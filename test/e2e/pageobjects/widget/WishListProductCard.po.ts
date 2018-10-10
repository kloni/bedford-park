import { by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { ProductPage } from '../page/ProductPage.po';
import { WishListPage } from '../page/WishListPage.po';
import { NewWishListDialog } from '../dialog/NewWishListDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("WishListProductCard");


export const WishListProductCardObjs = {
    card: element.all(by.css("[id^=wishlist_productCard_div_]")),
    productName : "[id^=wishlist_productCard_name_]",
    productPrice: "[id^=productCard_price_]",
    removeButton: "[id^=wishlist_productCard_remove_]",
    productImage: "[id^=wishlist_productCard_fullImage_]",
    addToCart :"[id^=wishlist_productCard_addtocart_]",

    actionMenuButton :"[id^=wishlist_productCard_action_button_]",
    actionMenu :"[id^=wishlist_productCard_menu_]",
    actionMenuCloseButton: "[id^=wishlist_productCard_close_button_]",
    actionMenuWishList: "[id^=wishlist_productCard_wishlist_name_]",
    actionMenuNewWishList: "[id^=wishlist_productCard_newWishList_]"
};

export class WishListProductCard extends BaseTest {
    index: number = 0;

    constructor(i: number = 0) {
        super();
        this.index = i;
        this.waitForElementPresent(WishListProductCardObjs.card.get(this.index));
    }

    getProductName(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.productName)).first().getText().then(productName => {
                console.log('productName:', productName);
                resolve(productName);
            })
        });
    }

    getPrice(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.productPrice)).first().getText().then(productPrice => {
                console.log('productPrice:', productPrice);
                resolve(productPrice);
            })
        });
    }

    clickRemove():WishListPage{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.removeButton)).first().click();
        return new WishListPage();
    }

    clickImage():ProductPage{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.productImage)).first().click();
        return new ProductPage();
    }

    clickProductName(): ProductPage{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.productName)).first().click();
        return new ProductPage();
    }

    clickAddToCart(): WishListProductCard{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.addToCart)).first().click();
        return this;
    }

    addToCartButtonDisabled(): Promise<boolean> {
        return this.waitForElementNotClickable(WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.addToCart)).first());
    }

    addToCartButtonEnabled() {
        this.verifyElementEnabled(WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.addToCart)).first());
    }


    openActionMenu(): WishListProductCard{
        let actionButton = WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenuButton)).first();
        this.waitForElementEnabled(actionButton);
        this.waitForElementDisplayed(actionButton);
        actionButton.click();

        let menu = WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenu)).first();
        this.waitForElementDisplayed(menu);
        return this;
    }

    actinoMenuDisplayed():Promise<boolean>{
        let menu = WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenu)).first();
        return new Promise<boolean>((resolve, reject) => {
            menu.isDisplayed().then(displayed => {
                console.log('Action menu Displayed:', displayed);
                resolve(displayed);
            });
        });
    }

    closeActionMenu(): WishListProductCard{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenuCloseButton)).first().click();

        let menu = WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenu)).first();
        this.waitForElementNotDisplayed(menu);
        return this;
    }

    moveToWishList(wishListName: string  = 'Default Wishlist'): WishListProductCard{
        WishListProductCardObjs.card.get(this.index).all(by.cssContainingText(WishListProductCardObjs.actionMenuWishList, wishListName)).first().click().then(function () {
            console.log("Click on wish list with text: ", wishListName);
        });
        return this;
    }

    createNewWishList(): NewWishListDialog{
        WishListProductCardObjs.card.get(this.index).all(by.css(WishListProductCardObjs.actionMenuNewWishList)).first().click().then(function () {
            console.log("Click on Creat New wish list");
        });
        return new NewWishListDialog();
    }


}