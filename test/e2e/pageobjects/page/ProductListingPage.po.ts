import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { ProductPage } from './ProductPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("ProductListingPage");


export const productListingPageObjs = {
    countDisplay : element.all(by.css('[id^=productGrid_span_4_]')).first(),

    filterPane: '[id^=productFilter_li_5_INDEX_]',
    filterArea: '[id^=productFilter_li_5_]',
    filterHeading:  element.all(by.css('[id^=productFilter_p_3_]')),
    filter : '[id^=productFilter_li_21_INDEX_]',
    swatch : '[id^=productFilter_img_23_2_INDEX_]',

    filterInputLabel: '[id^=productFilter_label_25_1_]',
    filterInput: '[id^=productFilter_input_24_INDEX_FILTERIN_]',

    showMore: '[id^=productFilter_a_26_INDEX_]',
    showLess: '[id^=productFilter_a_27_INDEX_]',

    //filter pane
    priceFilterLabel: element.all(by.css('[id^=productFilter_span_11_]')),
    pricePaneFilterRemoveButton: element.all(by.css('[id^=productFilter_a_10_]')),

    //above product listing
    filterClearButton: '[id^=productGrid_a_12_INDEX_]',
    filterClearAllButton : element.all(by.css('[id^=productGrid_a_15_]')),

    filteredBy: element.all(by.css('[id^=productGrid_span_10_]')),
    filterSelectionList : element.all(by.css('[id^=productGrid_span_13_]')),
    filterSelection : element.all(by.css('[id^=productGrid_div_11_INDEX_]')),

    product: element.all(by.css('[id^=gallery_div_2_]')),
    productImage: element.all(by.css('[id^=productCard_fullImage_]')),
    productName: element.all(by.css('[id^=productCard_name_]')),
    productPrice: element.all(by.css('[id^=productCard_price_]')),

    minPrice: element.all(by.css('[id^=productFilter_input_14_0_]')),
    maxPrice: element.all(by.css('[id^=productFilter_input_17_0_]')),
    priceFilterButton: element.all(by.css('[id^=productFilter_button_19_0_]')),

    //pagination
    nextPageButton: element.all(by.css("[id^=pagination_btn_next_]")),
    prevPageButton: element.all(by.css("[id^=pagination_btn_pre_]")),
    pageNumberButton: element.all(by.css("[id^=pagination_btn_pageNum_]")),
    sortDropdown: element.all(by.css("[id^=productGrid_select_6_]")),

    //no result filter
    noResultMsg: element.all(by.css("[id^=productGrid_div_31_]")),
    noResultModal: element.all(by.css("[id^=plpSharedService_div_1_]")),
    noResultHeading: element.all(by.css("[id^=productGrid_h4_28_]")),
    VATTax: element.all(by.css("[id^=productCard_price_vat_]"))

};

export class ProductListingPage extends BaseTest {

    constructor(numberOfProducts: number = 12, filterPanesDisplayed :number =8) {
        super();
        if(numberOfProducts > 0){
            this.waitForAllProductsLoaded(productListingPageObjs.productImage, numberOfProducts, 20000);
            this.waitForAllProductsLoaded(productListingPageObjs.product, numberOfProducts, 20000);
            this.waitForProductCount(numberOfProducts);
            browser.sleep(10000);
        }
    }

    waitForProductCount(numberOfProducts: number){
        this.waitForTextToBeUpdatedToContain(productListingPageObjs.countDisplay, numberOfProducts.toString());
    }

    /** Filter Pane methods */
    getFilterHeading(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            productListingPageObjs.filterHeading.first().getText().then(heading => {
                resolve(heading);
            });
        });
    }

    getFilterPaneNameByIndex(index: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
                element.all(by.css(newFilterPaneSelector)).first()
                    .all(by.css('.accordion-title')).first().getText().then(filterPaneTitle => {
                resolve(filterPaneTitle);
            });
        });
    }

    getFilterNamesInPaneByIndex(index:any): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
            var filters =productListingPageObjs.filter.replace(re,index);
            return element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css(filters)).getText().then( text => {
                    resolve(text);
                });
        });
    }

    clickFilterPaneByIndex(index:any): ProductListingPage{
        var re = /INDEX/gi;
        var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
        element.all(by.css(newFilterPaneSelector)).first()
            .all(by.css('.accordion-title')).first().click();
        return this;
    }

    filterPaneNotDisplayedByIndex(index:any): Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {
            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
            let filterPane = element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css('.accordion-content')).first();

            return this.waitForElementNotDisplayed(filterPane);
        });
    }

    filterPaneDisplayedByIndex(index:any): Promise<boolean>{

        return new Promise<boolean>((resolve, reject) => {

            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);

            let filterPane = element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css('.accordion-content')).first();

            return this.waitForElementDisplayed(filterPane);
        });
    }

    countFiltersByIndex(index: any): Promise<number>{
        return new Promise<number>((resolve, reject) => {

            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
            var filters =productListingPageObjs.filter.replace(re,index);
            return element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css(filters)).count().then( count => {
                    resolve(count);
                });
        });
    }


    getSwatchCountByIndex(index:any): Promise<number>{
        return new Promise<number>((resolve, reject) => {
            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
            re = /INDEX_/gi;
            var swatches =productListingPageObjs.swatch.replace(re,"");

            return element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css(swatches)).count().then( count => {
                    resolve(count);
                });
        });
    }

    clickShowMoreByIndex(index: any): ProductListingPage{
        var re = /INDEX/gi;
        var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
        var showMoreSelector = productListingPageObjs.showMore.replace(re, index);

        element.all(by.css(newFilterPaneSelector)).first()
            .all(by.css(showMoreSelector)).first().click();
        return this;
    }

    showLessDisplayedByIndex(index:any): Promise<boolean>{
        var re = /INDEX/gi;
        var showLess = productListingPageObjs.showLess.replace(re, index);

        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementDisplayed(
                element.all(by.css(showLess)).first());
        });
    }

    showMoreDisplayedByIndex(index:any): Promise<boolean>{
        var re = /INDEX/gi;
        var showMoreSelector = productListingPageObjs.showMore.replace(re, index);

        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementDisplayed(
                element.all(by.css(showMoreSelector)).first());
        });
    }

    clickShowLessByIndex(index: any): ProductListingPage{
        var re = /INDEX/gi;
        var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
        var showLessSelector = productListingPageObjs.showLess.replace(re, index);

        element.all(by.css(newFilterPaneSelector)).first()
            .all(by.css(showLessSelector)).first().click();
        return this;
    }

    /** Filter by Price  */
    enterMinPrice(minPrice: string): ProductListingPage{
        productListingPageObjs.minPrice.first().sendKeys(minPrice);
        return this;
    }
    enterMaxPrice(maxPrice: string): ProductListingPage{
        productListingPageObjs.maxPrice.first().sendKeys(maxPrice);
        return this;
    }

    clearMinPrice(): ProductListingPage{
        productListingPageObjs.minPrice.first().clear();
        return this;
    }
    clearMaxPrice(): ProductListingPage{
        productListingPageObjs.maxPrice.first().clear();
        return this;
    }

    priceFilterButtonDisabled():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementNotClickable(productListingPageObjs.priceFilterButton.first());
        });
    }

    priceFilterButtonEnabled():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementEnabled(productListingPageObjs.priceFilterButton.first());
        });
    }

    clickPriceFilterButton():ProductListingPage{
        productListingPageObjs.priceFilterButton.click();
        return this;
    }

    priceFilterDislpayedInFilterPane(index: any, priceText: string):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);
            productListingPageObjs.priceFilterLabel.first().getText().then(text => {
                if(priceText.includes(text)){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    removePriceFilterFromPane():ProductListingPage{
        productListingPageObjs.pricePaneFilterRemoveButton.first().click();
        return this;
    }

    priceFilterDisplayed():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            let promises = [
                this.waitForElementDisplayed(productListingPageObjs.minPrice.first()),
                this.waitForElementDisplayed(productListingPageObjs.maxPrice.first()),
                this.waitForElementDisplayed(productListingPageObjs.priceFilterButton.first())
            ];

            Promise.all(promises).then(displayed => {
                return displayed;
            });

        });
    }


    /** Filter application methods */
    /**
     * Filter pane by index and value by text
     * @param index
     * @param filterValue
     */
    selectFilterLabelByIndexAndValue(index: any, filterValue: any):ProductListingPage{

        var re = /INDEX/gi;
        var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, index);

        element.all(by.css(newFilterPaneSelector)).first()
            .all(by.cssContainingText(productListingPageObjs.filterInputLabel, filterValue)).first().click();
        return this;
    }

    selectSwatchByIndex(filterPaneIndex: any, swatchIndex: any): ProductListingPage{
        var re = /INDEX/gi;
        var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, filterPaneIndex);
        var swatchFilterSelector = productListingPageObjs.swatch.replace(re,swatchIndex);

        element.all(by.css(newFilterPaneSelector)).first()
            .all(by.css(swatchFilterSelector)).first().click();

        return this;
    }

    /**
     * Filter pane by index and value by index
     * @param index
     * @param filterValue
     */
    selectFilterInputByIndex(index: any, index2: any):ProductListingPage{

        var re = /INDEX/gi;
        var re2 = /FILTERIN/gi;
        var newFilterInputSelector = productListingPageObjs.filterInput.replace(re, index).replace(re2, index2);
        var filter = element.all(by.css(newFilterInputSelector));

        this.waitForElementDisplayed(filter.first()).then(() => {
            filter.first().click();
        });
        return this;
    }

    /** Filters in the listing section */
    filterClearButtonByIndex(filterIndex : any): ProductListingPage{
        var re = /INDEX/gi;
        var newSelector = productListingPageObjs.filterClearButton.replace(re, filterIndex);
        element.all(by.css(newSelector)).first().click();

        return this;
    }

    clearAllFilters(): ProductListingPage{
        productListingPageObjs.filterClearAllButton.first().click();
        return this;
    }

    clearAllFiltersDisplayed(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementDisplayed(productListingPageObjs.filterClearAllButton.first());
        });
    }

    filteredByPresent():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementDisplayed(productListingPageObjs.filteredBy.first());
        });
    }

    filteredByNotPresent():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementNotDisplayed(productListingPageObjs.filteredBy.first());
        });
    }

    filterPresent(filterValue : string):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            productListingPageObjs.filterSelectionList.getText().then(filterValues => {
                for (let entry of filterValues) {
                    if(entry.includes(filterValue)){
                        resolve(true);
                    }
                }
                resolve(false);
            });
        });
    }

    filterNotPresent(filterValue : string):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            productListingPageObjs.filterSelectionList.getText().then(filterValues => {
                for (let entry of filterValues) {
                    if(entry.includes(filterValue)){
                        resolve(false);
                    }else{
                         resolve(true);
                    }
                }
            });
        });
    }

    waitForAppliedFilterCountToUpdate(expectedCount: number): ProductListingPage{
        this.waitForCountToBeUpdated(productListingPageObjs.filterSelectionList, expectedCount);
        return this;
    }


    /** Product listing  */
    clickProductAtIndex(index:number): ProductPage{
        productListingPageObjs.productImage.get(index).click();
        return new ProductPage();
    }

    clickProductNameAtIndex(index:number): ProductPage{
        productListingPageObjs.productName.get(index).click();
        return new ProductPage();
    }

    getTotalProductDisplayed():Promise<number>{
        return new Promise<number>((resolve, reject) => {
            productListingPageObjs.productImage.count().then(count => {
                resolve(count);
            });
        });
    }

    getTotalCountText():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            productListingPageObjs.countDisplay.getText().then(text => {

            });
        });
    }

    getAllDisplayedProductName():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            productListingPageObjs.productName.getText().then(names => {
                resolve(names);
            });
        });
    }

    getAllDisplayedProductPrice( numberOfProducts: number =12):Promise<number[]>{
        return new Promise<number[]>((resolve, reject) => {
            productListingPageObjs.productPrice.getText().then(result => {
                var priceList=[];
                for(let i=0 ; i< result.length; i++){
                    let finalResults= Number(result[i].replace(/[^0-9\.]+/g, ""));
                    if(result[i].includes('Price pending')){
                    }else if(result[i].includes(' - ')){
                        let finalResults = result[i].split(' - $')[1];
                        priceList.push(Number(finalResults));
                    }else{
                        priceList.push(finalResults);
                    }
                }
                resolve(priceList);
            });
        });
    }

    getAllDisplayedMinProductPrice( numberOfProducts: number =12):Promise<number[]>{
        return new Promise<number[]>((resolve, reject) => {
            productListingPageObjs.productPrice.getText().then(result => {
                var priceList=[];
                for(let i=0 ; i< result.length; i++){
                    let finalResults= Number(result[i].replace(/[^0-9\.]+/g, ""));
                    if(result[i].includes('Price pending') || result[i].length == 0){
                    }else if(result[i].includes(' - ')){
                        let finalResults = result[i].split(' - $')[0].slice(1);
                        priceList.push(Number(finalResults));
                    }else{
                        priceList.push(finalResults);
                    }
                }
                resolve(priceList);
            });
        });
    }

    waitForFirstProductTobe(productName: string): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            this.waitForTextToBeUpdated(productListingPageObjs.productName.first(), productName);
        });
    }

    /** Pagination */
    goToNextPage(): ProductListingPage{
        productListingPageObjs.nextPageButton.first().click();
        return this;
    }

    goToPrevPage(): ProductListingPage {
        productListingPageObjs.prevPageButton.first().click();
        return this;
    }

    goToPage(pageNumber: string): ProductListingPage{
        element.all(by.cssContainingText('[id^=pagination_btn_pageNum_]', pageNumber)).first().click();
        return this;
    }

    pageNumberSelected(pageNumber: string): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.getClassNames(element.all(by.cssContainingText('[id^=pagination_btn_pageNum_]', pageNumber)).first());
        });

    }

    /**Sorting */
    selectSortOptionByText(option : string): ProductListingPage{
        productListingPageObjs.sortDropdown.sendKeys(option);
        return this;
    }

    /** CSS methods */
    getSwatchCSSByIndex(cssProperty: string, filterPaneIndex: any, swatchIndex: any) : Promise<string>{
        return new Promise<string>((resolve, reject) => {

            var re = /INDEX/gi;
            var newFilterPaneSelector = productListingPageObjs.filterPane.replace(re, filterPaneIndex);
            var swatchFilterSelector = productListingPageObjs.swatch.replace(re,swatchIndex);

            this.getCssValue(cssProperty, element.all(by.css(newFilterPaneSelector)).first()
                .all(by.css(swatchFilterSelector)).first());

            return this;
        });
    }


    /**No results modal */
    noResultsModalDisplayed():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementDisplayed(productListingPageObjs.noResultModal.first());
        });
    }

    noResultsModalNotDisplayed():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.waitForElementNotDisplayed(productListingPageObjs.noResultModal.first());
        });
    }

    getNoResultsText(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            productListingPageObjs.noResultMsg.first().getText().then(msg => {
                resolve(msg);
            });
        });
    }

    getNoResultsHeading(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            productListingPageObjs.noResultHeading.first().getText().then(msg => {
                resolve(msg);
            });
        });
    }

    // VATTaxDisplayedByIndex(index: any) {
    //     return this.waitForElementDisplayed(productListingPageObjs.VATTax);
    // }

    getNumberOfVATTaxDisplayed():Promise<number>{
        return new Promise<number>((resolve, reject) => {
            productListingPageObjs.VATTax.count().then(count => {
                resolve(count);
            });
        });
    }
}
