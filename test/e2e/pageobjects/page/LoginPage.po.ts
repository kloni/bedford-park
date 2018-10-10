import { BaseTest } from '../base/BaseTest.po';
import { by, element } from 'protractor';
import { ForgotPasswordModal } from '../dialog/ForgotPasswordDialog.po';
import { Banner } from '../banner/Banner.po';
import { CheckOutPage } from './CheckOutPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("LoginPage");

export const loginPageObj = {
    loginId: element.all(by.css("[id^=signin_input_9_]")).first(),
    password: element.all(by.css("[id^=signin_input_11_]")).first(),
    loginButton: element.all(by.css("[id^=signin_button_14_]")).first(),
    forgotPasswordLink: element.all(by.css("[id^=signin_a_13_]")).first(),
    credentialsErrorMessage: element.all(by.css("[id^=signin_div_6_")).first(),
    checkoutAsGuest: element.all(by.css("[id^=signin_button_18_")).first(),
};

export class LoginPage extends BaseTest {

    constructor(guest : boolean = false) {
        super();
        this.waitForElement(element(by.linkText("Forgot Password")));
        if (guest){
            this.waitForElementDisplayed(loginPageObj.checkoutAsGuest);
        }
    }

    forgotPasswordDisplayed() : Promise<boolean>{
        return this.waitForElementDisplayed(element(by.linkText("Forgot Password")));
    }

    typeUserName(loginId) {
        var elem = loginPageObj.loginId;
        elem.clear().then(() => {
            elem.sendKeys(loginId).then(function () {
                console.log("Entered for username: " + loginId);
            });
        });
        return this;
    }

    typePassword(password) {
        var elem = loginPageObj.password;
        elem.clear().then(() => {
            elem.sendKeys(password).then(function () {
                console.log("Entered " + password);
            });
        })
        return this;
    }

    /*successful login*/
    clickLogin() {
        loginPageObj.loginButton.click();
        return new Banner(true);
    }

    /**unsucessful login */
    clickLoginError() {
        loginPageObj.loginButton.click();
        return new Banner(false);
    }

    clickCheckoutAsGuest(nProducts : number = 1) {
        loginPageObj.checkoutAsGuest.click();
        return new CheckOutPage(nProducts, true);
    }

    clickForgotPassword(): ForgotPasswordModal {
        loginPageObj.forgotPasswordLink.click();
        return new ForgotPasswordModal();
    }

    checkLoginButtonEnabled(): void {
        var elem = loginPageObj.loginButton;
        this.verifyElementEnabled(elem);
    }

    checkLoginButtonDisabled(): void {
        var elem = loginPageObj.loginButton;
        this.verifyElementNotEnabled(elem);
    }

    checkLoginButtonNotClickable(): void {
        this.verifyElementNotDisplayed(loginPageObj.loginButton);
    }

    checkCredentialsErrorMessage(errorMessage) {
        var elem = loginPageObj.credentialsErrorMessage;
        this.verifyElementDisplayed(elem);
    }

    getCredentialsErrorMessage():Promise<string>{
        this.waitForElementPresent(loginPageObj.credentialsErrorMessage);
        return new Promise<string>((resolve, reject) => {
            loginPageObj.credentialsErrorMessage.getText().then(text => {
                console.log("credentials error message : " + text);
                resolve(text);
            })
        });
    }

    checkoutIsDisplayed(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return loginPageObj.checkoutAsGuest.isDisplayed().then(isDisplayed => {
                resolve(isDisplayed)
            });
        });
    }

    getLogonIdInputClassName():  Promise<string>{
        return this.getClassNames(loginPageObj.loginId);
    }

    getPasswordInputClassName():  Promise<string>{
        return this.getClassNames(loginPageObj.password);
    }

    getLogonIdInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, loginPageObj.loginId);
    }
    getPwInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, loginPageObj.password);
    }

    waitForLogonIdCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(loginPageObj.loginId, cssStyleProperty, cssValue);
    }

}
