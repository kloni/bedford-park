import { browser, by, element } from 'protractor';
import {BaseTest} from  '../base/BaseTest.po';
import { Dialog } from './Dialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("PrivacyPolicyDialog");


export const privacyPolicyDialogObjs = {
    privacyPolicyDialog: element.all(by.css("[id^=privacy_modal_1_]")).first(),    

    privacyPolicyFormattedText : element.all(by.css("[id^=sharedFormattedText_1_]")).first(), 

    marketingTrackingContainer: element.all(by.css("[id^=privacy_modal_4_]")).first(),
    marketingContentToggle: element.all(by.css("[id^=privacy_modal_10_]")).first(), 

    DAContainer: element.all(by.css("[id^=privacy_modal_12_]")).first(),
    DAToggle: element.all(by.css("[id^=privacy_modal_18_]")).first(),    

    anomynousToggleDisabled: element.all(by.css("[id^=privacy_modal_digitalAnalyticsAnonymousConsent]")).first(),
    anomynousToggle: element.all(by.css("[id^=privacy_modal_21_]")).first(),
    saveButton: element.all(by.css("[id^=privacy_modal_20_]")).first() , 
  };
  
export class PrivacyPolicyDialog extends Dialog {

    constructor(displayed :boolean = true){
        super(); 
        if(displayed){
            this.waitForElementDisplayed(privacyPolicyDialogObjs.privacyPolicyDialog); 
            this.waitForElementDisplayed(privacyPolicyDialogObjs.privacyPolicyFormattedText);           
            this.waitForElementDisplayed(privacyPolicyDialogObjs.saveButton);     
            
            this.waitForElementDisplayed(privacyPolicyDialogObjs.marketingTrackingContainer);  
            this.waitForElementDisplayed(privacyPolicyDialogObjs.marketingContentToggle);  

            this.waitForElementDisplayed(privacyPolicyDialogObjs.DAContainer);  
            this.waitForElementDisplayed(privacyPolicyDialogObjs.DAToggle);      
            this.waitForElementDisplayed(privacyPolicyDialogObjs.anomynousToggle); 
        }
    }


    getGDPRConsentText() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            privacyPolicyDialogObjs.privacyPolicyFormattedText.getText().then(text => {
                resolve(text);
            })
        });
    }

    /**Marketing Consent */
    getMarketingConsentText() : Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            element.all(by.css("[id^=privacy_modal_4_]")).first().all(by.css("[id^=sharedFormattedText_1_]")).first().getText().then(text => {
                resolve(text);
            })
        });
    }

    selectMarketingContentToggle(selected : boolean): PrivacyPolicyDialog{
        privacyPolicyDialogObjs.marketingContentToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.marketingContentToggle, 'Yes');
                console.log('Marketing consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.marketingContentToggle, 'No');
                console.log('Marketing consent turned off');
            }
        });
        return this;
    }
    
    marketingContentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            browser.sleep(5000);
            privacyPolicyDialogObjs.marketingContentToggle.getText().then(text => {
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    /**DA Consent */
    getDAConsentText(): Promise<string>{
        return new Promise<string>((resolve, reject) => {           
            element.all(by.css("[id^=privacy_modal_12_]")).first().all(by.css("[id^=sharedFormattedText_1_]")).first().getText().then(text => {
                console.log("get DA consent text : " + text);
                resolve(text);
            });
        });
    }


    DAConsentToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            privacyPolicyDialogObjs.DAToggle.getText().then(text => {
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    selectDAConsentToggle(selected : boolean): PrivacyPolicyDialog{
        privacyPolicyDialogObjs.DAToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.DAToggle, 'Yes');
                console.log('DA consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.DAToggle, 'No');
                console.log('DA consent turned off');
            }
        });
        return this;
    }

    /**Anomynous toggle */
    anomynousToggleInactive(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            privacyPolicyDialogObjs.anomynousToggleDisabled.getAttribute('disabled').then(on => {
                if(on){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    anomynousToggleSelected(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            privacyPolicyDialogObjs.anomynousToggle.getText().then(text => {
                if(text.includes('Yes')){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    selectAnomynousToggle(selected: boolean): PrivacyPolicyDialog{
        privacyPolicyDialogObjs.anomynousToggle.click().then(()=>{
            if(selected){
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.anomynousToggle, 'Yes');
                console.log('Anomynous consent turned on');
            }else{
                this.waitForTextToBeUpdatedToContain(privacyPolicyDialogObjs.anomynousToggle, 'No');
                console.log('Anomynous consent turned off');
            }
        });
        return this;
    }

    anomynousToggleNotClickable():Promise<boolean>{
        return this.waitForElementNotClickable(privacyPolicyDialogObjs.anomynousToggle);
    }

   /**Save button*/ 
    clickSave(): PrivacyPolicyDialog{
        privacyPolicyDialogObjs.saveButton.click();
        this.waitForElementNotDisplayed(privacyPolicyDialogObjs.privacyPolicyDialog);
        return this;
    }

    GDPRDialogNotDisplayed(waitTimeMs : number = 10000): Promise<boolean> {
        return this.waitForElementNotDisplayed(privacyPolicyDialogObjs.privacyPolicyDialog, waitTimeMs);
    }
    GDPRDialogNotPresent(waitTimeMs : number = 10000): Promise<boolean> {
        return this.waitForElementNotPresent(privacyPolicyDialogObjs.privacyPolicyDialog, waitTimeMs);
    }


    GDPRDialogDisplayed(waitTimeMs : number = 10000): Promise<boolean> {
        return this.waitForElementDisplayed(privacyPolicyDialogObjs.privacyPolicyDialog, waitTimeMs);
    }

}