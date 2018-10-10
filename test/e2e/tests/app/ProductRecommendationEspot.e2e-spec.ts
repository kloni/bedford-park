import { StoreFront } from '../../pageobjects/StoreFront.po';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';
import { ProductFeatured } from '../../pageobjects/widget/ProductFeatured.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StockholmProduct, Sku, StockholmCatalog } from './data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("ProductRecommendationEspot");

/**
* Product Recommendation Espots on
* Home Page
*/
describe('User views product recommendation espot', () => {
  var dataFile;
  let storeFront: StoreFront;
  const minImageSize = 50;

  var dataFile = require('./data/ProductRecommendationEspot.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');

  let product1 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Stonehenge UltraCozy Single Sofa"].productInfo;
  let sku1 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Stonehenge UltraCozy Single Sofa"]["LR-FNTR-0004-0001"];
  let product2 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Plump Leather Sofa"].productInfo;
  let sku2 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Plump Leather Sofa"]["LR-FNTR-CO-0004-0001"];
  let product3 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Abstract Wooden Coffee Table"].productInfo;
  let sku3 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Abstract Wooden Coffee Table"]["LR-FNTR-TB-0001-0003"];
  let product4 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Soft Plush Sofa"].productInfo;
  let sku4 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Soft Plush Sofa"]["LR-FNTR-CO-0007-0001"];
  let product5 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Casual Sofa"].productInfo;
  let sku5 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Casual Sofa"]["LR-FNTR-CO-0006-0004"];
  let product6 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["StyleHome Modern Plain Single Large Sofa"].productInfo;
  let sku6 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["StyleHome Modern Plain Single Large Sofa"]["LR-FNTR-CO-0001-0001"];


  beforeAll(function () {
  });

  beforeEach(function () {
    storeFront = new StoreFront();
  });

  it('test01 : to view product recommendation list and navigate to product details', () => {
    console.log('test01: [Recommended product type] to view product recommdation list');
    var testData = dataFile.test01

    // GIVEN user has home page loaded with product recommendation list
    // THEN there are 6 product are displayed with correct (1) names, (2) prices and (3) images present
    // PRODUCT1
    let pRecommended: ProductRecommended = new ProductRecommended(0);
    pRecommended.getName().then(result => {
      expect(result).toBe(product1.name);
    });
    pRecommended.getPrice().then(result => {
      expect(result).toBe(sku1.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku1.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    // PRODUCT2
    pRecommended = new ProductRecommended(1);
    pRecommended.getName().then(result => {
      expect(result).toBe(product2.name);
    });
    pRecommended.getPrice().then(result => {
      console.log('results:' , result);
      expect(result).toBe(sku2.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku2.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    pRecommended = new ProductRecommended(2);

    //PRODUCT3
    pRecommended.getName().then(result => {
      expect(result).toBe(product3.name);
    });
    pRecommended.getPrice().then(result => {
      expect(result).toBe(sku3.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku3.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    // //PRODUCT4
    pRecommended = new ProductRecommended(3);
    pRecommended.getName().then(result => {
      expect(result).toBe(product4.name);
    });
    pRecommended.getPrice().then(result => {
      expect(result).toBe(sku4.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku4.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT5
    pRecommended = new ProductRecommended(4, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //PRODUCT6
    pRecommended = new ProductRecommended(5, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //WHEN user scrolls right
    pRecommended.clickCarouselNext(1);

    //THEN PRODUCTS 5 AND 6 are displayed and have correct name, price and image
    //PRODUCT5
    pRecommended = new ProductRecommended(4);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });
    pRecommended.getName().then(result => {
      expect(result).toBe(product5.name);
    });
    pRecommended.getPrice().then(result => {
      expect(result).toBe(sku5.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku5.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });

    //PRODUCT6
    pRecommended = new ProductRecommended(5);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });
    pRecommended.getName().then(result => {
      expect(result).toBe(product6.name);
    });
    pRecommended.getPrice().then(result => {
      expect(result).toBe(sku6.priceOffering);
    });
    pRecommended.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku6.imageFull);
    });
    pRecommended.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });

    //THEN User can see the last 4 but not the first two
    //PRODUCT1
    pRecommended = new ProductRecommended(0, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //PRODUCT1
    pRecommended = new ProductRecommended(1, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });
    //PRODUCT2
    pRecommended = new ProductRecommended(2);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT3
    pRecommended = new ProductRecommended(3);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });
    //PRODUCT4
    pRecommended = new ProductRecommended(4);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT5
    pRecommended = new ProductRecommended(5, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //WHEN user scrolls left
    pRecommended.clickCarouselPrevious(1);

    //THEN User can see the first 4 but not the last two
    //PRODUCT1
    pRecommended = new ProductRecommended(0);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT2
    pRecommended = new ProductRecommended(1);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });
    //PRODUCT3
    pRecommended = new ProductRecommended(2);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //PRODUCT4
    pRecommended = new ProductRecommended(3);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(true);
    });
    //PRODUCT5
    pRecommended = new ProductRecommended(4, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //PRODUCT6
    pRecommended = new ProductRecommended(5, false);
    pRecommended.isDisplayed().then(result => {
      expect(result).toBe(false);
    });

    //WHEN user clicks on product image in 3rd position and product page is loaded
    pRecommended = new ProductRecommended(2);
    let productPage: ProductPage = pRecommended.clickOnImage();

    //THEN product page is loaded and product name is correct
    productPage.getProductName().then(result => {
      expect(result).toBe(product3.name);
    });

    //WHEN user loads home page again back to storefront with homepage loaded
    new StoreFront();

    //AND
    //WHEN user clicks on product text in 2nd position and product page is loaded
    pRecommended = new ProductRecommended(1);
    productPage = pRecommended.clickOnName();

    //THEN product page is loaded and product name is correct
    productPage.getProductName().then(result => {
      expect(result).toBe(product2.name);
    });
  });

  it('test02: to view featured product', () => {
    console.log('test 02: [Featured Product] to view featured product and navigate to product details');
    var testData = dataFile.test02;

    let product1 : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Flared Accent Chair"].productInfo;
    let sku1 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Flared Accent Chair"]["LR-FNTR-0002-0001"];
    let sku2 : Sku = CATALOG.LivingRoom.LivingRoomFurniture["Flared Accent Chair"]["LR-FNTR-0002-0004"];

    //GIVEN user has home page loaded with Featured Product

    //THEN there is a featured product displayed with correct (1) names, (2) prices and (3) images present
    //PRODUCT1
    let pFeatured: ProductFeatured = new ProductFeatured();
    pFeatured.getName().then(result => {
      expect(result).toBe(product1.name);
    });
    pFeatured.getMinPrice().then(result => {
      expect(result).toBe(sku1.priceOffering);
    });
    pFeatured.getMaxPrice().then(result => {
      expect(result).toBe(sku2.priceOffering);
    });

    pFeatured.getDescription().then(result => {
      expect(result).toBe(product1.shortDescription);
    });
    pFeatured.getImageUrl().then(result => {
      result = result.slice(result.lastIndexOf("/") + 1);
      expect(result).toBe(sku1.imageFull);
    });
    pFeatured.getImageSize().then(result => {
      expect(result.height).toBeGreaterThan(minImageSize);
      expect(result.width).toBeGreaterThan(minImageSize);
    });
    pFeatured.isDisplayed().then(result => {
      expect(result).toBe(true);
    });

    //WHEN user clicks on the image
    let productPage: ProductPage = pFeatured.clickOnImage();

    //THEN the product details page is displayed with correct product name
    productPage.getProductName().then(result => {
      expect(result).toBe(product1.name);
    });

    //WHEN user loads homepage again they can view featured product again
    new StoreFront();
    pFeatured = new ProductFeatured();

    //AND
    //WHEN user clicks on shop now button of featured product
    pFeatured.clickOnShopNow();

    //THEN the product details page is displayed with correct product name
    productPage.getProductName().then(result => {
      expect(result).toBe(product1.name);
    });

  });

});
