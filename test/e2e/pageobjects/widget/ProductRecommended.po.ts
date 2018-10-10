import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { ProductPage } from '../page/ProductPage.po';
import { ISize } from 'selenium-webdriver';
import { SessionErrorDialog } from '../dialog/SessionErrorDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("ProductRecommendation Widget");


export const ProductRecommendedObj = {
    widget: element.all(by.css("[id^=productCard_]")),
    image: element.all(by.css("[id^=productCard_fullImage_]")),
    name: element.all(by.css("[id^=productCard_name_]")),
    price: element.all(by.css("[id^=productCard_price_]")),

    product: element.all(by.css('[id^=productCard_]')),

    carouselNextButton: element.all(by.buttonText("Next")),
    carouselPreviousButton: element.all(by.buttonText("Previous")),
    VATTax: element.all(by.css("[id^=productCard_price_vat_]")).first()
};

export class ProductRecommended extends BaseTest {
    pageIndex: number = 0;

    constructor(index: number = 0, displayed: boolean = true) {
        super();
        this.pageIndex = index;

        if (displayed) {
            this.waitForElementDisplayed(ProductRecommendedObj.widget.first());
            this.waitForElementPresent(ProductRecommendedObj.image.get(index));
            this.waitForElementSizeGreaterThan(ProductRecommendedObj.image.get(index), 50, 50, 10000);
            this.waitForElementDisplayed(ProductRecommendedObj.name.get(index));
            this.waitForTextToNotBe(ProductRecommendedObj.name.get(index), '');
            this.waitForElementDisplayed(ProductRecommendedObj.price.get(index));
            this.waitForTextToNotBe(ProductRecommendedObj.price.get(index), '');
        }
    }

    isDisplayed(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return ProductRecommendedObj.image.get(this.pageIndex).isDisplayed().then(result => {
                resolve(result);
            }).then(null, error => {
                resolve(false);
            });
        });
    }

    clickCarouselNext(index: number = 0): ProductRecommended {
        ProductRecommendedObj.carouselNextButton.get(index).click().then(() => {
            console.log("Next button click for carousel at index : " + index);
        });
        return this;
    }

    clickCarouselPrevious(index: number = 0): ProductRecommended {
        ProductRecommendedObj.carouselPreviousButton.get(index).click().then(() => {
            console.log("Next button click for carousel at index : " + index);
        });
        return this;
    }

    clickOnImage(): ProductPage {
        ProductRecommendedObj.image.get(this.pageIndex).click().then(() => {
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    clickOnName(): ProductPage {
        ProductRecommendedObj.name.get(this.pageIndex).click().then(() => {
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    getImageUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductRecommendedObj.image.get(this.pageIndex).getAttribute("src").then(result => {
                resolve(result);
            });
        });
    }

    getImageSize(): Promise<ISize> {
        return new Promise<ISize>((resolve, reject) => {
            ProductRecommendedObj.image.get(this.pageIndex).getSize().then(result => {
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

    getPrice(): Promise<number>{
        return new Promise<number>((resolve, reject) => {
            ProductRecommendedObj.price.get(this.pageIndex).getText().then(result => {
                let finalResults= Number(result.replace(/[^0-9\.]+/g, ""));

                if(result.includes(' - ')){
                    let finalResults = result.split('- $')[1];
                    resolve(Number(finalResults));
                }else{
                    resolve(Number(finalResults));
                }
            });
        });
    }

    widgetDisplayed(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            return ProductRecommendedObj.widget.first().isDisplayed().then(result => {
                resolve(result);
            });
        });
    }

    clickOnNameSessionError(): SessionErrorDialog {
        ProductRecommendedObj.name.get(this.pageIndex).click().then(() => {
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new SessionErrorDialog();
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(ProductRecommendedObj.VATTax);
    }
}