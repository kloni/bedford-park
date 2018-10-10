import { BaseTest } from '../base/BaseTest.po';
import { by, browser, element, protractor, ElementArrayFinder } from 'protractor';
import { Banner } from '../../pageobjects/banner/Banner.po';

var log4js = require("log4js");
var log = log4js.getLogger("OrderConfirmationPage");

export const orderConfirmationPageObj = {
  orderConfirmationId : element.all(by.css("[id^=orderconfirmation_ordernumbermsg_")).first(),
  orderConfirmationMsgThankYou : element.all(by.css("[id^=orderconfirmation_ordermsg_")).first(),
  orderConfirmationMsgEmail : element.all(by.css("[id^=orderconfirmation_emailLabel_")).first(),
  email : element.all(by.css("[id^=registration_simplified_emailinput_")).first(),
  password : element.all(by.css("[id^=registration_simplified_pwinput_")).first(),
  verifyPassword : element.all(by.css("[id^=registration_simplified_pwconfirminput_")).first(),
  registerUserButton : element.all(by.css("[id^=registration_simplified_submitbutton_")).first()
};

export class OrderConfirmationPage extends BaseTest {

  constructor(guest : boolean = false) {
    super();
    this.waitForElementPresent(orderConfirmationPageObj.orderConfirmationId);
    this.waitForElementDisplayed(orderConfirmationPageObj.orderConfirmationId);
    if (guest){
        this.waitForElementDisplayed(orderConfirmationPageObj.verifyPassword);
    }
    this.waitForTextToNotBe(orderConfirmationPageObj.orderConfirmationId,'Order #');
    this.waitForOrderIdToLoad();
  }

  clickRegisterUser() : OrderConfirmationPage {
    this.waitForElementPresent(orderConfirmationPageObj.registerUserButton);
    this.waitForElementEnabled(orderConfirmationPageObj.registerUserButton);
    orderConfirmationPageObj.registerUserButton.click();
    new Banner(true);
    return this;
  }

  getOrderId(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      orderConfirmationPageObj.orderConfirmationId.getText().then(text => {
        console.log('Order Id: ', text.replace(/Order #/gi,""));
        resolve(text.replace(/Order #/gi,""));
      });
    });
  }

  getEmailConfirmationMessage() : Promise<string>{
    return new Promise<string>((resolve, reject) => {
      orderConfirmationPageObj.orderConfirmationMsgEmail.getText().then(text => {
        resolve(text);
      })
    });
  }


  getThankYouMessage() : Promise<string>{
    return new Promise<string>((resolve, reject) => {
      orderConfirmationPageObj.orderConfirmationMsgThankYou.getText().then(text => {
        resolve(text);
      })
    });
  }

  typeEmail(email : string) : OrderConfirmationPage {
    orderConfirmationPageObj.email.clear().then(function(){
      orderConfirmationPageObj.email.sendKeys(email);
    });
    return this;
  }

  typePassword(password : string) : OrderConfirmationPage {
    let ele = orderConfirmationPageObj.password;
    this.waitForElementPresent(ele);
    this.waitForElementDisplayed(ele);
    this.waitForStableHeight(ele);
    ele.clear().then(()=>{
        ele.sendKeys(password).then(()=>{
            console.log("type password in orderConfirmation")
        });
    });
    return this;
  }

  typeVerifyPassword(password : string) : OrderConfirmationPage {
    let ele = orderConfirmationPageObj.verifyPassword;
    this.waitForElementPresent(ele);
    this.waitForElementDisplayed(ele);
    this.waitForStableHeight(ele);
    ele.clear().then(()=>{
        ele.sendKeys(password).then(()=>{
            console.log("type verified password in orderConfirmation")
        });
    });
    return this;
  }

  waitForOrderIdToLoad(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      browser.wait(function () {
        return orderConfirmationPageObj.orderConfirmationId.getText().then(text => {
          return Number(text.replace(/[^0-9\.]+/g, "")) >0 && text.replace(/[^0-9\.]+/g, "") != '';
        });
      }, 20000)
      .then(null, function (error) {
        console.log('Order Id not loaded: ' + orderConfirmationPageObj.orderConfirmationId.locator().toString() + error);
        return false;
      });
    })
  }
}