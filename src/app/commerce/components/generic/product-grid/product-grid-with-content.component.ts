/*******************************************************************************
 * Copyright IBM Corp. 2017
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
 *******************************************************************************/
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeProductGridComponent } from './../../product-grid/typeProductGridComponent';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { ProductListingTransactionService } from '../../../services/componentTransaction/productlist.service';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';
import { Constants } from 'app/Constants';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Observable } from 'rxjs/Observable';
import { filterNotNil, shareLast } from "ibm-wch-sdk-utils";
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');

@Component({
    selector: 'app-product-grid',
    templateUrl: './product-grid.component.html',
    styleUrls: []
})
export class ProductGridWithContentComponent extends TypeProductGridComponent implements OnInit {
    id: any;
    lists: any;
    totalProducts: number = 0;
    pageNumber: number = 1;
    startIndex: number;
    endIndex: number;
    keyword: string;
    facetLabels: any[] = [];
    activeFacets: any = {};
    suggestedKeywordUsed: any = {};
    showNoProductsErrorMsg: boolean = false;
    pageSize: number = CommerceEnvironment.listSettings.pageSize;
    sortOptions: any = CommerceEnvironment.listSettings.defaultSortOptions;
    subscriptions: Subscription[] = [];
    noProductModalId = this.productListingSharedService.noProductModalId;
    currencyCode: string = "";
    firstLoad: boolean = true;
    scrollUpdateInProgress: boolean = false;
    scrollPageNumber: number = 1;
    onCategoryId: Observable<any>;
    categoryId: number;
    private readonly searchLink:string;
    private readonly plpLink:string;
    constructor(
        private productListingSharedService: ProductListingTransactionService,
        private route: ActivatedRoute,
        private storefrontUtils: StorefrontUtils,
        private router: Router,
        private breadcrumbService: BreadcrumbService) {
        super();
        this.searchLink=this.storefrontUtils.getPageLink(Constants.searchResultsPageIdentifier);
        this.plpLink=this.storefrontUtils.getPageLink(Constants.productListingPageIdentifier);

        // get the context of current page
        const onCurrentPage = this.onRenderingContext.pipe(
            filterNotNil(),
            pluck<any, any[]>('context', 'breadcrumb'),
            map(breadcrumb => breadcrumb[breadcrumb.length - 1])
        );

        // get id of current categorypage
        this.onCategoryId = onCurrentPage.pipe(
            filterNotNil(),
            pluck<any, any>('externalContext'),
            filterNotNil(),
            shareLast(),
            pluck<any, any>('identifier'),
            distinctUntilChanged(isEqual)
        );

        this.id = uniqueId();
        const onRenderingContext = this.onRenderingContext.distinctUntilChanged(isEqual);
        let prodSubscription = this.productListingSharedService.product$.subscribe(
            response => { this.initProducts(response); }
        );
        let activeFacetSubscription = this.productListingSharedService.activeFacet$.subscribe(
            response => { this.generateActiveFacetList(response); }
        );
        let categoryNameSubscription = this.breadcrumbService.categoryName$.subscribe(
            response => { this.keyword = response; }
        )

        let catIdSubscription = this.onCategoryId.subscribe( identifier => {
            if ($(`#productGrid_div_1_${this.id} .wci_toolbar`).length) {
                $(`#productGrid_div_1_${this.id} .wci_toolbar`).remove();
            }
            this.breadcrumbService.getCategoryByIdentifier(identifier).then(categoryInfo => {
                this.categoryId = categoryInfo.uniqueID;
            });
            this.cleanUpForNewQuery();
            this.productListingSharedService.getProductsByQuery({ 'categoryIdentifier': identifier });
        });

        let urlSubscription = this.route.queryParamMap.distinctUntilChanged().subscribe( params => {
            if (this.goToSamePage()) {
                this.cleanUpForNewQuery();
                let urlParam = params['params'];
                if (urlParam.searchTerm || urlParam.manufacturer) {
                    this.productListingSharedService.getProductsByQuery(urlParam);
                }
            }
        })
        this.currencyCode = sessionStorage.getItem('currentUserCurrency') === null ? this.storefrontUtils.commerceCurrency : sessionStorage.getItem('currentUserCurrency');

        this.subscriptions = [
            urlSubscription,
            prodSubscription,
            activeFacetSubscription,
            catIdSubscription
        ];
    }

    ngOnInit() {}

    ngAfterViewInit(){
        (<any>$(`#${this.noProductModalId}`)).foundation();
    }

    goToSamePage() {
        return this.storefrontUtils.onSamePage(this.plpLink) || this.storefrontUtils.onSamePage(this.searchLink);
    }

    initProducts(response) {
        let appendDirection = response.pageNumber - this.scrollPageNumber;
        this.scrollPageNumber = response.pageNumber;
        setTimeout(() => {
            this.generateLists(response.globalResults, response.pageNumber, appendDirection);
        }, 0);
        setTimeout(() => {
            this.updateSortOptions(response);
        }, 0);
        this.totalProducts = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.updateCategoryIdentifier(response.breadCrumbTrailEntryView);
        if (this.route.snapshot.queryParams['searchTerm'] !== undefined) {
            this.showNoProductsErrorMsg = response.totalCount === 0;
        }
    }

    generateLists(products : any, pageNumber: number, appendDirection: number) {
        let buffer : any[] = [];
        for (let prod of products) {
            let skeleton = JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
            skeleton.id=prod.partNumber;
            skeleton.productDesc=prod;
            skeleton.selectedLayouts[0].layout.id=this.getLayoutId();
            skeleton.layouts.default.template=this.getLayoutId();
            buffer.push(skeleton);
        }

        if (this.scrollUpdateInProgress && this.lists) {
            if (appendDirection < 0) {
                this.lists = buffer.concat(this.lists);
            }
            else if (appendDirection > 0) {
                this.lists = this.lists.concat(buffer);
            } else {
                this.lists.splice((pageNumber - 1) * this.pageSize, this.pageSize, ...buffer);
            }
            setTimeout(() => {
                this.scrollUpdateInProgress = false;
            }, 2000);
        } else {
            if (this.lists) {
                this.lists.splice((pageNumber - 1) * this.pageSize, this.pageSize, ...buffer);
            } else {
                this.lists = buffer;
            }
            //
            // this.lists replace starting at X
        }
    }

    updateSortOptions(response){
        this.sortOptions = CommerceEnvironment.listSettings.defaultSortOptions;
        if (response.priceMode === "1") {
            this.sortOptions = this.sortOptions.concat(CommerceEnvironment.listSettings.priceSortOptions);
        }
    }

    updateCategoryIdentifier(breadcrumbTrailEntryView){
        // no products found for current search term, but we have results for synonym / suggested keyword
        if (this.productListingSharedService.suggestedKeywords.length > 0 && this.productListingSharedService.suggestedKeywords[0] !== '')
        {
            this.keyword = this.productListingSharedService.suggestedKeywords[0];
            this.suggestedKeywordUsed = {
                display: true,
                searchTerm: this.route.snapshot.queryParams['searchTerm']
            }
        }
        // positive flow in search-results
        else if (!!this.route.snapshot.queryParams['searchTerm'] || !!this.route.snapshot.queryParams['manufacturer'])
        {
            this.keyword = this.route.snapshot.queryParams['searchTerm'] || this.route.snapshot.queryParams['manufacturer'];
        }
    }

    goToSearchPageByKeyword(keyword) {
        this.router.navigate( [this.searchLink], {
            queryParams: { searchTerm: keyword }
        });
        this.productListingSharedService.suggestedKeywords = [];
    }

    goToPage($event){
        this.pageNumber = $event;
        this.productListingSharedService.fetchPage($event);
        //$("html, body").animate({scrollTop: ($("body").offset().top)});
    }

    onNext() {
        this.goToPage(this.pageNumber + 1);
    }

    onPrev() {
        this.goToPage(this.pageNumber - 1);
    }

    onSortDropdownSelect($event){
        this.productListingSharedService.onSortDropdownSelect($event);
    }

    getLayoutId() {
        return "product-card";
    }

    generateActiveFacetList(activeFacets){
        this.activeFacets = activeFacets;
        this.facetLabels = [];
        for (let i in this.activeFacets){
			switch(i) {
                case 'price':
                    if (!this.isObjectEmpty(this.activeFacets[i])) {
                        this.facetLabels.push({
                            'minPrice': this.activeFacets.price.minPrice,
                            'maxPrice': this.activeFacets.price.maxPrice,
                            'text': this.getPriceRangeWithCurrency(this.activeFacets.price.minPrice, this.activeFacets.price.maxPrice),
                            'type': i
                        });
                    }
					break;
                case 'facet':
                    let facetKeys = Object.keys(this.activeFacets.facet);
                    facetKeys.forEach((key) => {
                        this.facetLabels.push({
                            'text': this.activeFacets.facet[key],
                            'type': this.getFacetType(key)
                        });
                    });
					break;
                case 'category':
                    this.activeFacets[i].forEach((cat, index) => {
                        this.getCategoryHierarchy(cat).then(
                            path => {
                                this.facetLabels.push({
                                    'id': cat.name,
                                    'type': i,
                                    'text': cat.name + path
                                });
                            }
                        );
                    });
                    break;
                default:
                /* istanbul ignore next */
					break;
			}
		};
    }

    getPriceRangeWithCurrency(minPrice: string, maxPrice: string) {
        return StorefrontUtils.getNumberWithCurrencySymbol(minPrice, this.currencyCode) + " - " + StorefrontUtils.getNumberWithCurrencySymbol(maxPrice, this.currencyCode);
    }

    getFacetType(facetValue: string){
        let facetType = "facet";
        let allFacetValues = Object.keys(this.productListingSharedService.facetValueNameMapping);
        allFacetValues.forEach( key => {
            if (facetValue.includes(key)) {
                facetType = this.productListingSharedService.facetValueNameMapping[key];
                return;
            }
        })
        return facetType;
    }

    getCategoryHierarchy(category){
        let catHierarchy = "";
        if (category.parentIds) {
            return this.productListingSharedService.getCategoryInfoByIds(category.parentIds.split('_'))
            .then( r => {
                let parentCats = r.body.catalogGroupView;
                if (parentCats.length > 0) {
                    catHierarchy = "("
                    parentCats.forEach( cat => {
                        catHierarchy += cat.name + '/';
                    });
                    catHierarchy += category.name + ")";
                    return catHierarchy;
                } else {
                     /* istanbul ignore next */
                    return catHierarchy;
                }
            });
        } else {
             /* istanbul ignore next */
            return Promise.resolve("");
        }
    }

    isObjectEmpty(obj){
        return Object.keys(obj).length === 0;
    }

    removeFacet(facet){
        if (facet.type === 'price') {
            this.removePriceFacet(facet);
        }
        else if (facet.type === 'category') {
            this.removeCategoryFacet(facet);
        }
        else {
            for (let i in this.activeFacets.facet) {
                if (this.activeFacets.facet[i] === facet.text) {
                    delete this.activeFacets.facet[i];
                }
            }
            this.productListingSharedService.sendFacetAnalyticsData(facet.type + ':' + facet.text, 'remove');
            this.productListingSharedService.onFacetChange(this.activeFacets.facet);
        }
    }

    removePriceFacet(facet){
        this.productListingSharedService.sendPriceFacetAnalyticsData(facet, 'remove');
        this.activeFacets.price = {};
        this.productListingSharedService.onPriceFacetChange(this.activeFacets.price);
    }

    removeCategoryFacet(facet){
        let indexToRemove;
        this.activeFacets.category.forEach( (cat, i) => {
            if (cat.name === facet.id) {
                indexToRemove = i;
            }
        });
        this.productListingSharedService.onCategoryFacetUnselect(indexToRemove);
    }

    clearAll(){
        this.clearActiveFacets();
        this.productListingSharedService.onClearAllFacets(this.activeFacets);
    }

    isPriceFacetEnabled(){
        return this.activeFacets.price !== undefined && this.activeFacets.price.minPrice !== undefined;
    }

    ngOnDestroy(){
        this.clearActiveFacets();
        if (this.subscriptions) {
            this.subscriptions.forEach(subscription => {
                subscription.unsubscribe();
            });
        }
    }

    clearActiveFacets(){
        for (let i in this.activeFacets.facet) {
            delete this.activeFacets.facet[i];
        };
        this.activeFacets.category = [];
        this.activeFacets.price = {};
        this.productListingSharedService.updatePriceFacetDisplay(this.activeFacets.price);
        this.productListingSharedService.showMoreCategoriesClicked = false;
        this.productListingSharedService.activeFacets = {};
    }

    cleanUpForNewQuery(){
        if (!this.firstLoad) {
            this.suggestedKeywordUsed = {};
            this.showNoProductsErrorMsg = false;
            this.productListingSharedService.suggestedKeywords = [];
            this.productListingSharedService.clearAnalyticsFacet();
            this.productListingSharedService.categoryIdentifier = '';
            this.clearActiveFacets();
            this.firstLoad = false;
        }
    }

    onScrollDown() {
        console.log('scrolled down!!');
        if (!this.scrollUpdateInProgress && this.pageSize * this.pageNumber < this.totalProducts) {
            this.scrollUpdateInProgress = true;
            this.scrollPageNumber = this.pageNumber;
            this.goToPage(this.pageNumber + 1);
        }
    }

    onScrollUp() {
        console.log('scrolled up!!');
        this.pageNumber = this.pageNumber + 1;
        this.goToPage(this.pageNumber);
    }
}
