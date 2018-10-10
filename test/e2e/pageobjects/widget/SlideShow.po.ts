import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';

var log4js = require("log4js");
var log = log4js.getLogger("SlideShow");


export const slideShowObjs = {
    heroSlideshow: element.all(by.css("[id^=hero_slideshow_]")).first(),
};

export class SlideShow extends BaseTest {
   

    constructor(expected : boolean = true) {
        super();
        if (expected){
            this.waitForElementDisplayed(slideShowObjs.heroSlideshow);
        }else{
            this.waitForElementNotDisplayed(slideShowObjs.heroSlideshow);
        }
    }
    isDisplayed(timeout : number = 10000): Promise<boolean> {
        return this.waitForElementDisplayed(slideShowObjs.heroSlideshow, timeout);
    }
}