import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';

var log4js = require("log4js");
var log = log4js.getLogger("EditPersonalInformationDialog");


export const ProductRecommendedObj = {
    image: element.all(by.css("[id^=x")),
    brand: element.all(by.css("[id^=x")),
    name: element.all(by.css("[id^=x")),
    price: element.all(by.css("[id^=x")),
    viewDetails : element.all(by.css("[id^=x")),
    stockStatus : element.all(by.css("[id^=x")),
    quantity : element.all(by.css("[id^=x")),
    addToCartButton: element.all(by.css("[id^=x")),
};

export class ProductRecommended extends BaseTest {
    pageIndex: number = 0;

    constructor(index: number = 0) {
        super();
        this.pageIndex = index;
        this.waitForElementPresent(ProductRecommendedObj.price.get(index));
    }

    clickAddToCart(index: number = 0): ProductRecommended {
        ProductRecommendedObj.addToCartButton.get(index).click().then(() => {
            console.log("Add To Cart button clicked at index : " + index);
        });
        return this;
    }

    clickViewDetails() : string {
        return "X";//TODO what does view details do?
    }

    getImageUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductRecommendedObj.image.get(this.pageIndex).getAttribute("src").then(result => {
                resolve(result);
            });
        });
    }

    getName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductRecommendedObj.name.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }

    getPrice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductRecommendedObj.price.get(this.pageIndex).getText().then(result => {
                var value = Number(result.replace(/[^0-9\.]+/g, ""));
                console.log("Price of item at index " + this.pageIndex + " : " + result);
                resolve(value);
            });
        });
    }

    getStockStatus () : Promise<string> {
        return new Promise<string>((resolve, rejct) => {
            ProductRecommendedObj.stockStatus.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }

}