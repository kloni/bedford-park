import { browser} from 'protractor';
import {} from 'jasmine';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { OrderHistoryPage } from '../../pageobjects/page/OrderHistoryPage.po';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { AddressBookPage } from '../../pageobjects/page/AddressBookPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { OrderDetailPage } from '../../pageobjects/page/OrderDetailPage.po';
import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("OrderHistoryPage");

/**
* Order History Page
*/
describe('Views Order History page', () => {

  var dataFile = require('./data/OrderHistoryPage.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');

  let storeFront: StoreFront;
  let addressBookPage : AddressBookPage;
  var checkoutOrderId: string;
  var date = new Date();
  let banner: Banner;

  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var todayDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();


  beforeAll(function() {
      // Register user
      storeFront = new StoreFront();

      banner = storeFront.banner();
      let register: RegistrationPage = banner.clickSignIn(RegistrationPage);
      console.log("Creating user: " + timeStamp+ dataFile.register.logonId);

      var registerData = dataFile.register;

      //create user
      register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp+ registerData.logonId)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password)
      .clickRegister();
      banner.myAccountDisplayed();
      banner.signInNotDisplayed();

      let myAccount : MyAccountPage = banner.clickMyAccount();

      myAccount.addressBookLinkDisplayed();
      myAccount.orderHistoryLinkDisplayed();

      let addressDialog= myAccount.goToAddressBookPage().clickEditLink(0);

      var addressBookData = dataFile.register.AddressBook;

      //EDIT existing users details with a valid US address
      addressDialog.enterAddress1(addressBookData.address)
      .selectShipping(addressBookData.country)
      .enterCity(addressBookData.city)
      .enterState(addressBookData.state)
      .enterZipCode(addressBookData.zipCode)
      .enterPhoneNumber(addressBookData.phone)
      .clickSave();
      addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
      });

      //sign out
      myAccount  = banner.clickMyAccount();
      myAccount.clickSignOut();
      banner.signInDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

      banner.clickSignIn(RegistrationPage);
      console.log("Creating user: " + timeStamp+ dataFile.register.noOrderLogin);

      var registerData = dataFile.register;

      //create user
      register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp+ registerData.noOrderLogin)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password)
      .clickRegister();

      banner.signInNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toEqual(true);
      });

      //sign out
      myAccount  = banner.clickMyAccount();
      myAccount.clickSignOut();
      banner.signInDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

  });

  beforeEach(function (){
    banner.signInNotDisplayed().then(notDisplayed => {
      if(notDisplayed){
        banner.clickMyAccount().clickSignOut();
        banner.signInDisplayed();
      }
    });
  });
  afterEach(function() {
    banner.signInNotDisplayed().then(notDisplayed => {
      if(notDisplayed){
        banner.clickMyAccount().clickSignOut();
        banner.signInDisplayed();
      }
    });
		banner.signInDisplayed().then(displayed => {
			expect(displayed).toEqual(true);
    });
  });

  it('to view order history: test01', () => {

      var testData = dataFile.checkout;
      var user01 = dataFile.user01;

      let category = CATALOG.Bath.Accessories;
      let product1 : StockholmProduct = CATALOG.Bath.Accessories["Bender Toothbrush Holder"].productInfo;
		  let sku1 : Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];

      //sign out if signed in
      let storeFront: StoreFront = new StoreFront();
      banner.signInNotDisplayed().then(notDisplayed => {
        if(!notDisplayed){
          let myAccount  = banner.clickMyAccount();
          myAccount.clickSignOut();
        }
      });
      banner.signInDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

      //WHEN user navigates to sign in page
      let login: LoginPage = banner.clickSignIn(LoginPage);

      //AND
      //WHEN user signs in
      login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();
      banner.signInNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toEqual(true);
      });

      //AND
      //WHEN user navigates to products page and adds a product to their cart
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
      var pdp: ProductPage = plp.clickProductAtIndex(1);

      pdp.addToCart(1);
      var shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();
      shoppingCartPage= new ShoppingCartPage(1);

      //AND
      //WHEN user clicks on check out and the checkout page is loaded
      let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

      //AND
      //WHEN clicks on save and continue
      checkout.saveAndContinue();

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
        console.log('orderId: ',checkoutOrderId);

      });

      testData = dataFile.test01;

      //AND go back to the storefront
      let storeFront2: StoreFront = new StoreFront();

      //WHEN an user navigates to my account page
       banner= storeFront2.banner();
      var myAccount : MyAccountPage = banner.clickMyAccount();

      //AND
      //WHEN an user clicks on order history page
      let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage(1);

      //THEN verify the order id
      orderHistory.getOrderId().then(orderId => {
        expect(orderId).toBe(checkoutOrderId, "incorrect order id");
      });

      //THEN verify the order status
      orderHistory.getOrderStatus().then(orderStatus => {
        expect(orderStatus).toBe(testData.orderStatus, "incorrect order status");
      });

      //THEN verify the order placed date
      orderHistory.getOrderPlacedDate().then(orderPlacedDate => {
        expect(orderPlacedDate).toBe(todayDate, "incorrect order placed date");
      });

      //THEN verify the order total
      orderHistory.getOrderTotal().then(orderTotal => {
        expect(orderTotal).toBe(testData.orderTotal, "incorrect order total");
      });

      //THEN verify the order quantity
      orderHistory.getOrderQuantity().then(orderQuantity => {
        expect(orderQuantity).toBe(testData.orderQuantity, "incorrect order quantity");
      });

      //THEN verify product in order
      //THEN verify the order item name
      orderHistory.waitForOrderItemsToLoad();
      orderHistory.getOrderItemName().then(orderItemName => {
        expect(orderItemName).toBe(product1.name, "incorrect order item name");
      });

      //THEN verify the order item SKU
      orderHistory.getOrderItemSKU().then(orderItemSKU => {
        expect(orderItemSKU).toBe(sku1.sku, "incorrect order item SKU");
      });

      //THEN verify the order item quantity
      orderHistory.getOrderItemQuantity().then(orderItemQuantity => {
        expect(orderItemQuantity).toBe(testData.orderItemQuantity, "incorrect order item quantity");
      });

      //THEN verify the order item price
      orderHistory.getOrderItemPrice().then(orderItemPrice => {
        expect(orderItemPrice).toBe(sku1.priceOffering, "incorrect order item price");
      });

      //THEN sign out
      myAccount  = banner.clickMyAccount();
      myAccount.clickSignOut();
      banner.signInDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

  });

  it('to navigate to the product page, with more than 2 products in an order: test02', () => {

      var testData = dataFile.checkout2;
      var user01 = dataFile.user01;

      let category  = CATALOG.Bedroom.Dressers;
      let product1 : StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"].productInfo;
      let product2 : StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Clodit Chest of Drawers"].productInfo;
      let product3 : StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo;

		  let sku1 : Sku = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"]["BD-DRSS-0001-0001"];
		  let sku2 : Sku = CATALOG.Bedroom.Dressers["Stonehenge Clodit Chest of Drawers"]["BD-DRSS-0002-0001"];
		  let sku3 : Sku = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0001"];

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      let storeFront: StoreFront = new StoreFront();
      banner = storeFront.banner();

      //sign out if signed in
      banner.signInNotDisplayed().then(notDisplayed => {
        if(notDisplayed){
          let myAccount  = banner.clickMyAccount();
          myAccount.clickSignOut();
        }
      });
      banner.signInDisplayed().then(displayed => {
        expect(displayed).toEqual(true);
      });

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      //WHEN user navigates to sign in page
      let login: LoginPage = banner.clickSignIn(LoginPage);

      //AND
      //WHEN user signs in
      login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();
      banner.signInNotDisplayed();

      //AND
      //WHEN user navigates to products page and adds a product to their cart
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
      let pdp: ProductPage  = plp.clickProductAtIndex(0);
      pdp.addToCart(1).confirmationModalDisplayed();

      megaMenu = banner.openMenu();
      plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
      plp.clickProductAtIndex(1).addToCart(1).confirmationModalDisplayed();

      megaMenu = banner.openMenu();
      plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
      plp.clickProductAtIndex(2).addToCart(1).confirmationModalDisplayed();

      var shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();

      //AND
      //WHEN user clicks on check out and the checkout page is loaded
      let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

      //AND
      //WHEN clicks on save and continue
      checkout.saveAndContinue();

      //THEN wait for the save and continue button to no longer be displayed
      checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
        expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
      });

      //AND
      //WHEN user clicks on place order navigates to the order confirmation page
      let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();
      // TODO: Does not go to order confirmation page

      // TODO: uncomment when order confirmation e2e is done and function to get the order id
      //THEN get order confirmation id
      orderConfirmation.waitForOrderIdToLoad();
      orderConfirmation.getOrderId().then(_orderId => {
        checkoutOrderId= _orderId;
        console.log('orderId: ',checkoutOrderId);
      });

      testData = dataFile.test02

      //AND go back to the storefront
      let storeFront2: StoreFront = new StoreFront();

      //WHEN an user navigates to my account page
      banner = storeFront2.banner();

      //AND
      //WHEN an user clicks on order history page
      var myAccount = banner.clickMyAccount();
      let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage(1);

      //THEN verify the order id
      orderHistory.getOrderId().then(orderId => {
        expect(orderId).toBe(checkoutOrderId, "incorrect order id");
      });

      //THEN click on the product name link to navigate to the product page
      pdp = orderHistory.viewProductByOrderIndexProductIndex(0,2);
      pdp.waitForProductNameToBe(product3.name);

      pdp.getProductName().then(name => {
          expect(name).toEqual(product3.name);
      });

      //THEN sign out
      banner.clickMyAccount().clickSignOut();
  });

   it('to navigate to the order details page : test03', () => {
      var testData = dataFile.checkout2;
      var user01 = dataFile.user01;
      let category  = CATALOG.Bath.Accessories;
		  let sku1 : Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      let storeFront: StoreFront = new StoreFront();
      banner = storeFront.banner();

      //sign out if signed in
      banner.signInNotDisplayed().then(notDisplayed => {
        if(notDisplayed){
          let myAccount  = banner.clickMyAccount();
          myAccount.clickSignOut();
        }
      });

      //WHEN user navigates to sign in page
      let login: LoginPage = banner.clickSignIn(LoginPage);

      //AND
      //WHEN user signs in
      login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();
      banner.signInNotDisplayed();

      //AND
      //WHEN user navigates to products page and adds a product to their cart
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
      let pdp: ProductPage  = plp.clickProductAtIndex(1);
      pdp.addToCart(1).confirmationModalDisplayed();


      pdp.addToCart(1);
      var shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();

      //AND
      //WHEN user clicks on check out and the checkout page is loaded
      let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

      //AND
      //WHEN clicks on save and continue
      checkout.saveAndContinue();

      //THEN wait for the save and continue button to no longer be displayed
      checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
        expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
      });

      //AND
      //WHEN user clicks on place order navigates to the order confirmation page
      let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();
      // TODO: Does not go to order confirmation page

      //THEN get order confirmation id
      orderConfirmation.waitForOrderIdToLoad();
      orderConfirmation.getOrderId().then(_orderId => {
        checkoutOrderId= _orderId;
      });

      testData = dataFile.test02

      //AND go back to storefront
      let storeFront2: StoreFront = new StoreFront();
      banner= storeFront2.banner();
      banner.myAccountDisplayed();

      //WHEN an user navigates to my account page
      var myAccount: MyAccountPage = banner.clickMyAccount();

      //AND
      //WHEN an user clicks on order history page
      let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage(1);

      //THEN verify the order id
      orderHistory.getOrderId().then(orderId => {
        expect(orderId).toBe(checkoutOrderId, "incorrect order id");
      });

      browser.sleep(10000);

      //THEN click on the order Id to navigate to the order details page
      let orderDetails : OrderDetailPage = orderHistory.viewOrderDetailByIndex(0);
      orderDetails.getOrderIdFromHeading().then(orderId => {
        expect(orderId).toContain(checkoutOrderId, "incorrect order id");
      });

      //THEN sign out
      banner.clickMyAccount().clickSignOut();
  });


  it('to use pagination for more than 5 orders : test04', () => {
    var testData = dataFile.checkout3;
    let category  = CATALOG.Bath.Accessories;
    var user01 = dataFile.user01;
    var num:number = 0

    //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
    let storeFront: StoreFront = new StoreFront();
    banner = storeFront.banner();

    //sign out if signed in
    banner.signInNotDisplayed().then(notDisplayed => {
      if(notDisplayed){
        let myAccount  = banner.clickMyAccount();
        myAccount.clickSignOut();
      }
    });
    banner.signInDisplayed();

    //WHEN user navigates to sign in page
    let login: LoginPage = banner.clickSignIn(LoginPage);

    //AND
    //WHEN user signs in
    login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();
    banner.signInNotDisplayed();

    var orderIdArray:string[] = [];
    storeFront.speedOfTests(50);

    //AND create 6 orders
    for(num =5 ;num >= 0 ;num-- ) {
      //AND
      //WHEN user navigates to products page and adds a product to their cart
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
      let pdp: ProductPage  = plp.clickProductAtIndex(1);
      pdp.addToCart(1).confirmationModalDisplayed();

      var shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();

      //AND
      //WHEN user clicks on check out and the checkout page is loaded
      let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

      //AND
      //WHEN clicks on save and continue
      checkout.saveAndContinue();

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
        console.log('orderId: ',_orderId, ' index:',  num);
        orderIdArray.push(_orderId);
        console.log('orderIds so far:', orderIdArray);
      });
    }
    storeFront.speedOfTests(0);

    //AND go back to the storefront
    storeFront = new StoreFront();

    //WHEN an user navigates to my account page
    banner= storeFront.banner();
    var myAccount = banner.clickMyAccount();

    //AND
    //WHEN an user clicks on order history page
    let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage(5);

    //THEN verify the order id, only orderId up to 6 orders are displayed
    orderHistory.getOrderIdByIndex(0).then(orderId => {
      expect(orderId).toBe(orderIdArray[5], "incorrect order id");
    });
    orderHistory.getOrderIdByIndex(1).then(orderId => {
      expect(orderId).toBe(orderIdArray[4], "incorrect order id");
    });
    orderHistory.getOrderIdByIndex(2).then(orderId => {
      expect(orderId).toBe(orderIdArray[3], "incorrect order id");
    });
    orderHistory.getOrderIdByIndex(3).then(orderId => {
      expect(orderId).toBe(orderIdArray[2], "incorrect order id");
    });
    orderHistory.getOrderIdByIndex(4).then(orderId => {
      expect(orderId).toBe(orderIdArray[1], "incorrect order id");
    });

    //WHEN the user goes back to the second page
    orderHistory.goToNextPage();

    //THEN Verify the first order id is present in the second page
    //TODO: Right now it does not update the test script to wait until order Id is updated. just thread.sleep(10000) for now.
    browser.sleep(10000);
    orderHistory.getOrderIdByIndex(0).then(orderId => {
      expect(orderId).toBe(orderIdArray[0], "incorrect order id");
    });

    //WHEN the user goes back to the previous page
    browser.sleep(5000);
    orderHistory.goToPrevPage();

    browser.sleep(10000);
    //AND the user click on the 2nd page of the pagination component
    orderHistory.goToPage('2');

    //THEN Verify the first order id is present in the second page
    //TODO: Right now it does not update the test script to wait until order Id is updated. just thread.sleep(10000) for now.
    browser.sleep(15000);
    orderHistory.getOrderIdByIndex(0).then(orderId => {
      console.log('orderId: ' , orderId);
      expect(orderId).toBe(orderIdArray[0], "incorrect order id");
    });

    //THEN sign out
    banner.clickMyAccount().clickSignOut();
  });


  it('to view order history page when there are no orders made: test06', () => {

      var testData = dataFile.checkout2;
      var user02 = dataFile.user02;

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      let storeFront: StoreFront = new StoreFront();
      banner = storeFront.banner();

      //sign out if signed in
      banner.signInNotDisplayed().then(notDisplayed => {
        if(notDisplayed){
          let myAccount  = banner.clickMyAccount();
          myAccount.clickSignOut();
        }
      });
      banner.signInDisplayed();

      //WHEN user navigates to sign in page
      let login: LoginPage = banner.clickSignIn(LoginPage);

      //AND
      //WHEN user signs in
      login.typeUserName(timeStamp + user02.login).typePassword(user02.password).clickLogin();
      banner.signInNotDisplayed();

      //go to myaccount page
      let myAccount: MyAccountPage = banner.clickMyAccount();

      //AND
      //WHEN an user clicks on order history page
      let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage();

      testData= dataFile.test06;

      //THEN verify there is a message displaying there are no more orders
      orderHistory.verifyNoOrderMsg().then( msg => {
        expect(msg).toEqual(testData.noOrderMsg);
      })

      //THEN sign out
      banner.clickMyAccount().clickSignOut();
  });


});
