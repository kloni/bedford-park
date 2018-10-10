import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementArrayFinder, browser } from 'protractor';


var log4js = require("log4js");
var log = log4js.getLogger("BreadCrumbPageObject");

export const breadcrumbPageObj = {
    breadcrumbs: element.all(by.css("[id^=breadcrumb_li_3_")),
};

export class Breadcrumb extends BaseTest {

    constructor(nCrumbs) {
        super();
        this.waitForCountToBeUpdated(breadcrumbPageObj.breadcrumbs, nCrumbs);
        this.waitForTextToNotBe(breadcrumbPageObj.breadcrumbs.get(nCrumbs - 1), '');
    }

    getBreadcrumbCount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            breadcrumbPageObj.breadcrumbs.count().then(result => {
                console.log("Breadcrumb count returned : " + result);
                resolve(result);
            });
        });
    }

    getBreadcrumbText(index : number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            breadcrumbPageObj.breadcrumbs.get(index).getText().then(result => {
                console.log("Breadcrumb return for index " + index + " : " + result);
                resolve(result);
            });
        });
    }
    clickOnBreadCrumbAtIndex<T>(index: number, type: { new(): T }): T {
        breadcrumbPageObj.breadcrumbs.get(index).click();
        return new type();
    }

}