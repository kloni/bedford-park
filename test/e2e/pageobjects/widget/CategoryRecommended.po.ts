import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { CategoryPage } from '../page/CategoryPage.po';
import { ISize } from 'selenium-webdriver';

var log4js = require("log4js");
var log = log4js.getLogger("CategoryRecommendationWidget");


export const CategoryRecommendedObjs = {
    image: element.all(by.css("[id^=categoryCard_img_3_]")),
    name: element.all(by.css("[id^=categoryCard_h3_1_]")),
};

export class CategoryRecommended extends BaseTest {
   

    constructor(index : number = 0) {
        super();
        this.waitForElementPresent(CategoryRecommendedObjs.name.get(index));
        this.waitForElementDisplayed(CategoryRecommendedObjs.name.get(index));
        this.waitForElementDisplayed(CategoryRecommendedObjs.image.get(index));
    }

    isDisplayed(index: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return CategoryRecommendedObjs.image.get(index).isDisplayed().then(result => {
                resolve(result);
            });
        });
    }


    clickOnImage(index: number): CategoryPage {
        CategoryRecommendedObjs.image.get(index).click().then(() => {
            console.log("Clicked on category image at index : " + index);
        });
        return new CategoryPage();
    }

    clickOnName(index: number): CategoryPage {
        CategoryRecommendedObjs.name.get(index).click().then(() => {
            console.log("Clicked on category image at index : " + index);
        });
        return new CategoryPage();
    }

    getImageUrl(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            CategoryRecommendedObjs.image.get(index).getAttribute("src").then(result => {
                resolve(result);
            });
        });
    }

    getName(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            CategoryRecommendedObjs.name.get(index).getText().then(result => {
                console.info("CATEGORY NAME: ", result);
                resolve(result);
            });
        });
    }


}