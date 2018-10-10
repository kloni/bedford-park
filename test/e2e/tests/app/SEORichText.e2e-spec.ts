import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { StockholmCatalog, Sku, StockholmProduct, Bundle } from '../app/data/structures/StockholmCatalog';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { BundlePage } from '../../pageobjects/page/BundlePage.po';
import { KitPage } from '../../pageobjects/page/KitPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("SEO RichText");

describe('User views if the SEO rich text snippet is present ', () => {
  const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
  const BUNDLES = require('./data/StockholmBundles.json');

  let storeFront: StoreFront;
  let banner: Banner;

  beforeAll(function () {
    storeFront = new StoreFront();
    banner = storeFront.banner();
  });

  beforeEach(function () {
  });

  it('in product page: test01', () => {
    console.log('in product page: test01');

    let category = CATALOG.Bedroom.Dressers;
    let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
    let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];

    //go to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
    plp.clickProductAtIndex(3);
    new ProductPage();

    //validate in the html that the correct tags are present
    browser.getPageSource().then(source =>{
      expect(source).toContain('itemscope="" itemtype="http://schema.org/Product"');
      expect(source).toContain('itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"');

      expect(source).toContain('itemprop="name"');
      expect(source).toContain('itemprop="description"');

      let desc = source.match(/\bmeta name="description"([\s\S]+?)\//g);
      expect(desc[0]).toContain(product1.shortDescription);
      expect(source).toContain('<title>'+ product1.name + '</title>');

      let img = source.match(/\bitemprop="image"([\s\S]+?)\>/g);
      expect(img[0]).toContain(sku1.imageFull);

      let price = source.match(/\bhttp:\/\/schema\.org\/Offer([\s\S]+?)itemprop="price"([\s\S]+?)content="/g);
      expect(price[0]).toContain('<meta itemprop="priceCurrency" content="USD" />');
      expect(source).toContain('<meta itemprop="price" content="'+ sku1.priceOffering+'" />');

      expect(source).toContain('<link href="http://schema.org/InStock" itemprop="availability" />');
    });
  });

  xit('in kit page: test02', () => {
      console.log('in kit page: test02');

      let category = CATALOG.LivingRoom.LivingRoomFurniture;

      let kit: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Sofa Set"].productInfo;
      let sku: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Sofa Set"]["LR-FUCH-NORDICSET-0001"];

      //go to a product listing page
      var megaMenu = banner.openMenu();
      var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
      plp.goToPage('3');
      new ProductListingPage(4);
      plp.clickProductAtIndex(2);
      new KitPage();

      //validate in the html that the correct tags are present
      browser.getPageSource().then(source =>{

      expect(source).toContain('itemscope="" itemtype="http://schema.org/Product"');
      expect(source).toContain('itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"');

      expect(source).toContain('itemprop="name"');
      expect(source).toContain('itemprop="description"');

      let desc = source.match(/\bmeta name="description"([\s\S]+?)\//g);
      expect(desc[0]).toContain(kit.shortDescription);
      expect(source).toContain('<title>'+ kit.name + '</title>');

      let img = source.match(/\bitemprop="image"([\s\S]+?)\>/g);
      expect(img[0]).toContain(sku.imageFull);

      let price = source.match(/\bhttp:\/\/schema\.org\/Offer([\s\S]+?)itemprop="price"([\s\S]+?)content="/g);
      expect(price[0]).toContain('<meta itemprop="priceCurrency" content="USD" />');
      expect(source).toContain('<meta itemprop="price" content="'+ sku.priceOffering+'" />');

      expect(source).toContain('<link href="http://schema.org/InStock" itemprop="availability" />');

    });

  });

  xit('in bundle page: test02', () => {
    console.log('in bundle page: test03');
    let category = CATALOG.LivingRoom.LivingRoomFurniture;
    const bundleData : Bundle = BUNDLES["Nordic Style"];

    //go to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
    plp.goToPage('3');
    new ProductListingPage(4);
    plp.clickProductAtIndex(3);
    new BundlePage();

    //validate in the html that the correct tags are present
    browser.getPageSource().then(source =>{

      expect(source).toContain('itemscope="" itemtype="http://schema.org/Product"');
      expect(source).toContain('itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"');

      expect(source).toContain('itemprop="name"');
      expect(source).toContain('itemprop="description"');

      let desc = source.match(/\bmeta name="description"([\s\S]+?)\//g);
      expect(desc[0]).toContain(bundleData.bundleShortDescription);
      expect(source).toContain('<title>'+ bundleData.bundleName + '</title>');

      let img = source.match(/\bitemprop="image"([\s\S]+?)\>/g);
      expect(img[0]).toContain(bundleData.slideImages[0]);

      let price = source.match(/\bhttp:\/\/schema\.org\/Offer([\s\S]+?)itemprop="price"([\s\S]+?)content="/g);
      console.log('price:', price);
      expect(price[0]).toContain('<meta itemprop="priceCurrency" content="USD" />');
      expect(source).toContain('<meta itemprop="price" content="'+ bundleData.bundlePrice+'" />');
    });
  });


});
