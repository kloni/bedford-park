import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { ISize } from 'selenium-webdriver';
import { ProductPage } from '../page/ProductPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("EditPersonalInformationDialog");


export const ProductFeaturedObj = {
    image: element.all(by.css("[id^=featureCard_fullImage_")),
    name: element.all(by.css("[id^=featureCard_name_")),
    price: element.all(by.css("[id^=featureCard_price_")),
    description: element.all(by.css("[id^=featureCard_description_")),
    shopNowButton: element.all(by.css("[id^=featureCard_textRouter_")),
    VATTax: element.all(by.css("[id^=featureCard_price_vat_]")).first()
};

export class ProductFeatured extends BaseTest {
    pageIndex: number = 0;

    constructor(index: number = 0) {
        super();
        this.pageIndex = index;
        this.waitForElementPresent(ProductFeaturedObj.price.get(index));
    }

    clickOnImage() : ProductPage{
        ProductFeaturedObj.image.get(this.pageIndex).click().then(()=>{
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    clickOnShopNow() : ProductPage{
        ProductFeaturedObj.shopNowButton.get(this.pageIndex).click().then(()=>{
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    isDisplayed() : Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return ProductFeaturedObj.image.get(this.pageIndex).isDisplayed().then( result =>{
                resolve(result);
            });
        });
    }

    getDescription(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductFeaturedObj.description.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }

    getImageSize(): Promise<ISize> {
        return new Promise<ISize>((resolve, reject) => {
            ProductFeaturedObj.image.get(this.pageIndex).getSize().then(result => {
                resolve(result);
            });
        });
    }

    getImageUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductFeaturedObj.image.get(this.pageIndex).getAttribute("src").then(result => {
                resolve(result);
            });
        });
    }

    getName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductFeaturedObj.name.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }
    getMinPrice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductFeaturedObj.price.first().getText().then(result => {   
                    if(result.includes('Price pending')){
                    }else if(result.includes(' - ')){
                        let finalResults = result.split(' - $')[0].slice(1);
                        resolve(Number(finalResults)); 
                    }else{
                        resolve(Number(result.slice(1))); 
                    }
                });
            });
    }

    getMaxPrice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductFeaturedObj.price.first().getText().then(result => {   
                    if(result.includes('Price pending')){
                    }else if(result.includes(' - ')){
                        let finalResults = result.split(' - $')[1];
                        resolve(Number(finalResults)); 
                    }else{
                        resolve(Number(result.slice(1))); 
                    }
                });
            });
    }

    getActiveSwatchColor(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            resolve("x");
        });
    }

    getImageXLocation(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductFeaturedObj.image.getLocation().then(iLocation => {
                resolve(iLocation.x);
            })
        });
    }

    getNameXLocation(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductFeaturedObj.name.getLocation().then(iLocation => {
                resolve(iLocation.x);
            })
        });
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(ProductFeaturedObj.VATTax);
    }
}