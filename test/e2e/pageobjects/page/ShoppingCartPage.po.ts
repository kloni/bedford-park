import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, browser } from 'protractor';
import { CheckOutPage } from './CheckOutPage.po';
import { LoginPage } from './LoginPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("ShoppingCartPageObject");

export const shoppingCartPageObj = {
    shoppingCartHeading: element.all(by.css("[id^=shoppingcart_h2_1_]")).first(),
    removeButtons: element.all(by.css("[id^=commerce-order-items_a_3_")),
    productNames: element.all(by.css("[id^=commerce-order-items_a_2_")),
    firstProductName: element.all(by.css("[id^=commerce-order-items_a_2_")).first(),
    productSkus: element.all(by.css("[id^=commerce-order-items_span_12_")),
    productQuantities: element.all(by.css("[id^=commerce-order-items_input_22_")),
    productPrice: element.all(by.css("[id^=commerce-order-items_p_24_")),

    promotionCode: element.all(by.css("[id^=commerce-order-promotion_input_2_")).first(),
    promotionCodeMobile: element.all(by.css("[id^=commerce-order-promotion_input_3_")).first(),
    promotionApplyButton: element.all(by.css("[id^=commerce-order-promotion_a_7_")).first(),
    promotionApplyButtonMobile: element.all(by.css("[id^=commerce-order-promotion_a_9_")).first(),
    promotionRemoveButton: element.all(by.css("[id^=commerce-order-promotion_span_41_")).first(),
    promotionRemoveButtonMobile: element.all(by.css("[id^=commerce-order-promotion_span_49_")).first(),

    shipToCountry: element.all(by.css("[id^=commerce-cart-address_notMobile_select_1_")).first(),
    shipToCountryMobile: element.all(by.css("[id^=commerce-cart-address_mobile_select_1_")).first(),
    zipCode: element.all(by.css("[id^=commerce-cart-address_notMobile_input_1_")).first(),
    zipCodeMobile: element.all(by.css("[id^=commerce-cart-address_mobile_input_1_")).first(),

    getShippingQuoteButton: element.all(by.css("[id^=commerce-cart-address_a_6_")).first(),
    getShippingQuoteButtonMobile: element.all(by.css("[id^=commerce-cart-address_a_5_")).first(),

    shipping: element.all(by.css("[id^=commerce-order-total_p_70_")).first(),
    subTotal: element.all(by.css("[id^=commerce-order-total_p_55_")).first(),
    discount: element.all(by.css("[id^=commerce-order-total_discount_60_")).first(),
    total: element.all(by.css("[id^=commerce-order-total_div_78_")).first(),
    checkoutButton: element.all(by.css("[id^=shoppingcart_a_10_")).first(),

    errorMessageInvalidPromotionCode: element.all(by.css("[id^=commerce-order-promotion_span_39_")).first(),
    errorMessageInvalidPromotionCodeMobile: element.all(by.css("[id^=commerce-order-promotion_span_47_")).first(),
    errorMessageInvalidZipCode: element.all(by.css("[id^=commerce-cart-address_notMobile_span_91_")).first(),
    errorMessageInvalidZipCodeMobile: element.all(by.css("[id^=commerce-cart-address_mobile_span_91_")).first(),

    mobilePromotionCodeAccordion: element.all(by.css("[id^=commerce-order-promotion_a_8_")).first(),
    mobileShippingQuoteAccordion: element.all(by.css("[id^=commerce-cart-address_a_4_")).first(),
    VATTax: element.all(by.css("[id^=commerce-order-total_p_566_]")).first(),

    product: element.all(by.css("[id^=commerce-order-items_div_1_]")),
    moveToWishList: "[id^=commerce-order-items_a_4_1_]",
    wishListDropdown: "[id^=wishList_dropDown_]",
    wishListName: "[id^=wishList_name_]",
    createNewWishList: "[id^=wishlist_createNewWishList_]",

    emptyCart: element.all(by.css("[id^=shoppingcart_p_2_]")).first(),

    //CSR
    csrLock : element.all(by.css("[id^=shoppingcart_lockButton_")).first(),
    csrUnLock : element.all(by.css("[id^=shoppingcart_unlockButton_")).first()
};

export class ShoppingCartPage extends BaseTest {

    constructor(expectedProducts: number = -1) {
        super();

        if (expectedProducts === -1) {
            this.waitForPossibleProductLoaded();
        } else {
            this.waitForAllProductsLoaded(expectedProducts);
        }

        if (expectedProducts > 0) {
            this.waitForStableHeight(shoppingCartPageObj.checkoutButton);
            this.waitForElementDisplayed(shoppingCartPageObj.checkoutButton);
            this.waitForTextToNotBe(shoppingCartPageObj.firstProductName, "")
        }
    }

    goToShoppingCartPage(): ShoppingCartPage {
        this.navigateTo("/cart");
        return this;
    }

    GetShippingQuote(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.getShippingQuoteButtonMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.getShippingQuoteButtonMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.getShippingQuoteButtonMobile.click();
                    shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.getShippingQuoteButton).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.getShippingQuoteButton.locator().toString() + "not displayed");
                    shoppingCartPageObj.getShippingQuoteButton.click();
                });
            }
        });
        return this;
    }

    clickApplyPromotion(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.promotionCodeMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionCodeMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionApplyButtonMobile.click();
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.promotionApplyButton).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionApplyButton.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionApplyButton.click();
                });
            }
        });
        return this;
    }

    clickCheckOut(nProducts: number = 1): CheckOutPage {
        this.waitForStableHeight(shoppingCartPageObj.checkoutButton);
        shoppingCartPageObj.checkoutButton.click().then(() => {
            console.log("Clicked on checkout from Shopping Cart Page");
        });
        return new CheckOutPage(nProducts);
    }

    clickRemovePromotion(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.promotionRemoveButtonMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionRemoveButtonMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionRemoveButtonMobile.click();
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.promotionRemoveButton).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionRemoveButton.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionRemoveButton.click();
                });
            }
        });
        return this;
    }


    getProductNameAtIndex(index: number) {
        return new Promise<string>((resolve, reject) => {
            shoppingCartPageObj.productNames.get(index).getText().then(result => {
                console.log("ProductName:", result, " at index:", index);
                resolve(result);
            })
        });
    }

    getProductSKUAtIndex(index: number) {
        return new Promise<string>((resolve, reject) => {
            shoppingCartPageObj.productSkus.get(index).getText().then(result => {
                console.log("ProductSKU:", result, " at index:", index);
                resolve(result);
            })
        });
    }

    getProductPriceAtIndex(index: number) {
        return new Promise<string>((resolve, reject) => {
            shoppingCartPageObj.productPrice.get(index).getText().then(result => {
                console.log("ProductPrice:", result, " at index:", index);
                resolve(result);
            })
        });
    }

    getProductQuantityAtIndex(index: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.productQuantities.get(index).getAttribute('value').then(result => {
                log.info("ProductQuantity:", result, " at index:", index);
                let quantity = Number(result.replace(/[^0-9\.]+/g, ""));
                resolve(quantity);
            })
        });
    }

    verifyInvalidPromotionCodeDisplayed(errorMessage: string): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();

                var elem = shoppingCartPageObj.errorMessageInvalidPromotionCodeMobile;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, elem.locator().toString() + " not in DOM or not displayed");

                    if (isDisplayed) {
                        elem.getText().then(text => {
                            expect(text).toBe(errorMessage, elem.locator().toString());
                        });
                    }
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            }
            else {
                var elem = shoppingCartPageObj.errorMessageInvalidPromotionCode;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, elem.locator().toString() + " not in DOM or not displayed");

                    if (isDisplayed) {
                        elem.getText().then(text => {
                            expect(text).toBe(errorMessage, elem.locator().toString());
                        });
                    }
                });
            }
        });
        return this;
    }

    verifyInvalidZipCodeDisplayed(errorMessage: string): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobileShippingQuoteAccordion.click();

                var elem = shoppingCartPageObj.errorMessageInvalidZipCodeMobile;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, elem.locator().toString() + " not in DOM or not displayed");

                    if (isDisplayed) {
                        elem.getText().then(text => {
                            expect(text).toBe(errorMessage, elem.locator().toString());
                        });
                    }
                    shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                });
            }
            else {
                var elem = shoppingCartPageObj.errorMessageInvalidZipCode;
                this.waitForElementDisplayed(shoppingCartPageObj.errorMessageInvalidZipCode);
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, elem.locator().toString() + " not in DOM or not displayed");

                    if (isDisplayed) {
                        elem.getText().then(text => {
                            expect(text).toBe(errorMessage, elem.locator().toString());
                        });
                    }
                });
            }
        });
        return this;
    }

    verifyInvalidZipCodeNotDisplayed(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();

                var elem = shoppingCartPageObj.errorMessageInvalidZipCodeMobile;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(false, elem.locator().toString() + " is displayed");
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            }
            else {
                var elem = shoppingCartPageObj.errorMessageInvalidZipCode;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(false, elem.locator().toString() + " is displayed");
                });
            }
        });
        return this;
    }

    verifyInvalidPromotionCodeNotDisplayed(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();

                var elem = shoppingCartPageObj.errorMessageInvalidPromotionCodeMobile;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(false, elem.locator().toString() + " is displayed");
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            }
            else {
                var elem = shoppingCartPageObj.errorMessageInvalidPromotionCode;
                this.checkElementDisplayed(elem).then(isDisplayed => {
                    expect(isDisplayed).toBe(false, elem.locator().toString() + " is displayed");
                });
            }
        });
        return this;
    }

    checkErrorInvalidPromotionCode(errorMessage: string, expectedDisplayed: boolean) {
        var elem = shoppingCartPageObj.errorMessageInvalidPromotionCode;
        if (expectedDisplayed) {
            this.verifyElementDisplayed(elem);
            elem.getText().then(text => {
                if (errorMessage != text) {
                    throw new Error("Error message text->" + text + "<- not equal to expected: ->" + errorMessage + "<-");
                }
            });
        } else {
            this.verifyElementNotDisplayed(elem);
        }
    }

    getShipping(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.shipping.getText().then(resultShipping => {
                var shipping = Number(resultShipping.replace(/[^0-9\.]+/g, ""));
                resolve(shipping);
            })
        });
    }

    getSubtotal(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.subTotal.getText().then(resultSubTotal => {
                var subTotal = Number(resultSubTotal.replace(/[^0-9\.]+/g, ""));
                resolve(subTotal);
            })
        });
    }

    getTotal(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.total.getText().then(resultTotal => {
                var total = Number(resultTotal.replace(/[^0-9\.]+/g, ""));
                resolve(total);
            })
        });
    }

    getDiscount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.discount.getText().then(resultDiscount => {
                console.log("returning discount : " + resultDiscount + "--------------------------");
                var discount = Number(resultDiscount.replace(/[^0-9\.]+/g, ""));
                resolve(discount);
            })
        });
    }

    getNumberOfProductsLoaded(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.productNames.getWebElements().then(elements => {
                resolve(elements.length);
            });
        });
    }

    getProductQuantity(index: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            shoppingCartPageObj.productQuantities.get(index).getAttribute('value').then(resultQuantity => {
                resolve(Number(resultQuantity));
            })
        });
    }

    verifyCheckoutButtonDisplayed(): ShoppingCartPage {
        this.checkElementDisplayed(shoppingCartPageObj.checkoutButton).then(isDisplayed => {
            expect(isDisplayed).toBe(true, " is not displayed when should be" + shoppingCartPageObj.checkoutButton.locator().toString());
        });
        return this;
    }

    verifyCheckoutButtonNotDisplayed(): ShoppingCartPage {
        this.checkElementDisplayed(shoppingCartPageObj.checkoutButton).then(isDisplayed => {
            expect(isDisplayed).toBe(false, " is displayed when should not be " + shoppingCartPageObj.checkoutButton.locator().toString());
        });
        return this;
    }

    waitForCheckoutButtonToLoad(itemCountExpected, timeout: number = 5000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return shoppingCartPageObj.checkoutButton.isPresent().then(present => {
                    resolve(present);
                });
            }, timeout)
        });
    }

    /**
    * this function will wait for specified amount of items loaded before timing out
    * @param itemCountExpected the amount of items expected to be in cart
    * @param timeout the amount of time before functions times out
    * becuase this function returns as soon as 1 element is loaded there still may be more
    * more elements to be loaded
    * Return false is no element is loaded
    */
    waitForAllProductsLoaded(itemCountExpected, timeout: number = 5000): Promise<boolean> {
        var itemsLoaded: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return shoppingCartPageObj.productNames.getWebElements().then(elements => {
                    itemsLoaded = elements.length;
                    if (itemCountExpected > 0 && itemsLoaded === itemCountExpected) {
                        resolve(true);
                        return true;
                    }
                });
            }, timeout)
                .then(null, function (error) {
                    if (itemCountExpected === 0 && itemsLoaded === 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                        console.log("Expected in cart ->" + itemCountExpected + "<- but got ->" + itemsLoaded + "<-" + error);
                    }
                });
        });
    }

    typeZipCode(zipCode: string, country: string): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.shipToCountryMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.shipToCountryMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.shipToCountryMobile.sendKeys(country);
                });
                this.checkElementDisplayed(shoppingCartPageObj.zipCodeMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.zipCodeMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.zipCodeMobile.sendKeys(zipCode);
                    shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                });
            }
            else {
                this.checkElementDisplayed(shoppingCartPageObj.shipToCountry).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.shipToCountry.locator().toString() + "not displayed");
                    element.all(by.css("[id^=commerce-cart-address_notMobile_select_1_]")).first().element(by.cssContainingText('option', country)).click();
                });
                this.checkElementDisplayed(shoppingCartPageObj.zipCode).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.zipCode.locator().toString() + "not displayed");
                    shoppingCartPageObj.zipCode.sendKeys(zipCode);
                });
            }
        });
        return this;
    }

    clearZipCode(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.zipCodeMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.zipCodeMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.zipCodeMobile.clear();
                    shoppingCartPageObj.zipCodeMobile.sendKeys("a");
                    shoppingCartPageObj.zipCodeMobile.sendKeys(protractor.Key.BACK_SPACE);
                    shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.zipCode).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.zipCode.locator().toString() + "not displayed");
                    shoppingCartPageObj.zipCode.clear();
                    shoppingCartPageObj.zipCode.sendKeys("a");
                    shoppingCartPageObj.zipCode.sendKeys(protractor.Key.BACK_SPACE);
                });
            }
        });
        return this;
    }

    typePromotionCode(promotionCode: string): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.promotionCodeMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionCodeMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionCodeMobile.sendKeys(promotionCode);
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            }
            else {
                this.checkElementDisplayed(shoppingCartPageObj.promotionCode).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionCode.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionCode.sendKeys(promotionCode);
                });
            }
        });
        return this;
    }

    clearPromotionCode(): ShoppingCartPage {
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.promotionCodeMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionCodeMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionCodeMobile.sendKeys(protractor.Key.BACK_SPACE);
                    shoppingCartPageObj.promotionCodeMobile.clear();
                    shoppingCartPageObj.mobilePromotionCodeAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.promotionCode).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.promotionCode.locator().toString() + "not displayed");
                    shoppingCartPageObj.promotionCode.sendKeys(protractor.Key.BACK_SPACE);
                    shoppingCartPageObj.promotionCode.clear();
                });
            }
        });
        return this;
    }

    typeProductQuantity(index: number, newValue: string): ShoppingCartPage {
        shoppingCartPageObj.productQuantities.get(index).clear();
        shoppingCartPageObj.productQuantities.get(index).sendKeys(newValue);
        shoppingCartPageObj.shoppingCartHeading.click();   //arbitrary click on screen to make the ui calculator run
        return this;
    }

    /**
    * @param timeout maximum time before, defaulted to 3000
    * @returns true if any products loaded, and false if 0 products loaded
    * this function will wait for atleast 1 element to be loaded for maximum of timeout
    * becuase this function returns as soon as 1 element is loaded there still may be more
    * more elements to be loaded
    * Return false is no element is loaded
    */
    waitForPossibleProductLoaded(timeout: number = 10000): Promise<boolean> {
        var itemsLoaded: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return shoppingCartPageObj.productNames.getWebElements().then(elements => {
                    itemsLoaded = elements.length;
                    if (itemsLoaded >= 1) {
                        resolve(true);
                        return true;
                    }
                });
            }, timeout)
                .then(null, function (error) {
                    resolve(false);
                    console.log("Possible products not loaded after timeout: " + error);
                });
        });
    }

    waitForSubtotalToEqual(expectedSubTotal: number): ShoppingCartPage {
        this.waitForTextToUpdate(shoppingCartPageObj.subTotal, "$" + expectedSubTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        return this;
    }

    waitForDiscountToEqual(expectedSubTotal: number): ShoppingCartPage {
        this.waitForTextToUpdate(shoppingCartPageObj.discount, "-$" + expectedSubTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        return this;
    }

    waitForShippingToEqual(expectedSubTotal: number): ShoppingCartPage {
        this.waitForTextToUpdate(shoppingCartPageObj.subTotal, "$" + expectedSubTotal.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        return this;
    }

    removeItem(index: number): ShoppingCartPage {
        shoppingCartPageObj.removeButtons.getWebElements().then(elements => {
            if (index < elements.length) {
                elements[index].click();
            } else {
                throw new Error("attempted to remove item at index " + index + " but cart array length is " + elements.length);
            }

        });
        return this;
    }
    removeAllItems(): Promise<boolean> {
        shoppingCartPageObj.removeButtons.getWebElements().then(elements => {
            elements.forEach(element => {
                browser.sleep(1000);//TODO: temporary work around, change to fix double click error prevents sequential removes
                //in the future we may add some sort of ui indication that a product cannot be removed while another one is in the process of being removed
                element.click();
            });
        });
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(() => {
                return this.getNumberOfProductsLoaded().then(nProducts => {
                    if (nProducts == 0) {
                        resolve(true);
                        return true;
                    } else {
                        return false;
                    }

                });
            }, 10000).then(null, function (error) {
                resolve(false);
                console.log("WARNING: something went wrong with removing all prdoucts: " + error);
            });
        });
    }

    clickCheckOutAsGuest(nProducts: number = 1): LoginPage {
        shoppingCartPageObj.checkoutButton.click();
        return new LoginPage(true);
    }

    clickGetShippingQuote() : ShoppingCartPage{
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')){
                shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                this.checkElementDisplayed(shoppingCartPageObj.getShippingQuoteButtonMobile).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.getShippingQuoteButtonMobile.locator().toString() + "not displayed");
                    shoppingCartPageObj.getShippingQuoteButtonMobile.click();
                    shoppingCartPageObj.mobileShippingQuoteAccordion.click();
                });
            } else {
                this.checkElementDisplayed(shoppingCartPageObj.getShippingQuoteButton).then(isDisplayed => {
                    expect(isDisplayed).toBe(true, shoppingCartPageObj.getShippingQuoteButton.locator().toString() + "not displayed");
                    shoppingCartPageObj.getShippingQuoteButton.click();
                });
            }
        });
        return this;
    }

    clickOnLock() : ShoppingCartPage {
        shoppingCartPageObj.csrLock.click().then( ()=>{
            console.log("Clicked on lock in shopping cart page");
        });
        this.waitForElementDisplayed(shoppingCartPageObj.csrUnLock)
        return this;
    }

    clickOnUnlock() : ShoppingCartPage {
        shoppingCartPageObj.csrUnLock.click().then( ()=>{
            console.log("Clicked on unlock in shopping cart page");
        });
        this.waitForElementDisplayed(shoppingCartPageObj.csrLock)
        return this;
    }

    waitDisplayedLockCart(timeout : number = 10000): Promise<boolean> {
        return this.waitForElementDisplayed(shoppingCartPageObj.csrLock, timeout);
    }

    waitDisplayedUnlockCart(timeout : number = 10000): Promise<boolean> {
        return this.waitForElementDisplayed(shoppingCartPageObj.csrUnLock, timeout);
    }

    VATTaxDisplayedByIndex() {
        return this.waitForElementDisplayed(shoppingCartPageObj.VATTax);
    }

    moveToWishListDisplayedByIndex(index: number): Promise<boolean> {
        return this.waitForElementDisplayed(shoppingCartPageObj.product.get(index).all(by.css(shoppingCartPageObj.moveToWishList)).first());
    }

    moveToWishListNotDisplayedByIndex(index: number): Promise<boolean> {
        return this.waitForElementNotDisplayed(shoppingCartPageObj.product.get(index).all(by.css(shoppingCartPageObj.moveToWishList)).first());
    }

    clickMoveToWishListByIndex(index:number): ShoppingCartPage{
        shoppingCartPageObj.product.get(index).all(by.css(shoppingCartPageObj.moveToWishList)).first().click();
        this.waitForElementDisplayed(shoppingCartPageObj.product.get(index).all(by.css(shoppingCartPageObj.wishListDropdown)).first());
        return this;
    }

    clickOnWishListName(index:number, wishListName : string = 'Default Wishlist'): ShoppingCartPage{
        shoppingCartPageObj.product.get(index).all(by.cssContainingText(shoppingCartPageObj.wishListName, wishListName)).first().click();
        return this;
    }

    cartEmpty():Promise<boolean>{
        return this.waitForElementDisplayed(shoppingCartPageObj.emptyCart);
    }

    moveToWishList(index: number): ShoppingCartPage {
        shoppingCartPageObj.product.get(index).all(by.css(shoppingCartPageObj.moveToWishList)).first().click().then(()=>{
            console.log("Clicked on move to wish list for item at index: " + index);
        });
        return this;
    }

    isWishListPresent(timeout : number = 10000): Promise<boolean> {
        return this.waitForElementPresent(shoppingCartPageObj.product.get(0).all(by.css(shoppingCartPageObj.moveToWishList)).first(), timeout);
    }



    //CSR
    waitForRemoveButtonPresent(timeout : number = 10000): Promise<boolean> {
        return this.waitForElementPresent(shoppingCartPageObj.removeButtons.get(0), timeout);
    }

    isUpdateQuantityReadonly(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            shoppingCartPageObj.productQuantities.get(0).getAttribute("readonly").then(result=>{
                resolve(result=='true');
            });
        });

    }
}