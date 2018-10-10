import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementFinder, browser } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("SearchPage");

const productsTab = "products";
const articlesTab = "articles";

export const searchResultPageObjs = {
    productsResultFound: element.all(by.css("[id^=productGrid_span_4_]")).first(),
    productsNoResultFound: element.all(by.css("[id^=productGrid_p_19_]")).first(),
    productsNoResultFoundMsg: element.all(by.css("[id^=productGrid_p_21_]")).first(),
    articlesSingleResultFound: element.all(by.css("[id^=searchResults_span_31_]")).first(), 
    articlesResultsFound: element.all(by.css("[id^=searchResults_span_33_]")).first(),
    productResultList: element.all(by.css("[id^=gallery_div_1_]")).first(),
    productResultContainer: element.all(by.css("[id^=gallery_div_2_]")),
    productResultImg: element.all(by.css("[id^=recommendedProduct_fullImage_]")).first(),
    articlesResultList: element.all(by.css("[id^=searchResults_div_28_]")).first(),
    articlesResultListEmpty: element.all(by.css("[id^=searchResults_div_40_]")).first(),
    articleResultContainer: element.all(by.css("[id^=searchResults_div_36_]")),
    articleResultImg: element.all(by.css("[id^=designPage_img_9_]")).first(),
    productsTab: element.all(by.css("[id^=searchResults_a_5_]")).first(),
    articlesTab: element.all(by.css("[id^=searchResults_a_7_]")).first(),
    productResultName: element.all(by.css("[id^=recommendedProduct_name_]")),
    articleResultName: element.all(by.css("[id^=designPage_span_13_]")),
    productCategoryFilter: element.all(by.css("[id^=productFilter_label_25_1_]")),
    productBrandFilter: element.all(by.css("[id^=productFilter_input_24_2_]")),
    productFilters: element.all(by.css("[id^=productFilter_label_25_]")),
    articleTypeFilter: element.all(by.css("[id^=searchResults_label_26_]")),
    productSuggestedKeyword: element.all(by.css("[id^=productGrid_a_22_]")).first(),
    articlesFilteredBy: element.all(by.css("[id^=productGrid_span_13_]")),
    clearAllArticleFilter: element.all(by.css("[id^=productGrid_a_15_]")).first()
};

export class SearchPage extends BaseTest {

    constructor(selectedTab: string, numberOfResult: number = -1) {
        super();

        if (selectedTab === productsTab) {
            this.waitForProdResult(numberOfResult);
        }
        else if (selectedTab === articlesTab) {
            this.waitForArticlesResult(numberOfResult);
        }
    }

    waitForProdResult(numberOfResult: number, timeout: number = 10000): Promise<boolean> {
        let resultLoaded: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return searchResultPageObjs.productResultContainer.getWebElements().then(elements => {
                    resultLoaded = elements.length;
                    if (numberOfResult > 0 && resultLoaded === numberOfResult) {
                        return searchResultPageObjs.productFilters.first().isDisplayed().then(isDisplayed => {
                            if (isDisplayed) {
                                return searchResultPageObjs.productsResultFound.isDisplayed().then(isDisplayed => {
                                    if (isDisplayed) {
                                        return searchResultPageObjs.productsResultFound.getText().then(result => {
                                            if (result !== '') {
                                                resolve(true);
                                                return true;
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }, timeout)
                .then(null, function (error) {
                    if (numberOfResult === 0 && resultLoaded === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                        console.log("Expected in search result ->" + numberOfResult + "<- but got ->" + resultLoaded + "<-" + error);
                    }
                });
        });
    }

    waitForArticlesResult(numberOfResult: number, timeout: number = 10000): Promise<boolean> {
        let resultLoaded: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return searchResultPageObjs.articleResultContainer.getWebElements().then(elements => {
                    resultLoaded = elements.length;
                    if (numberOfResult > 0 && resultLoaded === numberOfResult) {
                        return searchResultPageObjs.articleTypeFilter.first().isDisplayed().then(isDisplayed => {
                            if (isDisplayed) {
                                return searchResultPageObjs.articlesResultsFound.isDisplayed().then(isDisplayed => {
                                    if (isDisplayed) {
                                        return searchResultPageObjs.articlesResultsFound.getText().then(result => {
                                            if (result !== '') {
                                                resolve(true);
                                                return true;
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }, timeout) 
                .then(null, function (error) {
                    if (numberOfResult === 0 && resultLoaded === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                        console.log("Expected in search result ->" + numberOfResult + "<- but got ->" + resultLoaded + "<-" + error);
                    }
                });
        });
    }

    isProductsTabActive(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            searchResultPageObjs.productsTab.getAttribute('tabindex').then(tabIndex => {
                if (tabIndex === '0') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    isArticlesTabActive(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            searchResultPageObjs.articlesTab.getAttribute('tabindex').then(tabIndex => {
                if (tabIndex === '0') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    clickProductsTab(numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.productsTab.click();
        return new SearchPage(productsTab, numberOfResult);
    }

    clickArticlesTab(numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.articlesTab.click();
        return new SearchPage(articlesTab, numberOfResult);
    }

    getProdNumberOfResult(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            searchResultPageObjs.productsResultFound.getText().then(result => {
                let numberOfRes = Number(result.replace(/[^0-9\.]+/g, ""));
                this.waitForCountToBeUpdated(searchResultPageObjs.productResultContainer, numberOfRes);
                resolve(numberOfRes);
            });
        });
    }

    getSingleArticleNumberOfResult(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            searchResultPageObjs.articlesSingleResultFound.getText().then(result => {
                let numberOfRes = Number(result.replace(/[^0-9\.]+/g, ""));
                this.waitForCountToBeUpdated(searchResultPageObjs.articleResultContainer, numberOfRes);
                resolve(numberOfRes);
            });
        });
    }

    articlesResultNames(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.articleResultName.getText().then(result => {
                resolve(result);
            });
        });
    }

    getArticlesNumberOfResult(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            searchResultPageObjs.articlesResultsFound.getText().then(result => {
                let numberOfRes = Number(result.replace(/[^0-9\.]+/g, ""));
                this.waitForCountToBeUpdated(searchResultPageObjs.articleResultContainer, numberOfRes);
                resolve(numberOfRes);
            });
        });
    }

    getProductResultList(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.productResultList.getText().then(result => {
                resolve(result);
            });
        });
    }

    getEmptyProdResult(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.productsNoResultFoundMsg.getText().then(result => {
                resolve(result);
            });
        });
    }

    getEmptyProdNumOfResult(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            searchResultPageObjs.productsNoResultFound.getText().then(result => {
                let numberOfRes = Number(result.replace(/[^0-9\.]+/g, ""));
                resolve(numberOfRes);
            });
        });
    }

    getProdResultByName(productName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.productResultName.filter(function (elem) {
                return elem.getText().then(elementText => {
                    if (elementText === productName) {
                        resolve(elementText);
                        return true;
                    }
                    return false;
                });
            });
        });
    }

    getArticleResultList(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.articlesResultList.getText().then(result => {
                resolve(result);
            });
        });
    }

    getArticleResultByName(articleName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.articleResultName.filter(function (elem) {
                return elem.getText().then(elementText => {
                    if (elementText === articleName) {
                        resolve(elementText);
                        return true;
                    }
                    return false;
                });
            });
        });
    }

    getEmptyArticleResult(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.articlesResultListEmpty.getText().then(result => {
                resolve(result);
            });
        });
    }

    clickProdCategoryFilterByName(category: string, numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.productCategoryFilter.filter(function (elem) {
            return elem.getText().then(elementText => {
                return elementText === category;
            });
        }).first().click();
        return new SearchPage(productsTab, numberOfResult);
    }

    clickProductBrandFilter(brand: string, numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.productBrandFilter.filter(function (elem) {
            return elem.getText().then(elementText => {
                return elementText === brand;
            });
        }).first().click();
        return new SearchPage(productsTab, numberOfResult);
    }

    clickArticleTypeFilter(articleType: string, numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.articleTypeFilter.filter(function (elem) {
            return elem.getText().then(elementText => {
                if (elementText === articleType) {
                    return true;
                }
            });
        }).first().click();
        return new SearchPage(articlesTab, numberOfResult);
    }

    getSuggestedProdKeyword(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.productSuggestedKeyword.getText().then(keyword => {
                resolve(keyword);
            });
        });
    }

    getArticlesFilteredBy(filterName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            searchResultPageObjs.articlesFilteredBy.filter(function (elem) {
                return elem.getText().then(elementText => {
                    if (elementText === filterName) {
                        resolve(elementText);
                        return true;
                    }
                    return false;
                });
            });
        });
    }

    clearAllArticleFilter(numberOfResult: number = -1): SearchPage {
        searchResultPageObjs.clearAllArticleFilter.click();
        return new SearchPage(articlesTab, numberOfResult);
    }

}
