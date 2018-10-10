import { browser, by, element, ElementArrayFinder, ElementFinder, protractor } from 'protractor';
import { BaseTest } from  '../base/BaseTest.po';
import { WishListProductCard } from '../widget/WishListProductCard.po';
import { NewWishListDialog } from '../dialog/NewWishListDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("WishList");

export const wishListPageObjs = {
    label: element.all(by.css("[id^=wishlist_page_label_]")).first(),
    wishListName: element.all(by.css("[id^=wishlist_name_label_]")).first(),
    createNewButton: element.all(by.css("[id^=wishlist_newwishlist_button_]")).first(),

    card: element.all(by.css("[id^=wishlist_productCard_div_]")),
    emptyWishList: element.all(by.css("[id^=wishlist_emptywishlist_]")).first(),

    wishListDropdown: element.all(by.css("[id^=wishlist_name_dropdown_]")).first(),
    wishListRenameButton: element.all(by.css("[id^=wishlist_name_edit_button_]")).first(),
    wishListRenameInput: element.all(by.css("[id^=wishlist_rename_input_]")).first(),
    wishListDeleteButton : element.all(by.css("[id^=wishlist_delete_button_]")).first(),
    deleteConfirm: "[id^=deleteWishList_delete_]",
    deleteWishListModal: "[id^=deleteWishListModal]"
}

export class WishListPage extends BaseTest {

    constructor() {
        super();
        this.waitForElementDisplayed(wishListPageObjs.label);
        this.waitForElementDisplayed(wishListPageObjs.wishListName);
        this.waitForElementDisplayed(wishListPageObjs.createNewButton);
    }

    getProductAtIndex(index: number): WishListProductCard{
       return new WishListProductCard(index);
    }

    getNumberOfItems(numberOfProducts: number): Promise<number>{
        return new Promise<number>((resolve, reject) => {
            this.waitForAllProductsLoaded(wishListPageObjs.card, numberOfProducts, 10000);
            wishListPageObjs.card.count().then(count => {
                resolve(count);
            });
        });
    }

    wishListEmpty():Promise<boolean>{
        return this.waitForElementDisplayed(wishListPageObjs.emptyWishList);
    }


    wishListDropdown(option : string = 'Default Wishlist'): WishListPage{
        element.all(by.css("[id^=wishlist_name_dropdown_]")).first().element(by.cssContainingText('option', option)).click();
        return new WishListPage();
    }

    createNewWishList(): NewWishListDialog{
        wishListPageObjs.createNewButton.click();
        return new NewWishListDialog();
    }

    getWishListName(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            wishListPageObjs.wishListName.getText().then(name => {
                resolve(name);
            });
        });
    }

    clickRenameButton(): WishListPage{
        wishListPageObjs.wishListRenameButton.click();
        return this;
    }

    renameInputDisplayed(): Promise<boolean>{
        return this.waitForElementDisplayed(wishListPageObjs.wishListRenameInput);
    }

    clear(): WishListPage{
        wishListPageObjs.wishListRenameInput.clear();
        return this;
    }

    enterName(name:string): WishListPage{
        wishListPageObjs.wishListRenameInput.sendKeys(name);
        return this;
    }

    removeFocus():WishListPage{
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
        wishListPageObjs.label.click();
        wishListPageObjs.emptyWishList.click();
        return this;
    }

    waitForWishListNametoUpdate(name:string):WishListPage{
        this.waitForTextToBeUpdated(wishListPageObjs.wishListName, name);
        return this;
    }

    deleteWishListButtonDisplayed(): Promise<boolean>{
        return this.waitForElementDisplayed(wishListPageObjs.wishListDeleteButton);
    }

    deleteWishListButtonNotDisplayed(): Promise<boolean>{
        return this.waitForElementNotPresent(wishListPageObjs.wishListDeleteButton);
    }


    clickDelete(): WishListPage{
        wishListPageObjs.wishListDeleteButton.click();
        return this;
    }

    confirmDelete(){
        this.waitForElementDisplayed(element.all(by.css(wishListPageObjs.deleteWishListModal)).first());
        element.all(by.css(wishListPageObjs.deleteConfirm)).first().click().then(function () {
            console.log("Click on delete confirmation dialog");
        });
        this.waitForElementNotDisplayed(element.all(by.css(wishListPageObjs.deleteWishListModal)).first());
        return this;
    }

}

