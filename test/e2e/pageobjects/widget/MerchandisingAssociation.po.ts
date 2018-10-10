import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { ProductPage } from '../page/ProductPage.po';
import { ISize } from 'selenium-webdriver';

var log4js = require("log4js");
var log = log4js.getLogger("MerchandisingAssociation");


export const MerchandisingAssociationObjs = {
    image: element.all(by.css("[id^=productCard_fullImage_")),
    name: element.all(by.css("[id^=productCard_name_")),
    price: element.all(by.css("[id^=productCard_price_")),
    carouselNextButton: element.all(by.buttonText("Next")),
    carouselPreviousButton: element.all(by.buttonText("Previous")),
    VATTax: element.all(by.css("[id^=productCard_price_vat_]"))
};

export class MerchandisingAssociation extends BaseTest {
    pageIndex: number = 0;

    constructor(index: number = 0, displayed: boolean = true) {
        super();
        this.pageIndex = index;
        this.waitForElementPresent(MerchandisingAssociationObjs.image.get(index));
        this.waitForElementSizeGreaterThan(MerchandisingAssociationObjs.image.get(index), 50, 50);
        if (displayed) {
            this.waitForElementDisplayed(MerchandisingAssociationObjs.image.get(index));
            this.waitForElementDisplayed(MerchandisingAssociationObjs.name.get(index));
            this.waitForTextToNotBe(MerchandisingAssociationObjs.name.get(index), '');
        }
    }

    isDisplayed(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return MerchandisingAssociationObjs.image.get(this.pageIndex).isDisplayed().then(result => {
                resolve(result);
            });
        });
    }

    clickCarouselNext(index: number = 0): MerchandisingAssociation {
        MerchandisingAssociationObjs.carouselNextButton.get(index).click().then(() => {
            console.log("Next button click for carousel at index : " + index);
        });
        return this;
    }

    clickCarouselPrevious(index: number = 0): MerchandisingAssociation {
        MerchandisingAssociationObjs.carouselPreviousButton.get(index).click().then(() => {
            console.log("Next button click for carousel at index : " + index);
        });
        return this;
    }

    clickOnImage(): ProductPage {
        MerchandisingAssociationObjs.image.get(this.pageIndex).click().then(() => {
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    clickOnName(): ProductPage {
        MerchandisingAssociationObjs.name.get(this.pageIndex).click().then(() => {
            console.log("Clicked on product featured image at index : " + this.pageIndex);
        });
        return new ProductPage();
    }

    getImageUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            MerchandisingAssociationObjs.image.get(this.pageIndex).getAttribute("src").then(result => {
                resolve(result);
            });
        });
    }

    getImageSize(): Promise<ISize> {
        return new Promise<ISize>((resolve, reject) => {
            this.waitForStableHeight(MerchandisingAssociationObjs.image.get(this.pageIndex));
            this.waitForStableHeight(MerchandisingAssociationObjs.name.get(this.pageIndex));
            this.waitForStableHeight(MerchandisingAssociationObjs.price.get(this.pageIndex));
            MerchandisingAssociationObjs.image.get(this.pageIndex).getSize().then(result => {
                console.log('size??', result);
                resolve(result);
            });
        });
    }


    getName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            MerchandisingAssociationObjs.name.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }

    getPrice(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            MerchandisingAssociationObjs.price.get(this.pageIndex).getText().then(result => {
                resolve(result);
            });
        });
    }

    VATTaxDisplayed(): Promise<boolean> {
        // return this.waitForElementDisplayed(MerchandisingAssociationObjs.VATTax);
        return new Promise<boolean>((resolve, reject) => {
             MerchandisingAssociationObjs.VATTax.get(this.pageIndex).isDisplayed().then(result => {
                resolve(result);
            });
        });
    }

}