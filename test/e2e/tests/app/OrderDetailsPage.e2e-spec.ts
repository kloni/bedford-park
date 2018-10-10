import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import {AddressDialog} from '../../pageobjects/dialog/AddressDialog.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { OrderDetailPage } from '../../pageobjects/page/OrderDetailPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StockholmCatalog, Sku, StockholmProduct } from './data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("OrderDetails");

/**
 * Order Details Page
 *
 */
describe('User views Order Details page', () => {
  var dataFile = require('./data/OrderDetailsPage.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');

    var checkoutOrderId: string;

    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
    let orderDetailPage : OrderDetailPage;

    var date = new Date();

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var todayDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    var banner : Banner;

    let product1 : StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"].productInfo;
    let product2 : StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Clodit Chest of Drawers"].productInfo;
    let product3 : StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo;

    let sku1 : Sku = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"]["BD-DRSS-0001-0001"];
    let sku2 : Sku = CATALOG.Bedroom.Dressers["Stonehenge Clodit Chest of Drawers"]["BD-DRSS-0002-0001"];
    let sku3 : Sku = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0001"];

    beforeAll(function () {
      let storeFront: StoreFront = new StoreFront();

      banner = storeFront.banner();
      banner.signInDisplayed();
      dataFile = require('./data/OrderDetailsPage.json');

      let register: RegistrationPage = banner.clickSignIn(RegistrationPage);

      console.log("Creating user: " + timeStamp + dataFile.register.logonId);

      var registerData = dataFile.register;

      //create user
      banner= register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp + registerData.logonId)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password)
      .clickRegister();

      banner.signInNotDisplayed();
      console.log('logonID : ' + timeStamp + registerData.logonId);

      let myAccount : MyAccountPage = banner.clickMyAccount();
      let addressDialog : AddressDialog = myAccount.goToAddressBookPage().clickEditLink(0);

      var addressBookData = dataFile.register.AddressBook;

      //EDIT existing users details with a valid US address
      addressDialog.enterAddress1(addressBookData.address)
      .selectShipping(addressBookData.country)
      .enterCity(addressBookData.city)
      .enterState(addressBookData.state)
      .enterZipCode(addressBookData.zipCode)
      .clickSave();
      addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
      });

      //AND
      //WHEN user navigates to products page and adds a product to their cart
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP('Dressers', 4);
      var pdp: ProductPage = plp.clickProductAtIndex(0);

      pdp.addToCart(1);
      pdp.confirmationModalDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

      banner.openMenu();
      plp = megaMenu.navigateToPLP('Dressers', 4);
      pdp = plp.clickProductAtIndex(1);

      pdp.addToCart(1);
      pdp.confirmationModalDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

      banner.openMenu();
      plp = megaMenu.navigateToPLP('Dressers', 4);
      pdp = plp.clickProductAtIndex(2);
      pdp.addToCart(1);
      pdp.confirmationModalDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });
      var shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();

      //AND
      //WHEN user navigates to shopcart
      shoppingCartPage.typeProductQuantity(1, "3");
      shoppingCartPage.waitForSubtotalToEqual(dataFile.checkout.expectedSubtotal);

      //AND
      //WHEN user clicks on check out and the checkout page is loaded
      let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

      //AND
      //WHEN clicks on save and continue
      checkout.shippingMethod(dataFile.checkout.shipping).saveAndContinue();

      //THEN wait for the save and continue button to no longer be displayed
      checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
        expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
      });

      //AND
      //WHEN user clicks on place order navigates to the order confirmation page
      let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

      //THEN get order confirmation id
      orderConfirmation.waitForOrderIdToLoad();
      orderConfirmation.getOrderId().then(_orderId => {
        checkoutOrderId= _orderId;
        console.log('OrderId: ',checkoutOrderId);

      });

      //sign out
      banner.clickMyAccount().clickSignOut();
    });

    beforeEach(function () {
      let storeFront = new StoreFront();
      banner = storeFront.banner().signOutIfSignedIn();

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      let login = banner.clickSignIn(LoginPage);

      //Login
      var logonData = dataFile.commonLogin;
      login.typeUserName(timeStamp+ logonData.logonId)
      .typePassword(logonData.password)
      .clickLogin();
      banner.signInNotDisplayed();

      //Naviagate to MyAccount Page
      let myAccount = banner.clickMyAccount();

      //Navigate to OrderDetail Page
      orderDetailPage = myAccount.goToOrderHistoryPage(1).viewOrderDetailByIndex(0);

    });

    afterEach(function() {

      new Banner().signOutIfSignedIn();
    });


  it('test 01: to view order data', () => {
    console.log('test 01: to view order data');
    var testData = dataFile.test01

    //verify heading
    orderDetailPage.getOrderIdFromHeading().then(orderId =>{
      expect(orderId).toEqual(checkoutOrderId);
    });

    //verify billing address
    orderDetailPage.getOrderBillingAddress().then(billingAddr => {
      expect(billingAddr).toEqual(testData.expectedBillingAddress);
    });

    //verify date
    orderDetailPage.getOrderDate().then(date => {
      expect(date).toEqual(todayDate);
    });

    //verify status text
    orderDetailPage.getOrderStatus().then(status => {
      expect(status).toEqual(testData.expectedStatus);
    });

    //verify shipping address
    orderDetailPage.getOrderShippingAddress().then(shippingAddr => {
      expect(shippingAddr).toEqual(testData.expectedShippingAddress);
    });

    //payment method
    orderDetailPage.getOrderPaymentInfo().then(paymentInfo => {
      expect(paymentInfo).toEqual(testData.expectedPaymentInfo);
    });

    //shippihg method
    orderDetailPage.getOrderShippingMethod().then(shppingMethod => {
      expect(shppingMethod).toEqual(testData.expectedShppingMethod);
    });

    //verify item count
    orderDetailPage.getOrderCount().then(totalQuantityCount => {
      expect(totalQuantityCount).toEqual(testData.expectedQuantityCount);
    });

    //verify product name
    orderDetailPage.getOrderItemNameByIndex(0).then(itemName => {
      expect(itemName).toEqual(product1.name);
    });
    orderDetailPage.getOrderItemNameByIndex(1).then(itemName => {
      expect(itemName).toEqual(product2.name);
    });
    orderDetailPage.getOrderItemNameByIndex(2).then(itemName => {
      expect(itemName).toEqual(product3.name);
    });

    //verify product SKU
    orderDetailPage.getOrderItemSKUByIndex(0).then(itemSKU => {
      expect(itemSKU).toEqual(sku1.sku);
    });
    orderDetailPage.getOrderItemSKUByIndex(1).then(itemSKU => {
      expect(itemSKU).toEqual(sku2.sku);
    });
    orderDetailPage.getOrderItemSKUByIndex(2).then(itemSKU => {
      expect(itemSKU).toEqual(sku3.sku);
    });

    //verify attribute
    orderDetailPage.getOrderItemAttributeByIndex(0,0).then(attr => {
      let skuAttribute : any= sku1.attributes;
      expect(attr.toLowerCase()).toEqual(skuAttribute.color);
    });
    orderDetailPage.getOrderItemAttributeByIndex(1,0).then(attr => {
      let skuAttribute : any= sku2.attributes;
      expect(attr.toLowerCase()).toEqual(skuAttribute.color);
    });
    orderDetailPage.getOrderItemAttributeByIndex(2,0).then(attr => {
      let skuAttribute : any= sku3.attributes;
      expect(attr.toLowerCase()).toEqual(skuAttribute.color);
    });

    //verify quantity
    orderDetailPage.getOrderItemQuantityByIndex(0).then(quantity =>{
      expect(quantity).toEqual(testData.expectedQuantity1);
    });
    orderDetailPage.getOrderItemQuantityByIndex(1).then(quantity =>{
      expect(quantity).toEqual(testData.expectedQuantity2);
    });
    orderDetailPage.getOrderItemQuantityByIndex(2).then(quantity =>{
      expect(quantity).toEqual(testData.expectedQuantity3);
    });

    //verify subtotal
    orderDetailPage.getOrderProductSubTotal().then(subTotal => {
      expect(subTotal).toEqual(testData.expectedSubTotal);
    });

    //verify Discount amount
    orderDetailPage.getOrderDiscountTotal().then(discount => {
      expect(discount).toEqual(testData.expectedDiscount);
    });

    //verify shipping
    orderDetailPage.getOrderShippingTotal().then(shippingTotal => {
      expect(shippingTotal).toEqual(testData.expectedShippingTotal);
    });

    //verify tax
    orderDetailPage.getOrderTaxTotal().then(tax => {
      expect(tax).toEqual(testData.expectedTax);
    });

    //verify TOTAL
    orderDetailPage.getGrandTotal().then(grandTotal => {
      expect(grandTotal).toEqual(testData.expectedGrandTotal);
    });

    //THEN sign out
    banner.clickMyAccount().clickSignOut();
  });

  it('test 02: to re-order from order details page', () => {
    console.log('test 02: to re-order from order details page');
    var testData = dataFile.test02

    //click on the re-order button
    let shoppingCartPage = orderDetailPage.clickOrderAgain(3);

    //verify items in the shopping cart
    shoppingCartPage.getProductNameAtIndex(0).then(name => {
      expect(name).toEqual(product1.name);
    });
    shoppingCartPage.getProductNameAtIndex(1).then(name => {
      expect(name).toEqual(product2.name);
    });
    shoppingCartPage.getProductNameAtIndex(2).then(name => {
      expect(name).toEqual(product3.name);
    });


    shoppingCartPage.getProductSKUAtIndex(0).then(sku => {
      expect(sku).toEqual("SKU: " + sku1.sku);
    });
    shoppingCartPage.getProductSKUAtIndex(1).then(sku => {
      expect(sku).toEqual("SKU: " + sku2.sku);
    });
    shoppingCartPage.getProductSKUAtIndex(2).then(sku => {
      expect(sku).toEqual("SKU: " + sku3.sku);
    });


    shoppingCartPage.getProductPriceAtIndex(0).then(price => {
      expect(price).toEqual('$'+sku1.priceOffering + ".00");
    });
    shoppingCartPage.getProductPriceAtIndex(1).then(price => {
      expect(price).toEqual('$'+sku2.priceOffering);
    });
    shoppingCartPage.getProductPriceAtIndex(2).then(price => {
      expect(price).toEqual('$'+sku3.priceOffering);
    });

    shoppingCartPage.getProductQuantityAtIndex(0).then(quantity => {
      expect(quantity).toEqual(testData.expectedQuantity1);
    });
    shoppingCartPage.getProductQuantityAtIndex(1).then(quantity => {
      expect(quantity).toEqual(testData.expectedQuantity2);
    });
    shoppingCartPage.getProductQuantityAtIndex(2).then(quantity => {
      expect(quantity).toEqual(testData.expectedQuantity3);
    });

    //THEN sign out
    banner.clickMyAccount().clickSignOut();
  });

  it('test 03: to go back to the order history page', () => {
    console.log('test 03: to go back to the order history page');
    var testData = dataFile.test03

    //click on the Back to orders link
    let orderHistoryPage = orderDetailPage.clickBackToOrderHistory(1);

    //check page name
    orderHistoryPage.getPageName().then(pageName => {
      expect(pageName).toEqual('Order history');
    });

    //THEN sign out
    banner.clickMyAccount().clickSignOut();
  });
});
