import { Dialog } from '../dialog/Dialog.po';
import { browser, by, element } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("EditPersonalInformationDialog");


export const addressDialogObjs = {
    addressDialogTitle: element.all(by.css("[id^=addressEditable_title_]")).first(),

    addAddressCancelButton: element.all(by.css("[id^=addressEditable_buttonCancel_]")).first(),
    addAddressSaveButton: element.all(by.css("[id^=addressEditable_buttonSaveChanges_]")).first(),

    addressNickName: element.all(by.css("[id^=addressEditable_inputNickName_]")).first(),
    firstName: element.all(by.css("[id^=addressEditable_inputFirstName_]")).first(),
    lastName: element.all(by.css("[id^=addressEditable_inputLastName_]")).first(),
    email: element.all(by.css("[id^=addressEditable_inputEmail_]")).first(),
    phone: element.all(by.css("[id^=addressEditable_inputPhone_]")).first(),
    address1: element.all(by.css("[id^=addressEditable_inputLine1_]")).first(),
    address2: element.all(by.css("[id^=addressEditable_inputLine2_]")).first(),
    shipsTo: element.all(by.css("[id^=addressEditable_inputShipTo_]")).first(),
    city: element.all(by.css("[id^=addressEditable_inputCity_]")).first(),
    state: element.all(by.css("[id^=addressEditable_inputState_]")).first(),
    zipCode: element.all(by.css("[id^=addressEditable_inputZip_]")).first(),
    errorMsg: element.all(by.css("[id^=addressEditable_errorMsgSpan_]")).first()
};

export class AddressDialog extends Dialog {

    constructor() {
        super();
        this.waitForElementDisplayed(addressDialogObjs.firstName);
        this.waitForElementDisplayed(addressDialogObjs.lastName);
        this.waitForElementDisplayed(addressDialogObjs.phone);
        this.waitForElementDisplayed(addressDialogObjs.address1);
        this.waitForElementDisplayed(addressDialogObjs.address2);

        this.waitForElementDisplayed(addressDialogObjs.city);
        this.waitForElementDisplayed(addressDialogObjs.state);
        this.waitForElementDisplayed(addressDialogObjs.zipCode);

        this.waitForElementDisplayed(addressDialogObjs.addAddressCancelButton);
        this.waitForElementDisplayed(addressDialogObjs.addAddressSaveButton);
    }

    addAddressDialogNotDisplayed(): Promise<boolean> {
        return this.waitForElementNotDisplayed(addressDialogObjs.firstName);
    }

    clickCancel(): void {
        this.verifyElementDisplayed(addressDialogObjs.addAddressCancelButton);
        browser.executeScript("arguments[0].scrollIntoView();", addressDialogObjs.addAddressCancelButton).then(function () {
            addressDialogObjs.addAddressCancelButton.click().then(function () {
                console.log('Click Cancel');
            });
        });

        this.verifyElementNotDisplayed(addressDialogObjs.addressDialogTitle);
    }
    clickSave(): AddressDialog {
        browser.executeScript("arguments[0].scrollIntoView();", addressDialogObjs.addAddressSaveButton).then(function () {
            addressDialogObjs.addAddressSaveButton.click().then(function () {
                console.log('Click Add button');
            });
        });
        return this;
    }

    clickSaveError<T>(type: { new(): T }): T {
        browser.executeScript("arguments[0].scrollIntoView();", addressDialogObjs.addAddressSaveButton).then(function () {
            addressDialogObjs.addAddressSaveButton.click().then(function () {
                console.log('Click Add button');
            });
        });
        return new type();
    }

    removeFocus(){
        addressDialogObjs.addressDialogTitle.click();
        return this;
    }

    getFirstName() : Promise<string>{
       return new Promise<string>((resolve, reject) => {
            addressDialogObjs.firstName.getAttribute('value').then(firstName => {

              console.log('firstName in the dialog:', firstName);
              resolve(firstName);
            });
        });
    }

    getLastName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressDialogObjs.lastName.getAttribute('value').then(lastName => {
                console.log('lastName in the dialog:', lastName);
                resolve(lastName);
            });
        });
    }

    enterAddressNickName(addressNickName: string): AddressDialog {
        addressDialogObjs.addressNickName.clear().then(function () {
            addressDialogObjs.addressNickName.sendKeys(addressNickName);
        });
        return this;
    }

    enterFirstName(firstName: string): AddressDialog {
        addressDialogObjs.firstName.clear().then(function () {
            addressDialogObjs.firstName.sendKeys(firstName);
        });
        return this;
    }

    enterLastName(lastName: string): AddressDialog {
        addressDialogObjs.lastName.clear().then(function () {
            addressDialogObjs.lastName.sendKeys(lastName);
        });
        return this;
    }
    enterEmail(email: string): AddressDialog {
        addressDialogObjs.email.clear().then(function () {
            addressDialogObjs.email.sendKeys(email);
        });
        return this;
    }
    enterPhoneNumber(phoneNumber: string): AddressDialog {
        addressDialogObjs.phone.clear().then(function () {
            addressDialogObjs.phone.sendKeys(phoneNumber);
        });
        return this;
    }
    enterAddress1(address1: string): AddressDialog {
        addressDialogObjs.address1.clear().then(function () {
            addressDialogObjs.address1.sendKeys(address1);
        });
        return this;
    }
    enterAddress2(address2: string): AddressDialog {
        addressDialogObjs.address2.clear().then(function () {
            addressDialogObjs.address2.sendKeys(address2);
        });
        return this;
    }
    selectShipping(option: string): AddressDialog {
        element.all(by.css("[id^=addressEditable_inputShipTo_]")).first().element(by.cssContainingText('option', option)).click();
        return this;
    }
    enterCity(city: string): AddressDialog {
        addressDialogObjs.city.clear().then(function () {
            addressDialogObjs.city.sendKeys(city);
        });
        return this;
    }
    enterZipCode(zipCode: string): AddressDialog {
        addressDialogObjs.zipCode.clear().then(function () {
            addressDialogObjs.zipCode.sendKeys(zipCode);
        });
        return this;
    }
    enterState(state: string): AddressDialog {
        addressDialogObjs.state.sendKeys(state);
        return this;
    }

    getErrorMessage(): Promise<string> {
        this.waitForElementDisplayed(addressDialogObjs.errorMsg);
        return new Promise<string>((resolve, reject) => {
            addressDialogObjs.errorMsg.getText().then(errorMsg => {
                console.log("error Message : " + errorMsg);
                resolve(errorMsg);
            })
        });
    }

    saveButtonClickable(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementNotClickable(addressDialogObjs.addAddressSaveButton).then(clickable => {
                console.log("Save button clickable? : " + clickable);
                resolve(clickable);
            })
        });
    }

    verifySaveButtonNotClickable(): AddressDialog {
        this.waitForElementNotClickable(addressDialogObjs.addAddressSaveButton);
        return this;
    }

    /* Css methods */
    waitForNickNameCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(addressDialogObjs.addressNickName, cssStyleProperty, cssValue);
    }

    waitForShippingCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(addressDialogObjs.shipsTo, cssStyleProperty, cssValue);
    }

    getNickNameInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.addressNickName);
    }

    getFirstNameInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.firstName);
    }

    getLastNameInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.lastName);
    }

    getEmailInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.email);
    }

    getPhoneInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.phone);
    }

    getAddressOneInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.address1);
    }

    getAddressTwoInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.address2);
    }

    getShipsToInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.shipsTo);
    }

    getCityToInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.city);
    }

    getStateToInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.state);
    }

    getZipCodeToInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, addressDialogObjs.zipCode);
    }

}
