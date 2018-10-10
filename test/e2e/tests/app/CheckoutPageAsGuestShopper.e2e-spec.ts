import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { AddressBookPage } from '../../pageobjects/page/AddressBookPage.po';
import { browser } from 'protractor';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StockholmCatalog, Sku, StockholmProduct } from './data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("CheckoutPageAsGuestShopper");


/**
* Checkout Page as Registered User
*
*/
describe('User views checkout page in Stockholm store as a guest user', () => {
    var dataFile = require('./data/CheckoutPageAsGuestShopper.json');
    const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
    var storeFront: StoreFront;
    var banner: Banner;

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    beforeEach(function () {
        //GIVEN the homepage is loaded and user is not signed in
        storeFront = new StoreFront();
        banner = storeFront.banner().signOutIfSignedIn();
        banner.signInDisplayed();
    });

    afterEach(function () {
        let cart = banner.clickShopCart();
        cart.removeAllItems();
        banner.signOutIfSignedIn();
        banner.signInDisplayed();
    });

    //edited as part of form validation e2e
    //DOES NOT WORK WHEN PREVIOUS CASE DID NOT REGISTER USER FOR CHECKOUT BECAUSE THERE IS A SAVED ADDRESS
    it('to complete guest checkout with multiple products and register with field validation : test05', () => {
        console.log('to complete guest checkout with multiple products and register with field validation : test05');

        let category = CATALOG.Bedroom.Dressers;
        let category2 = CATALOG.Bath.Accessories;

        let sku2: Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];

        //AND
        //WHEN user navigates to  two sku page and adds a product to their cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3).addToCart(1);
        pdp.confirmationModalDisplayed();

        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category2.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1).addToCart(1);
        pdp.confirmationModalDisplayed();

        //AND
        //WHEN user goest to shopping cart with 2 product loaded
        pdp.clickViewCart(2);

        var cart: ShoppingCartPage = new ShoppingCartPage(2);

        // there is 1 product in Cart
        cart.getNumberOfProductsLoaded().then(products => {
            expect(products).toBe(2, " shopcart does not have correct number of products loaded");
        });

        // guest clicks on check out and the sign in page is loaded
        let loginPage: LoginPage = cart.clickCheckOutAsGuest();

        // checkout as guest button is displayed
        loginPage.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        });

        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = loginPage.clickCheckoutAsGuest();
        checkout.waitSaveAndContinueCreateAddressDisplayed();

        // Click save and continue
        /**
         * All empty
         * phone, address2, and country are valid
         */
        checkout.clickSaveAndContinueCreateAddress();

        // user clicks on save&continue for creating an address and waits for invalid css on zipcode
        checkout.clickSaveAndContinueCreateAddress().waitShippingBillingZipCodeCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

        // all manditory fields have invalid css and optional have valid css value
        checkout.getShippingBillingFirstNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingLastNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingEmailCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine1Css(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCityCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingStateCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingZipCodeCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });


        //WHEN user inputs all manditory fields for shipping and billing address
        /**
         * Special character on all form input
         * all valid except zipcode, phone number and email
         */
        let address = dataFile.user05.addressBook[0];
        checkout.typeShippingBillingFirstName(address.specialChar)
            .typeShippingBillingLastName(address.specialChar)
            .typeShippingBillingEmail(timeStamp + address.specialChar)
            .typeShippingBillingPhoneNumber(address.specialChar)
            .typeShippingBillingAddressLine1(address.specialChar)
            .typeShippingBillingCity(address.specialChar)
            .typeShippingBillingState(address.specialChar)
            .typeShippingBillingZipCode(address.specialChar);
        checkout.waitShippingBillingZipCodeCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

        //THEN all manditory fields have invalid css and optional have valid css value
        checkout.getShippingBillingFirstNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingLastNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingEmailCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingPhoneNumberCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine1Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCityCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingStateCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingZipCodeCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });

        //clear all fields
        checkout.clearShippingBillingFirstName().clearShippingBillingLastName().clearShippingBillingEmail()
            .clearShippingBillingPhoneNumber().clearShippingBillingAddressLine1().clearShippingBillingAddressLine2()
            .clearShippingBillingCity().clearShippingBillingZipCode();

        /**
         * All valid fields
         */
        //WHEN user inputs all manditory fields for shipping and billing address
        address = dataFile.user05.addressBook[1];
        checkout.typeShippingBillingFirstName(address.firstName)
            .typeShippingBillingLastName(address.lastName)
            .typeShippingBillingEmail(timeStamp + address.email)
            .typeShippingBillingPhoneNumber(address.phoneNumber)
            .typeShippingBillingAddressLine1(address.addressLine1)
            .typeShippingBillingCity(address.city)
            .typeShippingBillingCountryDropDown(address.country)
            .typeShippingBillingState(address.state)
            .typeShippingBillingZipCode(address.zipCode)
            .removeFocus()
            .waitShippingBillingZipCodeCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

        //THEN all manditory fields have invalid css and optional have valid css value
        checkout.getShippingBillingFirstNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingLastNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingEmailCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine1Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCityCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingStateCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });
        checkout.getShippingBillingZipCodeCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected invalid css");
        });

        //WHEN the user navigates to the shopping cart it is not empty
        let shoppingCart : ShoppingCartPage = banner.clickShopCart(2);

        //THEN remove all items
        shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
            if (nProducts > 0) {
                shoppingCart.removeAllItems();
            }
        });
    });

    //edited as part of form validation e2e
    it('to complete guest checkout with multiple products and register with field validation and perform second checkout: test01', () => {
        console.log('to complete guest checkout with multiple products and register with field validation and perform second checkout: test01');

        var testData = dataFile.test01;
        let user = dataFile.user01;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo
        let skus1: Sku[] = [];
        let category = CATALOG.Bedroom.Dressers;
        let category2 = CATALOG.LivingRoom.LivingRoomFurniture;

        // let sku1= CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0001"].attributes;
        skus1.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0001"]);
        skus1.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0002"]);
        skus1.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0003"]);
        skus1.push(CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0004"]);

        let skus2: Sku[] = [];
        let product2: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"].productInfo

        skus2.push(CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0005"]);
        skus2.push(CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0001"]);

        var nickname: string;

        //GIVEN the homepage is loaded and guest users shopping cart is empty
        let plp : ProductListingPage;
        let pdp : ProductPage;

        //WHEN user navigates to products page and adds 4 different skus
        skus1.forEach(sku => {
            let megaMenu = banner.openMenu();
            plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
            pdp = plp.clickProductAtIndex(2);
            pdp.clickTextAttribute(sku.attributes['color'].replace(/\s/g, "")).addToCart(1);
            pdp.confirmationModalDisplayed();
        });

        //AND
        //WHEN user navigates to shopcart waits for 4 products loaded
        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(skus1.length);

        //THEN there is 4 product in Cart
        shoppingCartPage.getNumberOfProductsLoaded().then(products => {
            expect(products).toBe(skus1.length, " shopcart does not have correct number of products loaded");
        });

        //When guest clicks on check out and the sign in page is loaded
        let login: LoginPage = shoppingCartPage.clickCheckOutAsGuest();

        //THEN checkout as guest button is displayed
        login.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        })

        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = login.clickCheckoutAsGuest();

        //THEN the user's product is displayed displayed, with correct name, price and quantity, sku
        let count: number = 0;
        skus1.forEach(sku => {
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

        //WHEN user clicks on save&continue for creating an address and waits for invalid css on zipcode
        checkout.clickSaveAndContinueCreateAddress().waitShippingBillingZipCodeCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

        //THEN all manditory fields have invalid css and optional have valid css value
        checkout.getShippingBillingFirstNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingLastNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingEmailCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine1Css(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCityCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingStateCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingBillingZipCodeCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });

        //WHEN user inputs all manditory fields for shipping and billing address
        let address = dataFile.user01.addressBook[0];
        checkout.typeShippingBillingFirstName(address.firstName)
            .typeShippingBillingLastName(address.lastName)
            .typeShippingBillingEmail(timeStamp + address.email)
            .typeShippingBillingPhoneNumber(address.phoneNumber)
            .typeShippingBillingAddressLine1(address.addressLine1)
            .typeShippingBillingCity(address.city)
            .typeShippingBillingCountryDropDown(address.country)
            .typeShippingBillingState(address.state)
            .typeShippingBillingZipCode(address.zipCode)
            .waitShippingBillingZipCodeCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

        //THEN all manditory fields have valid css value
        checkout.getShippingBillingFirstNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingLastNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingEmailCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine1Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingCityCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingStateCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingBillingZipCodeCss(dataFile.css.textField.valid[0]).then(result => {
            // expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
            console.log("TODO: why does zipcodecss have the following value: " + result);
        });

        //WHEN user clicks save and continue
        checkout.clickSaveAndContinueCreateAddress();

        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
            console.log('Save and continue for add address isNotDisplayed: ' + isNotDisplayed);
        });

        //WHEN user selects US - Overnight Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName1).saveAndContinue();

        //THEN wait for the save and continue button to no longer be displayed
        checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
        });

        //AND
        //THEN waits for total to update and verifies subtotal, discount, shipping and total
        checkout.waitForTotalToUpdate(Number(testData.total1));
        checkout.getSubtotal().then(result => {
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal1), " for subtotal checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount1), " for discount on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost1), " for shipping on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total1), " for total on checkout page.");
        });

        //WHEN user clicks on place order navigates to the order page
        let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            console.log('OrderId:' + result);
            expect(result).toBeGreaterThan(0);
        });

        //WHEN guest enters valid email, password, and verify password and clicks register
        orderConfirmation.typePassword(user.password).typeVerifyPassword(user.password).clickRegisterUser();
        banner.myAccountDisplayed();
        banner.signInNotDisplayed();

        //AND
        //WHEN user navigates to my accounts page
        let myAccount: MyAccountPage = storeFront.banner().clickMyAccount();

        //THEN the user navigates to my account page and verifies information
        myAccount.getHeadingName().then(heading => {
            expect(heading).toEqual(user.firstName + " " + user.lastName);
        });
        myAccount.getEmail().then(heading => {
            console.log("User with email : " + timeStamp + user.email)
            expect(heading).toEqual(timeStamp + user.email);
        });
        myAccount.getPhone(true).then(phone => {
            expect(phone).toEqual(user.phone);
        });

        //WHEN user navigates to address book with new address + default
        let addressBookPage: AddressBookPage = myAccount.goToAddressBookPage(user.addressBook.length + 1);

        //Then verifies correct information in address book
        addressBookPage.getAddressCardFirstName(1).then(result => {
            expect(result).toEqual(user.addressBook[0].firstName, " for address book card value");
        });
        addressBookPage.getAddressCardLastName(1).then(result => {
            expect(result).toEqual(user.addressBook[0].lastName, " for address book card value");
        });
        addressBookPage.getAddressCardNickName(1).then(result => {
            nickname = result;
            console.log("address nickname set to : " + nickname);
        });
        addressBookPage.getAddressCardPhone(1).then(result => {
            expect(result).toEqual(user.addressBook[0].phoneNumber, " for address book card value");
        });
        addressBookPage.getAddressCardAddressLine(1).then(result => {
            expect(result).toEqual(user.addressBook[0].addressLine1, " for address book card value");
        });
        addressBookPage.getAddressCardCity(0).then(result => {
            expect(result).toEqual(user.addressBook[0].city, " for address book card value");
        });
        addressBookPage.getAddressCardZipCode(0).then(result => {
            expect(result).toEqual(user.addressBook[0].zipCode, " for address book card value");
        });
        addressBookPage.getAddressCardState(0).then(result => {
            expect(result).toEqual(user.addressBook[0].stateShort, " for address book card value");
        });
        addressBookPage.getAddressCardCountry(0).then(result => {
            expect(result).toEqual(user.addressBook[0].country, " for address book card value");
        });
        addressBookPage.getAddressCardEmail(0).then(result => {
            expect(result).toEqual(timeStamp + user.addressBook[0].email, " for address book card value");
        });

        //WHEN the user navigates to the shopping cart it is now empty
        let shoppingCart: ShoppingCartPage = storeFront.banner().clickShopCart();

        //THEN there is 0 products in Cart
        shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
            expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
            if (nProducts > 0) {
                shoppingCart.removeAllItems();
            }
        });

        skus2.forEach(sku => {
            let megaMenu = banner.openMenu();
            plp = megaMenu.navigateToPLP(category2.subCategoryName, 12);
            plp.goToPage('3');
            new ProductListingPage(4);
            pdp = plp.clickProductAtIndex(1);
            pdp.clickTextAttribute(sku.attributes['Color'].replace(/\s/g, "")).addToCart(1);
            pdp.confirmationModalDisplayed();
        });

        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

        //AND
        //WHEN user navigates to shopcart waits for 2 products loaded
        shoppingCartPage = new ShoppingCartPage(skus2.length);

        //THEN there is 2 products in Cart
        shoppingCartPage.getNumberOfProductsLoaded().then(products => {
            expect(products).toBe(skus2.length, " shopcart does not have correct number of products loaded");
        });

        //WHEN user clicks on check out and the checkout page is loaded and selects there address
        checkout = shoppingCartPage.clickCheckOut();

        //AND when user selects shipping billing nickname
        checkout.getTotal().then(() => {

        });

        //because protractor generates calls asyncronously and nickname is a generated value, therefore a call using that value must be set in the script before the call is initiated
        browser.wait( () =>{
            return (nickname != '');
        }, 10000).then( ()=>{
            checkout.selectShippingBillingAddress(nickname);
        },);

        // THEN the users selected address is displayed
        new CheckOutPage().getShippingBillingFullAddress().then(result => {
            let expected = address.addressLine1 + ", " + address.city + ", " + address.state + " " + address.zipCode + ", " + address.country;
            expect(result).toBe(expected);
        });

        //AND
        //THEN the users product are displayed displayed, with correct name, price and quantity
        //THEN the user's product is displayed displayed, with correct name, price and quantity, sku
        count = 0;
        skus2.forEach(sku => {
            checkout.getProductNames().get(count).getText().then(text => {
                expect(text).toBe(product2.name, " for product name on checkout page.");
            });
            checkout.getProductPrices().get(count).getText().then(text => {
                expect(text).toBe("$" + numberWithCommas(sku.priceOffering.toFixed(2)), " for product price on checkout page.");
            });
            checkout.getProductQuantities().get(count).getText().then(text => {
                expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
            });
            count++;
        });


        //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName1);

        //AND
        //WHEN clicks on save and continue
        checkout.waitSaveAndContinueShippingDisplayed();
        checkout.saveAndContinue();

        //THEN wait for the save and continue button to no longer be displayed
        checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
        });

        //AND
        //THEN verifies subtotal, discount, shipping and total
        checkout.getSubtotal().then(result => {
            browser.sleep(10000);
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal2), " for subtotal2 checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount2), " for discount2 on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost2), " for shipping2 on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total2), " for total2 on checkout page.");
        });

        //WHEN user clicks on place order navigates to the order page
        checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            expect(result).toBeGreaterThan(0);
        });
    });

    it('to complete guest checkout with different shipping & billing address information (with field validation) and register and perform second checkout: test02', () => {
        console.log('to complete guest checkout with different shipping & billing address information (with field validation) and register and perform second checkout: test02');
        const testData = dataFile.test02;
        let user = dataFile.user02;
        let category = CATALOG.Bedroom.Dressers;
        let category2 = CATALOG.Bath.Accessories;

        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        let product2: StockholmProduct = CATALOG.Bath.Accessories["Bender Toothbrush Holder"].productInfo;
        let sku2: Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];
        let nickname: string = "";
        //GIVEN the homepage is loaded and guest users shopping cart is empty

        //AND
        //WHEN user navigates to products page and adds a product to their cart
        let megaMenu = banner.openMenu();
        let plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
        let pdp = plp.clickProductAtIndex(3);
        pdp.addToCart(1);

        //AND
        //WHEN user navigates to cart with 1 item
        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);


        //When guest clicks on check out and the sign in page is loaded
        let login: LoginPage = shoppingCartPage.clickCheckOutAsGuest();

        //THEN checkout as guest button is displayed
        login.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        });

        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = login.clickCheckoutAsGuest();

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

        //WHEN user opens different billing address form on save&continue for creating an address and waits for invalid css on nickname
        checkout.openBillingFormCheckbox().clickSaveAndContinueCreateAddress().waitBillingZipCodeCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);
        checkout.waitShippingZipCodeCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

        //THEN all manditory fields for both SHIPPING and BILLING have invalid css and optional have valid css value
        //SHIPPING
        checkout.getShippingFirstNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingLastNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingEmailCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingAddressLine1Css(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingCityCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingStateCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getShippingZipCodeCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        //BILLING
        checkout.getBillingFirstNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingLastNameCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingEmailCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingAddressLine1Css(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingCityCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingStateCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });
        checkout.getBillingZipCodeCss(dataFile.css.textField.invalid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.invalid[1], " expected invalid css");
        });

        //WHEN user inputs all manditory fields for shipping and billing address
        checkout.typeShippingFirstName(user.addressBook[0].firstName)
            .typeShippingLastName(user.addressBook[0].lastName)
            .typeShippingEmail(timeStamp + user.addressBook[0].email)
            .typeShippingPhoneNumber(user.addressBook[0].phoneNumber)
            .typeShippingAddressLine1(user.addressBook[0].addressLine1)
            .typeShippingCountryDropDown(user.addressBook[0].country)
            .typeShippingCity(user.addressBook[0].city)
            .typeShippingState(user.addressBook[0].state)
            .typeShippingZipCode(user.addressBook[0].zipCode);

        checkout.typeBillingFirstName(user.addressBook[1].firstName)
            .typeBillingLastName(user.addressBook[1].lastName)
            .typeBillingEmail(timeStamp + user.addressBook[1].email)
            .typeBillingPhoneNumber(user.addressBook[1].phoneNumber)
            .typeBillingAddressLine1(user.addressBook[1].addressLine1)
            .typeBillingCountryDropDown(user.addressBook[1].country)
            .typeBillingCity(user.addressBook[1].city)
            .typeBillingState(user.addressBook[1].state)
            .typeBillingZipCode(user.addressBook[1].zipCode)
            .waitBillingZipCodeCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

        //THEN all manditory fields have valid css value
        //SHIPPING
        checkout.getShippingFirstNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingLastNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingEmailCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingAddressLine1Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingCityCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingStateCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getShippingZipCodeCss(dataFile.css.textField.valid[0]).then(result => {
            // expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
            console.log("TODO: confirm why does zipcodecss have the following value: " + result);
        });

        //BILLING
        //THEN all manditory fields have valid css value
        checkout.getBillingFirstNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingLastNameCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingEmailCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingPhoneNumberCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingAddressLine1Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingAddressLine2Css(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingCountryDropDownCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingCityCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingStateCss(dataFile.css.textField.valid[0]).then(result => {
            expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
        });
        checkout.getBillingZipCodeCss(dataFile.css.textField.valid[0]).then(result => {
            // expect(result).toBe(dataFile.css.textField.valid[1], " expected valid css");
            console.log("TODO: confirm why does zipcodecss have the following value: " + result);
        });

        //WHEN user clicks save and continue
        checkout.clickSaveAndContinueCreateAddress();

        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
        });

        //WHEN user selects US - Regular Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName1).saveAndContinue();

        //THEN wait for the save and continue button to no longer be displayed
        checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
        });

        //AND
        //THEN waits for total to update and verifies subtotal, discount, shipping and total
        checkout.waitForTotalToUpdate(Number(testData.total1));
        checkout.getSubtotal().then(result => {
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal1), " for subtotal checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount1), " for discount on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost1), " for shipping on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total1), " for total on checkout page.");
        });

        //AND then verifies address info displayed is correct
        checkout.getGuestShippingFullAddress().then(result => {
            let expected = user.addressBook[0].addressLine1 + ", " + user.addressBook[0].city + ", " + user.addressBook[0].state + " " + user.addressBook[0].zipCode + ", " + user.addressBook[0].country;
            expect(result).toBe(expected);
        });
        checkout.getGuestBillingFullAddress().then(result => {
            let expected = user.addressBook[1].addressLine1 + ", " + user.addressBook[1].city + ", " + user.addressBook[1].state + " " + user.addressBook[1].zipCode + ", " + user.addressBook[1].country;
            expect(result).toBe(expected);
        });

        //WHEN user clicks on place order navigates to the order page
        let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            console.log('OrderId: ' + result);
            expect(result).toBeGreaterThan(0);
        });

        //WHEN guest enters valid email, password, and verify password and clicks register
        orderConfirmation.typePassword(user.password).typeVerifyPassword(user.password).clickRegisterUser();

        //navigates to my accounts page
        let myAccount: MyAccountPage = new Banner(true).clickMyAccount();

        //THEN the user navigates to my account page and verifies information
        myAccount.getHeadingName().then(heading => {
            expect(heading).toEqual(user.addressBook[1].firstName + " " + user.addressBook[1].lastName);
        });
        myAccount.getEmail().then(heading => {
            expect(heading).toEqual(timeStamp + user.addressBook[1].email);
        });
        myAccount.getPhone(true).then(phone => {
            expect(phone).toEqual(user.addressBook[1].phoneNumber);
        });

        //WHEN user navigates to address book and there are 3 address loaded (default/empty, shipping, billing)
        let addressBookPage: AddressBookPage = myAccount.goToAddressBookPage(user.addressBook.length + 1);

        //Then verifies correct information in address book for 1st address
        addressBookPage.getAddressCardFirstName(1).then(result => {
            let index: number = 0;
            if (result === user.addressBook[1].firstName) {
                index = 1;
            }

            expect(result).toEqual(user.addressBook[index].firstName, " for address book card value");
            addressBookPage.getAddressCardLastName(1).then(result => {
                expect(result).toEqual(user.addressBook[index].lastName, " for address book card value")
            });
            addressBookPage.getAddressCardNickName(1).then(result => {
                if (index === 0) {
                    console.log("Nickname set to : " + result);
                    nickname = result;
                }
            });
            addressBookPage.getAddressCardPhone(1).then(result => {
                expect(result).toEqual(user.addressBook[index].phoneNumber, " for address book card value")
            });
            addressBookPage.getAddressCardAddressLine(1).then(result => {
                expect(result).toEqual(user.addressBook[index].addressLine1, " for address book card value")
            });
            addressBookPage.getAddressCardCity(0).then(result => {
                expect(result).toEqual(user.addressBook[index].city, " for address book card value")
            });
            addressBookPage.getAddressCardZipCode(0).then(result => {
                expect(result).toEqual(user.addressBook[index].zipCode, " for address book card value")
            });
            addressBookPage.getAddressCardState(0).then(result => {
                expect(result).toEqual(user.addressBook[index].stateShort, " for address book card value")
            });
            addressBookPage.getAddressCardCountry(0).then(result => {
                expect(result).toEqual(user.addressBook[index].country, " for address book card value")
            });
            addressBookPage.getAddressCardEmail(0).then(result => {
                expect(result).toEqual(timeStamp + user.addressBook[index].email, " for address book card value")
            });

            //Then verifies correct information in address book for 2nd address
            addressBookPage.getAddressCardFirstName(2).then(result => {
                let index: number = 0;
                if (result === user.addressBook[1].firstName) {
                    index = 1;
                }

                expect(result).toEqual(user.addressBook[index].firstName, " for address book card value");
                addressBookPage.getAddressCardLastName(2).then(result => {
                    expect(result).toEqual(user.addressBook[index].lastName, " for address book card value")
                });
                addressBookPage.getAddressCardNickName(2).then(result => {
                    if (index === 0) {
                        console.log("Nickname set to : " + result);
                        nickname = result;
                    }
                });
                addressBookPage.getAddressCardPhone(2).then(result => {
                    expect(result).toEqual(user.addressBook[index].phoneNumber, " for address book card value")
                });
                addressBookPage.getAddressCardAddressLine(2).then(result => {
                    expect(result).toEqual(user.addressBook[index].addressLine1, " for address book card value")
                });
                addressBookPage.getAddressCardCity(1).then(result => {
                    expect(result).toEqual(user.addressBook[index].city, " for address book card value")
                });
                addressBookPage.getAddressCardZipCode(1).then(result => {
                    expect(result).toEqual(user.addressBook[index].zipCode, " for address book card value")
                });
                addressBookPage.getAddressCardState(1).then(result => {
                    expect(result).toEqual(user.addressBook[index].stateShort, " for address book card value")
                });
                addressBookPage.getAddressCardCountry(1).then(result => {
                    expect(result).toEqual(user.addressBook[index].country, " for address book card value")
                });
                addressBookPage.getAddressCardEmail(1).then(result => {
                    expect(result).toEqual(timeStamp + user.addressBook[index].email, " for address book card value")
                });

                //WHEN the user navigates to the shopping cart it is now empty
                let shoppingCart: ShoppingCartPage = banner.clickShopCart();

                //THEN there is 0 products in Cart
                shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
                    expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
                    if (nProducts > 0) {
                        shoppingCart.removeAllItems();
                    }
                });

                //AND
                //WHEN user navigates to products page and adds a product to their cart
                megaMenu = banner.openMenu();
                plp = megaMenu.navigateToPLP(category2.subCategoryName, 4);
                pdp = plp.clickProductAtIndex(1);
                pdp.addToCart(1);

                //AND
                //WHEN user navigates to shopping cart with 1 product in their cart
                checkout = pdp.clickViewCart(1).clickCheckOut(1);

                //THEN the user's product is displayed displayed, with correct name, price and quantity
                checkout.getProductNames().first().getText().then(text => {
                    expect(text).toBe(product2.name, " for product name on checkout page.");
                });
                checkout.getProductPrices().first().getText().then(text => {
                    expect(text).toBe("$" + numberWithCommas(sku2.priceOffering.toFixed(2)), " for product price on checkout page.");
                });
                checkout.getProductQuantities().first().getText().then(text => {
                    expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
                });

                //WHEN user selects shipping and billing address
                browser.sleep(1).then(() => {
                    checkout.selectShippingBillingAddress(nickname);    //TODO: TEMPORARY workaround for ascyn variable
                });


                //THEN address info displayed is correct
                checkout.getShippingBillingFullAddress().then(result => {
                    let expected = user.addressBook[0].addressLine1 + ", " + user.addressBook[0].city + ", " + user.addressBook[0].state + " " + user.addressBook[0].zipCode + ", " + user.addressBook[0].country;
                    expect(result).toBe(expected);
                });


                //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
                checkout.shippingMethod(testData.shippingName2);

                //AND
                //WHEN clicks on save and continue
                checkout.waitSaveAndContinueShippingDisplayed();
                checkout.saveAndContinue();

                //THEN wait for the save and continue button to no longer be displayed
                checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
                    expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
                });

                //AND
                //THEN verifies subtotal, discount, shipping and total
                checkout.getSubtotal().then(result => {
                    console.log('SubTotal: ' + result);
                    expect(result).toBe(Number(testData.subtotal2), " for subtotal2 checkout page.");
                });
                checkout.getDiscount().then(result => {
                    console.log('DiscountTotal: ' + result);
                    expect(result).toBe(Number(testData.discount2), " for discount2 on checkout page.");
                });
                checkout.getShipping().then(result => {
                    console.log('ShippingCharge: ' + result);
                    expect(result).toBe(Number(testData.shippingCost2), " for shipping2 on checkout page.");
                });
                checkout.getTotal().then(result => {
                    console.log('GrandTotal: ' + result);
                    expect(result).toBe(Number(testData.total2), " for total2 on checkout page.");
                });

                //WHEN user clicks on place order navigates to the order page
                checkout.placeOrder();

                //THEN there is an order confirmation id greater than 0
                orderConfirmation.getOrderId().then(result => {
                    expect(result).toBeGreaterThan(0);
                });
            });
        });
    });

    it('to complete guest checkout with editting address and then a second checkout with registered user and add another address test:03', () => {
        console.log('to complete guest checkout with editting address and then a second checkout with registered user and add another address test:03');
        var testData = dataFile.test03;
        let user = dataFile.user03;
        let category = CATALOG.LivingRoom.LivingRoomFurniture;
        let category2 = CATALOG.Bedroom.Dressers;

        let product1: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"].productInfo;
        let sku1: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0001"];
        let product2: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku2: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0002"];

        //AND
        //WHEN user navigates to products page and adds a product to their cart
        let megaMenu = banner.openMenu();
        let plp = megaMenu.navigateToPLP(category.subCategoryName, 12);
        plp.goToPage('3');
        new ProductListingPage(4);
        let pdp = plp.clickProductAtIndex(1);
        pdp.addToCart(1);

        //AND
        //WHEN user goes to shopping cart with 1 product loaded
        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);


        //When guest clicks on check out and the sign in page is loaded
        let login: LoginPage = shoppingCartPage.clickCheckOutAsGuest();

        //THEN checkout as guest button is displayed
        login.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        })

        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = login.clickCheckoutAsGuest();

        //THEN the users product is displayed displayed, with correct name, price and quantity
        checkout.getProductNames().first().getText().then(text => {
            expect(text).toBe(product1.name, " for product name on checkout page.");
        });
        checkout.getProductPrices().first().getText().then(text => {
            expect(text).toBe("$" + numberWithCommas(sku1.priceOffering), " for product price on checkout page.");
        });
        checkout.getProductQuantities().first().getText().then(text => {
            expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
        });

        //AND
        //WHEN user inputs all manditory fields for shipping and billing address
        checkout.typeShippingBillingFirstName(user.addressBook[0].firstNameWrong)
            .typeShippingBillingLastName(user.addressBook[0].lastNameWrong)
            .typeShippingBillingEmail(timeStamp + user.addressBook[0].emailWrong)
            .typeShippingBillingPhoneNumber(user.addressBook[0].phoneNumberWrong)
            .typeShippingBillingAddressLine1(user.addressBook[0].addressLine1Wrong)
            .typeShippingBillingCountryDropDown(user.addressBook[0].countryWrong)
            .typeShippingBillingCity(user.addressBook[0].cityWrong)
            .typeShippingBillingState(user.addressBook[0].stateWrong)
            .typeShippingBillingZipCode(user.addressBook[0].zipCodeWrong);

        //WHEN user clicks save and continue
        checkout.clickSaveAndContinueCreateAddress();

        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
        });

        //THEN verifies address info displayed with incorrect info
        checkout.getGuestShippingBillingFullAddress().then(result => {
            let expected = user.addressBook[0].addressLine1Wrong + ", " + user.addressBook[0].cityWrong + ", " + user.addressBook[0].stateWrong + " " + user.addressBook[0].zipCodeWrong + ", " + user.addressBook[0].countryWrong;
            expect(result).toBe(expected);
        });


        //AND
        //THEN verifies that edit button is displayed
        checkout.editButtonShippingBillingIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " S&B address edit button is not displayed before save and continue");
        });

        //WHEN user edits shipping and billing information with correct info
        checkout.openShippingBillingEditAddress()
            .typeShippingBillingFirstName(user.addressBook[0].firstNameAddition)
            .typeShippingBillingLastName(user.addressBook[0].lastNameAddition)
            .typeShippingBillingEmail(user.addressBook[0].emailAddition)
            .clearShippingBillingPhoneNumber().typeShippingBillingPhoneNumber(user.addressBook[0].phoneNumber)
            .typeShippingBillingAddressLine1(user.addressBook[0].addressLine1Addition)
            .typeShippingBillingCountryDropDown(user.addressBook[0].country)
            .typeShippingBillingCity(user.addressBook[0].cityAddition)
            .typeShippingBillingState(user.addressBook[0].state)
            .clearShippingBillingZipCode().typeShippingBillingZipCode(user.addressBook[0].zipCode);

        //AND
        //WHEN user clicks save and continue for create new address
        checkout.clickSaveAndContinueCreateAddress();

        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
        });

        //AND
        //THEN verifies that edit button is displayed
        checkout.editButtonShippingBillingIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, "S&B address edit button is not displayed after save and continue");
        });

        //AND
        //THEN verifies address info displayed is correct with correct info
        checkout.getGuestShippingBillingFullAddress().then(result => {
            let expected = user.addressBook[0].addressLine1 + ", " + user.addressBook[0].city + ", " + user.addressBook[0].state + " " + user.addressBook[0].zipCode + ", " + user.addressBook[0].country;
            console.log("After user corrects info the info now displayed is: " + result);
            expect(result).toBe(expected);
        });

        //WHEN user selects US - Regular Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName1).saveAndContinue();

        //THEN wait for the save and continue button to no longer be displayed
        checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, " save and continue displayed when should be hidden");
        });

        //AND
        //THEN waits for total to update and verifies subtotal, discount, shipping and total
        checkout.waitForTotalToUpdate(Number(testData.total1));
        checkout.getSubtotal().then(result => {
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal1), " for subtotal checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount1), " for discount on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost1), " for shipping on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total1), " for total on checkout page.");
        });

        //WHEN user clicks on place order navigates to the order page
        let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            console.log('OrderId: ' + result);
            expect(result).toBeGreaterThan(0);
        });

        //WHEN guest enters valid email, password, and verify password and clicks register
        orderConfirmation.typePassword(user.password).typeVerifyPassword(user.password).clickRegisterUser();

        //AND
        //WHEN user navigates to my accounts page
        let myAccount: MyAccountPage = banner.clickMyAccount();

        //THEN the user navigates to my account page and verifies information
        myAccount.getHeadingName().then(heading => {
            expect(heading).toEqual(user.firstName + " " + user.lastName);
        });
        myAccount.getEmail().then(heading => {
            expect(heading).toEqual(timeStamp + user.login);
        });
        myAccount.getPhone(true).then(phone => {
            expect(phone).toEqual(user.phone);
        });

        //WHEN user navigates to address book there should be two addres entries loaded (default + shipping)
        let addressBookPage: AddressBookPage = myAccount.goToAddressBookPage(user.addressBook.length);

        //Then verifies correct information in address book
        addressBookPage.getAddressCardFirstName(1).then(result => {
            expect(result).toEqual(user.addressBook[0].firstName, " for address book card value")
        });
        addressBookPage.getAddressCardLastName(1).then(result => {
            expect(result).toEqual(user.addressBook[0].lastName, " for address book card value")
        });
        addressBookPage.getAddressCardPhone(1).then(result => {
            expect(result).toEqual(user.addressBook[0].phoneNumber, " for address book card value")
        });
        addressBookPage.getAddressCardAddressLine(1).then(result => {
            expect(result).toEqual(user.addressBook[0].addressLine1, " for address book card value")
        });
        addressBookPage.getAddressCardCity(0).then(result => {
            expect(result).toEqual(user.addressBook[0].city, " for address book card value")
        });
        addressBookPage.getAddressCardZipCode(0).then(result => {
            expect(result).toEqual(user.addressBook[0].zipCode, " for address book card value")
        });
        addressBookPage.getAddressCardState(0).then(result => {
            expect(result).toEqual(user.addressBook[0].stateShort, " for address book card value")
        });
        addressBookPage.getAddressCardCountry(0).then(result => {
            expect(result).toEqual(user.addressBook[0].country, " for address book card value")
        });
        addressBookPage.getAddressCardEmail(0).then(result => {
            expect(result).toEqual(timeStamp + user.addressBook[0].email, " for address book card value")
        });

        //WHEN the user navigates to the shopping cart it is now empty
        let shoppingCart: ShoppingCartPage = banner.clickShopCart();

        //THEN there is 0 products in Cart
        shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
            expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
            if (nProducts > 0) {
                shoppingCart.removeAllItems();
            }
        });

        //AND
        //WHEN user navigates to sku page and adds a product to their cart
        megaMenu = banner.openMenu();
        plp = megaMenu.navigateToPLP(category2.subCategoryName, 4);
        new ProductListingPage(4);
        pdp = plp.clickProductAtIndex(3);
        pdp.addToCart(1);

        //WHEN user goes to shopcart with 1 product loaded
        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

        //When user clicks on check out and the checkout page is loaded
        checkout = shoppingCartPage.clickCheckOut();

        //THEN the users product is displayed displayed, with correct name, price and quantity
        checkout.getProductNames().first().getText().then(text => {
            expect(text).toBe(product2.name, " for product name on checkout page.");
        });
        checkout.getProductPrices().first().getText().then(text => {
            expect(text).toBe("$" + numberWithCommas(sku2.priceOffering.toFixed(2)), " for product price on checkout page.");
        });
        checkout.getProductQuantities().first().getText().then(text => {
            expect(text).toBe("Quantity: 1", " for product quantity on checkout page");
        });

        //WHEN user selects new address from dropdown
        checkout.selectShippingBillingAddress(user.addressBook[1].newAddress);

        //AND
        //WHEN user creates a new Shipping Billing address
        checkout.selectShippingBillingAddress()
            .typeShippingBillingAddressNickname(user.addressBook[1].nickName)
            .typeShippingBillingFirstName(user.addressBook[1].firstName)
            .typeShippingBillingLastName(user.addressBook[1].lastName)
            .typeShippingBillingEmail(timeStamp + user.addressBook[1].email)
            .typeShippingBillingPhoneNumber(user.addressBook[1].phoneNumber)
            .typeShippingBillingAddressLine1(user.addressBook[1].addressLine1)
            .typeShippingBillingCountryDropDown(user.addressBook[1].country)
            .typeShippingBillingCity(user.addressBook[1].city)
            .typeShippingBillingState(user.addressBook[1].state)
            .typeShippingBillingZipCode(user.addressBook[1].zipCode);

        //WHEN user clicks save and continue
        checkout.clickSaveAndContinueCreateAddress();

        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
        });

        //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName2).saveAndContinue().waitSaveAndContinueShippingNotDisplayed();

        //THEN verfies address info displayed is correct
        checkout.getShippingBillingFullAddress().then(result => {
            let expected = user.addressBook[1].addressLine1 + ", " + user.addressBook[1].city + ", " + user.addressBook[1].state + " " + user.addressBook[1].zipCode + ", " + user.addressBook[1].country;
            expect(result).toBe(expected);
        });

        //AND
        //THEN verifies subtotal, discount, shipping and total
        checkout.getSubtotal().then(result => {
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal2), " for subtotal2 checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount2), " for discount2 on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost2), " for shipping2 on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total2), " for total2 on checkout page.");
        });

        //WHEN user clicks on place order navigates to the order page
        orderConfirmation = checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            console.log('OrderId: ' + result);
            expect(result).toBeGreaterThan(0);
        });

        //AND
        //user navigates to my accounts page
        banner.clickMyAccount();

        //THEN the user navigates to my account page and verifies information
        myAccount.getHeadingName().then(heading => {
            expect(heading).toEqual(user.addressBook[0].firstName + " " + user.addressBook[0].lastName);
        });
        myAccount.getEmail().then(heading => {
            expect(heading).toEqual(timeStamp + user.addressBook[0].email);
        });
        myAccount.getPhone(true).then(phone => {
            expect(phone).toEqual(user.addressBook[0].phoneNumber);
        });

        //WHEN user navigates to address book and there are default + 2 address loaded (default/empty, shipping, billing, new shipping)
        addressBookPage = myAccount.goToAddressBookPage(user.addressBook.length + 1)

        //Then verifies correct information in address book for 1st address
        addressBookPage.getAddressCardFirstName(1).then(result => {
            expect(result).toEqual(user.addressBook[1].firstName, " for address book card value")
        });
        addressBookPage.getAddressCardLastName(1).then(result => {
            expect(result).toEqual(user.addressBook[1].lastName, " for address book card value")
        });
        addressBookPage.getAddressCardNickName(1).then(result => {
            expect(result).toContain(user.addressBook[1].nickName, " for address book card value")
        });
        addressBookPage.getAddressCardPhone(1).then(result => {
            expect(result).toEqual(user.addressBook[1].phoneNumber, " for address book card value")
        });
        addressBookPage.getAddressCardAddressLine(1).then(result => {
            expect(result).toEqual(user.addressBook[1].addressLine1, " for address book card value")
        });
        addressBookPage.getAddressCardCity(0).then(result => {
            expect(result).toEqual(user.addressBook[1].city, " for address book card value")
        });
        addressBookPage.getAddressCardZipCode(0).then(result => {
            expect(result).toEqual(user.addressBook[1].zipCode, " for address book card value")
        });
        addressBookPage.getAddressCardState(0).then(result => {
            expect(result).toEqual(user.addressBook[1].stateShort, " for address book card value")
        });
        addressBookPage.getAddressCardCountry(0).then(result => {
            expect(result).toEqual(user.addressBook[1].country, " for address book card value")
        });
        addressBookPage.getAddressCardEmail(0).then(result => {
            expect(result).toEqual(timeStamp + user.addressBook[1].email, " for address book card value")
        });

        addressBookPage.getAddressCardFirstName(2).then(result => {
            expect(result).toEqual(user.addressBook[0].firstName, " for address book card value")
        });
        addressBookPage.getAddressCardLastName(2).then(result => {
            expect(result).toEqual(user.addressBook[0].lastName, " for address book card value")
        });
        addressBookPage.getAddressCardPhone(2).then(result => {
            expect(result).toEqual(user.addressBook[0].phoneNumber, " for address book card value")
        });
        addressBookPage.getAddressCardAddressLine(2).then(result => {
            expect(result).toEqual(user.addressBook[0].addressLine1, " for address book card value")
        });
        addressBookPage.getAddressCardCity(1).then(result => {
            expect(result).toEqual(user.addressBook[0].city, " for address book card value")
        });
        addressBookPage.getAddressCardZipCode(1).then(result => {
            expect(result).toEqual(user.addressBook[0].zipCode, " for address book card value")
        });
        addressBookPage.getAddressCardState(1).then(result => {
            expect(result).toEqual(user.addressBook[0].stateShort, " for address book card value")
        });
        addressBookPage.getAddressCardCountry(1).then(result => {
            expect(result).toEqual(user.addressBook[0].country, " for address book card value")
        });
        addressBookPage.getAddressCardEmail(1).then(result => {
            expect(result).toEqual(timeStamp + user.addressBook[0].email, " for address book card value")
        });

        //WHEN the user navigates to the shopping cart it is now empty
        shoppingCart = banner.clickShopCart();

        //THEN there is 0 products in Cart
        shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
            expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
            if (nProducts > 0) {
                shoppingCart.removeAllItems();
            }
        });
    });

    it('to complete guest checkout with a product: test04', () => {
        console.log('to complete guest checkout with a product: test04');
        var testData = dataFile.test04
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0003"];

        //GIVEN the homepage is loaded and guest users shopping cart is empty

        //AND
        //WHEN user navigates to sku page and adds a product to their cart
        let megaMenu = banner.openMenu();
        let plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
        new ProductListingPage(4);
        let pdp = plp.clickProductAtIndex(3);
        pdp.addToCart(1);

        //AND
        //WHEN user goest to shopping cart with 1 product loaded
        var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

        //When guest clicks on check out and the sign in page is loaded
        let login: LoginPage = shoppingCartPage.clickCheckOutAsGuest();

        //THEN checkout as guest button is displayed
        login.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        })
        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = login.clickCheckoutAsGuest();

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

        //WHEN user inputs all manditory and optional fields for shipping and billing address and clicks save and continue
        let address = dataFile.user01.addressBook[0];
        checkout.typeShippingBillingFirstName(address.firstName)
            .typeShippingBillingLastName(address.lastName)
            .typeShippingBillingEmail(address.email)
            .typeShippingBillingAddressLine1(address.addressLine1)
            .typeShippingBillingAddressLine2(address.addressLine2)
            .typeShippingBillingCountryDropDown(address.country)
            .typeShippingBillingCity(address.city)
            .typeShippingBillingState(address.state)
            .typeShippingBillingZipCode(address.zipCode)
            .clickSaveAndContinueCreateAddress();


        //THEN wait for address save&continue to dissapear and shipping and payment save&continue to appear
        checkout.waitSaveAndContinueCreateAddressNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue button should not be displayed after save & continue");
            console.log('Save and continue for add address isNotDisplayed: ' + isNotDisplayed);
        });

        //WHEN user selected US - Regular Delivery for shipping and clicks on save and continue
        checkout.shippingMethod(testData.shippingName1).saveAndContinue();

        //THEN wait for the save and continue button to no longer be displayed
        checkout.waitSaveAndContinueShippingNotDisplayed().then(isNotDisplayed => {
            expect(isNotDisplayed).toBe(true, "save and continue displayed when should be hidden");
        });

        //AND
        //THEN verifies subtotal, discount, shipping and total
        checkout.getSubtotal().then(result => {
            console.log('SubTotal: ' + result);
            expect(result).toBe(Number(testData.subtotal1), " for subtotal checkout page.");
        });
        checkout.getDiscount().then(result => {
            console.log('DiscountTotal: ' + result);
            expect(result).toBe(Number(testData.discount1), " for discount on checkout page.");
        });
        checkout.getShipping().then(result => {
            console.log('ShippingCharge: ' + result);
            expect(result).toBe(Number(testData.shippingCost1), " for shipping on checkout page.");
        });
        checkout.getTotal().then(result => {
            console.log('GrandTotal: ' + result);
            expect(result).toBe(Number(testData.total1), " for total on checkout page.");
        });

        //WHEN user clicks on place order navigates to the order page
        let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

        //THEN there is an order confirmation id greater than 0
        orderConfirmation.getOrderId().then(result => {
            console.log('OrderId: ' + result);
            expect(result).toBeGreaterThan(0);
        });

        //WHEN the user navigates to the shopping cart it is now empty
        let shoppingCart: ShoppingCartPage = banner.clickShopCart();

        //THEN there is 0 products in Cart
        shoppingCart.getNumberOfProductsLoaded().then(nProducts => {
            expect(nProducts).toBe(0, " shopcart does not have correct number of products loaded, place order did not succeed");
        });
    });

});