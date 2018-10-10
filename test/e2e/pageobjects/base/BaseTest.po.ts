import { browser, protractor, ElementFinder } from 'protractor';
import { } from 'jasmine';
import { ElementArrayFinder } from 'protractor/built/element';
var log4js = require("log4js");
var log = log4js.getLogger("BaseTest");

/**
* Base class all page objects extend from
*
* @class
*/

export class BaseTest {

    constructor() {

    }

    navigateTo(path = '/') {
        if (path === '/') {
            console.log("Navigating to :" + browser.params.storeBaseUrl);
            return browser.get(browser.params.storeBaseUrl);
        } else {
            console.log("Navigating to :" + browser.params.storeBaseUrl + path);
            return browser.get(browser.params.storeBaseUrl + path);
        }
    }

    speedOfTests(time: number) {
        const origFn = browser.driver.controlFlow().execute;

        browser.driver.controlFlow().execute = function () {
            const args = arguments;

            // queue wait
            origFn.call(browser.driver.controlFlow(), function () {
                return protractor.promise.delayed(time);
            });

            return origFn.apply(browser.driver.controlFlow(), args);
        };
    }

    /**
     * Function will wait timeout ms until element is displayed
     * @param elem target element to check if displayed
     * @param timout optional amount of time that function will wait for element to be present
     * @returns true if element is displayed before timeout and false if element is not in DOM or hidden after timeout
     */
    checkElementDisplayed(elem: ElementFinder, timout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isPresent().then(isPresent => {
                    if (isPresent) {
                        elem.isDisplayed().then(isDisplayed => {
                            if (isDisplayed) {
                                resolve(true);
                                return true;
                            }
                        });
                    }
                    return false;
                })
            }, 10000).then(null, error => {
                resolve(false);
            });
        });
    }

    waitForElement(elem: ElementFinder) {
        return browser.wait(function () {
            return elem.isPresent();
        }, 10000)
            .then(null, function (error) {
                console.log('Element not loaded: ' + elem.locator().toString() + error);
                return false;
            });

    }

    verifyElementEnabled(elem: ElementFinder) {
        var EC = protractor.ExpectedConditions;
        this.verifyElementDisplayed(elem).then(() => {
            elem.isEnabled().then(enabled => {
                if (!enabled) {
                    elem.getText().then(text => {
                        throw new Error("Element: " + elem.locator().toString() + " is disabled");
                    });
                }
            });
        });
    }

    verifyElementNotEnabled(elem: ElementFinder) {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.presenceOf(elem), 10000, "Element not found :" + elem.locator().toString()).then(function () {
            elem.isEnabled().then(enabled => {
                if (enabled) {
                    elem.getText().then(text => {
                        throw new Error("Element text: " + elem.locator().toString() + " is enabled");
                    });
                }
            });
        });
    }

    verifyElementDisplayed(elem: ElementFinder) {
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.presenceOf(elem), 10000)
            .then(null, function (error) {
                console.log('Element not displayed: ' + elem.locator().toString() + error);
                return false;
            });

    }

    verifyElementNotDisplayed(elem: ElementFinder) {
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.invisibilityOf(elem), 10000)
            .then(null, function (error) {
                console.log('Element not displayed: ' + elem.locator().toString() + error);
                return false;
            });
    }

    verifyElementClickable(elem: ElementFinder) {
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.elementToBeClickable(elem), 10000)
            .then(null, function (error) {
                console.log('Element not clickable: ' + elem.locator().toString() + error);
                return false;
            });
    }

    waitForTextToBeUpdated(elem: ElementFinder, expectedText? : string) {
        return browser.wait(function () {
            return elem.getText().then(function (text) {
                if(expectedText){
                    return text === expectedText;
                }else{
                    return Number(text) > 0
                }
            });
        }, 10000)
            .then(null, function (error) {
                console.log('Text is not updated to ' + expectedText + ' for elem:' + elem.locator().toString() + error);
                return false;
            });
    }

    waitForTextToBeUpdatedToContain(elem : ElementFinder, expectedText: string) {
        return browser.wait(function () {
            return elem.getText().then(function (text) {
                if(text.includes(expectedText)){
                    return true;
                }
            });
        }, 20000).then(null, function (error) {
            log.info('Text is not updated to: ' + expectedText + " in elem:" + elem.locator().toString() + error);
            return false;
        });
    }

    waitForCountToBeUpdated(elems: ElementArrayFinder, expectedCount) {
        let actualCount : number = -1;
        return browser.wait(function () {
            return elems.count().then(function (text) {
                actualCount = text;
                return text === expectedCount;
            });
        }, 10000)
            .then(null, function (error) {
                console.log('Count is not updated/correct: ' + actualCount + " when expected is " + expectedCount + " for element: " + elems.locator().toString() + error);
                return false;
            });
    }

    getCssValue(cssStyleProperty: string, elem: ElementFinder): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            elem.getCssValue(cssStyleProperty).then(result => {
                resolve(result);
            });
        });
    }

    /**
     * Use this method to get the class names for an element
     */
    getClassNames(elem: ElementFinder): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            elem.getAttribute('class').then(classNames => {
                console.log('Class Names for: ', classNames);
                resolve(classNames);
            });
        });
    }

    /**
     * Use this method to get the attribute values for an element
     */
    getAttribute(elem: ElementFinder, attributeName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            elem.getAttribute(attributeName).then(value => {
                console.log('Attribute value Names for: ',  attributeName,' - ', value);
                resolve(value);
            });
        });
    }

    /**
     * Function will wait timeout ms until elements css property value is upated to expected value
     * Function assumes element is in the dom/present
     * @param elem target element for css property update
     * @param cssProperty target css property
     * @param expectedValue expected value for css property
     * @param timout optional amount of time that function will wait for element to be present, default 10000 ms
     * @returns true if elements css property is equal to expected value before timeout, false otherwise
     */
    waitForCssPropertyToUpdate(elem, cssProperty, expectedCssValue, timeout = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getCssValue(cssProperty).then(result => {
                    if (result === expectedCssValue) {
                        resolve(true);
                        return true;
                    }
                });
            }, timeout).then(null, error => {
                console.log(elem.locator() + " css property ->" + cssProperty + "<- did not update to->" + expectedCssValue + "<-");
                resolve(false);
            });
        });
    }


    /**
     * Function will wait timeout ms until element is displayed, will throw error if not displayed or not present
     * @param elem target element to wait for clickable
     * @param timout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns resolve true if element is enabled before timeout and resolve false if not enabled
     */
    waitForElementEnabled(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isEnabled().then(isEnabled => {
                    if (isEnabled) {
                        resolve(true);
                        return true;
                    }

                });
            }, timeout).then(null, error => {
                resolve(false);
            });
        });
    }

    /**
     * Function will wait timeout ms until element is displayed, will throw error if not displayed or not present
     * @param elem target element to wait for displayed
     * @param timout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns true if element is displayed before timeout and false if not displayed within timeout period
     */
    waitForElementDisplayed(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isPresent().then(isPresent => {
                    if (isPresent) {
                        return elem.isDisplayed().then(isDisplayed => {
                            if (isDisplayed) {
                                resolve(true);
                                return true;
                            }
                        });
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + " waitForElementDisplayed " + error);
                resolve(false);
            });
        });
    }

    /**
    * Function will wait timeout ms until element is not displayed, will resolve false if element stays displayed for timeout duration
    * @param elem target element to wait for not displayed
    * @param timout optional amount of time that function will wait for element to be not present , default 10000 ms
    * @returns true if element is not displayed before timeout and throws error if not displayed
    * WARNING this function will fail if you call an element that is in the process of being removed from the DOM
    * In those cases use waitForElementNotPresent()
    */
    waitForElementNotDisplayed(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isDisplayed().then(isDisplayed => {
                    if (!isDisplayed) {
                        resolve(true);
                        return true;
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + " is displayed: " + error);
                resolve(false);
            });
        });
    }

    /**
     * Function will wait timeout ms until element is not present, will resolve false if element says present for timeout duration
     * @param elem target element to wait for not present
     * @param timout optional amount of time that function will wait for element to be not present , default 10000 ms
     * @returns true if element is not present before timeout and throws error if not displayed
     */
    waitForElementNotPresent(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isPresent().then(isPresent => {
                    if (!isPresent) {
                        resolve(true);
                        return true;
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + " is present: " + error);
                resolve(false);
            });
        });
    }

    /**TODO:REMOVE NOT USED
     * Function will wait timeout ms until element is not present, will resolve false if element says present for timeout duration
     * @param elem target element to wait for not present
     * @param timout optional amount of time that function will wait for element to be not present , default 10000 ms
     * @returns true if element is not present before timeout and throws error if not displayed
     */
    ElementNotPresent(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            elem.isPresent().then(isPresent => {
                if (!isPresent) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Function will wait timeout ms until element is present, will resolve false if element is not present for timeout duration
     * @param elem target element to wait for present
     * @param timeout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns true if element is present before timeout and throws error if not present
     */
    waitForElementPresent(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isPresent().then(isPresent => {
                    if (isPresent) {
                        resolve(true);
                        return true;
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + " is not present: " + error);
                resolve(false);
            });
        });
    }

    /**
     * Function will wait timeout ms until one of the elements is present, will resolve false if elements are not present for timeout duration
     * @param elem1 target element to wait for present
     * @param elem2 target element to wait for present
     * @param timout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns true if one of the elements is present before timeout and throws error if not present
     */
    waitForMinimumOneElementPresent(elem1: ElementFinder, elem2: ElementFinder, elem3: ElementFinder, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem1.isPresent().then(isPresent1 => {
                    return elem2.isPresent().then(isPresent2 => {
                        return elem3.isPresent().then(isPresent3 => {
                            if (isPresent1 || isPresent2 || isPresent3) {
                                console.log(isPresent1 + "-" + isPresent2 + "-" + isPresent3 + "is present for ---->" + elem1.locator() + "<----> " + elem2.locator() + "<---->" + elem3.locator() + "<----");
                                resolve(true);
                                return true;
                            }
                            return false;
                        });
                    });
                })
            }, timeout).then(null, error => {
                console.log("All elements not present->" + elem1.locator() + "<----> " + elem2.locator() + "<---->" + elem3.locator() + "<----" + error);
                resolve(false);
            });
        });
    }


    /**Function will wait for text of element to not be a specific value
     * For Example, to wait for a text field to not be an empty string
     * @param elem target element to wait for present
     * @param textNotToBe text that will be waited for until not prsent in elem
     * @param timout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns true if element is present before timeout and throws error if not present
     */
    waitForTextToNotBe(elem: ElementFinder, textNotToBe: string, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getText().then(result => {
                    if (result !== textNotToBe)
                    {
                        console.log(elem.locator() + " is not ->" + textNotToBe + "<- but is:" + result + ".");
                        resolve(true);
                        return true;
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + " is not present: " + error);
                resolve(false);
            });
        });
    }

    /**Function will wait for element to have stable height
     * This function will repeatedly get location of the item until two consective returns yeild the same height
     * @param elem target element to wait for stable height
     * @param timout optional amount of time that function will wait for element to stabalize height , default 10000 ms
     * @returns true if element has two consectiv
     */
    waitForStableHeight(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        let currentY: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getLocation().then(function (iLocation) {
                    if (iLocation.y !== currentY) {
                        currentY = iLocation.y;
                    } else {
                        log.info(elem.locator() + " has stable height at : " + iLocation.y);
                        resolve(true);
                        return true;
                    }
                });
            }, 10000)
                .then(null, function (error) {
                    log.info('Y location not stable for element: ' + elem.locator().toString() + error);
                    resolve(false);
                    return false;
                });
        });
    }

    /**Function will wait for element to have stable x location
     * This function will repeatedly get location of the item until two consective returns yeild the same horizontal location
     * @param elem target element to wait for stable height
     * @param timout optional amount of time that function will wait for element to stabalize height , default 10000 ms
     * @returns true if element has two consectiv
     */
    waitForStableXLocation(elem: ElementFinder, timeout: number = 10000): Promise<boolean> {
        let currentX: number = -1;
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getLocation().then(function (iLocation) {
                    console.log("ilocation.x = " + iLocation.x + "    and currentX = " + currentX)
                    if (iLocation.x !== currentX) {
                        currentX = iLocation.x;
                    } else {
                        resolve(true);
                        return true;
                    }
                });
            }, 10000)
                .then(null, function (error) {
                    log.info('X location not stable for element: ' + elem.locator().toString() + error);
                    resolve(false);
                    return false;
                });
        });
    }

    waitForTextToUpdate(elem, expectedText, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getText().then(function (text) {
                    log.info("expected text---->" + expectedText + "<----but got------->" + text);
                    if (text === expectedText) {
                        resolve(true);
                        return true;
                    }
                });
            }, 10000)
                .then(null, function (error) {
                    log.info('Text is not updated: ' + elem.locator().toString() + error);
                    resolve(false);
                    return false;
                });
        });
    }

    waitForElementNotClickable(elem: ElementFinder): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.isEnabled();
            }, 10000)
                .then(null, function (error) {
                    return false;
                });
        });
    }

    /**Function will wait size of element to be greater than specific amount
     * For Example, to wait for a text field to not be an empty string
     * @param elem target element to wait for present
     * @param height height of target element, expected to be greater than specified value, default 0
     * @param width width of target element, expected to be greater than specified value, default 0
     * @param timout optional amount of time that function will wait for element to be present , default 10000 ms
     * @returns true if element has greater height and width than specied, resolves false otherwise
     */
    waitForElementSizeGreaterThan(elem: ElementFinder, height: number = 0, width: number = 0, timeout: number = 10000): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            return browser.wait(function () {
                return elem.getSize().then(result => {
                    if (result.height > height && result.width > width) {
                        resolve(true);
                        return true;
                    }
                })
            }, timeout).then(null, error => {
                console.log(elem.locator() + "element height AND width not greater than expected height: " + height + " width: " + width + ". " + error);
                resolve(false);
            });
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
   waitForAllProductsLoaded(elem,itemCountExpected, timeout: number = 5000): Promise<boolean> {
    var itemsLoaded: number = -1;
    return new Promise<boolean>((resolve, reject) => {
        return browser.wait(function () {
            return elem.getWebElements().then(elements => {
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

    getCurrentPath() : Promise<string> {
        return new Promise<string>((resolve, reject)=> {
            browser.getCurrentUrl().then(url => {
                resolve(url.substring(browser.baseUrl.length-1))
            });
        });
    }

}