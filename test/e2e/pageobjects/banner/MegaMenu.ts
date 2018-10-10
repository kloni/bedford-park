import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementArrayFinder, browser } from 'protractor';
import { ProductListingPage } from '../page/ProductListingPage.po';
import { CategoryPage } from '../page/CategoryPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("MegaMenu");

export const menuObj = {
    catalogMenu: element.all(by.css("[id^=wch_mega_menu_]")).first(),
    editorialMenu: element.all(by.css("[id^=wch_mega_menu_]")).get(1)

};

export class MegaMenu extends BaseTest {

    constructor() {
        super();

        this.waitForElementDisplayed(menuObj.catalogMenu);
        this.waitForElementDisplayed(menuObj.editorialMenu);
        this.waitForStableHeight(menuObj.editorialMenu);
        this.waitForStableHeight(menuObj.catalogMenu);

    }

    navigateToPLP(category : string, numberOfProducts: number) : ProductListingPage{
        element.all(by.cssContainingText("[id^=megamenu_department_]", category)).first().click();
        return new ProductListingPage(numberOfProducts);
    }

    navigateToCategoryPage(category : string) : CategoryPage{
        element.all(by.cssContainingText("[id^=megamenu_department_]", category)).first().click();
        return new CategoryPage();
    }
    navigateToEditorialPage(editorialPageName: string){
        element.all(by.cssContainingText("[id^=megamenu_department_]", editorialPageName)).first().click();
        browser.sleep(10000);
    }

}