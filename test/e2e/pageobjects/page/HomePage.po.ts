import {BaseTest } from  '../base/BaseTest.po';
import {Banner } from  '../banner/Banner.po';

import { by, element,browser } from 'protractor';

export const homePageObj = {
    heroSlideshow: element.all(by.css("[id^=hero_slideshow_]")).first(),

  };

export class HomePage extends BaseTest {

    constructor() {
        super();
        this.waitForElementDisplayed(homePageObj.heroSlideshow);
    }

    heroSlideshowExists():Promise<boolean>{
        return this.waitForElementDisplayed(homePageObj.heroSlideshow);
    }

    banner(){
        return new Banner();
    }

    

}