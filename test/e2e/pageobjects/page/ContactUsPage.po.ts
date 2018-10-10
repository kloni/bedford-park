import {BaseTest } from  '../base/BaseTest.po';
import {Banner } from  '../banner/Banner.po';
import { by, element,browser } from 'protractor';

export const contactUsPageObjs = {
    contactUS: element.all(by.css("[id^=contactus_div_1_]")).first(),
}

export class ContactUsPage extends BaseTest {

    constructor() {
      super();
      this.waitForElementDisplayed(contactUsPageObjs.contactUS);
    }
  }