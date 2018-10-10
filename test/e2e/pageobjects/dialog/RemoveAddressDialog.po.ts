import {Dialog} from  '../dialog/Dialog.po';
import { browser,by, element } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("RemoveAddressDialog");

export const removeAddressDialogObjs = {
    noButton: element.all(by.css("[id^=addressBook_removeAddress_buttonNo_]")),
    removeAddressDialogTitle: element.all(by.css("[id^=addressBook_removeAddress_title_]")),
    yesButton: element.all(by.css("[id^=addressBook_removeAddress_buttonYes_]")),
    confirmMsg: element.all(by.css("[id^=addressBook_removeAddress_confirm_]"))
  };
  
export class RemoveAddressDialog extends Dialog {

    constructor(index: number){
        super();
        this.waitForElementDisplayed(removeAddressDialogObjs.removeAddressDialogTitle.first());
        this.waitForElementDisplayed(removeAddressDialogObjs.yesButton.first());
        this.waitForElementDisplayed(removeAddressDialogObjs.noButton.first());
    }

    clickCancel(){
        removeAddressDialogObjs.noButton.first().click();
    }
    
    clickConfirm(){
        browser.executeScript("arguments[0].scrollIntoView();", removeAddressDialogObjs.yesButton.first()).then(function () {
            removeAddressDialogObjs.yesButton.click().then(function(){
                console.log('Confirm to remove Address');
            }).catch(function (e){
                console.log(e);                
            })
        });
    }

    removeDialogNotDisplayed():Promise<boolean>{
        return this.waitForElementNotDisplayed(removeAddressDialogObjs.removeAddressDialogTitle.first());   
    }
    
}