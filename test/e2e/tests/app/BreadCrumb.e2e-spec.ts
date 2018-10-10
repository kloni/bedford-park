import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Breadcrumb } from '../../pageobjects/banner/Breadcrumb.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Breadcrumb");

/**
 * Breadcrumb
 * Tests breadcrumb displayed after navigating to different categories and products.
 * TODO: currently this suite uses temporary category page for testing purposes and
 * tests will have to be redone for actual Stockholm categories and products after
 * they are available.
 */
describe('User views Breadcrumb', () => {
  var dataFile = require('./data/BreadCrumb.json');
  let storeFront : StoreFront = new StoreFront();
  let banner : Banner = storeFront.banner();

  beforeAll(function () {
    let base = new BaseTest();
  });

  beforeEach(function () {
  });

  it('test01: to view breadcrumb in a category page', () => {
    console.log('test01: to view breadcrumb in a category page');
    var testData = dataFile.test01

    //Given homepage is loaded

    //WHEN user navigates to Living Room category page
    banner.checkMegamenuExists();
    banner.cartDisplayed();
    banner.storeLocatorDisplayed();
    let megaMenu = banner.openMenu();
    let dept: CategoryPage = megaMenu.navigateToCategoryPage('Living Room');

    //AND
    //WHEN user navigates Living room
    dept.goToCategory(testData.categoryA1[0], testData.categoryA1[1]);

    //THEN the bread crumb will show the users path GROCERY-DAIRY
    let breadcrumb : Breadcrumb = new Breadcrumb(2);
    breadcrumb.getBreadcrumbText(0).then(result =>{
      expect(result).toBe(testData.department);
    });
    breadcrumb.getBreadcrumbText(1).then(result =>{
      expect(result).toBe(testData.category);
    });
    breadcrumb.getBreadcrumbCount().then(result=> {
      expect(result).toBe(2);
    });

  });

  it('test02: to view breadcrumb in a product page', () => {
    console.log('test02: to view breadcrumb in a product page');
    var testData = dataFile.test02

    //Given homepage is loaded

    //WHEN user navigates to Living Room  category page
    let megaMenu = banner.openMenu();
    let dept: CategoryPage = megaMenu.navigateToCategoryPage('Living Room');

    //AND
    //WHEN user navigates Furniture category
    dept.goToCategory(testData.categoryA1[0], testData.categoryA1[1]);

    //THEN the bread crumb will show the users path Living Room - Furniture
    let breadcrumb : Breadcrumb = new Breadcrumb(2);
    breadcrumb.getBreadcrumbText(0).then(result =>{
      expect(result).toBe(testData.department);
    });
    breadcrumb.getBreadcrumbText(1).then(result =>{
      expect(result).toBe(testData.category);
    });
    breadcrumb.getBreadcrumbCount().then(result=> {
      expect(result).toBe(2);
    });

    //AND
    //WHEN user navigates Living Room - Furniture- Wooden Angled Chair
    banner.openMenu();
    let plp: ProductListingPage = megaMenu.navigateToPLP('Furniture', 12);
    plp.clickProductAtIndex(0);

    //THEN the bread crumb will show the users path
    breadcrumb = new Breadcrumb(3);
    breadcrumb.getBreadcrumbText(0).then(result =>{
      expect(result).toBe(testData.department);
    });
    breadcrumb.getBreadcrumbText(1).then(result =>{
      expect(result).toBe(testData.category);
    });
    breadcrumb.getBreadcrumbText(2).then(result =>{
      expect(result).toBe(testData.product);
    });
    breadcrumb.getBreadcrumbCount().then(result=> {
      expect(result).toBe(3);
    });

    //check page navigated to a product listing page
    breadcrumb.clickOnBreadCrumbAtIndex(1, ProductListingPage);
    plp = new ProductListingPage(12);

    plp.getFilterHeading().then(heading => {
      expect(heading).toEqual('Filter by');
    });

    //THEN the bread crumb will show the users path Living Room - Furniture
    breadcrumb = new Breadcrumb(2);
    breadcrumb.getBreadcrumbText(0).then(result =>{
      expect(result).toBe(testData.department);
    });
    breadcrumb.getBreadcrumbText(1).then(result =>{
      expect(result).toBe(testData.category);
    });
    breadcrumb.getBreadcrumbCount().then(result=> {
      expect(result).toBe(2);
    });

  });
});