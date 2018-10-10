import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { ErrorPage } from '../../pageobjects/page/ErrorPage.po';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("InvalidURL");

/**
 * Invalid URL and parameters
 */

describe('User encounters error page', () => {
  var dataFile = require('./data/InvalidURL.json');
  let storeFront: StoreFront = new StoreFront();
  let base = new BaseTest();

  beforeAll(function () {
  });

  beforeEach(function () {
  });

  it('test04: from navigating to page with invalid parameters in order confirmation page', () => {
    console.log('test04: from navigating to page with invalid parameters in order confirmation page');
    var testData = dataFile;

    //declarations for registration data
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    base.navigateTo('/sign-in');
    let register: RegistrationPage = new RegistrationPage();
    var registerData = dataFile.register;

    //Register

    register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp + registerData.logonId)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password);


    register.clickRegister();

    //need this sleep to complete clicking on register before hitting invalid URL
    browser.sleep(5000);

    //attempt to navigate without params
    base.navigateTo('/order-confirmation');
    let errorPage: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage.getErrorMsg().then(error => {

      expect(error).toBe(testData.errorMsg,'Error is not the same as error on page not found');

    });

    //attempt to navigate passing in empty value parameters
    base.navigateTo('/order-confirmation?orderId=?storeId=');
    let errorPage2: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage2.getErrorMsg().then(error => {

      expect(error).toBe(testData.errorMsg,'Error is not the same as error on page not found');

    });

    //attempt to navigate passing in invalid value for parameters
    base.navigateTo('/order-confirmation?orderId=invalidOrderId?storeId=invalidStoreId');
    let errorPage3: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage3.getErrorMsg().then(error => {
      expect(error).toBe(testData.errorMsg,'Error is not the same as error on page not found');
    });


    //shopper logs out
    new Banner().signOutIfSignedIn();
  });

  it('test05: from navigating to page with invalid parameters in order details page', () => {
    console.log('test05: from navigating to page with invalid parameters in order details page');

    var testData = dataFile;

    //declarations for registration data
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    var registerData = dataFile.register;

    //Register
    base.navigateTo('/sign-in');
    let register: RegistrationPage = new RegistrationPage();

    register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp + registerData.logonId)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password);


    register.clickRegister();

    //need this sleep to complete clicking on register before hitting invalid URL
    browser.sleep(5000);

    //attempt to navigate passing in no params
    base.navigateTo('/order-details');
    let errorPage: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage.getErrorMsg().then(error => {

      expect(error).toBe(testData.errorMsg,'Error is not the same as error on page not found');
    });

    //attempt to navigate passing in empty value for orderId
    base.navigateTo('/order-details?orderId=');
    let errorPage2: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage2.getErrorMsg().then(error => {

      expect(error).toBe(testData.errorMsg,'Error is not the same as error on page not found');
    });

    //attempt to navigate passing in invalid value for orderId
    base.navigateTo('/order-details?orderId=invalidOrderId');
    let errorPage3: ErrorPage = new ErrorPage();
    //verify error msg
    errorPage3.getErrorMsg().then(error => {

      expect(error).toBe(testData.errorMsg);
    });


    //shopper logs out
    new Banner().signOutIfSignedIn();
  });

  it('test06: from from navigating to a non-existing page', () => {
    console.log('test06: from from navigating to a non-existing page');

    var testData = dataFile;
    //(alphanumeric paths only)
    //Navigate
    base.navigateTo('/nonexistingPage');

    //Check the error message
    let errorPage: ErrorPage = new ErrorPage();
    errorPage.getErrorMsg().then(msg => {
      expect(msg).toEqual(testData.errorMsg);
    });

    // Check that the widget is displayed
    let productRecommendationWidget: ProductRecommended = new ProductRecommended();
    productRecommendationWidget.widgetDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });

    //special character - Defect
    //use ~!@#$%^&*()_+%601234567890-=[]{}|; as path
    //use . as input
    //use * as input
  });




});