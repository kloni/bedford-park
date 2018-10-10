import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { WishListPage } from '../../pageobjects/page/WishListPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { NewWishListDialog } from '../../pageobjects/dialog/NewWishListDialog.po';
import { SignInModal } from '../../pageobjects/dialog/SignInModal.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("Wish List");

/**
 * Wish List
 *
 * Access control that needs to be tested by UT and Manual testing
 * CSR can view shopper's wish list on behalf
 * CSR can modify shopper's wish list - browse and modify the shopper's wish list
 *
 * Try to add duplicate product to the wish list, view no change
 */

describe('Shopper can', () => {
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
    var dataFile = require('./data/WishList.json');

    var wishListName = dataFile.testWishListName;
    var defaultWishListName = 'Default Wishlist';

    const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
    let storeFront: StoreFront = new StoreFront();
    var banner : Banner = new Banner();

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    beforeAll(function () {
        //register a shopper
        banner.signInDisplayed();
        var register = banner.clickSignIn(RegistrationPage);
        console.log(timeStamp + dataFile.user.email)
        register.typeFirstName(dataFile.user.firstName);
        register.typeLastName(dataFile.user.lastName + timeStamp);
        register.typeEmail(timeStamp + dataFile.user.email);
        register.typePassword(dataFile.user.password);
        register.typeVerifyPassword(dataFile.user.password);
        register.clickRegister();
    });

    beforeEach(function () {
        storeFront.navigateToHomePage();
        banner.cartDisplayed();
        banner.signInDisplayed();
        banner.checkMegamenuExists();
    });

    afterAll(function () {
        var banner = new Banner();
        banner.signOutIfSignedIn();
    });

    it('add items to wish lists from product/bundle/kit detail page: test01', () => {
        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        pdp.getShortDescription().then(result => {
            expect(result).toBe(product1.shortDescription);
        });

        pdp.getProductOfferPrice().then(result => {
            expect(result).toBe("$" + numberWithCommas(sku1.priceOffering));
        });

        //add product to wish list, open the wishlist dropdown
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //select the default wishlist
        pdp.selectWishList();

        // verify the confirmation modal message for wish list
        pdp.getWishListConfirmationModal().then(confirmation => {
           expect(confirmation).toContain(dataFile.wishListConfirmationMsg);
        });

        //Not Supported for 3Q- this has to be done after bundle/ kit support has been added
        //navigate to bundle page
        //add product to wish list (one by one?)

        //navigate to kit page
        //add producft to wish list

        //go to wishlist from the confirmation modal
        let wishListPage : WishListPage = pdp.viewWishList();

        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        let product = wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });

        //check the product price
        product.getPrice().then(price=> {
            expect(price).toEqual("$" + numberWithCommas(sku1.priceOffering));
        });

        //remove the product
        wishListPage= product.clickRemove();

        //empty wishlist label is displayed
        wishListPage.wishListEmpty().then(empty=> {
            expect(empty).toEqual(true);
        });
    });

    it('add items to wish list from shopping cart page: test02', () => {
        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //add to cart
        pdp.addToCart(1);

        //navigate to cart
        pdp.getConfirmationModal().then(confirmation => {
            expect(confirmation).toContain(dataFile.cartConfirmation);
        });
        let shoppingCartPage =pdp.clickViewCart(1);

        //click on 'add to wish list' link on item at index 0
        shoppingCartPage.moveToWishListDisplayedByIndex(0).then(displayed => {
            expect(displayed).toEqual(true);
        });

        //click move to wishlist
        shoppingCartPage.clickMoveToWishListByIndex(0).clickOnWishListName(0);

        //select the default wishlist
        shoppingCartPage.moveToWishListNotDisplayedByIndex(0);

        //now cart empty
        shoppingCartPage.cartEmpty().then(empty=>{
            expect(empty).toEqual(true);
        });

        //Verify the item removed from the cart
        shoppingCartPage.getNumberOfProductsLoaded().then(count => {
            expect(count).toEqual(0);
        });

        //go to myaccount page, go to withlist page
        let wishListPage = banner.clickMyAccount().goToWishListPage();

        //verify the item is in the default wish list
        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        let product = wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });

        //check the product price
        product.getPrice().then(price=> {
            expect(price).toEqual("$" + numberWithCommas(sku1.priceOffering));
        });

        //remove the product
        wishListPage= product.clickRemove();

        //empty wishlist label is displayed
        wishListPage.wishListEmpty().then(empty=> {
            expect(empty).toEqual(true);
        });
    });

    it('create a new wish list from wish list page and a product page: test03', () => {

        let testWishListName = wishListName+'3';
        let testWishListName2 = wishListName+'3-2';
        let testWishListName3 = wishListName+'3-3';

        //1: Create a wishlist from Wishlist page
        //go to wishlist page
        let wishListPage : WishListPage = banner.clickMyAccount().goToWishListPage();

        //create a new wishlist
        let newWishListDialog: NewWishListDialog = wishListPage.createNewWishList();
        newWishListDialog.enterWishListName(testWishListName).save(WishListPage);
        wishListPage.wishListEmpty()
        wishListPage.renameInputDisplayed();

        //2: Create a wishlist from product page
        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //add product to wish list, click on the Wishlist button
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //Create a new wishlist
        newWishListDialog = pdp.creaetNewWishList();
        newWishListDialog.enterWishListName(testWishListName2).save(ProductPage);

        //add the product to the newly created (created in product page) wishlist
        pdp.addToWishList().selectWishList(testWishListName2);
        pdp.getWishListConfirmationModal();

        //add the product to the newly created (created in wishlist page) wishlist
        pdp.addToWishList().selectWishList(testWishListName);
        pdp.getWishListConfirmationModal();

        // go to wishlist page from the confirmation modal
        wishListPage = pdp.viewWishList();

        // go to the first new wishlist
        let wishListProductCard = wishListPage.wishListDropdown(testWishListName2).getProductAtIndex(0);

        //verify the product is in the wishlist
        wishListProductCard.getProductName().then(name=>{
            expect(name).toEqual(product1.name);
        });

        //go to the second new wishlist
        wishListPage.wishListDropdown(testWishListName).getProductAtIndex(0);

        //verify the product is in the wishlist
        wishListProductCard.getProductName().then(name=>{
            expect(name).toEqual(product1.name);
        });

        //3: create a wishlist from a product's action menu
        newWishListDialog= wishListProductCard.openActionMenu().createNewWishList();
        newWishListDialog.enterWishListName(testWishListName3).save(WishListPage);
        wishListPage.waitForWishListNametoUpdate(testWishListName3);
        wishListPage.getWishListName().then(name => {
            expect(name).toEqual(testWishListName3);
        });

        wishListPage.wishListDropdown(testWishListName3);

    });

    //has defect
    it('create a new wish list with invalid data: test04', () => {

        //go to withlist page
        let wishListPage : WishListPage = banner.clickMyAccount().goToWishListPage();

        //attempt to create a wishlist wish a blank name
        let newWishListDialog: NewWishListDialog = wishListPage.createNewWishList();
        newWishListDialog.enterWishListName(' ').removeFocus();

        //check the css highlight
        newWishListDialog.waitForInvalidCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
        newWishListDialog.getNameCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
        });

        //input is not valid, save button is disabled
        newWishListDialog.saveButtonDisabled().then(notClickable=>{
            expect(notClickable).toEqual(true);
        });

        //check error message?
        //cancel to close the dialog
        newWishListDialog.cancel(WishListPage);
        newWishListDialog.notDisplayed().then(notDisplayed =>{
            expect(notDisplayed).toEqual(true);
        });

        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //add product to wish list
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //Open the new wishlist creation dialog
        newWishListDialog = pdp.creaetNewWishList();

        //enter invalid name
        newWishListDialog.enterWishListName(' ').removeFocus();

        //check the css highlight
        newWishListDialog.waitForInvalidCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
        newWishListDialog.getNameCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
        });

        //save button disabled
        newWishListDialog.saveButtonDisabled().then(notClickable=>{
            expect(notClickable).toEqual(true);
        });

        //cancel to close the dialog
        newWishListDialog.close(ProductPage);

        //Dialog not dislayed
        newWishListDialog.notDisplayed().then(notDisplayed =>{
            expect(notDisplayed).toEqual(true);
        });

    });

    it('change the withlist name: test05', () => {
        let testWishListName = wishListName + '05';
        let testWishListName2 = wishListName + '05-2';

        //go to withlist page
        let wishListPage : WishListPage = banner.clickMyAccount().goToWishListPage();

        //attempt to create a wishlist wish a blank name
        let newWishListDialog: NewWishListDialog = wishListPage.createNewWishList();
        newWishListDialog.enterWishListName(testWishListName).save(WishListPage).waitForWishListNametoUpdate(testWishListName);

        wishListPage.getWishListName().then(name => {
            expect(name).toEqual(testWishListName);
        });

        wishListPage.wishListDropdown(testWishListName).clickRenameButton().renameInputDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        wishListPage.clear().enterName(testWishListName2);
        browser.sleep(3000);
        wishListPage.removeFocus().waitForWishListNametoUpdate(testWishListName2);

        wishListPage.getWishListName().then(name=>{
            expect(name).toEqual(testWishListName2);
        });

        wishListPage.wishListDropdown(testWishListName2);
        wishListPage.clickDelete();

        wishListPage.waitForWishListNametoUpdate(defaultWishListName).getWishListName().then(name => {
            expect(name).toEqual(defaultWishListName);
        });
    });

    it('delete a wish list: test06', () => {
        let testWishList4= wishListName + '04';

        //go to withlist page
        let wishListPage : WishListPage = banner.clickMyAccount().goToWishListPage();

        // create a new wishlist
        let newWishListDialog: NewWishListDialog = wishListPage.createNewWishList();
        newWishListDialog.enterWishListName(testWishList4).save(WishListPage).waitForWishListNametoUpdate(testWishList4);
        wishListPage.wishListDropdown(testWishList4).waitForWishListNametoUpdate(testWishList4);

        //check the name of the new wishlist
        wishListPage.getWishListName().then(name => {
            expect(name).toEqual(testWishList4);
        });

        //delete button is displayed
        wishListPage.deleteWishListButtonDisplayed().then(displayed => {
            expect(displayed).toEqual(displayed);
        });

        //click delete
        wishListPage.clickDelete();

        //automatically the page is refreshed with default wishlist, and there is no delete button displayed for defualt wishlist
        wishListPage.waitForWishListNametoUpdate(defaultWishListName).deleteWishListButtonNotDisplayed().then(notDisplayed => {
            expect(notDisplayed).toEqual(true);
        });
    });

    it('navigate to a product from wish list: test07', () => {
        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        pdp.getShortDescription().then(result => {
            expect(result).toBe(product1.shortDescription);
        });

        pdp.getProductOfferPrice().then(result => {
            expect(result).toBe("$" + numberWithCommas(sku1.priceOffering));
        });

        //add product to wish list, open the wishlist dropdown
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //select the default wishlist
        pdp.selectWishList();

        // verify the confirmation modal message for wish list
        pdp.getWishListConfirmationModal().then(confirmation => {
        expect(confirmation).toContain(dataFile.wishListConfirmationMsg);
        });

        //go to wishlist from the confirmation modal
        let wishListPage : WishListPage = pdp.viewWishList();

        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        let product = wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });

        pdp =product.clickImage();
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        browser.navigate().back();

        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });

        pdp =product.clickProductName();
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

    });

    it('add a product to the cart from wish list: test08', () => {

        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        pdp.getShortDescription().then(result => {
            expect(result).toBe(product1.shortDescription);
        });

        pdp.getProductOfferPrice().then(result => {
            expect(result).toBe("$" + numberWithCommas(sku1.priceOffering));
        });

        //add product to wish list, open the wishlist dropdown
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //select the default wishlist
        pdp.selectWishList();

        // verify the confirmation modal message for wish list
        pdp.getWishListConfirmationModal().then(confirmation => {
        expect(confirmation).toContain(dataFile.wishListConfirmationMsg);
        });

        //go to wishlist from the confirmation modal
        let wishListPage : WishListPage = pdp.viewWishList();

        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        let product = wishListPage.getProductAtIndex(0);

        //click on the 'Add to cart' button
        product.clickAddToCart();

        //Add to cart is not clickable
        product.addToCartButtonDisabled().then(disabled => {
            expect(disabled).toEqual(true);
        });

        //wait for 10 seconds
        browser.sleep(10000);

        //Add to cart is clickable again
        product.addToCartButtonEnabled();

        //go to cart
        let shoppingCartPage : ShoppingCartPage=  banner.clickShopCart(1);

		shoppingCartPage.getProductNameAtIndex(0).then(name => {
			expect(name).toEqual(product1.name);
        });

        //remove all items from cart
        shoppingCartPage.removeAllItems();
        shoppingCartPage.cartEmpty();
    });

    it('move a product from wishlist to another wishlist: test09', () => {
        let testWishListName = wishListName + '09';
        //go to withlist page
        let wishListPage : WishListPage = banner.clickMyAccount().goToWishListPage();

        //create a new wishlist
        let newWishListDialog: NewWishListDialog = wishListPage.createNewWishList();
        newWishListDialog.enterWishListName(testWishListName).save(WishListPage).waitForWishListNametoUpdate(testWishListName);

        wishListPage.getWishListName().then(name => {
            expect(name).toEqual(testWishListName);
        });

        // wishListPage.wishListDropdown('gracewishlist5');

        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        pdp.getShortDescription().then(result => {
            expect(result).toBe(product1.shortDescription);
        });

        //add product to wish list, open the wishlist dropdown
        pdp = pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //select the newly created wishlist
        pdp.selectWishList(testWishListName);

        // verify the confirmation modal message for wish list
        pdp.getWishListConfirmationModal().then(confirmation => {
           expect(confirmation).toContain(dataFile.wishListConfirmationMsg);
        });

        //go to new wishlist from the confirmation modal
        wishListPage = pdp.viewWishList().waitForWishListNametoUpdate(testWishListName);

        //select the new wishlist from the dropdown
        wishListPage.wishListDropdown(testWishListName);

        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        let product = wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });

        //open the action menu
        product.openActionMenu().actinoMenuDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //close the action menu
        product.closeActionMenu().actinoMenuDisplayed().then(displayed => {
            expect(displayed).toEqual(false);
        });

        //open the action menu, and click on the 'Default Wishlist' option
        product.openActionMenu().moveToWishList();

        //now the item is moved to default wishlist
        //check the number of items added to the wishlist is correct
        wishListPage.getNumberOfItems(0).then(count => {
            expect(count).toEqual(0);
        });

        //go to default wishlist and check the right product is present
        wishListPage.wishListDropdown(defaultWishListName);
        wishListPage.getNumberOfItems(1).then(count => {
            expect(count).toEqual(1);
        });

        //Get the item in position 0
        product= wishListPage.getProductAtIndex(0);

        //check the product name
        product.getProductName().then(name=> {
            expect(name).toEqual(product1.name);
        });
    });

    //has defect
    it('attempt to use wishlist as a guest user: test10', () => {
        //sign out, need to use guest session
        banner.signOutIfSignedIn();
        banner.signInDisplayed();

        //navigate to product page
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //add product to wish list, as a guuest, sign in modal will pop up
        let signInModal : SignInModal = pdp.addToWishListAsAGust();

        //navigate to the registration page
        let r : RegistrationPage=  signInModal.clickRegister();
        r.getSignInPageLabel().then(text =>{
            expect(text).toEqual('Returning Customer');
        });
        signInModal.waitForDialogNotDisplayed();


        //navigate to product page again
        category = CATALOG.Bedroom.Dressers;
        product1 = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        sku1 = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        megaMenu = banner.openMenu();
        plp = megaMenu.navigateToPLP(category.subCategoryName, 4);
        pdp = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //add product to wish list, as a guuest, sign in modal will pop up
        signInModal = pdp.addToWishListAsAGust();

        //login error needed! user tries to login with invalid login
        signInModal.typeUserName(dataFile.invalidUserName).typePw(dataFile.invalidUserPw).clickSignIn();
        //some error check needed

        //shopper signs in with correcrt login
        signInModal.typeUserName(timeStamp + dataFile.user.email).typePw(dataFile.user.password).clickSignIn();
        signInModal.waitForDialogNotDisplayed();

        //add product to wish list, now open the wishlist dropdown
        pdp.addToWishList();

        //wishlist dropdown is displayed
        pdp.wishListDropdownDisplayed().then(displayed => {
            expect(displayed).toEqual(true);
        });

        //select the default wishlist
        pdp.selectWishList();

        // verify the confirmation modal message for wish list
        pdp.getWishListConfirmationModal().then(confirmation => {
           expect(confirmation).toContain(dataFile.wishListConfirmationMsg);
        });

    });

});