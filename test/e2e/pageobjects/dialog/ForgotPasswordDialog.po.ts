import { by, element, browser, protractor } from 'protractor';
import {BaseTest } from  '../base/BaseTest.po';
var log4js = require("log4js");
var log = log4js.getLogger("ForgotPassword");


export const forgotPasswordModalObj = {
    forgotPasswordModal: element.all(by.css("[id^=signin_div_32_")).first(),
    closeButton: element.all(by.css("[id^=signin_button_22_]")).first(),
    submit: element.all(by.css("[id^=signin_div_31_]")).first(),
    email: element.all(by.css("[id^=signin_input_28_]")).first(),
    heading: element.all(by.css("[id^=signin_div_20_]")).first(),
  };
export class ForgotPasswordModal extends BaseTest{

    constructor(){
        super();
        this.waitForElementDisplayed(forgotPasswordModalObj.email);
        this.waitForElementDisplayed(forgotPasswordModalObj.submit);
        this.waitForElementDisplayed(forgotPasswordModalObj.closeButton);

    }

    clickClose(): ForgotPasswordModal{
        forgotPasswordModalObj.closeButton.click();
        return this;
    }

   checkForgotPasswordModalExists(): ForgotPasswordModal{
        this.verifyElementDisplayed(forgotPasswordModalObj.forgotPasswordModal);
        return this;
   }

   submit():ForgotPasswordModal{
        forgotPasswordModalObj.submit.click().then(r => {
            console.log('click submit');
        });
        return this;
    };

    typeEmail(email:string):ForgotPasswordModal{
        forgotPasswordModalObj.email.sendKeys(email).then(r => {
            console.log('typing email:', email);
        });
        return this;
    };

    removeFocus():ForgotPasswordModal{
        forgotPasswordModalObj.heading.click();
        return this;
    }

    clearEmail():ForgotPasswordModal{
        forgotPasswordModalObj.email.clear();
        return this;
    }

    getEmailInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, forgotPasswordModalObj.email); 
    }

    waitForEmailCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(forgotPasswordModalObj.email, cssStyleProperty, cssValue);
    }


}