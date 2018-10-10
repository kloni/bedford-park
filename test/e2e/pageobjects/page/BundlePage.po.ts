import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementFinder, browser, ElementArrayFinder } from 'protractor';
import { ShoppingCartPage } from './ShoppingCartPage.po';
import { ProductPage } from './ProductPage.po';
import { Sku } from '../../tests/app/data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("BundlePage");

export const BundlePageObj = {
    //bundle
    bundleName: element.all(by.css("[id^=product_name_")).first(),
    bundleSku: element.all(by.css("[id^=product_sku_")).first(),
    bundleShortDescription: element.all(by.css("[id^=product_shortdescription_")).first(),
    bundleLongDescription: element.all(by.css("[id^=product_longdescription_")).first(),
    bundleViewAllProducts: element.all(by.css("[id^=product_ViewProductsArrangement_link_")).first(),

    //bundle items
    productsContainer: element.all(by.css("[id^=bundleProducts")).first(),
    productCollections: element.all(by.css("[id^=collectionCard_")),
    productName: element.all(by.css("[id^=product_name_")),
    productOfferPrice: element.all(by.css("[id^=product_price_")),
    productViewDetails: element.all(by.css("[id^=product_viewDetails_")),
    productInventoryAvailability: element.all(by.css("[id^=product_availability_inStock_")),
    productSku: element.all(by.css("[id^=product_sku_")),
    addToCart: element.all(by.css("[id^=product_add_to_cart_")),

    productQuantity: element.all(by.css("[id^=product_quantity_input_")),
    productQuantityIncrement: element.all(by.css("[id^=product_quantity_add_")),
    productQuantityDecrement: element.all(by.css("[id^=product_quantity_subtract_")),
    productAddToCart: element.all(by.css("[id^=product_add_to_cart_")),

    addToCartConfirmation: element.all(by.css("[id^=confirmationModal_]")).last(),
    cart: element.all(by.css("[id^=cart_link_]")).first(),
    VATTax: element.all(by.css("[id^=product_price_vat_]")).first()
};

export class BundlePage extends BaseTest {

    constructor(nProducts: number = 1) {
        super();
        this.waitForElementDisplayed(BundlePageObj.productName.first());
        this.waitForElementDisplayed(BundlePageObj.bundleViewAllProducts);
        this.waitForElementDisplayed(BundlePageObj.productsContainer);
        this.waitForArrangementProdToLoad(nProducts);
    }

    waitForArrangementProdToLoad(nProducts: number, timeout: number = 10000): Promise<boolean> {
        let resultLoaded: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return BundlePageObj.productCollections.getWebElements().then(elements => {
                    resultLoaded = elements.length;
                    if (nProducts > 0 && resultLoaded === nProducts) {
                        resolve(true);
                        return true;
                    }
                });
            }, timeout)
                .catch(error => {
                    if (nProducts === 0 && resultLoaded === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                        console.log("Expected in product arrangement ->" + nProducts + "<- but got ->" + resultLoaded + "<-" + error);
                    }
                });
        });
    }

    addToCart(index: number): BundlePage {
        let nItems: number = 0;
        browser.wait(() => {
            return BundlePageObj.cart.getAttribute("data-cart-length").then(result => {
                console.log(result);
                nItems = Number(result);
                return true;
            });
        }, 2500);

        BundlePageObj.addToCart.get(index).click().then(function () {
            console.log("Click on add to cart button on item with index: " + index);
        });

        browser.wait(() => {
            return BundlePageObj.cart.getAttribute("data-cart-length").then(result => {
                console.log(result);
                if (Number(result) > nItems) {
                    console.log("updated" + result + " - " + nItems);
                    return true;
                } else {
                    console.log("not updated" + result + " - " + nItems);
                }
            });
        }, 2500);

        return this;
    }

    clickProductViewDetails(index: number = 0): ProductPage {
        BundlePageObj.productViewDetails.get(index).click().then(() => {
            console.log('productViewDetails clicked at index: ' + index);
        });
        return new ProductPage();
    }

    isDisplayedBundleViewAllProducts(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return BundlePageObj.bundleViewAllProducts.isDisplayed().then(result => {
                resolve(result);
            });
        });
    }


    getBundleName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.bundleName.getText().then(text => {
                console.log("BundleName : " + text);
                resolve(text);
            })
        });
    }

    getBundleSku(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.bundleSku.getText().then(text => {
                console.log("BundleSku : " + text);
                resolve(text);
            })
        });
    }

    getBundleShortDescription(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.bundleShortDescription.getText().then(text => {
                console.log("BundleShortDescription : " + text);
                resolve(text);
            })
        });
    }

    getBundleLongDescription(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.bundleLongDescription.getText().then(text => {
                console.log("BundleLongDescription : " + text);
                resolve(text);
            })
        });
    }

    /**
     * @param index, index of target product within a bundle page
     * because bundle name and product names share common tag, this function will add one to the index
     */
    getProductName(index: number = 0): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.productName.get(index + 1).getText().then(text => {
                console.log('productName:' + text + "at index :" + index); resolve(text);
            });
        });
    }

    /**
     * @param index, index of target product within a bundle page
     * because bundle name and product names share common tag, this function will add one to the index
     */
    getProductSku(index: number = 0): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.productSku.get(index + 1).getText().then(text => {
                console.log('productSku:' + text + "at index :" + index); resolve(text);
            });
        });
    }

    getProductInventoryAvailability(index: number = 0): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            BundlePageObj.productInventoryAvailability.get(index).getText().then(text => {
                console.log('productInventoryAvailability:', text);
                resolve(text);
            });
        });
    }

    getProductOfferPrice(index: number = 0): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            BundlePageObj.productOfferPrice.get(index).getText().then(text => {
                resolve(Number(text.replace(/\$|,/g, "")));
            });
        });
    }

    isDisplayedProductViewDetails(index: number = 0): Promise<boolean> {
        return new Promise<boolean>((result, reject) => {
            return BundlePageObj.productViewDetails.get(index).isDisplayed();
        });
    }

    /**
     * @param productCode the product code of target item
     * @param sku desired sku will be selected based on defining attributes
     */
    selectAttributes(productCode: string, sku: Sku): BundlePage {
        let uniqueId: string = '';
        browser.wait(function () {
            return BundlePageObj.productSku.getWebElements().then(elements => {
                elements.forEach(element => {
                    element.getText().then(text => {
                        console.log(text + " ...");
                        if (text.lastIndexOf(productCode) > -1) {
                            element.getAttribute("id").then(id => {
                                let idSplit: string[] = id.split('_');
                                uniqueId = idSplit[idSplit.length - 1];
                            });
                        }
                    });
                });
                if (uniqueId != '') {
                    console.log("RETURNING TRUE" + uniqueId);
                    return true;
                }
            });
        }, 5000, " Attribute not locating for product " + productCode).then(() => {
            let definingAttributes = Object.keys(sku.attributes);
            definingAttributes.forEach(attribute => {
                console.log("generating sku.attributes[attributes] " + sku.attributes[attribute]);
                let targetId: string = "[id*=_" + sku.attributes[attribute].replace(/['"]+/g, '') + "_" + uniqueId
                let targetAttribute: ElementFinder = element.all(by.css(targetId.toLowerCase())).first();
                browser.executeScript("arguments[0].scrollIntoView();", targetAttribute).then(function () {
                    targetAttribute.click().then(() => {
                        console.log("For SKU: " + productCode + "clicked on attribute: " + attribute + " : " + sku.attributes[attribute] + " for targetId" + targetId);
                    });
                });
            });
        });
        let textUpdated: boolean = false;
        browser.wait(() => {
            return BundlePageObj.productSku.getWebElements().then(elements => {
                elements.forEach(element => {
                    element.getText().then(text => {
                        console.log(text + "<-----------found in text checker");
                        if (text.includes(sku.sku)) {
                            console.log(text + " has " + sku.sku);
                            textUpdated = true;
                        }
                    });
                });
                return textUpdated;
            });
        }, 3000);
        return this
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(BundlePageObj.VATTax);
    }
}
