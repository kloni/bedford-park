import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';

var log4js = require("log4js");
var log = log4js.getLogger("SearchKeywordRedirect");

/**
 * SearchKeywordRedirect
 * 
 * Manual test:
 * Change the redirect content to point to other pages
 * Create a new page and have the redirect content point to the new page
 */

describe('User searches a keyword ', () => {
  var dataFile = require('./data/SearchKeywordRedirect.json');
  let storeFront: StoreFront = new StoreFront();
  let base = new BaseTest();
  let banner: Banner;
  let homePage: HomePage;
  beforeAll(function () {
  });

  beforeEach(function () {
    homePage = storeFront.navigateToHomePage();
    banner = storeFront.banner();
  });


  it('test01: to land on contact us page', () => {
    console.log('test01: to land on contact us page');
    let testData = dataFile.test01;
    //search for a keyword
    banner.typeSearchInputField(testData.searchTerm);
    let page = banner.clickSearchWithKeyword(testData.searchTerm);
    
    //verify the user landed on contact us page
    page.getCurrentPath().then(path=>{
      expect(path).toBe("/contact-us");
    });

  });

  it('test02: to land on editorial page', () => {
    console.log('test02: to land on editorial page');
    //search for a keyword
    let testData = dataFile.test02;
    banner.typeSearchInputField(testData.searchTerm);
    let page = banner.clickSearchWithKeyword(testData.searchTerm);

    //verify the user landed on an editorial page
    page.getCurrentPath().then(path=>{
      expect(path).toBe("/design-topics");
    });
  });


});