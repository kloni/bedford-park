import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { BundlePage } from '../../pageobjects/page/BundlePage.po';
import { KitPage } from '../../pageobjects/page/KitPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("BundleKitPages");

interface Bundle {
  bundleName: string,
  bundleSku: string,
  bundleShortDescription: string,
  bundleLongDescription: string,
  slideImages : string[],
  bundleProducts : string[];
}
/** Bundle and Kit pages */

describe('User views product page', () => {
  const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
  const dataFile = require('./data/BundleAndKitPage.json');
  const BUNDLES = require('./data/StockholmBundles.json');
  const bundleData : Bundle = BUNDLES["Nordic Style"];

  //bundle will be populated with sku and product data for tcs
  let bundle: [Sku[], StockholmProduct][] = [];

  //bundleProducts contains the relative path to products in StockholmCatalog.json
  bundleData.bundleProducts.forEach(bProduct => {
    let result : any = CATALOG; //used for tunelling to target products
    let sProduct : StockholmProduct;//product to be pushed into bundle
    let skus : Sku[] = [];          //skus to be pushed into bundle

    //tunnel into target produt data
    bProduct.split('.').forEach(key => {
      result = result[key];
    });

    //product info and all skues associated with product, therefore product info must be removed
    let allSkuKeys: string[] = Object.keys(result);
    
    //remove and assign stockholm product and allSkuKeys now only contains target skus
    sProduct = result[allSkuKeys.shift()];

    //push each target sku into skus array
    allSkuKeys.forEach(sku => {
      skus.push(result[sku])
    });
    //push target skues and product into bundle array
    bundle.push([skus, sProduct]);
  });

  let storeFront : StoreFront = new StoreFront();
  var banner : Banner;

  beforeAll(function () {
  });

  beforeEach(function () {
    storeFront = new StoreFront();
    banner = storeFront.banner();
  });

  afterEach(function () {
  });

  it('test01: to view kit packages', () => {
    console.log('test01: to view kit packages');
    let testData = dataFile.test01;
    let category = CATALOG.LivingRoom.LivingRoomFurniture;

    //navigate to kit product page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(3);

    let kitPage = new KitPage();

    //check the included products and price
    kitPage.getAllIncludedProductNames().then(productNames => {
      let index = 0;
      for (let name of productNames) {
        let product: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture[testData.kitIncludedProductNames[index]].productInfo;
        expect(name).toBe(product.name);
        index++;
      }
    });
    kitPage.getAllIncludedProductPrices().then(productPrices => {
      let index = 0;
      for (let price of productPrices) {
        let productSku: Sku = CATALOG.LivingRoom.LivingRoomFurniture[testData.kitIncludedProductNames[index]][testData.kitIncludedProductSkus[index]];
        expect(price).toBe(productSku.priceOffering);
        index++;
      }
    });
  });

  it('test02: to navigate to included products by clicking on the product image', () => {
    console.log('test02: to navigate to included products by clicking on the product image');
    let testData = dataFile.test02;
    let category = CATALOG.LivingRoom.LivingRoomFurniture;
    let includedProduct: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture[testData.kitIncludedProduct].productInfo;

    //navigate to kit product page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(3);
    let kitPage = new KitPage();

    //click on the included product
    let productPage: ProductPage = kitPage.clickIncludedProductImgByIndex(0);

    //check the product heading name
    productPage.getProductName().then(productName => {
      expect(productName).toBe(includedProduct.name);
    });
  });

  it('test03: to view kit packages and add to cart', () => {
    console.log('test03: to view kit packages and add to cart');
    let testData = dataFile.test03;
    let category = CATALOG.LivingRoom.LivingRoomFurniture;
    let kitProduct: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture[testData.productName].productInfo;
    
    //navigate to kit product page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(3);
    let kitPage = new KitPage();

    //add to cart
    kitPage.addToCart(testData.productQuantity);

    //go to cart
    let shoppingCartPage: ShoppingCartPage = kitPage.clickViewCart(testData.productQuantity);

    //verify the items are in cart
    shoppingCartPage.getProductNameAtIndex(0).then(productName => {
      expect(productName).toBe(kitProduct.name);
    });
    shoppingCartPage.getProductQuantityAtIndex(0).then(quantity => {
      expect(quantity).toEqual(testData.productQuantity);
    });
    shoppingCartPage.getProductSKUAtIndex(0).then(sku => {
      expect(sku).toContain(kitProduct.productCode);
    });

    //clean up this test case
    shoppingCartPage.removeAllItems();
  });

  it('test04: to view bundle', () => {
    console.log('test04: to view bundle');

    //When user goes to bundle page 
    //navigate to kit product page
    var megaMenu = banner.openMenu();
    let category = CATALOG.LivingRoom.LivingRoomFurniture;

    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(2);
    
    let bundlePage = new BundlePage(bundle.length);

    //THEN there is a link 'view all products from bundle arrangement'
    bundlePage.isDisplayedBundleViewAllProducts().then(result => {
      expect(result).toBe(true, " view all products not displayed for:" + bundleData.bundleName);
    });

    //AND 
    //THEN verify all bundle information
    bundlePage.getBundleName().then(result=>{
      expect(result).toBe(bundleData.bundleName, " for bundle name.");
    });
    bundlePage.getBundleSku().then(result=>{
      expect(result).toBe(bundleData.bundleSku, " for bundle sku.");
    });
    bundlePage.getBundleShortDescription().then(result=>{
      expect(result).toBe(bundleData.bundleShortDescription, " for bundle short description.");
    });
    bundlePage.getBundleLongDescription().then(result=>{
      expect(result).toBe(bundleData.bundleLongDescription, " for bundle long description.");
    });

    //THEN in the arrangement section, checks all the product names, prices, stock, and view details
    let productCount: number = 0;
    bundle.forEach(bundleItem => {
      console.log(bundleItem[1].name);
      bundlePage.getProductName(productCount).then(result => {
        expect(result).toBe(bundleItem[1].name, "Product Name");
      });

      bundlePage.getProductOfferPrice(productCount).then(result => {
        expect(result).toBe(bundleItem[0][0].priceOffering, "Product Name for: " + bundleItem[1].name);
      });

      bundlePage.getProductInventoryAvailability(productCount).then(result => {
        expect(result).toBe("In Stock", "for product inventory availability for :" + bundleItem[1].name);
      });

      bundlePage.isDisplayedProductViewDetails(productCount).then(result => {
        expect(result).toBe(true, "for product view details is displayed for :" + bundleItem[1].name);
      });

      //bundle items always show first sku on page load
      bundlePage.getProductSku(productCount).then(result => {
        expect(result).toBe("SKU: " + bundleItem[0][0].sku, "for product inventory availability for :" + bundleItem[1].name);
      });

      productCount++;
    });
    
  });

  it('test06: to arrange bundle and add to cart', () => {
    log.info('test06: to arrange bundle and add to cart');

    //When user goes to bundle page 
    let category = CATALOG.LivingRoom.LivingRoomFurniture;

    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(2);
    
    let bundlePage = new BundlePage(bundle.length);

    //WHEN user select swatches for bundle products and add each sku to cart
    let productCount: number = 0;
    let skuCount : number = 0;
    bundle.forEach(bundleItem => {
      console.log(bundleItem[1].name);
      bundleItem[0].forEach(sku =>{
        skuCount++;
        bundlePage.selectAttributes(bundleItem[1].productCode, sku);
        bundlePage.addToCart(productCount);
      });

      productCount++;
    });

    let shopcart : ShoppingCartPage = storeFront.banner().clickShopCart(skuCount);
    shopcart.getNumberOfProductsLoaded().then(result=>{
      expect(result).toBe(skuCount, " Number of products loaded in shopcart");
    });

    let skuCount2 : number = 0;
    bundle.forEach(bundleItem => {
      console.log(bundleItem[1].name);
      bundleItem[0].forEach(sku =>{
        shopcart.getProductSKUAtIndex(skuCount2).then(result=>{
          expect(result).toContain(sku.sku);
        });
        skuCount2++;
      });
      
    });

    //view the items are in cart with the right attributes selected 
    
    
    // To Do: clean up this test case
    // shopcart.removeAllItems();
  });

  //image navigation not possible?
  xit('test06: to navigate to a cart from a bundle product image', () => {
    console.log('test06: to navigate to a cart from bundle widget');

    //Go to a bundle page

    //click on the image for one of the products

    //check the page heading 
  });

  it('test07: to navigate to a cart from bundle product view detail link', () => {
    console.log('test07: to navigate to a cart from bundle widget');
    let productIndex: number = 2

    //When user goes to bundle page 
    let category = CATALOG.LivingRoom.LivingRoomFurniture;

    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    plp= new ProductListingPage();
    plp.clickProductAtIndex(2);

    let bundlePage = new BundlePage(bundle.length);

    //WHEN user clicks on view detials of an item 
    let pdp: ProductPage = bundlePage.clickProductViewDetails(productIndex);

    //THEN the correct product is loaded on products details page
    pdp.getProductName().then(result => {
      expect(result).toBe(bundle[productIndex][1].name, " for product name on products details page");
    });

  });
});
