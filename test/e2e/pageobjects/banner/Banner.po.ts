import { ProductListingPage } from '../page/ProductListingPage.po';
import { by, element, browser } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { StoreLocatorPage } from '../page/StoreLocatorPage.po';
import { MyAccountPage } from '../page/MyAccountPage.po';
import { ShoppingCartPage } from '../page/ShoppingCartPage.po';
import { SearchPage } from '../page/SearchPage.po';
import { CategoryPage } from '../page/CategoryPage.po';
import { ProductPage } from '../page/ProductPage.po';
import { MegaMenu } from './MegaMenu';
import { ContactUsPage } from '../page/ContactUsPage.po';
import { DesignTopicsPage } from '../page/DesignTopicPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("Banner");
const productsTab: string = "products";

export const bannerObj = {
  megaMenu: element.all(by.css("[id^=hamburger_menu_button_]")).first(),
  signOut: element.all(by.css("[id^=signout_link_]")).first(),
  signIn: element.all(by.css("[id^=signin_link_]")).first(),
  myAccountLink: element.all(by.css("[id^=myaccount_link_]")).first(),
  shopcartLink: element.all(by.css("[id^=cart_link_]")).first(),
  searchInputField: element.all(by.css("[id^=search-box_input_3_]")).first(),
  searchButton: element.all(by.css("[id^=search-box_button_4_]")).first(),
  suggestedKeywords: element.all(by.css("[id^=search-box_a_10_]")),
  searchSuggestionDropdown: element.all(by.css("[id^=search-box_div_6_]")).first(),
  searchInputClearButton: element.all(by.css("[id^=search-box_div_5_]")).first(),
  storeLocator: element.all(by.css("[id^=store_locator_]")).first(),
  preferStore: element.all(by.css("[id^=store_locator_preferred_store_]")).first(),
};

export class Banner extends BaseTest {

  constructor(signedIn : boolean = false) {
    super();
    if (signedIn) {
      this.signInNotDisplayed(5000);
    }else{
      this.waitForElementDisplayed(bannerObj.signIn, 5000)
    }
    this.waitForElementDisplayed(bannerObj.searchInputField);
    this.waitForElementDisplayed(bannerObj.searchButton);

  }

  signOutIfSignedIn(): Banner {
    this.signInNotDisplayed().then(signInNotDisplayed => {
      if (signInNotDisplayed) {
        let myAccount : MyAccountPage = this.clickMyAccount();
        myAccount.ifCrsStopActingAsDisplayed(250).then(result=>{
            if(result){
                myAccount.clickStopActingAs().clickSignOut();
            }else{
                myAccount.clickSignOut();
            }
        })
      }
    });
    this.waitForElementPresent(bannerObj.signIn);
    return new Banner(false);
  }
  /**
   *
   * @param waitTimeMs when user is expected to be signed in set number higher for longer wait time
   */
  signInNotDisplayed(waitTimeMs : number = 200): Promise<boolean> {
    return this.waitForElementNotPresent(bannerObj.signIn, waitTimeMs);
  }

  //
  waitForSignedInNotDisplayed(): Banner {
    this.waitForElementNotDisplayed(bannerObj.signIn);
    return this;
  }
  /**Needs to be revisited for mobile
   * @deprecated REPLACED WITH waitForUserSignedOut()
   */
  signOutDisplayed(): Promise<boolean> {
    return this.waitForElementDisplayed(bannerObj.signOut);
  }

  waitForUserSignedOut(): Promise<boolean> {
    return this.waitForElementNotDisplayed(bannerObj.signIn);
  }

  /**
   * @deprecated signout removed from banner, must go to my account page first
   */
  clickSignOut(): Banner {
    bannerObj.signOut.click();
    return this;
  }

  signInDisplayed(): Promise<boolean>{
    this.waitForElementDisplayed(bannerObj.searchInputField);
    this.waitForElementDisplayed(bannerObj.searchButton);
    return this.waitForElementDisplayed(bannerObj.signIn);
  }

  clickSignIn<T>(type: { new(): T }): T {
    bannerObj.signIn.click();
    return new type();
  }

  checkMegamenuExists(): Promise<boolean> {
    return this.waitForElementDisplayed(bannerObj.megaMenu);
  }

  clickMyAccount(): MyAccountPage {
    this.waitForElementDisplayed(bannerObj.myAccountLink);
    bannerObj.myAccountLink.click();
    return new MyAccountPage();
  }

  clickMyAccountError<T>(type: { new(): T }): T {
    bannerObj.myAccountLink.click();
    return new type();
  }

  myAccountDisplayed(): Promise<boolean> {
    return this.waitForElementDisplayed(bannerObj.myAccountLink);
  }

  clickShopCart(numberOfProducts: number = 0): ShoppingCartPage {
    bannerObj.shopcartLink.click();
    return new ShoppingCartPage(numberOfProducts);
  }

  cartDisplayed(): Promise<boolean> {
    return this.waitForElementDisplayed(bannerObj.shopcartLink);
  }

  storeLocatorDisplayed(): Promise<boolean>{
    return this.waitForElementDisplayed(bannerObj.storeLocator);
  }

  typeSearchInputField(searchTerm: string): Banner {
    bannerObj.searchInputField.clear().then(function () {
      bannerObj.searchInputField.sendKeys(searchTerm);
    });
    return this;
  }

  clickSearch(numberOfResult: number = -1): SearchPage {
    this.waitForSearchInputExpanded();
    bannerObj.searchButton.click();
    return new SearchPage(productsTab, numberOfResult);
  }

  clickStoreLocator() : StoreLocatorPage {
    bannerObj.storeLocator.click();
    return new StoreLocatorPage();
  }

  waitForSearchInputExpanded(timeout: number = 10000): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      return browser.wait(function () {
        return bannerObj.searchInputField.getSize().then(element => {
          if (element.width === 270) {
            resolve(true);
            return true;
          }
        });
      }, timeout)
        .then(null, function (error) {
          resolve(false);
          console.log("Expected in search input field in banner to expand ->" + error);
        });
    });
  }

  isSuggestionVisible(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.waitForElementDisplayed(bannerObj.searchSuggestionDropdown).then(isDisplayed => {
        if (isDisplayed) {
          resolve(true);
          return true;
        }
      });
    });
  }

  clickOnSuggestion(suggestionKeyword: string, numberOfResult: number = -1): SearchPage {
    bannerObj.suggestedKeywords.filter(function (elem) {
      return elem.getText().then(elementText => {
        if (elementText === suggestionKeyword) {
          return true;
        }
      });
    }).first().click();
    return new SearchPage(productsTab, numberOfResult);
  }

  clickOnPLPSuggestion(suggestionKeyword: string, numberOfResult: number = -1): ProductListingPage {
    bannerObj.suggestedKeywords.filter(function (elem) {
      return elem.getText().then(elementText => {
        if (elementText === suggestionKeyword) {
          return true;
        }
      });
    }).first().click();
    return new ProductListingPage(numberOfResult);
  }

  clickOnCategorySuggestion(suggestionKeyword: string, numberOfResult: number = -1): CategoryPage {
    bannerObj.suggestedKeywords.filter(function (elem) {
      return elem.getText().then(elementText => {
        if (elementText === suggestionKeyword) {
          return true;
        }
      });
    }).first().click();
    return new CategoryPage();
  }

  clickRedirectToProductPage(): ProductPage {
    this.waitForSearchInputExpanded();
    bannerObj.searchButton.click();
    return new ProductPage();
  }

  getNumberOfSuggestion(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.waitForElementDisplayed(bannerObj.searchSuggestionDropdown);
      bannerObj.suggestedKeywords.count().then(count => {
        resolve(count);
        return true;
      });
    });
  }

  getSuggestedKeywordBySearchTerm(searchTerm: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bannerObj.suggestedKeywords.each(function (elem) {
        return elem.getText().then(elementText => {
          if (elementText === searchTerm) {
              resolve(elementText);
              return true;
          }
          else {
            return false;
          }
        });
      });
    });
  }

  isClearButtonDisplayed(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      bannerObj.searchInputClearButton.isDisplayed().then(isDisplayed => {
        resolve(isDisplayed);
      });
    });
  }

  clickSearchInputClearButton(): Banner {
    bannerObj.searchInputClearButton.click();
    return this;
  }

  getSearchInput(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      bannerObj.searchInputField.getText().then(input => {
        resolve(input);
      });
    });
  }

  openMenu(): MegaMenu{
    bannerObj.megaMenu.click();
    return new MegaMenu();
  }

  clickSearchWithKeyword(keyword: string): BaseTest {
    this.waitForSearchInputExpanded();
    bannerObj.searchButton.click();
    if (keyword === "help")
      return new ContactUsPage();
    else if (keyword === "Maxine Brown")
      return new DesignTopicsPage();
    return new BaseTest();
  }

  getPreferredStore(): Promise<string>{
      let ele = bannerObj.preferStore;
      return new Promise<string>(resolve=>{
          resolve(ele.getText());
      });
  }
}