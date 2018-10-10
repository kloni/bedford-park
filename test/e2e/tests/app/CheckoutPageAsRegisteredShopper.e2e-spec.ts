import { StoreFront } from '../../pageobjects/StoreFront.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { AddressBookPage } from '../../pageobjects/page/AddressBookPage.po';
import { AddressDialog } from '../../pageobjects/dialog/AddressDialog.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';

import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("CheckoutPageAsRegisterShopper");

/**
* Checkout Page as Registered User
*
*/
describe('User views checkout page in Stockholm store as a registered user', () => {
  var dataFile = require('./data/CheckoutPageAsRegisteredShopper.json');
  var user01 = dataFile.user01;
  const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');

  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  let storeFront: StoreFront = new StoreFront();
  var banner: Banner;

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  beforeAll(function () {
    //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
    let storeFront: StoreFront = new StoreFront();
    banner = storeFront.banner().signOutIfSignedIn();
    let register: RegistrationPage = banner.clickSignIn(RegistrationPage);
    console.log("creating user: " + timeStamp + dataFile.user01.login);

    //create user
    banner = register.typeFirstName(user01.firstName).typeLastName(user01.lastName).typeEmail(timeStamp + user01.login).typePassword(user01.password).typeVerifyPassword(user01.password).clickRegister();


    let addBook = dataFile.user01.addressBook;
    let addressBookPage: AddressBookPage = banner.clickMyAccount().goToAddressBookPage();
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

    //ADD US address
    addressDialog = addressBookPage.clickAddAddressButton();
    addressDialog.enterAddressNickName(addBook[1].nickName);
    addressDialog.enterFirstName(addBook[1].firstName);
    addressDialog.enterLastName(addBook[1].lastName);
    addressDialog.enterEmail(addBook[1].email);
    addressDialog.enterAddress1(addBook[1].address);
    addressDialog.selectShipping(addBook[1].country);
    addressDialog.enterCity(addBook[1].city);
    addressDialog.enterState(addBook[1].state);
    addressDialog.enterZipCode(addBook[1].zipCode);
    addressDialog.clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    // ADD CAD address
    addressDialog = addressBookPage.clickAddAddressButton();
    addressDialog.enterAddressNickName(addBook[2].nickName);
    addressDialog.enterFirstName(addBook[2].firstName);
    addressDialog.enterLastName(addBook[2].lastName);
    addressDialog.enterEmail(addBook[2].email);
    addressDialog.enterAddress1(addBook[2].address);
    addressDialog.selectShipping(addBook[2].country);
    addressDialog.enterCity(addBook[2].city);
    addressDialog.enterState(addBook[2].state);
    addressDialog.enterZipCode(addBook[2].zipCode);
    addressDialog.clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });
  });


  beforeEach(function () {
    new Banner().signOutIfSignedIn();
  });

  afterEach(function () {
    new Banner().signOutIfSignedIn();
  });

  it('to complete checkout with a product: test01', () => {
    console.log('to complete checkout with a product: test01');
    var testData = dataFile.test01
    let storeFront: StoreFront = new StoreFront();
    let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
    let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];

    //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded

    //WHEN user navigates to sign in page
    let login: LoginPage = storeFront.banner().clickSignIn(LoginPage);

    //AND
    //WHEN user signs in
    login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();

    //AND
    //WHEN user navigates to products page and adds a product to their cart
    var pdp: ProductPage = storeFront.navigateToURL('/product?productNumber=' + product1.productCode, ProductPage).addToCart(1);

    //AND
    //WHEN user goest to shopping cart with 1 product loaded
    var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

    //THEN there is 1 product in Cart
    shoppingCartPage.getNumberOfProductsLoaded().then(products => {
      expect(products).toBe(1, " shopcart does not have correct number of products loaded");
    });

    //When user clicks on check out and the checkout page is loaded
    let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

    //THEN the user's product is displayed displayed, with correct name, price and quantity
    checkout.getProductNames().first().getText().then(text => {
      expect(text).toBe(product1.name, " for product name on checkout page.");
    });
    checkout.getProductPrices().first().getText().then(text => {
      expect(text).toBe("$" + numberWithCommas(sku1.priceOffering), " for product price on checkout page.");
    });
    checkout.getProductQuantities().first().getText().then(text => {
      expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
    });

    //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
    checkout.shippingMethod(testData.shippingName);

    //AND
    //WHEN clicks on save and continue
    checkout.saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, " 3save and continue displayed when should be hidden");
    });

    //AND
    //THEN verifies subtotal, discount, shipping and total
    checkout.getSubtotal().then(result => {
      expect(result).toBe(testData.subtotal, " for subtotal checkout page.");
    });
    checkout.getDiscount().then(result => {
      expect(result).toBe(Number(testData.discountTotal.toFixed(2)), " for discount on checkout page.");
    });
    checkout.getShipping().then(result => {
      expect(result).toBe(Number(testData.shippingCost), " for shipping on checkout page.");
    });
    checkout.getTotal().then(total => {
      expect(total).toBe(Number(testData.total.toFixed(2)), " for total on checkout page.");
    });

    //WHEN user clicks on place order navigates to the order page
    checkout.placeOrder();

    //AND
    //WHEN the user navigates to the shopping cart it is now empty
    let shoppingCart: ShoppingCartPage = banner.clickShopCart();

    // //THEN there is 0 products in Cart
    shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
      expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
      if (nProducts > 0) {
        shoppingCart.removeAllItems();
      }
    });

  });

  it('to complete checkout after adding promotion code in checkout: test02', () => {
    console.log('to complete checkout after adding promotion code in checkout: test02');
    const testData = dataFile.test02
    let product1: StockholmProduct = CATALOG.Bath.Accessories["Makeup Mirror"].productInfo;
    let sku1: Sku = CATALOG.Bath.Accessories["Makeup Mirror"]["BR-ACCE-0001-0001"];

    //GIVEN a user has an empty shopping cart, a valid US and CAD address in address book, and the homepage is loaded

    //WHEN user navigates to sign in page
    let login: LoginPage = banner.clickSignIn(LoginPage);

    //AND
    //WHEN user signs in
    login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();

    //AND
    //WHEN user navigates to products page and adds a product to their cart
    var pdp: ProductPage = storeFront.navigateToURL('/product?productNumber=' + product1.productCode, ProductPage);

    pdp.addToCart(1);
    var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

    //THEN there is 1 product in Cart
    shoppingCartPage.getNumberOfProductsLoaded().then(products => {
      expect(products).toBe(1, " shopcart does not have correct number of products loaded");
    });

    //AND
    //When user clicks on check out and the checkout page is loaded
    let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();

    //THEN the user's product is displayed displayed, with correct name, price and quantity
    checkout.getProductNames().first().getText().then(text => {
      expect(text).toBe(product1.name, " for product name on checkout page.");
    });
    checkout.getProductPrices().first().getText().then(text => {
      expect(text).toBe("$" + sku1.priceOffering.toFixed(2), " for product price on checkout page.");
    });
    checkout.getProductQuantities().first().getText().then(text => {
      expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
    });

    //AND
    //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
    checkout.shippingMethod(testData.shippingName);

    //AND
    //WHEN users adds promotion for 7% off and waits for discount to update
    checkout.promotionCode(testData.promotionCode).applyPromotion();
    checkout.waitForDiscountToBe(Number(testData.discountTotal.toFixed(2)));

    //AND
    //WHEN clicks on save and continue
    checkout.saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
    });

    //AND
    //THEN verifies subtotal, discount, shipping and total
    checkout.getSubtotal().then(result => {
      expect(result).toBe(testData.subtotal, " for subtotal checkout page.");
    });
    checkout.getDiscount().then(result => {
      expect(result).toBe(Number(testData.discountTotal.toFixed(2)), " for discount on checkout page.");
    });
    checkout.getShipping().then(result => {
      expect(result).toBe(Number(testData.shippingCharge), " for shipping on checkout page.");
    });
    checkout.getTotal().then(total => {
      expect(total).toBe(Number(testData.total.toFixed(2)), " for total on checkout page.");
    });

    //WHEN user clicks on place order navigates to the order page
    checkout.placeOrder();

    //AND
    //WHEN the user navigates to the shopping cart it is now empty
    var shoppingCart: ShoppingCartPage = banner.clickShopCart();

    //THEN there is 0 products in Cart
    shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
      expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
      if (nProducts > 0) {
        shoppingCart.removeAllItems();
      }
    });

  });


  it('to complete checkout with 1 product after changing billing address to CAD and shipping to US: test03', () => {
    console.log('to complete checkout with 1 product after changing billing address to CAD and shipping to US: test03');
    var testData = dataFile.test03
    let product1: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"].productInfo;
    let sku1: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0001"];

    //GIVEN a user has an empty shopping cart, a valid US and CAD address in address book, and the homepage is loaded

    //WHEN user navigates to sign in page
    let login: LoginPage = banner.clickSignIn(LoginPage);

    //AND
    //WHEN user signs in
    login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();

    //AND
    //WHEN user navigates to products page
    var pdp: ProductPage = storeFront.navigateToURL('/product?productNumber=' + sku1.sku, ProductPage);

    //AND
    //WHEN user navigates to shopcart
    pdp.addToCart(1);
    var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

    //THEN there is 1 product in Cart
    shoppingCartPage.getNumberOfProductsLoaded().then(products => {
      expect(products).toBe(1, " shopcart does not have correct number of products loaded");
    });

    //When user clicks on check out and the checkout page is loaded
    let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();


    //THEN the user's product is displayed displayed, with correct name, price and quantity
    checkout.getProductNames().first().getText().then(text => {
      expect(text).toBe(product1.name, " for product name on checkout page.");
    });
    checkout.getProductPrices().first().getText().then(text => {
      expect(text).toBe("$" + numberWithCommas(sku1.priceOffering.toFixed(2)), " for product price on checkout page.");
    });
    checkout.getProductQuantities().first().getText().then(text => {
      expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
    });

    //WHEN clicks on save and continue
    checkout.saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
    });

    //WHEN user checks off same address and selects Texas address as shipping
    checkout.openBillingAddress().selectShippingAddress(dataFile.user01.addressBook[1].nickName);

    //THEN the shipping address is updated
    checkout.getShippingAddress().then(address => {
      let add = dataFile.user01.addressBook[1];
      expect(address).toBe(add.address + ", " + add.city + ", " + add.state + " " + add.zipCode + ", " + add.country, " address label for shipping address");
    });

    //WHEN and selects CAD address as billing
    checkout.selectBillingAddress(dataFile.user01.addressBook[2].nickName);

    //THEN the billing address is updated
    checkout.getBillingAddress().then(address => {
      let add = dataFile.user01.addressBook[2];
      expect(address).toBe(add.address + ", " + add.city + ", " + add.state + " " + add.zipCode + ", " + add.country, " address label for billing address");
    });

    //WHEN selects Overnight Delivery for shippingand clicks on save and continue
    checkout.shippingMethod(testData.shippingName);

    //THEN wait for the save and continue button to be displayed
    checkout.waitSaveAndContinueShippingDisplayed().then(isDisplayed => {
      expect(isDisplayed).toBe(true, " save and continue is not displayed");
    });

    //WHEN clicks on save and continue
    checkout.saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
    });


    //AND
    //THEN verifies subtotal, discount, shipping and total
    checkout.getSubtotal().then(subTotal => {
      expect(subTotal).toBe(Number((testData.subtotal)), " for subtotal checkout page.");
    });
    checkout.getDiscount().then(discount => {
      expect(discount).toBe(Number(testData.discountTotal.toFixed(2)), " for discount on checkout page.");
    });
    checkout.getShipping().then(shipping => {
      expect(shipping).toBe(testData.shippingCharge, " for shipping on checkout page.");
    });
    checkout.getTotal().then(total => {
      expect(total).toBe(Number(testData.total.toFixed(2)), " for total on checkout page.");
    });

    //WHEN user clicks on place order navigates to the order page
    checkout.placeOrder();

    //AND
    //WHEN the user navigates to the shopping cart it is now empty
    var shoppingCart: ShoppingCartPage = banner.clickShopCart();

    //THEN there is 0 products in Cart
    shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
      expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
      if (nProducts > 0) {
        shoppingCart.removeAllItems();
      }
    });
  });

  it('to complete checkout with multiple products and nonflat shipping option: test04', () => {
    console.log('to complete checkout with multiple products and nonflat shipping option: test04');
    const testData = dataFile.test04
    let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo
    let skus : Sku[] = [];
    let skuCount : number = 4;
    skus.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0001"]);
    skus.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0002"]);
    skus.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0003"]);
    skus.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0004"]);

    //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded

    //WHEN user navigates to sign in page
    let login: LoginPage = banner.clickSignIn(LoginPage);

    //AND
    //WHEN user signs in
    login.typeUserName(timeStamp + user01.login).typePassword(user01.password).clickLogin();

    //WHEN user navigates to products page and adds 4 different skus
    skus.forEach(sku=>{
      let pdp : ProductPage = storeFront.navigateToURL('/product?productNumber=' + sku.sku, ProductPage);
      pdp.addToCart(1);
    });

    //AND
    //WHEN user navigates to shopcart
    var shoppingCartPage: ShoppingCartPage = new ProductPage().clickViewCart(skus.length);


    //THEN there is 4 products in Cart
    shoppingCartPage.getNumberOfProductsLoaded().then(products => {
      expect(products).toBe(skus.length, " shopcart does not have correct number of products loaded");
    });

    //WHEN user clicks on checkout the user navigates to checkout
    let checkout: CheckOutPage = shoppingCartPage.clickCheckOut(skus.length);
    checkout = new CheckOutPage(skus.length);

    //THEN the user's product is displayed displayed, with correct name, price and quantity, sku
    let count : number = 0;
    skus.forEach(sku=>{
      checkout.getProductNames().get(count).getText().then(text => {
        expect(text).toBe(product1.name, " for product name on checkout page.");
      });
      checkout.getProductPrices().get(count).getText().then(text => {
        expect(text).toBe("$" + numberWithCommas(sku.priceOffering.toFixed(2)), " for product price on checkout page.");
      });
      checkout.getProductQuantities().get(count).getText().then(text => {
        expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
      });
      count++;
    });

    //WHEN user selected US - Day Express Delivery for shipping and clicks on save and continue
    checkout.shippingMethod(testData.shippingName);

    //AND
    //WHEN clicks on save and continue
    checkout.saveAndContinue();

    //THEN wait for the save and continue button to no longer be displayed
    checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
      expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
    });

    //AND
    //THEN verifies subtotal, discount, shipping and total
    checkout.getSubtotal().then(subTotal => {
      expect(subTotal).toBe(subTotal, " for subtotal checkout page.");
    });
    checkout.getDiscount().then(discount => {
      expect(discount).toBe(Number(testData.discountTotal.toFixed(2)), " for discount on checkout page.");
    });
    checkout.getShipping().then(shipping => {
      expect(shipping).toBe(testData.shippingCharge, " for shipping on checkout page.");
    });
    checkout.getTotal().then(total => {
      expect(total).toBe(Number(testData.total.toFixed(2)), " for total on checkout page.");
    });

    //WHEN user clicks on place order navigates to the order page
    checkout.placeOrder();

    //AND
    //WHEN the user navigates to the shopping cart it is now empty
    var shoppingCart: ShoppingCartPage = banner.clickShopCart();

    //THEN there is 0 products in Cart
    shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
      expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
      if (nProducts > 0) {
        shoppingCart.removeAllItems();
      }
    });

  });

  // only one payment method, cash on delivery
  xit('to complete checkout after editing payment method', () => {
    var testData = dataFile.test02;

    //go to Login Page

    //sign in a registered shopper

    //add product

    //Go to shopping cart

    //proceed to checkout

    //Edit payment method to all different types of credit card

    //Complete checkout

  });

  //this is a drop down from address book, once we have create address we can try to create a bad address
  xit('to attempt to complete checkout with invalid shipping and billing info', () => {
    var testData = dataFile.test1

    //go to Login Page

    //sign in a registered shopper

    //add product

    //Go to shopping cart

    //proceed to checkout

    //Edit billing information with invalid data

    //Attempt to save

    //Validate error message

    //cancel

    //Edit shipping information with invalid data

    //Attempt to save

    //validate error message

  });

  //do not have payment options, only cash on delivery
  xit('to attempt to complete checkout with invalid payment info', () => {
    var testData = dataFile.test1

    //go to Login Page

    //sign in a registered shopper

    //add product

    //Go to shopping cart

    //proceed to checkout

    //Edit payment info with invalid data

    //Attempt to save

    //Validate error message

    //Cancel

  });
});
