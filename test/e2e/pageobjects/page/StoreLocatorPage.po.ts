import { BaseTest } from '../base/BaseTest.po';
import { by, element, browser, ElementFinder } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("StoreLocatorPage");

export const storeLocatorPageObj = {
    searchField: element.all(by.css("[id^=storeLocator_input_9_")).first(),
    searchButton: element.all(by.css("[id^=storeLocator_button_10_")).first(),
    useMyLocationButton: element.all(by.css("[id^=storeLocator_button_13_")).first(),
    resultsContainer: element.all(by.css("[id^=storeLocator_div_33_")).first(),
    noOfResults: element.all(by.css("[id^=storeLocator_div_29")).first(),
    storeInfoFromList: element.all(by.css("[id^=storeLocator_div_34_")),
    storeInfoPopUp: element.all(by.css("[id^=storeLocator_div_65_")).first(),
    selectFilters: element.all(by.css("[id^=storeLocator_a_20_")).first(),
    filterPopUp: element.all(by.css("[id^=storeLocator_div_42_")).first(),
    filterCheckboxes: element.all(by.css("[id^=storeLocator_label_57_")),
    applyFilters: element.all(by.css("[id^=storeLocator_button_64_")).first(),
    typeAheadDropdown: element.all(by.css("[id^=storeLocator_div_11_")).first(),
    dropdownOption: '[id^=storeLocator_a_14_]',
    dropdownOptionElement: element.all(by.css("[id^=storeLocator_a_14_]")),
    dropdownResults: element.all(by.css("[id^=storeLocator_a_14_]")),
    storeButtons: element.all(by.css("[id^=storeLocator_button_41_")),
    storeResults: element.all(by.css("[id^=storeLocator_p_35_")),
    storeInfoExs: element.all(by.css("a[id^=storeLocator_div_51_")),
    storeServices: element.all(by.css("[id^=storeLocator_p_65_]")),
    storeAddInfo: element.all(by.css("[id^=storeLocator_div_59_]")),
    storePhones: element.all(by.css("[id^=storeLocator_a_39_]")),
};

export class StoreLocatorPage extends BaseTest {

    constructor() {
        super();
        this.waitForElementDisplayed(storeLocatorPageObj.searchField);
        this.waitForElementDisplayed(storeLocatorPageObj.noOfResults);
        this.waitForTextToBeUpdatedToContain(storeLocatorPageObj.noOfResults,"your location");
    }

    typeAheadDropdownDisplayed( numberOfResults: number): Promise<boolean>{
        this.waitForCountToBeUpdated(storeLocatorPageObj.dropdownOptionElement, numberOfResults);
        return this.waitForElementDisplayed(storeLocatorPageObj.typeAheadDropdown);
    }

    selectDropdownContainingText(location :string , searchResults: string, searchResultCount: number): StoreLocatorPage{
        element(by.cssContainingText(storeLocatorPageObj.dropdownOption , location)).click();
        this.waitForTextToBeUpdated(storeLocatorPageObj.noOfResults, searchResults);
        this.waitForCountToBeUpdated( storeLocatorPageObj.storeInfoFromList ,searchResultCount);
        return this;
    }

    getTypeAheadDropdownResults(): Promise<string[]>{
        let list: string[] = [];
        return new Promise<string[]>((resolve) => {
            storeLocatorPageObj.dropdownResults.each(storeNames => {
                storeNames.getText().then(name => {
                    list.push(name);
                });
            }).then(() => {
                resolve(list);
            });
        });
    }

    getAllStoreInfoFromList(): Promise<string[]> {
        let list: string[] = [];
        return new Promise<string[]>((resolve) => {
            storeLocatorPageObj.storeInfoFromList.each(storeNames => {
                storeNames.getText().then(name => {
                    list.push(name);
                });
            }).then(() => {
                resolve(list);
            });
        });
      }

    clickStoreSearch(searchResults: string) : StoreLocatorPage {
        let elem = storeLocatorPageObj.searchButton;
        this.waitForElementPresent(elem);
        this.waitForElementDisplayed(elem);
        this.waitForStableHeight(elem);
        elem.click().then(()=>{
            console.log("Click on store search button");
        });
        this.waitForTextToBeUpdatedToContain(storeLocatorPageObj.noOfResults, searchResults);
        return this;
    }

    clickSelectFilters() : StoreLocatorPage {
        storeLocatorPageObj.selectFilters.click();
        this.waitForElementDisplayed(storeLocatorPageObj.filterPopUp);
        this.waitForElementDisplayed(storeLocatorPageObj.filterCheckboxes.first());
        return this;
    }

    clickApplyFilters(filteredResults : string) : StoreLocatorPage {
        storeLocatorPageObj.applyFilters.click();
        this.waitForElementNotDisplayed(storeLocatorPageObj.filterPopUp);
        this.waitForTextToBeUpdated(storeLocatorPageObj.noOfResults, filteredResults);
        return this;
    }

    clickFilterAtIndex(index : number): StoreLocatorPage {
        storeLocatorPageObj.filterCheckboxes.get(index).click();
        return this;
    }

    clickStoreInfoFromList(store1PopUpText, index : number = 0): StoreLocatorPage {
        storeLocatorPageObj.storeInfoFromList.get(index).click().then( ()=>{
            console.log("clicked on store at index " + index + " which should be store: " + store1PopUpText)
        });
        this.waitForElementDisplayed(storeLocatorPageObj.storeInfoPopUp);
        this.waitForTextToBeUpdated(storeLocatorPageObj.storeInfoPopUp, store1PopUpText);
        return this;
    }

    typeSearchText(searchText : string) {
        let elem = storeLocatorPageObj.searchField;
        elem.clear().then(() => {
            elem.sendKeys(searchText).then(function () {
                console.log("Entered for store location search: " + searchText);
            });
        });
        return this;
    }

    typeSearchTextWithoutClear(searchText : string) {
        var elem = storeLocatorPageObj.searchField;
        elem.sendKeys(searchText).then(function () {
            browser.sleep(1000);
            console.log("Entered for search location: " + searchText);
        });
        return this;
    }

    getResultsText(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
          storeLocatorPageObj.noOfResults.getText().then(text => {
            resolve(text);
          })
        });
      }

    getStoreInfoFromList(index : number = 0): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            storeLocatorPageObj.storeInfoFromList.get(index).getText().then(text => {
            resolve(text);
            });
        });
    }

    /* Css methods and popover methods */
    getStoreInfoFromPopUp(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            storeLocatorPageObj.storeInfoPopUp.getText().then(text => {
                resolve(text);
            });
        });
    }

    waitForActiveLocationCss(cssStyleProperty: string, cssValue: string, index: number): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(storeLocatorPageObj.storeInfoFromList.get(index), cssStyleProperty, cssValue);
    }

    getActiveLocationCssByIndex(cssStyleProperty: string, index:number): Promise<string>{
        return this.getCssValue(cssStyleProperty, storeLocatorPageObj.storeInfoFromList.get(index));
    }

    getCssValuesForResultsContainer(cssStyleProperty: string) : Promise<string> {
        return this.getCssValue(cssStyleProperty, storeLocatorPageObj.resultsContainer);
    }

    phoneNumberClickableByIndex(index:number){
        let phoneNumberLink = storeLocatorPageObj.storePhones.get(index);
        return this.verifyElementClickable(phoneNumberLink);
    }

    getPhoneNumberLinkFromStoreInfoByIndex(index: number): Promise<string>{
        return this.getAttribute(storeLocatorPageObj.storePhones.get(index), 'href');
    }


    phoneNumberClickableInPopOver(){
        var phoneNumberLink = element.all(by.css('[id^=storeLocator_div_65_')).first().all(by.css('[id^=storeLocator_a_72_]')).first();
        return this.verifyElementClickable(phoneNumberLink);
    }

    getPhoneNumberLinkFromPopOver(): Promise<string>{
        return this.getAttribute(element.all(by.css('[id^=storeLocator_div_65_')).first().all(by.css('[id^=storeLocator_a_72_]')).first(),  'href');
    }

    directionClickableInPopOver(){
        var phoneNumberLink = element.all(by.css('[id^=storeLocator_div_65_')).first().all(by.css('[id^=storeLocator_a_77_]')).first();
        return this.verifyElementClickable(phoneNumberLink);
    }

    getDirectionLinkFromPopOver(): Promise<string>{
        return this.getAttribute(element.all(by.css('[id^=storeLocator_div_65_')).first().all(by.css('[id^=storeLocator_a_77_]')).first(),  'href');
    }

    selectPreferedStore(index: number): StoreLocatorPage {
        storeLocatorPageObj.storeButtons.get(index).click().then(function () {
            console.log("Click on store button at "+index);
        });
        let ele = this.getMyStoreSpanByIndex(index);
        this.waitForElementPresent(ele);
        return this;
    }

    clickStoreInfoEx(index: number): StoreLocatorPage {
        let ele = storeLocatorPageObj.storeInfoExs.get(index);
        this.waitForElementPresent(ele);
        this.waitForElementDisplayed(ele);
        this.waitForStableHeight(ele);
        ele.click().then(function () {
            console.log("Click on store Info expended at "+index);
        });
        return this;
    }

    getStorePhoneNumber(index:number): Promise<string> {
        let ele = storeLocatorPageObj.storePhones.get(index);
        this.waitForElementPresent(ele);
        this.waitForElementDisplayed(ele);
        this.waitForStableHeight(ele);
        return new Promise<string>(resolve=>{
            ele.getText().then(res=>{
                resolve(res);
            })
        });
    }

    getStoreService(index:number): Promise<string> {
        let ele = storeLocatorPageObj.storeServices.get(index);
        this.waitForElementPresent(ele);
        this.waitForElementDisplayed(ele);
        this.waitForStableHeight(ele);
        return new Promise<string>(resolve=>{
            ele.getText().then(res=>{
                resolve(res);
            })
        });
    }

    getMyStoreSpanByIndex(index:number): ElementFinder {
        return element.all(by.css('[id^=storeLocator_span_36_'+index+'_]')).first();
    }
}
