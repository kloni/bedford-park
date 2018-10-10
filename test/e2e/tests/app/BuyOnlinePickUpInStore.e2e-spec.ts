import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { StockholmCatalog } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { ProductPage, ProductDetailPageObjs } from '../../pageobjects/page/ProductPage.po';
import { by, element, protractor} from 'protractor';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { CheckOutPage, checkOutPageObj } from '../../pageobjects/page/CheckOutPage.po';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { OrderDetailPage } from '../../pageobjects/page/OrderDetailPage.po';
import { StoreLocatorPage, storeLocatorPageObj } from '../../pageobjects/page/StoreLocatorPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("BOPIS");

/**
 * BOPIS
 */
describe('User selects store', () => {
  let storeFront : StoreFront;
  let banner : Banner;
  let dataFile;
  let CATALOG : StockholmCatalog
  const date = new Date();
  const timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

  beforeAll(()=>{
    storeFront = new StoreFront();
    banner = storeFront.banner();
    dataFile = require('./data/BOPIS.json');
    CATALOG = require('./data/StockholmProducts.json');
  });

  beforeEach(()=>{
    protractor.browser.executeScript('window.sessionStorage.clear();');
    protractor.browser.executeScript('window.localStorage.clear();');
    storeFront.navigateToHomePage();
    banner.cartDisplayed();
    banner.signInDisplayed();
    banner.checkMegamenuExists();
  });

  afterEach(()=>{
    let cart = banner.clickShopCart();
    cart.removeAllItems();
    banner.signOutIfSignedIn();
    banner = storeFront.banner();
  })

  it('test01: to view error from checkout page when attempting to continue BOPIS checkout with no stores selected', () => {
    console.log('test01: to view error from checkout page when attempting to continue BOPIS checkout with no stores selected');
    let testData = dataFile.test01;
    const category = CATALOG.Bedroom.Dressers;

    // navigates user to products page
    let megaMenu = banner.openMenu();
    let plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName,4);
    let pdp: ProductPage = plp.clickProductAtIndex(0);

    //add and go to cart
    pdp.addToCart(1);
    let cartPage : ShoppingCartPage = pdp.clickViewCart(1);

    // continue as guest to checkout.
    let loginPage : LoginPage = cartPage.clickCheckOutAsGuest(1);
    loginPage.checkoutIsDisplayed();
    let checkout : CheckOutPage = loginPage.clickCheckoutAsGuest(1);

    // select pickup method.
    checkout.pickupOption(testData.shippingMethond);
    checkout.saveAndContinueStoreLocator();
    storeFront.waitForElementPresent(checkOutPageObj.errorMessage);
    storeFront.waitForElementDisplayed(checkOutPageObj.errorMessage);
    expect(checkOutPageObj.errorMessage.getText()).toContain("Select pickup store","The error message 'select pickup store' is not shown");
  });

  it('test02: to complete a checkout using store pickup option', () => {
    log.debug('test02: to complete a checkout using store pickup option');
    const testData = dataFile.test02;
    const category = CATALOG.Bedroom.Dressers;

    // navigates user to products page
    let megaMenu = banner.openMenu();
    let plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName,4);
    let pdp: ProductPage = plp.clickProductAtIndex(0);

    // click Change store
    let storeLocator : StoreLocatorPage = pdp.clickChangeStore();

    // search stores
    storeLocator.typeSearchText(testData.searchLocation);
    storeLocator.clickStoreSearch(testData.searchLocation);

    //wait for old result gone and change to new one.
    storeFront.waitForElementPresent(storeLocatorPageObj.storeResults.first());
    storeFront.waitForTextToBeUpdatedToContain(storeLocatorPageObj.storeResults.first(), testData.storeName);

    // verify the store search results and set default store buttons are shown.
    expect(storeLocatorPageObj.storeResults.first().getText()).toContain(testData.storeName,"Wrong store results returned.");
    expect(storeLocatorPageObj.storeButtons.count()).toBeGreaterThan(1,"No store results returned.");

    // Pick a store
    const index = 0;
    storeLocator.selectPreferedStore(index);

    // Verify the preferred store shown correct on banner.
    banner.getPreferredStore().then(res=>{
        expect(res).toBe(testData.storeName, "Prefered store on banner is wrong.");
    });

    // Verify the correct my store sign is shown on chosen store div.
    storeLocator.getMyStoreSpanByIndex(index).isPresent().then(res=>{
       expect(res).toBe(true,"the my store sign is not present");
    });

    pdp.closeStoreModel();

    // ensure that product availibility is right.
    storeFront.waitForCountToBeUpdated(ProductDetailPageObjs.inventoryAvailability, 2);
    pdp.getInventoryAvailability(1).then(result => {
        expect(result).toBe(testData.availability,"The product is not in stock.");
    });

    //add and go to cart
    pdp.addToCart(1);
    let cartPage : ShoppingCartPage = pdp.clickViewCart(1);
    let loginPage : LoginPage = cartPage.clickCheckOutAsGuest(1);

    // checkout as guest button is displayed
    loginPage.checkoutIsDisplayed();
    let checkout : CheckOutPage = loginPage.clickCheckoutAsGuest(1);

    // select pickup option
    checkout.pickupOption(testData.shippingMethond);

    // verify the selected store address shown on checkout page.
    storeFront.waitForElementPresent(checkOutPageObj.selectedStoreAddress);
    storeFront.waitForElementDisplayed(checkOutPageObj.selectedStoreAddress);
    checkOutPageObj.selectedStoreAddress.isDisplayed().then(res=>{
        expect(res).toBe(true, " selected store address not displayed on checkout page");
    });

    checkout.saveAndContinueStoreLocator();

    // wait for billing form is ready.
    storeFront.waitForElementPresent(checkOutPageObj.billingForm);
    storeFront.waitForElementDisplayed(checkOutPageObj.billingForm);
    storeFront.waitForStableHeight(checkOutPageObj.billingForm);

    // type the billing information.
    let address = dataFile.address;
    checkout.typeBillingFirstName(address.firstName)
        .typeBillingLastName(address.lastName)
        .typeBillingEmail(timeStamp+address.email)
        .typeBillingPhoneNumber(address.phoneNumber)
        .typeBillingAddressLine1(address.addressLine1)
        .typeBillingCountryDropDown(address.country)
        .typeBillingCity(address.city)
        .typeBillingState(address.state)
        .typeBillingZipCode(address.zipCode)
        .waitBillingZipCodeCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    // user clicks save and continue
    checkout.clickSaveAndContinueCreateAddress();
    checkout.getGuestBillingFullAddress().then(res=>{
        const expectedBillingAddress = address.addressLine1 + ", " + address.city + ", " + address.state + " " + address.zipCode + ", " + address.country;
        expect(res).toBe(expectedBillingAddress);
    });
    // select payment method
    checkout.selectPayMethod(testData.paymentMethod);
    checkout.saveAndContinue();
    checkout.waitSaveAndContinueShippingNotDisplayed();

    // place order.
    let orderConfirm : OrderConfirmationPage = checkout.placeOrder();

    // Enters password, and verify password and clicks register
    orderConfirm.typePassword(dataFile.user.password).typeVerifyPassword(dataFile.user.password).clickRegisterUser();
    banner = new Banner(true);
    let myAccount: MyAccountPage = banner.clickMyAccount();

    // come to order detail page and verify the information.
    let orderDetail : OrderDetailPage = myAccount.goToOrderHistoryPage(1).viewOrderDetailByIndex(0);
    orderDetail.getOrderShippingMethod().then(shppingMethod => {
        expect(shppingMethod).toEqual(testData.expectedShppingMethod, "Wrong shipping method in order detail.");
    });
    orderDetail.getOrderShippingAddress().then(res=>{
        expect(res).toEqual(testData.shippingAddress, "Wrong shipping address in order detail.");
    });
    orderDetail.getOrderBillingAddress().then(res=>{
        expect(res).toEqual(address.orderDetailBillingAddress, "Wrong billing address in order detail.");
    });
    orderDetail.getOrderPaymentInfo().then(res=>{
        expect(res).toEqual(testData.expectedPaymentMethod, "Wrong payment methond in order detail.")
    });
  });

  it('test03: to use the store selection dialog from checkout page', () => {
    console.log('test03: to use the store selection dialog from checkout page');
    const testData = dataFile.test03;
    const category = CATALOG.Bedroom.Dressers;

    // navigates user to products page
    let megaMenu = banner.openMenu();
    let plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName,4);
    let pdp: ProductPage = plp.clickProductAtIndex(0);

    //add and go to cart
    pdp.addToCart(1);
    let cartPage : ShoppingCartPage = pdp.clickViewCart(1);
    let loginPage : LoginPage = cartPage.clickCheckOutAsGuest(1);

    // checkout as guest button is displayed
    loginPage.checkoutIsDisplayed();
    let checkout : CheckOutPage = loginPage.clickCheckoutAsGuest(1);

    // select pickup option.
    checkout.pickupOption(testData.shippingMethond);
    let storeLocator : StoreLocatorPage = checkout.clickSelectStore();
    checkOutPageObj.storeLocatorModal.isDisplayed().then(res=>{
        expect(res).toBe(true,"store modal is not displayed on checkout page.")
    })

    // search stores
    storeLocator.typeSearchText(testData.searchLocation);
    storeLocator.clickStoreSearch(testData.searchLocation);

    // wait for old result gone and change to new one.
    storeFront.waitForElementPresent(storeLocatorPageObj.storeResults.first());
    storeFront.waitForTextToBeUpdatedToContain(storeLocatorPageObj.storeResults.first(), testData.storeName);

    expect(storeLocatorPageObj.storeResults.first().getText()).toContain(testData.storeName,"Wrong store results returned.");
    expect(storeLocatorPageObj.storeButtons.count()).toBeGreaterThan(1,"No store results returned.");

    // Pick a store as prefered store.
    const index = 0;
    storeLocator.selectPreferedStore(index);

    // verify the perferred store on banner.
    banner.getPreferredStore().then(res=>{
        expect(res).toBe(testData.storeName, "Prefered store on banner is wrong.");
    });

    storeLocator.getMyStoreSpanByIndex(index).isPresent().then(res=>{
        expect(res).toBe(true,"the my store sign is not present");
    });

    checkout.closeStoreModel();

    // vertify the selected store is shown.
    storeFront.waitForElementPresent(checkOutPageObj.selectedStoreAddress);
    storeFront.waitForElementDisplayed(checkOutPageObj.selectedStoreAddress);
    checkOutPageObj.selectedStoreAddress.isDisplayed().then(res=>{
        expect(res).toBe(true, " selected store address not displayed on checkout page");
    });
    checkout.saveAndContinueStoreLocator();

    // wait for billing form is ready.
    storeFront.waitForElementPresent(checkOutPageObj.billingForm);
    storeFront.waitForElementDisplayed(checkOutPageObj.billingForm);
    storeFront.waitForStableHeight(checkOutPageObj.billingForm);

    // filling the billing address.
    let address = dataFile.address;
    checkout.typeBillingFirstName(address.firstName)
        .typeBillingLastName(address.lastName)
        .typeBillingEmail(timeStamp+address.email)
        .typeBillingPhoneNumber(address.phoneNumber)
        .typeBillingAddressLine1(address.addressLine1)
        .typeBillingCountryDropDown(address.country)
        .typeBillingCity(address.city)
        .typeBillingState(address.state)
        .typeBillingZipCode(address.zipCode)
        .waitBillingZipCodeCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    // clicks save and continue
    checkout.clickSaveAndContinueCreateAddress();
    checkout.getGuestBillingFullAddress().then(res=>{
        const expectedBillingAddress = address.addressLine1 + ", " + address.city + ", " + address.state + " " + address.zipCode + ", " + address.country;
        expect(res).toBe(expectedBillingAddress,"Wrong billing address is shown.");
    });

    // select payment method
    checkout.selectPayMethod(testData.paymentMethod);
    checkout.saveAndContinue();
    checkout.waitSaveAndContinueShippingNotDisplayed();

    // place order.
    let orderConfirm : OrderConfirmationPage = checkout.placeOrder();
  });

  it('test04: to view store detail from selecting store', () => {
    console.log('test04: to view store detail from selecting store');
        let testData = dataFile.test04;
        const category = CATALOG.Bedroom.Dressers;

        // navigates user to products page
        let megaMenu = banner.openMenu();
        let plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName,4);
        let pdp: ProductPage = plp.clickProductAtIndex(0);

        // click Change store
        let storeLocator : StoreLocatorPage = pdp.clickChangeStore();
        storeFront.waitForElementPresent(storeLocatorPageObj.storeResults.first());

        // search stores
        storeLocator.typeSearchText(testData.searchLocation);
        storeLocator.clickStoreSearch(testData.searchLocation);

        //wait for old result gone and change to new one.
        storeFront.waitForElementPresent(storeLocatorPageObj.storeResults.first());
        storeFront.waitForTextToBeUpdatedToContain(storeLocatorPageObj.storeResults.first(), testData.storeName);

        // Pick a store
        const index = 0;
        storeLocator.clickStoreInfoEx(index);
        let storeAddInfo = storeLocatorPageObj.storeAddInfo.get(index);

        // wait for store additional info to be expanded completely.
        storeFront.waitForElementPresent(storeAddInfo);
        storeFront.waitForElementDisplayed(storeAddInfo);
        storeFront.waitForStableHeight(storeAddInfo);

        // verify that the store entry section expanded
        storeAddInfo.isDisplayed().then(res=>{
            expect(res).toBe(true, "the store additional info is not shown.");
        });

        //  verify the phone number and service section
        storeLocator.getStorePhoneNumber(0).then(res=>{
            expect(res).toBe(testData.storePhone, "Wrong store phone is shown.")
        });

        storeLocator.getStoreService(0).then(res=>{
            expect(res).toBe(testData.storeServices, "Wrong store servics is shown.");
        });
        pdp.closeStoreModel();
  });
});