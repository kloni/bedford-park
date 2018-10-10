import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, AfterViewInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { TypeProductFilterComponent } from './../../components/product-filter/typeProductFilterComponent';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ProductListingTransactionService } from './../../services/componentTransaction/productlist.service';
import { subscribeOn } from 'rxjs/operator/subscribeOn';
import * as $ from 'jquery';
import { Constants } from '../../../Constants';

const uniqueId = require('lodash/uniqueId');
declare var Foundation: any;
/*
 * @name productFilterLayout
 * @id product-filter-layout
 */
@LayoutComponent({
    selector: 'product-filter-layout'
})
@Component({
  selector: 'app-product-filter-layout-component',
  templateUrl: './productFilterLayout.html',
  styleUrls: ['./productFilterLayout.scss'],
  preserveWhitespaces: false
})
export class ProductFilterLayoutComponent extends TypeProductFilterComponent implements AfterViewInit{

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    @ViewChildren('facetAccordion') facetAccordion: QueryList<any>;
    id: any;
    accordionIds: any = {};
    beforeInit: boolean = false;
    facets: any;
    breadCrumbTrailView: any = [];
    selectedFacets: any = {};
    expandedFacets: string[] = [];
    subscription: Subscription;
    currencyCode: string = "";

    constructor(
        private storeUtils: StorefrontUtils,
        private productListingSharedService: ProductListingTransactionService) {
        super();
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
        this.subscription = this.productListingSharedService.facet$.subscribe(
            response => {
                // timeout needed to avoid Angular ExpressionChangedAfterItHasBeenCheckedError
                // this error happens when response is cached and returned faster before the next digest cycle
                setTimeout(() => {
                    this.currencyCode = sessionStorage.getItem('currentUserCurrency') === null ? this.storeUtils.commerceCurrency : sessionStorage.getItem('currentUserCurrency');
                    this.initFacets(response.facet);
                    this.breadCrumbTrailView = response.breadCrumbTrailView;
                });
            }
        );
    }

    ngOnInit(){
        this.id = uniqueId();
        this.accordionIds.filterBy = 'productFilter_ul_30_' + this.id;
        this.accordionIds.facet = 'productFilter_ul_34_' + this.id;
    }

    /* istanbul ignore next */
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.safeSubscribe(this.facetAccordion.changes, (change) => {
            if (this.beforeInit) {
                (<any>$('#' + this.accordionIds.filterBy + ', #' + this.accordionIds.facet)).foundation('_destroy');
            }
            this.beforeInit = true;
            (<any>$('#' + this.accordionIds.filterBy + ', #' + this.accordionIds.facet)).foundation();
            Foundation.reInit($('#' + this.accordionIds.filterBy + ', #' + this.accordionIds.facet));
            this.beforeInit = false;
        });
    }

    initFacets(responseFacets) {
        this.facets = [];
        if (responseFacets){
            responseFacets.forEach(iFacet => {
                if (!iFacet.extendedData) {
                    this.facets.push(this.initPriceFacet(iFacet));
                }
                else if (iFacet.extendedData['groupId'] == 1) {
                    this.initFeatureFacet(iFacet);
                }
                else {
                    this.facets.push(this.initOtherFacet(iFacet));
                }
            });
        }
    }

    getDisplayValue( entry ){
        return entry.extendedData.unitID != 'C62' && entry.extendedData.unitOfMeasure ? 
        entry.label + " " + entry.extendedData.unitOfMeasure : 
        entry.label;
    }

    isPriceFacet( facetItem ){
        return facetItem.value.startsWith('price_');
    }

    initPriceFacet( facetItem ){
        this.isPriceFacet(facetItem);
        if (!facetItem.value.startsWith('price_')) return {} ; 
        let facet = {
            'name': "PRICE",
            'value': facetItem.value,
            'priceFacet': true,
            'minPrice': this.productListingSharedService.priceFacets['minPrice'],
            'maxPrice': this.productListingSharedService.priceFacets['maxPrice']
        };
        return facet;
    }

    /* istanbul ignore next */
    initFeatureFacet( facetItem ){
        // TODO - implement feature facet
        // facetItem.entry.forEach(item => {
        //     let showFacet = !this.isSubcategoryFacet(this.breadCrumbTrailView, item);
        //     let facet = {};
        //     if (showFacet) {
        //         facet['name'] = this.getDisplayValue(item);
        //         facet['count'] = item.count;
        //         facet['value'] = item.value;
        //         facet['id'] = item.extendedData.uniqueId;
        //         facet['imgURL'] = item.image;
        //     }
        // })
    }

    initOtherFacet( facetItem ){
        let facet = {};
        facet["name"] = this.getFacetTitle(facetItem);
        facet["entries"] = [];
        facetItem.entry.forEach(item => {
            let entry = {
                'name': this.getDisplayValue(item),
                'count': item.count,
                'value': item.value,
                'id': item.extendedData.uniqueId,
                'imageURL': item.image,
                'parentIds': item.extendedData.parentIds,
                'categoryFacet': this.isCategoryFacet(facetItem)
            };
            entry['selected'] = this.selectedFacets[item.value] !== undefined ? this.selectedFacets[item.value] : false;
            facet['hasImage'] = item.image !== undefined;
            this.populateFacetEntries(facet, entry, facetItem);
        })
        facet['multipleSelection'] = facetItem.extendedData.allowMultipleValueSelection;
        facet['maxVal'] = facetItem.extendedData.maximumValuesToDisplay;
        facet['allValReturned'] = facetItem.extendedData.allValuesReturned;
        facet['value'] = facetItem.value;
        facet['categoryFacet'] = this.isCategoryFacet(facetItem);
        this.productListingSharedService.facetValueNameMapping[facetItem.value] = facet['name'];
        return facet;
    }

    populateFacetEntries(facet, entry, facetItem){
        if (!this.isCategoryFacet(facetItem) || facetItem.entry.length.toString() === this.categoryLimit) {
            facet['entries'].push(entry);
        }
        // category facet is handled differently
        // we need to limit manually in UI
        else if (this.productListingSharedService.showMoreCategoriesClicked === false) // show more is not clicked, filter
        {
            if (this.categoryLimit === "" || (this.categoryLimit && facet['entries'].length < this.categoryLimit)) {
                facet['entries'].push(entry);
                delete facet['displayShowMoreCategoriesButton'];
            } 
            else if (this.categoryLimit && facet['entries'].length >= this.categoryLimit){
                facet['displayShowMoreCategoriesButton'] = "true";
            }
        } 
        // show more is clicked, push everything
        else {
            facet['entries'].push(entry);
            facet['displayShowMoreCategoriesButton'] = "false";
        } 
    }

    isCategoryFacet(facetItem){
        return facetItem.value === "parentCatgroup_id_search";
    }

    getFacetTitle( facetItem ){
        return facetItem.value === 'mfName_ntk_cs' || this.isCategoryFacet(facetItem)? facetItem.extendedData.fname : facetItem.name; 
    }

    isSubcategoryFacet(breadcrumbArray, facetItem) {
        return breadcrumbArray.some(function(breadcrumbItem) {
            return  breadcrumbItem.value === facetItem.value;
        });
    }

    toggleMoreFacetEntries(facet, action){
        let facetLimit = facet.value + ':-1';
        if (action === 'more') {
            this.expandedFacets.push(facetLimit);
        } 
        else {
            this.expandedFacets.splice(this.expandedFacets.indexOf(facetLimit));
        };

        if (facet.value === 'parentCatgroup_id_search') {
            this.productListingSharedService.showMoreCategoriesClicked = action === 'more' ? true : false; 
        }
        this.productListingSharedService.onShowMoreLessFacetEntries(this.expandedFacets);
    }

    showMoreButton(facet){
        return !facet.allValReturned || (facet.categoryFacet && facet.displayShowMoreCategoriesButton === 'true');
    }

    showLessButton(facet) {
        return facet.allValReturned && facet.maxVal != -1 && facet.maxVal < facet.entries.length || (facet.categoryFacet && facet.displayShowMoreCategoriesButton === 'false');
    }

    onCheckboxChange(facet, facetType) {
        this.productListingSharedService.showMoreCategoriesClicked = false;
        if (facet.categoryFacet) {
            this.productListingSharedService.onCategoryFacetSelect(facet);
        } else {
            let facetAnalyticsEntry = facetType + ':' + facet.name;
            if (facet.selected) {
                this.selectedFacets[facet.value] = facet.name;
                this.productListingSharedService.sendFacetAnalyticsData(facetAnalyticsEntry, 'add');
            } else {
                delete this.selectedFacets[facet.value];
                this.productListingSharedService.sendFacetAnalyticsData(facetAnalyticsEntry, 'remove');
            }
            this.productListingSharedService.onFacetChange(this.selectedFacets);
        }
    }
    
    onPriceFacetSubmit(facet) {
        this.productListingSharedService.sendPriceFacetAnalyticsData(facet, 'add');
        this.productListingSharedService.onPriceFacetChange(facet);
    }

    clearPriceFacet(facet){
        // update DA to remove price info before resetting the facet
        this.productListingSharedService.sendPriceFacetAnalyticsData(facet, 'remove');
        facet = {};
        this.productListingSharedService.onPriceFacetChange(facet);
    }

    validateGoButton(minPrice, maxPrice) {
        if (typeof minPrice !== "number")
            return false;
        if (typeof maxPrice !== "number")
            return false;
        if (maxPrice < minPrice)
            return false;
        if (minPrice < 0)
            return false;
        return true;
    }

    validMinInput(minPrice, maxPrice) {
        if (minPrice < 0)
            return false;
        if (typeof maxPrice !== "number")
            return true;
        if (typeof minPrice !== "number")
            return false;
        if (maxPrice < minPrice)
            return false;
        return true;
    }

    validMaxInput(minPrice, maxPrice) {
        if (maxPrice < 0)
            return false;
        if (typeof minPrice !== "number")
            return true;
        if (typeof maxPrice !== "number")
            return false;
        if (maxPrice < minPrice)
            return false;
        return true;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}