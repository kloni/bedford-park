import {BaseTest } from  '../base/BaseTest.po';
import { by, element, protractor , browser} from 'protractor';
import { HomePage } from './HomePage.po';
import { Banner } from '../banner/Banner.po';


export const registerPageObj = {
    firstName: element.all(by.css("[id^=registration_input_7_]")).first(),
    lastName: element.all(by.css("[id^=registration_input_9_]")).first(),
    email: element.all(by.css("[id^=registration_input_11_]")).first(),
    phone: element.all(by.css("[id^=registration_input_15_]")).first(),
    password: element.all(by.css("[id^=registration_input_18_]")).first(),
    verifyPassword: element.all(by.css("[id^=registration_input_21_]")).first(),
    registerButton: element.all(by.css("[id^=registration_button_25_]")).first(),
    errorMessageVerifyPassword : element.all(by.css("[id^=registration_div_4_")).first(),
    errorMessageInvalidEmail : element.all(by.css("[id^=registration_div_13_")).first(),
    errorMessagePhoneInvalid : element.all(by.css("[id^=registration_div_16_")).first(),
    receiveHomeIdeas: element.all(by.css("[id^=registration_input_23_]")).first(),
    signInLabel: element.all(by.css("[id^=signin_h4_5_]")).first(),

    marketingTrackToggleLabel: element.all(by.css("[id^=registration_label_251]")).first(),
    marketingConsentLabel : element.all(by.css("[id^=registration_label_25_]")).first(),
    
    DAToggleLabel: element.all(by.css("[id^=registration_label_261_]")).first(),
    DAConsent: element.all(by.css("[id^=registration_label_26_]")).first(),

    anomynousToggleLabel: element.all(by.css("[id^=registration_label_271_]")).first(),
    anomynousConsent: element.all(by.css("[id^=registration_label_27_]")).first(),
  };

export class RegistrationPage extends BaseTest {

    constructor(gdprEnabled: boolean = false) {
      super();
      this.waitForElement(registerPageObj.firstName);

        if(gdprEnabled){
            this.waitForElementDisplayed(registerPageObj.marketingConsentLabel);
            this.waitForElementDisplayed(registerPageObj.DAConsent);
            this.waitForElementDisplayed(registerPageObj.anomynousConsent);
            this.waitForElementDisplayed(registerPageObj.registerButton);
        }
    }

    getSignInPageLabel() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            registerPageObj.signInLabel.getText().then(signInLabel => {
                resolve(signInLabel);
            });
        });
    
    }

    typeFirstName(firstName : string):RegistrationPage{
        var elem =registerPageObj.firstName;
        elem.clear().then(()=> {
          elem.sendKeys(firstName);
        })
        return this;
    }

    typeLastName(lastName : string):RegistrationPage{
        var elem =registerPageObj.lastName;
        elem.clear().then(()=> {
          elem.sendKeys(lastName);
        })
        return this;
    }

    typeEmail(email : string):RegistrationPage{
        var elem =registerPageObj.email;
        elem.clear().then(()=> {
          console.log("Typing into register email field " + email);
          elem.sendKeys(email);
        })
        return this;
    }

    typePhone(phone : string ):RegistrationPage{
        var elem =registerPageObj.phone;
        elem.clear().then(()=> {
          elem.sendKeys(phone);
        })
        return this;
    }

    typePassword(password : string):RegistrationPage{
        var elem =registerPageObj.password;
        elem.clear().then(()=> {
          elem.sendKeys(password);
        })
        return this;
    }

    typeVerifyPassword(verifyPassword : string):RegistrationPage{
        var elem =registerPageObj.verifyPassword;
        elem.clear().then(()=> {
          elem.sendKeys(verifyPassword);
        })

        return this;
    }

    selectReceiveHomeIdea():RegistrationPage{
        registerPageObj.receiveHomeIdeas.click();
        return this;
    }

    /**happy path */
    clickRegister() : Banner{   
        registerPageObj.registerButton.click();
        return new Banner(true);
    }

    /**TODO: unhappy path */
    clickRegisterError() : RegistrationPage{ 
        registerPageObj.registerButton.click();
        return new RegistrationPage();
    }


    checkRegisterButtonEnabled():RegistrationPage{
        var elem =registerPageObj.registerButton;
        this.verifyElementEnabled(elem);
        return this;
    }

    checkRegisterButtonDisabled():RegistrationPage{
        var elem =registerPageObj.registerButton;
        this.verifyElementNotEnabled(elem);
        return this;
    }

    checkRegisterButtonNotClickable():RegistrationPage{
        this.verifyElementNotDisplayed(registerPageObj.registerButton);
        return this;
    }

    checkErrorMessageVerifyPassword (errorMessage : string, expectedDisplayed : boolean){
        var elem =registerPageObj.errorMessageVerifyPassword;
        if (expectedDisplayed){
            this.verifyElementDisplayed(elem);
            elem.getText().then( text => {
                if (errorMessage != text){
                    throw new Error("Error message text->" + text + "<- not equal to expected: ->" + errorMessage + "<-");
                }
            });
        }else{
            this.verifyElementNotDisplayed(elem);
        }
    }

    checkErrorMessageEmail (errorMessage : string, expectedDisplayed : boolean){
        var elem =registerPageObj.errorMessageInvalidEmail;
        if (expectedDisplayed){
            this.verifyElementDisplayed(elem);
            elem.getText().then( text => {
                if (errorMessage != text){
                    throw new Error("Error message text->" + text + "<- not equal to expected: ->" + errorMessage + "<-");
                }
            });
        }else{
            this.verifyElementNotDisplayed(elem);
        }
    }

    checkErrorMessagePhone (errorMessage : string, expectedDisplayed : boolean){
        var elem =registerPageObj.errorMessagePhoneInvalid;
        if (expectedDisplayed){
            this.verifyElementDisplayed(elem);
            elem.getText().then( text => {
                if (errorMessage != text){
                    throw new Error("Error message text->" + text + "<- not equal to expected: ->" + errorMessage + "<-");
                }
            });
        }else{
            this.verifyElementNotDisplayed(elem);
        }
    }

    clearFirstName(): RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.firstName);
        var elem =registerPageObj.firstName;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    clearLastName():RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.lastName);
        var elem =registerPageObj.lastName;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard        
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    clearEmail():RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.email);
        var elem =registerPageObj.email;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard        
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    
    clearPhone():RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.phone);
        var elem =registerPageObj.phone;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard 
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    clearPassword():RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.password);
        var elem =registerPageObj.password;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard 
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    clearVerifyPassword():RegistrationPage{
        this.verifyElementDisplayed(registerPageObj.verifyPassword);
        var elem =registerPageObj.verifyPassword;
        elem.clear();   //does not similute user input
        elem.sendKeys("a"); //simulate user input as if user was using keyboard 
        elem.sendKeys(protractor.Key.BACK_SPACE); //simulate user using backspace
        return this;
    }

    /* Form validation methods */

    /* Input field class name methods */
    getFirstNameClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.firstName);
    }

    getLastNameClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.lastName);
    }

    getEmailClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.email);
    }

    getPasswordClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.password);
    }

    getPasswordVerifyClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.verifyPassword);
    }

    getPhoneVerifyClassName(): Promise<string>{
        return this.getClassNames(registerPageObj.phone);
    }

    /* Input field css methods */
    getFirstNameInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, registerPageObj.firstName); 
    }

    getLastNameInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, registerPageObj.lastName); 
    }

    getEmailInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, registerPageObj.email); 
    }

    getPasswordInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, registerPageObj.password); 
    }

    getPasswordVerifyInputCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, registerPageObj.verifyPassword); 
    }

    getPhoneInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, registerPageObj.phone); 
    }

    waitForFirstNameCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(registerPageObj.firstName, cssStyleProperty, cssValue);
    }

    waitForPhoneCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(registerPageObj.phone, cssStyleProperty, cssValue);
    }
    
    waitForPwCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(registerPageObj.password, cssStyleProperty, cssValue);
    }


    /**GDPR */
    /**Marketing Consent */
    getMarketingConsentText() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            registerPageObj.marketingConsentLabel.getText().then(text => {
                resolve(text);
            })
        });
    }
    selectMarketingContentToggle(selected : boolean): RegistrationPage{
        registerPageObj.marketingTrackToggleLabel.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(registerPageObj.marketingTrackToggleLabel, 'Yes');
                console.log('Marketing consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(registerPageObj.marketingTrackToggleLabel, 'No');
                console.log('Marketing consent turned off');
            }
        });
        return this;
    }

    marketingConsentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            registerPageObj.marketingTrackToggleLabel.getText().then(text => {
                console.log('text:' , text);
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    /**DA Consent */
    getDAConsentText() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            registerPageObj.DAConsent.getText().then(text => {
                resolve(text);
            })
        });
    }

    selectDAToggle(selected : boolean): RegistrationPage{
        registerPageObj.DAToggleLabel.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(registerPageObj.DAToggleLabel, 'Yes');
                console.log('DA consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(registerPageObj.DAToggleLabel, 'No');
                console.log('DA consent turned off');
            }
        });
        return this;
    }

    DAConsentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            registerPageObj.DAToggleLabel.getText().then(text => {
                console.log('text:' , text);
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    getAnomynousConsentText() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            registerPageObj.anomynousConsent.getText().then(text => {
                resolve(text);
            })
        });
    }

    selectAnomynousToggle(selected:  boolean): RegistrationPage{
        registerPageObj.anomynousToggleLabel.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(registerPageObj.anomynousToggleLabel, 'Yes');
                console.log('Anomynous consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(registerPageObj.anomynousToggleLabel, 'No');
                console.log('Anomynous consent turned off');
            }
        });
        return this;
    }

    anomynousToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            registerPageObj.anomynousToggleLabel.getText().then(text => {
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    anomynousToggleNotClickable(): Promise<boolean>{
        return this.waitForElementNotClickable(registerPageObj.anomynousToggleLabel);
    }

    anomynousToggleClickable(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.verifyElementClickable(registerPageObj.anomynousToggleLabel);
        });
    }

}