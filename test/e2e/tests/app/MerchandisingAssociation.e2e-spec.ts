import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { MerchandisingAssociation } from '../../pageobjects/widget/MerchandisingAssociation.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';

import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Merchandising Association");

/**
 * Merchandising Association
 */
describe('User views Merchandising Association', () => {
  var dataFile = require('./data/MerchandisingAssociation.json');
  const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');

  let category = CATALOG.LivingRoom.LivingRoomFurniture;

  //target product
  let product1: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Modern Armchair"].productInfo;
  let sku1: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Modern Armchair"]["LR-FUCH-0001-0001"];

  //merchandising associations
  let skus: Sku[] = [];
  let products: StockholmProduct[] = [];
  skus.push(CATALOG.LivingRoom.LivingRoomFurniture["Soft Vintage Armchair"]["LR-FUCH-0003-0001"]);
  skus.push(CATALOG.LivingRoom.LivingRoomFurniture["Casual Armchair"]["LR-FUCH-0002-0001"]);
  skus.push(CATALOG.LivingRoom.LivingRoomLighting["Modern Pendant Light"]["LR-LITB-0001-0001"]);

  let p1 = CATALOG.LivingRoom.LivingRoomFurniture["Soft Vintage Armchair"].productInfo;
  let p2=  CATALOG.LivingRoom.LivingRoomFurniture["Casual Armchair"].productInfo;
  let p3 = CATALOG.LivingRoom.LivingRoomLighting["Modern Pendant Light"].productInfo;

  const minImageSize = 50;

  var storeFront: StoreFront;
  var banner : Banner;

  beforeAll(function () {
    let base = new BaseTest();
  });

  beforeEach(function () {
    storeFront = new StoreFront();
    banner = storeFront.banner();
  });

  it('test01: to view products listed in the merchandising association widget', () => {
    console.log('test01: to view products listed in the merchandising association widget');
    var testData = dataFile;

    //Navigate to a product that has a merchandising association widget
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToNextPage();
    plp = new ProductListingPage(12);

    plp.clickProductAtIndex(9);
    let pdp: ProductPage = new ProductPage(product1.name);

    let merchandiseAssociation: MerchandisingAssociation = new MerchandisingAssociation(0);

    //Verify the expected skus are there with all the correct info
    let count: number = 0;
    skus.forEach(sku => {
      merchandiseAssociation = new MerchandisingAssociation(count);

      merchandiseAssociation.getImageUrl().then(result => {
        result = result.slice(result.lastIndexOf("/") + 1);
        expect(result).toBe(sku.imageFull, " image check on iteration : " + count);
      });
      merchandiseAssociation.getImageSize().then(result => {
        expect(result.height).toBeGreaterThan(minImageSize);
        expect(result.width).toBeGreaterThan(minImageSize);
      });
      merchandiseAssociation.isDisplayed().then(result => {
        expect(result).toBe(true);
      });
      count++;
    });

    //check the product names and prices
    merchandiseAssociation = new MerchandisingAssociation(0);
    merchandiseAssociation.getName().then(result => {
      expect(result).toBe(p1.name);
    });

    merchandiseAssociation.getPrice().then(result => {
      expect(result).toBe("$"+ p1.minPrice + " - $"+p1.maxPrice);
    });

    merchandiseAssociation = new MerchandisingAssociation(1);
    merchandiseAssociation.getName().then(result => {
      expect(result).toBe(p2.name);
    });

    merchandiseAssociation.getPrice().then(result => {
      expect(result).toBe("$"+ p2.minPrice + " - $"+p2.maxPrice);
    });

    merchandiseAssociation = new MerchandisingAssociation(2);
    merchandiseAssociation.getName().then(result => {
      expect(result).toBe(p3.name);
    });

    merchandiseAssociation.getPrice().then(result => {
      expect(result).toBe("$"+ p3.maxPrice);
    });

  });

  it('test02: to Navigate to the detail page of a listed product', () => {
    console.log('test02: to Navigate to the detail page of a listed product');

    var testData = dataFile;

    //target sku/product merchandising association of product
    let target = 1;

    //Navigate to a product that has a merchandising association widget
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('2');
    plp = new ProductListingPage(12);
    plp.clickProductAtIndex(9);

    let pdp: ProductPage = new ProductPage(product1.name);
    let merchandiseAssociation: MerchandisingAssociation = new MerchandisingAssociation(target);

    merchandiseAssociation.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });

    //Click on product
    merchandiseAssociation.clickOnImage();
    let productDetailsPage = new ProductPage(p2.name);

    //Verify the product Name
    productDetailsPage.getProductName().then(result => {
      expect(result).toBe(p2.name);
    });

  });

  //TODO: is there a scrolling merchandising association in Stockholm?
  xit('test03: to scroll to next then back to left', () => {
    log.info('test03: to scroll to next then back to left');

    //Navigate to a product that has a merchandising association widget
    storeFront.navigateTo('/product?productNumber=auroraWMDRS-22');
    let merchandiseAssociation: MerchandisingAssociation = new MerchandisingAssociation(0);

    //verify products are not visible
    //PRODUCT4
    merchandiseAssociation = new MerchandisingAssociation(4, false);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //PRODUCT5
    merchandiseAssociation = new MerchandisingAssociation(5, false);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //scroll to next
    merchandiseAssociation.clickCarouselNext(1);

    //verify products are visible
    //PRODUCT4
    merchandiseAssociation = new MerchandisingAssociation(4, true);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT5
    merchandiseAssociation = new MerchandisingAssociation(5, true);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //verify products arent visible
    //PRODUCT0
    merchandiseAssociation = new MerchandisingAssociation(0, false);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //PRODUCT1
    merchandiseAssociation = new MerchandisingAssociation(1, false);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //scroll to previous
    merchandiseAssociation.clickCarouselPrevious(1);

    //verify products are visible
    //PRODUCT0
    merchandiseAssociation = new MerchandisingAssociation(0, true);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT1
    merchandiseAssociation = new MerchandisingAssociation(1, true);
    merchandiseAssociation.isDisplayed().then(result => {
      expect(result).toBe(true);
    });


  });


});
