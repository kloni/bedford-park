import {BaseTest } from  '../base/BaseTest.po';
import { by, element,browser } from 'protractor';

export const designTopicsPageObjs = {
  textLeftHero: element.all(by.css("[id^=text-left-hero_div_1_]")).first(),
}
;
export class DesignTopicsPage extends BaseTest {

    constructor() {
      super();
      this.waitForElementDisplayed(designTopicsPageObjs.textLeftHero);
    }
  }