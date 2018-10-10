import { browser, by, element } from 'protractor';
import {BaseTest} from  '../base/BaseTest.po';
import { Dialog } from './Dialog.po';
import { editPasswordDialogObjs } from './EditPasswordDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("EditPersonalInformationDialog");


export const editPersonalInformationDialogObjs = {
    editPersonalInformationDialog: element.all(by.css("[id^=personalinfo_h2_27_]")).first(),    
    firstName: element.all(by.css("[id^=personalinfo_input_35_]")).first(),
    lastName: element.all(by.css("[id^=personalinfo_input_38_]")).first(),
    email: element.all(by.css("[id^=personalinfo_input_41_]")).first(),
    phone: element.all(by.css("[id^=personalinfo_input_44_]")).first(),
    birthYearDropdown : element.all(by.css('[id^=personalinfo_select_56_]')).first(),
    birthMonthDropdown: element.all(by.css('[id^=personalinfo_select_61_]')).first(),
    birthDateDropdown: element.all(by.css('[id^=personalinfo_select_66_]')).first(),
    dialogAlertMsg: element.all(by.css('[id^=personalinfo_span_31_]')).first(),
    
    cancel: element.all(by.css("[id^=personalinfo_button_71_]")).first(),
    save: element.all(by.css("[id^=personalinfo_button_73_]")).first(),
    
    close: element.all(by.css("[id^=personalinfo_button_28_]")).first(),

    marketingToggle: element.all(by.css("[id^=personalinfo_label_501_]")).first(),
    marketingLabel: element.all(by.css("[id^=personalinfo_label_50_]")).first(),

    DAToggle: element.all(by.css("[id^=personalinfo_label_511_]")).first(),
    DALabel: element.all(by.css("[id^=personalinfo_label_51_]")).first(),

    anomynousToggle: element.all(by.css("[id^=personalinfo_label_521_]")).first(),
    anomynousLabel: element.all(by.css("[id^=personalinfo_label_52_]")).first()
  };
  
export class EditPersonalInformationDialog extends Dialog {

    constructor(gdprEnabled: boolean = false){
        super(); 
        this.waitForElement(editPersonalInformationDialogObjs.firstName);     
        
        if(gdprEnabled){
            this.waitForElementDisplayed(editPersonalInformationDialogObjs.marketingToggle);
            this.waitForElementDisplayed(editPersonalInformationDialogObjs.DAToggle);
            this.waitForElementDisplayed(editPersonalInformationDialogObjs.anomynousToggle);
        }
    }
    
    getBirthYear(year: string) : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            editPersonalInformationDialogObjs.birthYearDropdown.element(by.css('option:checked')).getText().then(text => {
                console.log("get birthYear : " + text);   
                resolve(text);
            })
        });
    }

    getBirthMonth(month: string) : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            editPersonalInformationDialogObjs.birthMonthDropdown.element(by.css('option:checked')).getText().then(text => {
                console.log("get birthMonth : " + text);
                
                resolve(text);
            })
        });
    }

    getBirthDay(day: string) : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            editPersonalInformationDialogObjs.birthDateDropdown.element(by.css('option:checked')).getText().then(text => {
                console.log("get birthDay : " + text);
                
                resolve(text);
            })
        });
    }

    modifyFirstName(firstName: string):EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.firstName.clear();
        editPersonalInformationDialogObjs.firstName.sendKeys(firstName);
        return this;
    }
    modifyLastName(lastName: string): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.lastName.clear();
        editPersonalInformationDialogObjs.lastName.sendKeys(lastName);
        return this;
    }
    modifyEmail(email: string): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.email.clear();
        editPersonalInformationDialogObjs.email.sendKeys(email);
        return this;
    }
    modifyPhone(phone: string): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.phone.clear();
        editPersonalInformationDialogObjs.phone.sendKeys(phone);
        return this;
    }
    modifyCurrency(currency: string): EditPersonalInformationDialog{
        element(by.cssContainingText('option', currency)).click();
        return this;
    }
    modifyGender(gender: string): EditPersonalInformationDialog{
        element(by.cssContainingText('option', gender)).click();
        return this;
    }
    modfiyBirthYear(year: string): EditPersonalInformationDialog{
        element(by.cssContainingText('option', year)).click();
        return this;             
    }
    modfiyBirthMonth(month: string): EditPersonalInformationDialog{
        element.all(by.css('[id^=personalinfo_select_61_]')).first().element(by.cssContainingText('option', month)).click();
        return this; 
    }
    modfiyBirthDay(day: string): EditPersonalInformationDialog{
        element.all(by.css('[id^=personalinfo_select_66_]')).first().element(by.cssContainingText('option', day)).click();
        return this; 
    }
    
    save(): void{
        editPersonalInformationDialogObjs.save.click();
    }

    editPersonalInformationDialogNotDisplayed(): Promise<boolean>{
        return this.waitForElementNotDisplayed(editPersonalInformationDialogObjs.editPersonalInformationDialog);
    }

    cancel(): void{
        editPersonalInformationDialogObjs.cancel.click();
    }

    getDialogAlertMsg(): Promise<string>{
        this.waitForElementDisplayed(editPersonalInformationDialogObjs.dialogAlertMsg);
        return new Promise<string>((resolve, reject) => {           
            editPersonalInformationDialogObjs.dialogAlertMsg.getText().then(text => {
                console.log("Alert msg : " + text);
                
                resolve(text);
            })
        });
    }
    dialogClose():void{
        editPersonalInformationDialogObjs.close.click();
        this.verifyElementNotDisplayed(editPersonalInformationDialogObjs.editPersonalInformationDialog);        
    }
    saveButtonNotClickable(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {             
            this.waitForElementNotClickable(editPasswordDialogObjs.saveButton).then(clickable => {
                console.log("Save button dislabed? : " + clickable);
                
                resolve(clickable);
            })
        });
    }

    getFirstNameInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, editPersonalInformationDialogObjs.firstName); 
    }

    getLastNameInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, editPersonalInformationDialogObjs.lastName); 
    }

    getEmailInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, editPersonalInformationDialogObjs.email); 
    }

    getPhoneInputCss(cssStyleProperty: string): Promise<string>{
        return this.getCssValue(cssStyleProperty, editPersonalInformationDialogObjs.phone); 
    }

    waitForFirstNameCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(editPersonalInformationDialogObjs.firstName, cssStyleProperty, cssValue);
    }
    waitForEmailCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(editPersonalInformationDialogObjs.email, cssStyleProperty, cssValue);
    }
    waitForPhoneCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
        return this.waitForCssPropertyToUpdate(editPersonalInformationDialogObjs.phone, cssStyleProperty, cssValue);
    }

    /**GDPR */
    selectMarketingContentToggle(selected : boolean): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.marketingToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.marketingToggle, 'Yes');
                console.log('Marketing consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.marketingToggle, 'No');
                console.log('Marketing consent turned off');
            }
        });
        return this;
    }

    marketingConsentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            editPersonalInformationDialogObjs.marketingToggle.getText().then(text => {
                console.log('text:' , text);
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    selectDAToggle(selected : boolean): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.DAToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.DAToggle, 'Yes');
                console.log('DA consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.DAToggle, 'No');
                console.log('DA consent turned off');
            }
        });
        return this;
    }

    DAConsentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            editPersonalInformationDialogObjs.DAToggle.getText().then(text => {
                console.log('text:' , text);
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    selectAnomynousToggle(selected:  boolean): EditPersonalInformationDialog{
        editPersonalInformationDialogObjs.anomynousToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.anomynousToggle, 'Yes');
                console.log('Anomynous consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(editPersonalInformationDialogObjs.anomynousToggle, 'No');
                console.log('Anomynous consent turned off');
            }
        });
        return this;
    }

    anomynousToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            editPersonalInformationDialogObjs.anomynousToggle.getText().then(text => {
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    anomynousToggleNotClickable(): Promise<boolean>{
        return this.waitForElementNotClickable(editPersonalInformationDialogObjs.anomynousToggle);
    }

    anomynousToggleClickable(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return this.verifyElementClickable(editPersonalInformationDialogObjs.anomynousToggle);
        });
    }

}