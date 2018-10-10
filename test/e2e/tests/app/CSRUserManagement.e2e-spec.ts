import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { CustomerServicePage } from '../../pageobjects/page/CustomerServicePage.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { OrderDetailPage } from '../../pageobjects/page/OrderDetailPage.po';

import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { WishListPage } from '../../pageobjects/page/WishListPage.po';

import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("CSR User Management");

/**
* CSR User Management
*
* login id is exact match - ask Fahad about search crtieria
* add a user as a CSR - and check email has been sent with pw reset
*/

describe('CSR ', () => {
    var dataFile = require('./data/CSRUserManagement.json');
    const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
    const date = new Date();
    const timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    //products for order history
    let category1 = CATALOG.Bedroom.Dressers;
    let product1 : StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
    let sku1 : Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
    let category2 = CATALOG.LivingRoom.LivingRoomLighting;
    let product2 : StockholmProduct = CATALOG.LivingRoom.LivingRoomLighting["Modern Pendant Light"].productInfo;
    let sku2 : Sku = CATALOG.LivingRoom.LivingRoomLighting["Modern Pendant Light"]["LR-LITB-0001-0001"];
    let wishCategory1 = CATALOG.Bath.Accessories;
    let wishProduct1 : StockholmProduct = CATALOG.Bath.Accessories["Bender Toothbrush Holder"].productInfo;
    let wishSku1 : Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];

    let storeFront: StoreFront = new StoreFront();
    let base = new BaseTest();
    let csrUserName1 = dataFile.csrUserName1;
    let csrPassword = dataFile.csrPassword;
    let shopper1UserName : string = timeStamp + dataFile.register.logonId
    let shopper1Password : string = dataFile.register.password;

    beforeAll(function () {
        let banner : Banner = new StoreFront().banner().signOutIfSignedIn();
        var register = banner.clickSignIn(RegistrationPage);
        console.log("Creating user: " + shopper1UserName + " wish password: " + shopper1Password);
        var registerData = dataFile.register;

        //create user
        register.typeFirstName(registerData.firstName)
        .typeLastName(registerData.lastName + timeStamp)
        .typeEmail(shopper1UserName)
        .typePassword(shopper1Password)
        .typeVerifyPassword(shopper1Password)
        .clickRegister();
        banner.signInNotDisplayed();
        banner.myAccountDisplayed();

        //add address
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

        //add order history
        //AND CHECKOUT 1-------------------------------------------------------
        //WHEN user navigates to products page and adds a product to their cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category1.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        pdp.addToCart(1);
        let shoppingCartPage : ShoppingCartPage= pdp.clickViewCart();
        shoppingCartPage= new ShoppingCartPage(1);

        //AND
        //WHEN user clicks on check out and the checkout page is loaded
        let checkout: CheckOutPage = shoppingCartPage.clickCheckOut();
        //AND
        //WHEN clicks on save and continue and places order
        checkout.saveAndContinue().placeOrder();

        //AND CHECKOUT 2-------------------------------------------------------
        //WHEN user navigates to products page and adds a product to their cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category2.subCategoryName, 8);
        var pdp: ProductPage = plp.clickProductAtIndex(0);
        pdp.addToCart(1);
        shoppingCartPage = pdp.clickViewCart();
        shoppingCartPage= new ShoppingCartPage(1);
        //AND
        //WHEN user clicks on check out and the checkout page is loaded
        checkout = shoppingCartPage.clickCheckOut();
        //AND
        //WHEN clicks on save and continue and places order
        checkout.saveAndContinue().placeOrder();

        //WISHLIST and Item in cart-------------------------------------------------------
        //WHEN user navigates to products page and adds a product to their cart AND wish list
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(wishCategory1.subCategoryName, 8);
        var pdp: ProductPage = plp.clickProductAtIndex(0);
        pdp.addToCart(1);
        pdp.addToWishList();

        banner.signOutIfSignedIn();
        banner.signInDisplayed();

    });

    beforeEach(function () {
        storeFront.banner().signOutIfSignedIn();
    });

    it('test01: finds a customer without the form completed', () => {
        console.log('test01: finds a customer without the form completed');
        let testData = dataFile.test01;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open find customer area
        csp.openFindCustomer();

        //fill the form out to search for a specific user
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //validate the result (user info)
        csp.getSearchResultUserName().then( result => {
            expect(result).toEqual(shopper1UserName, "user name not correct");
        });
        csp.getSearchResultFullName().then( result => {
            expect(result).toEqual(testData.fullNameWithoutTimeStamp + timeStamp, "full name not correct");
        });
        csp.getSearchResultAddress().then( result => {
            expect(result).toEqual(testData.address, "address not correct");
        });

        //click 'clear filter' button
        csp.openFindCustomerCriteria().clickFindCustomerClearFilter();

        //verify the search result cleared
        csp.waitNoResultsPresent().then(result=>{
            expect(result).toBe(true, " Expected no results to be shown after cleared filter");
        });

        //verify all form input emtpy
        csp.getFindCustomerAddress().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerEmailAddress().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerFirstName().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerLastName().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerLoginId().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerPhoneNumber().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerState().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });
        csp.getFindCustomerZipCode().then(result => {
            expect(result).toBe('', "expected field to be empty after clear results");
        });

    });

    it('test02: disables a shopper', () => {
        console.log('test02: disables a shopper');
        let testData = dataFile.test02;
        let banner: Banner = storeFront.banner();

        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'disables' option for a shopper
        csp.disableUser();

        //Verify user is disabled
        csp.isUserEnabled().then(result=>{
            expect(result).toBe(false, " expected user to be disabled.");
        });

        //csr logs out
        banner.clickMyAccount().clickSignOut();

        //attemp to sign in as the disabled shopper
        banner.clickSignIn(LoginPage).typeUserName(shopper1UserName).typePassword(shopper1Password).clickLogin();

        //re-enable user
        csp  = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'enables' option for a shopper
        csp.enableUser();

        //Verify user is enabled
        csp.isUserEnabled().then(result=>{
            expect(result).toBe(true, " expected user to be enabled.");
        });
    });

    it('test03: starts acting as a shopper', () => {
        console.log('test03: starts acting as a shopper');
        let testData = dataFile.test03;
        let banner: Banner = storeFront.banner();

        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'start acting' as a shopper
        csp.startActingAs();
        let myAccount : MyAccountPage = banner.clickMyAccount();

        //verify my account displays the logon of the shopper CSR is impersonating
        myAccount.getActingAsUserInfo().then( result => {
            expect(result).toContain(testData.lastName + timeStamp, "user name not correct for CSR acting as on MyAccountPage.");
        });

        //verify the personal info of the shopper
        myAccount.getHeadingName().then( result => {
            expect(result).toContain(dataFile.register.firstName + " " + dataFile.register.lastName + timeStamp, " Heading name not correct");
        });

        myAccount.getEmail().then( result => {
            expect(result).toEqual(shopper1UserName, "Email not correct");
        });
        myAccount.getPhone(true).then(result => {
            expect(result).toEqual(dataFile.register.AddressBook.phone, " Phone not correct");
        });

        //verify 'CSR' page link is not displayed in the page
        myAccount.isCsrLinkDisplayed().then(result =>{
            expect(result).toBe(false, "expecting csr link to NOT be displayed when acting as shopper.");
        });

        //click on the 'Stop acting' button
        myAccount.clickStopActingAs();

        //verify 'CSR' page link is now displayed in the page
        myAccount.isCsrLinkDisplayed().then(result =>{
            expect(result).toBe(true, "expecting csr link to be displayed when acting as shopper.");
        });

        //verify the shopper name is not displayed in the my account page
        myAccount.isCsrActingAsUserNameNotPresent().then(result =>{
            expect(result).toBe(true, "expecting csr acting as user name to be NOT displayed when acting as shopper.");
        });
    });

    it('test04: is not able to find any users', () => {
        console.log('test04: is not able to find any users');
        let testData = dataFile.test04;
        let date = new Date();
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(timeStamp)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open find customer area
        csp.openFindCustomer();

        //fill the form out to search for a specific user and search that returns no results
        csp.typefcLoginId(timeStamp).clickFindCustomerSearch(false);

        //verify the no users found
        csp.waitDisplayedFindCustomerNoResultsFound().then(result =>{
            expect(result).toBe(true, "expecting message that no results found");
        });

    });

    it('test05: adds a new user', () => {
        console.log('test05: adds a new user');
        let testData = dataFile.test05;
        let banner: Banner = storeFront.banner();

        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open add a customer
        csp.openAddCustomer();

        //fill the form out
        csp.typeAddCustomerFirstName(testData.firstName).typeAddCustomerLastName(testData.lastName).typeAddCustomerLoginId(timeStamp + testData.loginId).typeAddCustomerPhone(testData.phone);

        //click 'register' button
        let homePage : HomePage = csp.clickAddCustomerRegisterButton();

        //verify homepage is loading
        homePage.heroSlideshowExists().then(result =>{
            expect(result).toBe(true, "expecting homepage to be loaded with heroslide");
        });
    });

    it('test06: starts impersonating a guest user', () => {
        console.log('test06: starts impersonating a guest user');
        let testData = dataFile.test06;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open the 'Shop As Guest' section and click on the 'Shop as Guest' section
        csp.openShopAsGuest().clickShopAsGuestButton();
        let myAccount : MyAccountPage =banner.clickMyAccount();

        myAccount.getActingAsUserInfo().then( result => {
            expect(result).toContain(testData.guestIdentifier, "acting guest displayed not correct for CSR acting as on MyAccountPage.");
        });

        //check if Adddressbook link is disabled
        myAccount.addressBookLinkNotPresent().then( result => {
            expect(result).toEqual(true, "address book should not be displayed for csr acting as guest");
        });

        let category1 = CATALOG.Bedroom.Dressers;
        let product1 : StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"].productInfo;
        let sku1 : Sku = CATALOG.Bedroom.Dressers["Style Home Large Ash Wood Chest of Drawers"]["BD-DRSS-0001-0001"];

        //WHEN user navigates to products page and adds a product to their cart
        banner.openMenu().navigateToPLP(category1.subCategoryName, 4).clickProductAtIndex(0).addToCart(1);

        //go to cart and begin checkout
        let loginPage : LoginPage = banner.clickShopCart().clickCheckOutAsGuest();

        //verify 'Checkout as guest' button is visible
        login.checkoutIsDisplayed().then(result=>{
            expect(result).toBe(true, "expecting checkout as guest button to be displayed");
        });

        //go to myaccount and click on 'Stop acting' button
        myAccount = banner.clickMyAccount().clickStopActingAs();

        //verify the CSR page link is visible
        myAccount.isCsrLinkDisplayed().then(result =>{
            expect(result).toBe(true, "expecting csr link to be displayed as CSR.");
        });
    });


    it('test07: register from impersonating a guest user', () => {
        console.log('test07: register from impersonating a guest user');
        let testData = dataFile.test07;
        let banner: Banner = storeFront.banner();

        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open the 'Shop As Guest' section and click on the 'Shop as Guest' section
        csp.openShopAsGuest().clickShopAsGuestButton();
        banner.clickMyAccount().clickRegisterGuest();

        //fill the form out
        csp.typeAddCustomerFirstName(testData.firstName).typeAddCustomerLastName(testData.lastName).typeAddCustomerLoginId(timeStamp + testData.loginId).typeAddCustomerPhone(testData.phone);

        //click 'register' button
        let homePage : HomePage = csp.clickAddCustomerRegisterButton();

        //verify homepage is loading
        homePage.heroSlideshowExists().then(result =>{
            expect(result).toBe(true, "expecting homepage to be loaded with heroslide");
        });
    });

    it('test08: page is not visible to a shopper', () => {
        console.log('test08: page is not visible to a shopper');
        let testData = dataFile.test08;
        let banner: Banner = storeFront.banner();

        //login as shopper (not CSR)
        banner.clickSignIn(LoginPage).typeUserName(shopper1UserName).typePassword(shopper1Password).clickLogin();

        //go to myaccount page
        let myAccount : MyAccountPage = banner.clickMyAccount();

        //Verify CSR page link is not displayed
        myAccount.isCsrLinkDisplayed().then(result =>{
            expect(result).toBe(false, "expecting csr link to NOT be displayed when acting as shopper.");
        });

        //try to hit the CSR page by hitting the url , user gets redirected to the home page
        base.navigateTo("customer-service");
        new HomePage().heroSlideshowExists().then(result =>{
            expect(result).toBe(true, "expecting homepage to be loaded with heroslide");
        });
    });

    it('test09: can view shopper\'s wish list', () => {
        console.log('test09: can view shopper\'s wish listd');
        let testData = dataFile.test09;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open find customer area
        csp.openFindCustomer();

        //fill the form out to search for a specific user and act as
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch().startActingAs();

        //click on the Wish list link
        let wishList : WishListPage = banner.clickMyAccount().goToWishListPage();

        //verify the shopper's wish lists are displayed
        wishList.getProductAtIndex(0).getProductName().then(result=>{
            expect(result).toBe(wishProduct1.name, "Wish list product name at index 0");
        });

        //verify the list of user's wish lists
        wishList.wishListDropdown().getWishListName().then(result=>{
            expect(result).toBe(testData.wishListDropDown, "Wish list drop down");
        });
    });

    it('test10: to find and view an order in detail', () => {
        console.log('test10: to find and view an order in detail');
        let testData = dataFile.test10;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open 'Find Order' section in CSR page
        csp.openFindOrder();

        //search for one order by filling the form out with a date
        csp.typeFindOrderEmailAddress(shopper1UserName)
        .typeFindOrderStartDate(date.getFullYear().toString(), (date.getMonth()+1).toString(), date.getDate().toString())
        .typeFindOrderEndDate(date.getFullYear().toString(), (date.getMonth()+1).toString(), date.getDate().toString());

        //cilck 'search'
        csp.clickFindOrderSearch();

        //Verify order details from the returned list date, address, email address, order number
        csp.getFindOrderSearchResultOrderNumber().then( result => {
            expect(Number(result)).toBeGreaterThan(0, "order number should be greater than 0");
        });
        csp.getFindOrderSearchResultOrderDate().then( result => {
            expect(result).toContain(date.getDate().toString() + ", " + date.getFullYear(), "order date not correct on find order search results");
        });
        csp.getFindOrderSearchResultAddress().then( result => {
            expect(result).toContain(testData.address, "address not correct");
        });
        csp.getFindOrderSearchResultEmail().then( result => {
            expect(result).toEqual(shopper1UserName, "email not correct");
        });

        //check the time placed descending + sorting order
        csp.getFindOrderSearchAllResultOrderNumber().then( result => {
            expect(Number(result[0])).toBeGreaterThan(Number(result[1]), "order numbers not descending");
        });

        //click on the order number
        let orderDetailsPage : OrderDetailPage = csp.clickOnOrderNumber();

        //verify the user is navigated to the order detail page
        orderDetailsPage.getOrderDate().then( result => {
            expect(result).toContain(date.getDate().toString() + ", " + date.getFullYear(), "order date not correct on order details page");
        });
    });

    it('test11: to view order details from the dropdown', () => {
        console.log('test11: to view order details from the dropdown');
        let testData = dataFile.test11;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //open 'Find Order' section in CSR page
        csp.openFindOrder();

        //search for users orders
        csp.typeFindOrderEmailAddress(shopper1UserName);

        //search for an order
        csp.clickFindOrderSearch();

        //select 'View Order details'
        let orderDetails : OrderDetailPage = csp.clickOnViewOrderSummary(0);

        // Verify the user is navigated to the correct order details page
        orderDetails.getOrderItemNameByIndex(0).then( result => {
            expect(result).toBe(product2.name, "item in order not correct on order details page");
        });
    });

    it('test12: of a registered user, and guest user cannot modify the cart', () => {
        console.log('test12: of a registered user, and guest user cannot modify the cart');
        let testData = dataFile.test11;
        let banner: Banner = storeFront.banner();
        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //Tab 1

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'start acting' as a shopper
        csp.startActingAs();

        //go to shopping cart
        let shoppingCart : ShoppingCartPage =  storeFront.banner().clickShopCart(1);

        //lock the cart
        shoppingCart.waitDisplayedLockCart();
        shoppingCart.clickOnLock();

        //verify the 'unlock' button is visible <- Ux might change this to be some other UI
        shoppingCart.waitDisplayedUnlockCart().then(result => {
            expect(result).toBe(true, " expected unlock cart to be displayed");
        });

        banner.clickMyAccount().clickStopActingAs().clickSignOut();

        // sign in as the same shopper
        banner.clickSignIn(LoginPage).typeUserName(shopper1UserName).typePassword(shopper1Password).clickLogin();

        //browse to a product and attempt to add a product
        let productPage : ProductPage = banner.openMenu().navigateToPLP(category1.subCategoryName, 4).clickProductAtIndex(0).addToCart(1);

        //verify an error message displayed
        productPage.waitLockedCartErrorModalDisplayed().then(result =>{
            expect(result).toBe(true, "Error message modal expected when cart is locked and user adds to cart.");
        });

        //navigate to cart
        shoppingCart = banner.clickShopCart(1);

        //verify remove button not present
        shoppingCart.waitForRemoveButtonPresent().then( result => {
            expect(result).toBe(false, "remove item should not be present");
        });

        //verify 'unlock' button not visible
        shoppingCart.waitDisplayedUnlockCart(3000).then( result => {
            expect(result).toBe(false, "unlock cartshould not be present");
        });
        //verify update quantity is disabled
        shoppingCart.isUpdateQuantityReadonly().then( result => {
            expect(result).toBe(true, " quantity areas should be readonly");
        });

        //verify wish list option not present
        shoppingCart.isWishListPresent(500).then( result => {
            expect(result).toBe(false, " wish list should not be present when cart is locked");
        });

        //UNLOCK CART
        banner.clickMyAccount().clickSignOut(); //logout user
        login = banner.clickSignIn(LoginPage);  //login csr
        csp = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //Tab 1

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'start acting' as a shopper
        csp.startActingAs();

        //go to shopping cart
        shoppingCart = storeFront.banner().clickShopCart(1);

        //lock the cart
        shoppingCart.clickOnUnlock();
    });

    it('test13: of a registered user, and registered user cannot add items in the cart from guest session', () => {
        console.log('test13: of a registered user, and registered user cannot add items in the cart from guest session');
        let testData = dataFile.test13;
        let banner: Banner = storeFront.banner();

        let login = banner.clickSignIn(LoginPage);

        let csp : CustomerServicePage = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //Tab 1

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'start acting' as a shopper
        csp.startActingAs();

        //go to shopping cart
        let shoppingCart : ShoppingCartPage =  storeFront.banner().clickShopCart();

        //lock the cart
        shoppingCart.waitDisplayedLockCart();
        shoppingCart.clickOnLock();

        //verify the 'unlock' button is visible <- Ux might change this to be some other UI
        shoppingCart.waitDisplayedUnlockCart().then(result => {
            expect(result).toBe(true, " expected unlock cart to be displayed");
        });

        banner.clickMyAccount().clickStopActingAs().clickSignOut();

        //as a guest user browse to products add a product to cart
        banner.openMenu().navigateToPLP(category1.subCategoryName, 4).clickProductAtIndex(0).addToCart(0);

        //navigate to sign in page and sign in with locked cart account
        login = banner.clickSignIn(LoginPage)
        login.typeUserName(shopper1UserName).typePassword(shopper1Password).clickLoginError();

        //verify the error message displayed in the sign in page
        login.getCredentialsErrorMessage().then( result => {
            expect(result).toContain(testData.partialErrorMessage, "Expected error message to contain X");
        });

        //UNLOCK CART
        login = banner.clickSignIn(LoginPage);
        csp = login.typeUserName(csrUserName1)
        .typePassword(csrPassword)
        .clickLogin()
        .clickMyAccount().goToCustomerServicePage();

        //Tab 1

        //open find customer area
        csp.openFindCustomer();

        //search for a shopper
        csp.typefcLoginId(shopper1UserName).clickFindCustomerSearch();

        //select 'start acting' as a shopper
        csp.startActingAs();

        //go to shopping cart
        shoppingCart = storeFront.banner().clickShopCart(1);

        //lock the cart
        shoppingCart.clickOnUnlock();
    });

    it('test14: of a registered shopper, and the user does not see the cart unlock button', () => {
        console.log('test14: of a registered shopper, and the user does not see the cart unlock button');
        let testData = dataFile.test14;
        let banner: Banner = storeFront.banner();

        //navigate to sign in page and sign in with locked cart account
        let login : LoginPage = banner.clickSignIn(LoginPage)
        login.typeUserName(shopper1UserName).typePassword(shopper1Password).clickLoginError();

        //shopper goes to a shopping cart
        let shoppingCart : ShoppingCartPage = storeFront.banner().clickShopCart(1);

        //verify user is in a proper shopping cart
        shoppingCart.getNumberOfProductsLoaded().then(result=>{
            expect(result).toBeGreaterThan(0, " cart not loaded or empty");
        });

        //check the cart lock button is not visible to a shopper
        shoppingCart.waitDisplayedLockCart(3000).then(result=>{
            expect(result).toBe(false, " lock should not be displayed for shopper");
        });
        shoppingCart.waitDisplayedUnlockCart(3000).then(result=>{
            expect(result).toBe(false, " unlock should not be displayed for shopper");
        });
    });

});