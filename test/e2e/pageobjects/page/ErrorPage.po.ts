import { BaseTest } from '../base/BaseTest.po';
import { by, browser, element, protractor, ElementArrayFinder } from 'protractor';

var log4js = require("log4js");
var log = log4js.getLogger("ErrorPage");

export const errorPageObjs = {
  errorMsg: element.all(by.css("[id^=errormsg_text_]")).first().all(by.tagName('p')).first(),

};

export class ErrorPage extends BaseTest {
  
  constructor() {
    super();
  
    this.waitForElementDisplayed(errorPageObjs.errorMsg);
    
  }
  
  getErrorMsg(){
    return new Promise<string>((resolve, reject) => {           
        errorPageObjs.errorMsg.getText().then(errorMsg => {
            resolve(errorMsg);
        });
    });

  }
  
}