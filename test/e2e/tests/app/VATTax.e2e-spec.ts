import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { BundlePage } from '../../pageobjects/page/BundlePage.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { KitPage } from '../../pageobjects/page/KitPage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { OrderConfirmationPage } from '../../pageobjects/page/OrderConfirmationPage.po';
import { OrderDetailPage } from '../../pageobjects/page/OrderDetailPage.po';
import { OrderHistoryPage } from '../../pageobjects/page/OrderHistoryPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { Sku, StockholmCatalog, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';
import { ProductFeatured } from '../../pageobjects/widget/ProductFeatured.po';
import { MerchandisingAssociation } from '../../pageobjects/widget/MerchandisingAssociation.po';

var log4js = require("log4js");
var log = log4js.getLogger("VAT tax");

interface Bundle {
    bundleName: string,
    bundleSku: string,
    bundleShortDescription: string,
    bundleLongDescription: string,
    slideImages: string[],
    bundleProducts: string[];
}

describe('User views VAT tax included text where prices are displayed ', () => {

    let storeFront: StoreFront = new StoreFront();
    const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
    const BUNDLES = require('./data/StockholmBundles.json');
    var dataFile = require('./data/VATTax.json');
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
    //bundle will be populated with sku and product data for tcs
    let bundle: [Sku[], StockholmProduct][] = [];

    let sProduct: StockholmProduct;//product to be pushed into bundle
    let skus: Sku[] = [];          //skus to be pushed into bundle

    //push target skues and product into bundle array
    bundle.push([skus, sProduct]);

    var maxProducts = 12;

    beforeAll(function () {
        let base = new BaseTest();
        let storeFront: StoreFront = new StoreFront();
    });

    beforeEach(function () {
    });

    it('in catalog browsing page: test01', () => {
        console.log('in catalog browsing page: test01');

        let category = CATALOG.Bedroom.Dressers;
        //Go to a product page
        storeFront = new StoreFront();
        let banner = storeFront.banner();

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //verify 'VAT incl' text displayed
        pdp.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        //this portion is commented out because navigate to kit and bundle not currently working

        // //Go to a kit page
        // megaMenu = banner.openMenu();

        // let testData = dataFile.test01;
        // let categoryKit = CATALOG.LivingRoom.LivingRoomFurniture;

        // //navigate to kit product page
        // plp = megaMenu.navigateToPLP(categoryKit.subCategoryName, 12);
        // plp.goToPage('3');
        // plp = new ProductListingPage();
        // plp.clickProductAtIndex(3);
        // let kitPage = new KitPage();

        // //verify 'VAT incl' text displayed for each component of the kit
        // kitPage.VATTaxDisplayed().then(displayed => {
        //     expect(displayed).toBeTruthy();
        // });

        // //go to a bundle page
        // megaMenu = banner.openMenu();
        // plp = megaMenu.navigateToPLP(category.subCategoryName, 12);

        // plp.goToPage('3');

        // plp = new ProductListingPage();
        // plp.clickProductAtIndex(2);

        // let bundlePage = new BundlePage(bundle.length);

        // //verify 'VAT incl' text displayed  for each component of the bundle
        // bundlePage.VATTaxDisplayed().then(displayed => {
        //     expect(displayed).toBeTruthy();
        // });

        //Go to Product listing pages
        let categoryPlp = CATALOG.LivingRoom.LivingRoomFurniture;
        megaMenu = banner.openMenu();

        plp = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

        //verify 'VAT incl' text displayed for each product
        plp.getNumberOfVATTaxDisplayed().then(number => {
            expect(number).toBe(4);
        });

    })

    it('in user page: test02', () => {
        console.log('in user page: test02');

        let category = CATALOG.Bedroom.Dressers;
        let testData = dataFile.test02;
        let user = dataFile.user01;
        //Go to a product page
        storeFront = new StoreFront();
        let banner = storeFront.banner();

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);
        pdp.addToCart(1);
        var cart: ShoppingCartPage = pdp.clickViewCart(1);

        //verify VAT TAX shows in shop cart page
        cart.VATTaxDisplayedByIndex().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        // guest clicks on check out and the sign in page is loaded
        let loginPage: LoginPage = cart.clickCheckOutAsGuest();

        // checkout as guest button is displayed
        loginPage.checkoutIsDisplayed().then(isDisplayed => {
            expect(isDisplayed).toBe(true, " checkout as guest is not displayed on signin page");
        });

        //WHEN user clicks on checkout as guest checkout page is loaded
        let checkout: CheckOutPage = loginPage.clickCheckoutAsGuest();

        /**
         * All empty
         * phone, address2, and country are valid
         */

        //WHEN user inputs all manditory fields for shipping and billing address
        let address = user.addressBook[0];
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

        //THEN waits for total to update and verifies subtotal, discount, shipping and total
        checkout.waitForTotalToUpdate(Number(testData.total1));

        //verify VAT TAX shows in checkout page
        checkout.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        //WHEN user clicks on place order navigates to the order page
        let orderConfirmation: OrderConfirmationPage = checkout.placeOrder();

        //register in order confirmation page
        //WHEN guest enters valid email, password, and verify password and clicks register
        orderConfirmation.typePassword(user.password).typeVerifyPassword(user.password).clickRegisterUser();

        //navigates to my accounts page
        let myAccount: MyAccountPage = new Banner(true).clickMyAccount();

        //go to order history page
        let orderHistory: OrderHistoryPage = myAccount.goToOrderHistoryPage(1);

        //verify 'VAT incl' text displayed beside the order total <- check behaviour with Naisargi
        orderHistory.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        //click on order detail
        //THEN click on the order Id to navigate to the order details page
        let orderDetails: OrderDetailPage = orderHistory.viewOrderDetailByIndex(0);


        //verify 'VAT incl' text displayed beside the order total
        orderDetails.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


    });

    it('in product recommendation: test03', () => {

        console.log('in product recommendation: test03');
        let category = CATALOG.LivingRoom.LivingRoomFurniture;

        //View product recommenation in the home page
        storeFront = new StoreFront();

        //verify 'VAT incl' text displayed for each product
        let pRecommended: ProductRecommended = new ProductRecommended(0);

        pRecommended.isDisplayed().then(result => {
            expect(result).toBe(true);
        });

        pRecommended.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        pRecommended = new ProductRecommended(1);

        pRecommended.isDisplayed().then(result => {
            expect(result).toBe(true);
        });

        pRecommended.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        pRecommended = new ProductRecommended(2);

        pRecommended.isDisplayed().then(result => {
            expect(result).toBe(true);
        });

        pRecommended.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        //view featured product recommendatinon in the home page
        let pFeatured: ProductFeatured = new ProductFeatured();

        pFeatured.isDisplayed().then(result => {
            expect(result).toBe(true);
        });

        //verify 'VAT incl' text displayed
        pFeatured.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        //go to a product page with merchandising association

        //Navigate to a product that has a merchandising association widget


        let banner = storeFront.banner();
        let product1MA: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Modern Armchair"].productInfo;
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);
        plp.goToNextPage();
        plp = new ProductListingPage(12);

        plp.clickProductAtIndex(9);
        let pdp: ProductPage = new ProductPage(product1MA.name);

        let merchandiseAssociation: MerchandisingAssociation = new MerchandisingAssociation(0);

        //verify 'VAT incl' text displayed for each product
        merchandiseAssociation.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        merchandiseAssociation = new MerchandisingAssociation(1);

        merchandiseAssociation.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });


        merchandiseAssociation = new MerchandisingAssociation(2);

        merchandiseAssociation.VATTaxDisplayed().then(displayed => {
            expect(displayed).toBeTruthy();
        });

    });

});
