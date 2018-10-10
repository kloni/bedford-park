import {Dialog} from  './Dialog.po';
import { browser,by, element } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("NewWishListDialog");


export const newWishListDialogObjs = {
    dialog : element.all(by.css("[id^=newWishListModal_]")).first(),
    nameInput : element.all(by.css("[id^=newWishList_name_]")).first(),
    cancel: element.all(by.css("[id^=newWishList_cancel_]")).first(),
    save: element.all(by.css("[id^=newWishList_save_]")).first(),
    heading: element.all(by.cssContainingText(".new-wishlist-modal-top", "New wishlist")).first(),
    close: element.all(by.css("[id^=wishlist_newwishlist_close_button_]")).first()
  };

export class NewWishListDialog extends Dialog {

  constructor(){
    super();
    this.waitForElementDisplayed(newWishListDialogObjs.dialog);
    this.waitForElementDisplayed(newWishListDialogObjs.nameInput);
    this.waitForElementDisplayed(newWishListDialogObjs.cancel);
    this.waitForElementDisplayed(newWishListDialogObjs.save);

  }

  enterWishListName(name: string): NewWishListDialog{
      newWishListDialogObjs.nameInput.sendKeys(name);
      return this;
  }

    save<T>(type: { new(): T }): T {
        newWishListDialogObjs.save.click();
        return new type();
    }

    saveButtonDisabled(): Promise<boolean>{
        return this.waitForElementNotClickable(newWishListDialogObjs.save);
    }

    notDisplayed(): Promise<boolean>{
        this.waitForElementNotPresent(newWishListDialogObjs.dialog);
        return this.waitForElementNotDisplayed(newWishListDialogObjs.dialog);
    }

    cancel<T>(type: { new(): T }): T  {
        newWishListDialogObjs.cancel.click();
        return new type();
    }

    close<T>(type: { new(): T }): T  {
        newWishListDialogObjs.close.click();
        return new type();
    }

    waitForInvalidCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
            return this.waitForCssPropertyToUpdate(newWishListDialogObjs.nameInput, cssStyleProperty, cssValue);
    }

    getNameCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, newWishListDialogObjs.nameInput);
    }
    removeFocus(): NewWishListDialog{
        newWishListDialogObjs.heading.click();
        return this;
    }

}