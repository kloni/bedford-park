import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementFinder, ElementArrayFinder } from 'protractor';
import { ShoppingCartPage } from './ShoppingCartPage.po';
import { Sku } from '../../tests/app/data/structures/StockholmCatalog';
import { ProductPage } from './ProductPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("KitPage");

export const KitPageObj = {
    productName: element.all(by.css("[id^=product_name_]")).first(),
    productOfferPrice: element.all(by.css("[id^=product_offer_price_]")).first(),
    addToCart: element.all(by.css("[id^=product_add_to_cart_]")).first(),
    addToCartConfirmation: element.all(by.css("[id^=confirmationModal_]")).first(),
    viewCart: element.all(by.css("[id^=cart_link_")).first(),
    kitIncludedProductNames: element.all(by.css("[id^=productCard_name_]")),
    kitIncludedProductPrices: element.all(by.css("[id^=productCard_price_]")),
    kitIncludedProductImgs: element.all(by.css("[id^=productCard_fullImage_]")),
    VATTax: element.all(by.css("[id^=product_price_vat_]")).first()
};

export class KitPage extends BaseTest {

    constructor() {
        super();
        this.waitForElementDisplayed(KitPageObj.productName);
        this.waitForElementDisplayed(KitPageObj.productOfferPrice);
        this.waitForElementDisplayed(KitPageObj.addToCart);
        this.waitForElementDisplayed(KitPageObj.kitIncludedProductImgs.first());
    }

    getProductName() {
        return new Promise<string>((resolve, reject) => {
            KitPageObj.productName.getText().then(productName => {
                resolve(productName);
            })
        });
    }

    addToCart(quantity: number): KitPage {
        KitPageObj.addToCart.click();
        this.waitForElementDisplayed(KitPageObj.addToCartConfirmation);
        return this;
    }

    clickViewCart(nProducts: number = -1): ShoppingCartPage {
        KitPageObj.viewCart.click().then(function () {
            console.log("Clicked on View Cart link and expected number of products: " + nProducts);
        });
        return new ShoppingCartPage(nProducts);
    }

    getAllIncludedProductNames(): Promise<string[]> {
        let list: string[] = [];
        return new Promise<string[]>((resolve, reject) => {
            KitPageObj.kitIncludedProductNames.each(kitNames => {
                kitNames.getText().then(name => {
                    list.push(name);
                });
            }).then(res => {
                resolve(list);
            });
        });
    }

    getAllIncludedProductPrices(): Promise<number[]> {
        let list: number[] = [];
        return new Promise<number[]>((resolve, reject) => {
            KitPageObj.kitIncludedProductPrices.each(kitPrices => {
                kitPrices.getText().then(priceString => {
                    let price = Number(priceString.replace(/[^0-9\.]+/g, ""));
                    list.push(price);
                });
            }).then(res => {
                resolve(list);
            });
        });
    }

    //should avoid xpath, but is there a way to use name instead of index?
    clickIncludedProductImgByName(product: string): ProductPage {
        let selectedProductName: ElementFinder = KitPageObj.kitIncludedProductNames.filter(function (elem) {
            return elem.getText().then(elementText => {
                if (elementText === product) {
                    return true;
                }
            });
        }).first();
        selectedProductName.element(by.xpath('parent::a')).element(by.xpath('preceding-sibling::a')).element(by.xpath('child::img')).click();
        return new ProductPage;
    }

    clickIncludedProductImgByIndex(index: number): ProductPage {
        element.all(by.css('[id^=productCard_]')).get(index).all(by.css('[id^=productCard_fullImage_]')).first().click();
        return new ProductPage;
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(KitPageObj.VATTax);
    }
}
