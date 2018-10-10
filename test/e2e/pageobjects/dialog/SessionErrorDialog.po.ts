import { Dialog } from '../dialog/Dialog.po';
import { browser, by, element, protractor } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("SessionErrorDialog");


export const sessionErrorDialogObjs = {
    dialogHeading: element.all(by.css("[id^=sessionError_h2_5_]")).first(),
    errorMsg: element.all(by.css("[id^=sessionError_p_6_]")).first(),
    cancelButton: element.all(by.css("[id^=sessionError_button_19_]")).first(),
    loginButton: element.all(by.css("[id^=sessionError_21_]")).first(),
    closeButton: element.all(by.css("[id^=sessionError_button_7_]")).first(),

    logonId: element.all(by.css("[id^=sessionError_input_14_]")).first(),
    password: element.all(by.css("[id^=sessionError_input_17_]")).first(),

    logonErrorMsg: element.all(by.css("[id^=sessionError_span_10_]")).first(),
    logonErrorMsgClose: element.all(by.css("[id^=sessionError_button_11_]")).first(),

};

export class SessionErrorDialog extends Dialog {

    constructor() {
        super();

        this.waitForElementDisplayed(sessionErrorDialogObjs.dialogHeading);
        this.waitForElementDisplayed(sessionErrorDialogObjs.cancelButton);
        this.waitForElementDisplayed(sessionErrorDialogObjs.logonId);
        this.waitForElementDisplayed(sessionErrorDialogObjs.password);
    }

    getHeading(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sessionErrorDialogObjs.dialogHeading.getText().then(heading => {
                resolve(heading);
            });
        });
    }
    errorMessage(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            sessionErrorDialogObjs.errorMsg.getText().then(msg => {
                resolve(msg);
            });
        });    
    }

    getEmail(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            sessionErrorDialogObjs.logonId.getAttribute('value').then(logonId => {
                resolve(logonId);
            });
        });    
    }

    enterLogin(logonId: string): SessionErrorDialog {
        sessionErrorDialogObjs.logonId.clear();
        sessionErrorDialogObjs.logonId.sendKeys(logonId);
        return this;
    }
    clearLogin(): SessionErrorDialog{
        sessionErrorDialogObjs.logonId.clear();
        return this;
    }

    enterPw(password: string): SessionErrorDialog {
        sessionErrorDialogObjs.password.sendKeys(password);
        return this;
    }
    deletePw(): SessionErrorDialog{
        sessionErrorDialogObjs.password.sendKeys(protractor.Key.BACK_SPACE);
        return this;
    }

    deleteLogin(): SessionErrorDialog{
        sessionErrorDialogObjs.logonId.sendKeys(protractor.Key.BACK_SPACE);
        return this;
    }

    clearPw(): SessionErrorDialog{
        sessionErrorDialogObjs.password.clear();
        return this;
    }

    removeFocus(): SessionErrorDialog{
        sessionErrorDialogObjs.dialogHeading.click();
        return this;
    }

    clickLogin<T>(type: { new(): T }): T {
        sessionErrorDialogObjs.loginButton.click();
        return new type();
    }

    clickCancel<T>(type: { new(): T }): T {
        sessionErrorDialogObjs.cancelButton.click();
        return new type();
    }

    clickClose<T>(type: { new(): T }): T {
        sessionErrorDialogObjs.closeButton.click();
        return new type();
    }

    getEmailInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, sessionErrorDialogObjs.logonId); 
    }

    waitForEmailCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(sessionErrorDialogObjs.logonId, cssStyleProperty, cssValue);
    }

    getPwInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, sessionErrorDialogObjs.password); 
    }

    waitForPwCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(sessionErrorDialogObjs.password, cssStyleProperty, cssValue);
    }

    getLogonId() : Promise<string>{
        return new Promise<string>((resolve, reject) => {
            sessionErrorDialogObjs.logonId.getAttribute('value').then(logonId => {
               console.log('logonid  in the input:', logonId);
               resolve(logonId);
             });
         });
     }


}
