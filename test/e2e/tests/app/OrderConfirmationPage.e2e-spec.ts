import { HomePage } from '../../pageobjects/page/HomePage.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { AddressBookPage } from '../../pageobjects/page/AddressBookPage.po';
import { AddressDialog } from '../../pageobjects/dialog/AddressDialog.po';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { browser } from 'protractor';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';

import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("OrderConfirmationPage");

/**
* Order Confirmation Page
*/
describe('Views Order Confirmation page', () => {

  var dataFile = require('./data/OrderConfirmationPage.json');
  var user01 = dataFile.user01;
  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  let storeFront: StoreFront = new StoreFront();
  const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');

  it('to view order confirmation page: test01', () => {
    console.log('to view order confirmation page: test01');
    var testData = dataFile.test01;
    let sku1: Sku = CATALOG.Bath.Accessories["Makeup Mirror"]["BR-ACCE-0001-0001"];


    //GIVEN a user has a a valid address in address book as default, and the homepage is loaded
    let storeFront: StoreFront = new StoreFront();

    storeFront = new StoreFront();
    let banner : Banner = storeFront.banner();
    var register = banner.clickSignIn(RegistrationPage);

    //create user
    register.typeFirstName(user01.firstName).typeLastName(user01.lastName).typeEmail(timeStamp + user01.login).typePassword(user01.password).typeVerifyPassword(user01.password).clickRegister();

    let addBook = dataFile.user01.addressBook;
    let addressBookPage = banner.clickMyAccount().goToAddressBookPage();
    let addressDialog: AddressDialog = addressBookPage.clickEditLink(0);

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addBook[0].address);
    addressDialog.selectShipping(addBook[0].country);
    addressDialog.enterCity(addBook[0].city);
    addressDialog.enterState(addBook[0].state);
    addressDialog.enterZipCode(addBook[0].zipCode);
    addressDialog.clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //AND 
    //WHEN user navigates to products page and adds to cart and then views cart
    var pdp: ProductPage = storeFront.navigateToURL('/product?productNumber=' + sku1.sku, ProductPage);

    pdp.addToCart(1);
    var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

    //THEN there is 1 product in Cart
    shoppingCartPage.getNumberOfProductsLoaded().then(products => {
      expect(products).toBe(1, " shopcart does not have correct number of products loaded");
    });

    //When user clicks on check out and the checkout page is loaded 
    let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

    //AND
    //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
    checkout.shippingMethod(dataFile.shippingType[testData.shippingTypeIndex].shippingName).saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed 
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, "save and continue displayed when should be hidden");
    });

    //WHEN user clicks on place order navigates to the order page
    let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

    //THEN there are thank you and email confirmation messages
    orderConfirmation.getThankYouMessage().then(text => {
      expect(text).toBe(dataFile.messages.thankYou, "thank you message");
    });
    orderConfirmation.getEmailConfirmationMessage().then(text => {
      expect(text).toBe(dataFile.messages.emailConfirmation, "email confirmation message");
    });

    //AND
    //THEN there is a order id confirmation number greater than 0
    orderConfirmation.getOrderId().then(orderId => {
      console.log(orderId);
      expect(Number(orderId)).toBeGreaterThan(0, " for get order id");
    });
  });

});