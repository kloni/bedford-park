/*******************************************************************************
 * productlist.service.ts
 *
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ProductViewService } from '../rest/search/productView.service';
import { CategoryViewService } from '../rest/search/categoryView.service';
import { StorefrontUtils } from '../../../commerce/common/storefrontUtils.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { Constants } from 'app/Constants';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'rxjs/add/operator/pluck';

const uniqueId = require('lodash/uniqueId');

@Injectable()
export class ProductListingTransactionService {

	facetSource = new Subject<any>();
	productSource = new Subject<any>();
	activeFacetSource = new Subject<any>();

	facet$ = this.facetSource.asObservable();
	product$ = this.productSource.asObservable();
	activeFacet$ = this.activeFacetSource.asObservable();

	urlParams: any = {};
	activeFacets: any = {};
	priceFacets: Map<string, any> = new Map();
	priceSelected = false;
	facetValueNameMapping: any = {}; // for DA purpose

	showMoreCategoriesClicked = false;
	suggestedKeywords: string[] = [];
	noProductModalId: string;
	categoryIdentifier: string;
	products: any;
	baseParams: any = {
		'storeId': this.storefrontUtils.commerceStoreId,
		'pageSize': CommerceEnvironment.listSettings.pageSize,
		'_fields': 'breadCrumbTrailEntryView.label,facetView,metaData,recordSetTotal,recordSetStartNumber,catalogEntryView.price,catalogEntryView.thumbnail,catalogEntryView.attributes,catalogEntryView.hasSingleSKU,catalogEntryView.name,catalogEntryView.uniqueID,catalogGroupView.uniqueID,catalogEntryView.partNumber,catalogEntryView.catalogEntryTypeCode',
		'contractId': this.storefrontUtils.getContractId()
	};
	private readonly pdpLink: string;

	constructor(private productViewService: ProductViewService,
				private storefrontUtils: StorefrontUtils,
				private categoryViewService: CategoryViewService,
				private router: Router,
				private da: DigitalAnalyticsService,
				private breadcrumbService: BreadcrumbService) {
		this.pdpLink = this.storefrontUtils.getPageLink(Constants.productDetailPageIdentifier);
		this.noProductModalId = 'plpSharedService_div_1_' + uniqueId();
		this.breadcrumbService.directParentCategory$.subscribe( category => {
			if (category.identifier !== this.categoryIdentifier) {
				this.categoryIdentifier = category.identifier;
				this.createPageViewDATag();
			}
		});
	}

	getProductsByQuery(urlParams: any, facetParams?: any, refreshFacets?: boolean, sendDATag?: boolean) {
		const params = this.getRestParameters(facetParams);
		let productObservable;
		let categoryObservable = Observable.of({ body: {}});
		this.urlParams = urlParams;
		const currentSuggestedKeyword = this.suggestedKeywords.length > 0 ? this.suggestedKeywords[0] : '';
		if (urlParams.searchTerm !== undefined && urlParams.searchTerm !== '') {
			params['searchTerm'] = currentSuggestedKeyword !== '' ? currentSuggestedKeyword : urlParams.searchTerm;
			productObservable = this.productViewService.findProductsBySearchTerm(params, undefined);
		} else if (urlParams.categoryIdentifier !== undefined && urlParams.categoryIdentifier !== '') {
			params['categoryIdentifier'] = urlParams.categoryIdentifier;
			categoryObservable = this.categoryViewService.findCategoryByIdentifier(params, undefined);
		} else if (urlParams.manufacturer !== undefined && urlParams.manufacturer !== '') {
			params['manufacturer'] = urlParams.manufacturer;
			params['searchTerm'] = '*';
			productObservable = this.productViewService.findProductsBySearchTerm(params, undefined);
		} else {
			this.storefrontUtils.gotoNotFound();
		}
		categoryObservable.pluck('body').subscribe(
			response => {
				if (this.isInvalidCategoryIdentifier(response)) {
					this.storefrontUtils.gotoNotFound();
				} else if (this.isValidCategoryIdentifier(response)) {
					params['categoryId'] = response['catalogGroupView'][0].uniqueID;
					productObservable = this.productViewService.findProductsByCategory(params, undefined);
				}
				// get products
				const prodObservable = productObservable.subscribe(
					response => {
						if (response && response.body) {
								let facet;
								if (refreshFacets !== false) {
									facet = {
										facet: response.body.facetView,
										priceMode: response.body.metaData.price,
										breadCrumbTrailEntryView: response.body.breadCrumbTrailEntryView ? response.body.breadCrumbTrailEntryView : {}
									};
								}
								if (!this.noProductsDueToInvalidPriceFilter(response.body.catalogEntryView)) {
									// if this is no products because of invalid price,
									// save the product results info from previous search for DA tag
									this.products = response.body;
								}
								this.loadProductsAndFacets(response.body, facet);
								if (urlParams['searchTerm'] !== undefined || sendDATag) {
									this.createPageViewDATag(this.products);
								}
						}
					},
					error => {
						this.storefrontUtils.gotoNotFound(); // invalid category Id
					}
				)
			}
		)
	};

	appendSeoUrlToProducts(products: any) {
		if (products.length === 0) {
			return Promise.resolve(products);
		} else {
            // get SEO urls
			return this.storefrontUtils.getSeoUrlMapForProducts($.extend(true, [], products))
			.then( urlIdMap => {
				for (const product of products) {

					switch (product.catalogEntryTypeCode) {
						case 'ProductBean': {
							product.seoUrl = urlIdMap['idc-product-' + product.partNumber];
							break;
						}
						case 'BundleBean': {
							product.seoUrl = urlIdMap['idc-bundle-' + product.partNumber];
							break;
						}
						case 'PackageBean': {
							product.seoUrl = urlIdMap['idc-kit-' + product.partNumber];
							break;
						}
					}
				}
			});
		}
	}

	isInvalidCategoryIdentifier(response) {
		return response && response['recordSetTotal'] === 0;
	}

	isValidCategoryIdentifier(response) {
		return response && response['recordSetTotal'] > 0
	}

	getRestParameters(facetParams?) {
		const params = Object.assign({}, this.baseParams);
		this.addUserCurrency(params);
		for (const i in facetParams) {
			switch (i) {
				case 'price':
					params['minPrice'] = facetParams[i].minPrice;
					params['maxPrice'] = facetParams[i].maxPrice;
					break;
				case 'facet':
					params[i] = Object.keys(facetParams[i]);
					break;
				case 'category':
					if (facetParams[i].length > 0) {
						const catLevels = facetParams[i].length;
						const lowestLevelCat = facetParams[i][catLevels - 1];
						params['categoryId'] = lowestLevelCat.id;
						params['categoryHierarchyPath'] = lowestLevelCat.id;
					}
					break;
				default:
					params[i] = facetParams[i];
			}
		};
		return params;
	}

	addUserCurrency(params) {
		const currency = sessionStorage.getItem('currentUserCurrency');
		if (currency !== undefined && currency !== null) {
			params.currency = currency;
		} else {
            params.currency = this.storefrontUtils.commerceCurrency;
        }
	}

	getProductIds(products) {
		const ids = [];
		products.forEach(product => {
			ids.push(product.uniqueID.toString());
		});
		return ids;
	}

	getCategoryInfoByIds(ids: String[]) {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'id': ids,
			'_fields': 'catalogGroupView.name,catalogGroupView.identifier',
			'contractId': this.storefrontUtils.getContractId()
		};
		return this.categoryViewService.findCategoryByUniqueIds(params, undefined).toPromise();
	}

	loadProductsAndFacets(productresults: any, facetToUpdate?:  any) {
		const productIds = this.getProductIds(productresults.catalogEntryView);
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'id': productIds,
			'_fields': 'catalogEntryView.attributes,catalogEntryView.uniqueID,catalogEntryView.catalogEntryTypeCode',
			'contractId' : this.storefrontUtils.getContractId()
		};
		const products = {
			'priceMode': productresults.metaData.price,
			'suggestions': productresults.metaData.spellcheck,
			'suggestedTermUsed': productresults.keyword,
			'totalCount': productresults.recordSetTotal,
			'globalResults': productresults.catalogEntryView,
			'breadCrumbTrailEntryView': productresults.breadCrumbTrailEntryView,
			'pageNumber': this.getPageNumber(productresults.recordSetStartNumber)
		}

		if (this.searchResultHasOneProductOnly(params)) {
			const partNumber = productresults.catalogEntryView[0].partNumber;
			this.appendSeoUrlToProducts(productresults.catalogEntryView)
			.then( () => {
				this.router.navigate( [productresults.catalogEntryView[0].seoUrl] );
			});
		} else if (productIds.length !== 0) {
			this.productSource.next(products);
			this.activeFacetSource.next(this.activeFacets);
			if (facetToUpdate) {
				this.facetSource.next(facetToUpdate);
			}
			Promise.all([
				this.productViewService.findProductsByIds(params, undefined).toPromise(),
				this.appendSeoUrlToProducts(products.globalResults)
			])
			.then( response => {
				let productAttributes = response[0].body.catalogEntryView;
				// response are always in the same order
				for (let i = 0; i < products.globalResults.length; i++) {
					if (products.globalResults[i].uniqueID === productAttributes[i].uniqueID) {
						products.globalResults[i].attributes = productAttributes[i].attributes;
					}
				}
				this.productSource.next(products);
			});
		} else if (this.noProductsDueToInvalidPriceFilter(productIds)) {
			this.createPageViewDATag(productresults);
			this.unselectPriceFacet();
			this.showNoProductsModal();
		} else if (this.noProductsButSuggestionExists(productIds, products)) {
			this.suggestedKeywords = products.suggestions;
			const currentSuggestedKeyword = this.suggestedKeywords.length > 0 ? this.suggestedKeywords[0] : '';
			const newParams = this.getRestParameters({ 'searchTerm': currentSuggestedKeyword });
			this.productViewService.findProductsBySearchTerm(newParams, undefined).subscribe(
				response => {
					response.body.keyword = currentSuggestedKeyword;
					const facets = {
						facet: response.body.facetView,
						priceMode: response.body.metaData.price,
						breadCrumbTrailEntryView: response.body.breadCrumbTrailEntryView ? response.body.breadCrumbTrailEntryView : {}
					};
					this.loadProductsAndFacets(response.body, facets);
				}
			)
		} else if (this.noProductsDueToInvalidParam(productIds)) {
			this.storefrontUtils.gotoNotFound();
		} else {
      		// no products + no suggestion keyword for current search term
			this.productSource.next(products);
			this.facetSource.next(facetToUpdate);
			this.activeFacetSource.next(this.activeFacets);
		}
	}

	noProductsDueToInvalidParam(productIds) {
		return productIds.length === 0 &&
			((this.urlParams['categoryId'] !== undefined && this.urlParams['categoryId'] !== '') ||
			(this.urlParams['categoryIdentifier'] !== undefined && this.urlParams['categoryIdentifier'] !== ''));
	}

	noProductsButSuggestionExists(productIds, products) {
		return productIds.length === 0 &&
			products.suggestions && products.suggestions.length !== 0;
	}

	noProductsDueToInvalidPriceFilter(productIds) {
		return productIds.length === 0 && this.activeFacets.price && typeof this.activeFacets.price.minPrice === "number" && typeof this.activeFacets.price.maxPrice === "number";
	}

	searchResultHasOneProductOnly(params) {
		return this.urlParams.searchTerm !== undefined && 	// search results case
				params.id.length === 1 && 				  	// returns only 1 result
				this.suggestedKeywords.length === 0 && 		// don't redirect if it's from suggested keyword result
				Object.keys(this.activeFacets).length === 0; // don't redirect if it's from selecting facets
	}

	/* istanbul ignore next */
	showNoProductsModal() {
		(<any>$(`#${this.noProductModalId}` )).foundation('open');
		setTimeout(() => {
            (<any>$(`#${this.noProductModalId}`)).foundation('close');
        }, 8000);
	}

	unselectPriceFacet() {
		this.sendPriceFacetAnalyticsData(this.activeFacets.price, 'remove');
		this.activeFacets.price.minPrice = undefined;
		this.activeFacets.price.maxPrice = undefined;
		this.activeFacets.price = {};
		this.updatePriceFacetDisplay(this.activeFacets);
	}

	getPageNumber(recordSetStartNumber) {
		return ( recordSetStartNumber / CommerceEnvironment.listSettings.pageSize ) + 1;
	}

	updatePriceFacetDisplay(priceFacet) {
		this.priceFacets = priceFacet;
		this.priceSelected = priceFacet.minPrice === undefined && priceFacet.maxPrice === undefined ? false : true;
	}

	onShowMoreLessFacetEntries(expandedFacets: string[]) {
		this.activeFacets['facetLimit'] = expandedFacets;
		this.getProductsByQuery(this.urlParams, this.activeFacets);
	}

	onFacetChange(selectedFacets: {}) {
		this.resetPageNumber();
		this.activeFacets['facet'] = selectedFacets;
		this.getProductsByQuery(this.urlParams, this.activeFacets, undefined, true);
	}

	onPriceFacetChange(priceFacet: any) {
		this.resetPageNumber();
		this.activeFacets['price'] = priceFacet;
		this.updatePriceFacetDisplay(priceFacet);
		this.getProductsByQuery(this.urlParams, this.activeFacets, undefined, true);
	}

	/*
		category facet is different with the other facets
		product-filter can only do select
		product-grid can only do unselect
		we also need to manually store selected category filter in an array in this service
		Thus, select() and unselect() is defined separately to simplify things
	*/
	onCategoryFacetSelect(facet: any) {
		this.resetPageNumber();
		if (this.activeFacets['category'] === undefined) {
			this.activeFacets['category'] = [];
		}
		this.sendCategoryFacetAnalyticsData(facet, 'add').then(r => {
			this.activeFacets['category'].push(facet);
			this.getProductsByQuery(this.urlParams, this.activeFacets);
		});
	}

	onCategoryFacetUnselect(index) {
		this.sendCategoryFacetAnalyticsData(this.activeFacets['category'][index], 'remove').then( r => {
			this.activeFacets['category'].splice(index, 1);
			this.getProductsByQuery(this.urlParams, this.activeFacets);
		});
	}

	onClearAllFacets(selectedFacets) {
		this.resetPageNumber();
		this.activeFacets['facet'] = {};
		this.activeFacets['price'] = {};
		this.activeFacets['category'] = [];
		this.updatePriceFacetDisplay({});
		this.clearAnalyticsFacet();
		this.getProductsByQuery(this.urlParams, this.activeFacets, undefined, true);
	}

	sendFacetAnalyticsData(facetAnalyticEntry: string, action: string) {
		if (action === 'remove') {
			this.da.removeFacetAnalyticsEntry(facetAnalyticEntry);
		} else {
			this.da.addFacetAnalyticsEntry(facetAnalyticEntry);
		}
	}

	sendPriceFacetAnalyticsData(facet: any, action: string) {
		const facetAnalyticsEntry = CommerceEnvironment.analytics.facetAnalyticsKey.price + ':' + facet.minPrice + '-' + facet.maxPrice;
		this.sendFacetAnalyticsData(facetAnalyticsEntry, action);
	}

	sendCategoryFacetAnalyticsData(facet: any, action: string) {
		return this.getCategoryInfoByIds([facet.id]).then( catInfo => {
			const catIdentifier = catInfo.body.catalogGroupView[0].identifier;
			this.sendFacetAnalyticsData(CommerceEnvironment.analytics.facetAnalyticsKey.category + ':' + catIdentifier, action);
		});
	}

	createPageViewDATag(productResults?: any) {
		let searchTerm = '';
		let searchResults = '';
		let pageID = this.categoryIdentifier;
		let attribute = this.da.analyticsFacet;

		if (this.urlParams['searchTerm'] !== undefined && this.urlParams['searchTerm'] !== '') {
			this.categoryIdentifier = CommerceEnvironment.analytics.searchCategoryId;
			searchTerm = this.urlParams['searchTerm'];
			searchResults = productResults.recordSetTotal;
			pageID = parseInt(searchResults) === 0 ?
				CommerceEnvironment.analytics.productSearchUnsuccessfulPageName :
				CommerceEnvironment.analytics.productSearchSuccessfulPageName + this.getPageNumber(productResults.recordSetStartNumber);
			// first attribute in search case is reserved for store ID
			attribute = attribute === '' ? this.storefrontUtils.commerceStoreId : this.storefrontUtils.commerceStoreId + '-_-' + this.da.analyticsFacet;
		};

		const pageParam = {
            pageName: pageID,
            searchTerm: searchTerm,
            searchResults: searchResults,
            facet: attribute
        };
		this.da.viewPage(pageParam);
	}

	clearAnalyticsFacet() {
		this.da.clearAnalyticsFacet();
	}

	fetchPage(pageNumber: number) {
		this.activeFacets['pageNumber'] = pageNumber;
		this.getProductsByQuery(this.urlParams, this.activeFacets, undefined, true);
	}

	onSortDropdownSelect(value) {
		this.activeFacets['orderBy'] = value;
		this.resetPageNumber();
		this.getProductsByQuery(this.urlParams, this.activeFacets);
	}

	resetPageNumber() {
		delete this.activeFacets['pageNumber'];
	}

}
