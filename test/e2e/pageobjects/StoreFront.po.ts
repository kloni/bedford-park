import {BaseTest } from  './base/BaseTest.po';
import { by, element, browser } from 'protractor';
import { HomePage } from  './page/HomePage.po';
import { LoginPage } from  './page/LoginPage.po';
import { Banner } from  './banner/Banner.po';
import { RegistrationPage } from './page/RegistrationPage.po';
import { ProductListingPage } from './page/ProductListingPage.po';

export const storeFrontObj = {
    navmenu: element(by.css("[id^=nav-menu")),
    category: element.all(by.cssContainingText("[id^=megamenu_department_]", "CATEGORY_NAME")).first()
}
var log4js = require("log4js");
var log = log4js.getLogger("StoreFront");

export class StoreFront extends BaseTest {
    constructor() {
      super();
      this.navigateTo();
    }

    navigateToHomePage(){
        this.navigateTo();
        return new HomePage();
    }

    navigateToLogin(){
        this.navigateTo("/sign-in");
        return new LoginPage();
    }
    navigateToRegistration(){
        this.navigateTo("/sign-in");
        return new RegistrationPage();
    }

    banner() {
      return new Banner();
    }

    navigateToURLVoid (url: string): void{
        this.navigateTo(url);
    }

    navigateToURL<T>(url: string, type: { new(): T }): T {
        this.navigateTo(url);
        return new type();
    }


}