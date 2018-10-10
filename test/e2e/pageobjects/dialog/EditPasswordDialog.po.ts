import {Dialog} from  '../dialog/Dialog.po';
import { browser,by, element } from 'protractor';
import { templateJitUrl } from '@angular/compiler';

var log4js = require("log4js");
var log = log4js.getLogger("EditPasswordDialog");


export const editPasswordDialogObjs = {
    editPasswordDialogTitle: element.all(by.css("[id^=personalinfo_h2_78_]")).first(),
    
    currentPw: element.all(by.css("[id^=personalinfo_input_86_]")).first(),
    newPw1: element.all(by.css("[id^=personalinfo_input_90_]")).first(),
    newPw2: element.all(by.css("[id^=personalinfo_input_93_]")).first(),
    
    cancelButton: element.all(by.css("[id^=personalinfo_button_95_]")).first(),
    saveButton: element.all(by.css("[id^=personalinfo_button_97_]")).first(),
    
    alertMsg: element.all(by.css("[id^=personalinfo_span_82_]")).first(),
    close: element.all(by.css("[id^=personalinfo_button_79_]")).first()
    
    
  };
  
export class EditPassswordDialog extends Dialog {
  
  constructor(){
    super();
    this.waitForElementDisplayed(editPasswordDialogObjs.editPasswordDialogTitle);    
    this.waitForElementDisplayed(editPasswordDialogObjs.currentPw);
  }
    
  typeCurrentPw(currentPw: string): EditPassswordDialog{
    editPasswordDialogObjs.currentPw.sendKeys(currentPw).then()
    console.log("Type current password : " + currentPw);
    
    return this;
  }

  typeNewPw1(newPw: string): EditPassswordDialog{
    editPasswordDialogObjs.newPw1.sendKeys(newPw); 
    return this;   
  }
  clearNewPw1(): EditPassswordDialog{
    editPasswordDialogObjs.newPw1.clear(); 
    return this;   
  }

  typeNewPw2(newPw: string): EditPassswordDialog{
    editPasswordDialogObjs.newPw2.sendKeys(newPw);     
    return this;   
  }

  clearCurrentPw(): EditPassswordDialog{
    editPasswordDialogObjs.currentPw.clear(); 
    return this;   
  }

  clearNewPw2(): EditPassswordDialog{
    editPasswordDialogObjs.newPw2.clear(); 
    return this;   
  }

  clickSave():EditPassswordDialog{
    editPasswordDialogObjs.saveButton.click();
    return this;
  }


  editPasswordDialogNotDisplayed(): Promise<boolean>{
    return this.waitForElementNotDisplayed(editPasswordDialogObjs.editPasswordDialogTitle);
  }

  getDialogAlertMsg(): Promise<string>{
    this.waitForElementDisplayed(editPasswordDialogObjs.alertMsg);
    return new Promise<string>((resolve, reject) => {           
      editPasswordDialogObjs.alertMsg.getText().then(text => {
          console.log("Alert msg : " , text);                
          resolve(text);
      })
  });
  }

  clickCancel():void{
    editPasswordDialogObjs.cancelButton.click();
  }
  
  dialogClose():EditPassswordDialog{
    editPasswordDialogObjs.close.click();
    return this;
  }

  getCurrentPwInputCss(cssStyleProperty: string): Promise<string>{
    return this.getCssValue(cssStyleProperty, editPasswordDialogObjs.currentPw); 
  }

  getNewPwInputCss(cssStyleProperty: string): Promise<string>{
    return this.getCssValue(cssStyleProperty, editPasswordDialogObjs.newPw1); 
  }

  getNewPwVerifyInputCss(cssStyleProperty: string): Promise<string>{
    return this.getCssValue(cssStyleProperty, editPasswordDialogObjs.newPw2); 
  }

  waitForPw2Css(cssStyleProperty: string, cssValue: string): Promise<boolean> {
      return this.waitForCssPropertyToUpdate(editPasswordDialogObjs.newPw2, cssStyleProperty, cssValue);
  }

  
}