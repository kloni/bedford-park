import { SearchPage } from './../../pageobjects/page/SearchPage.po';
import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { StockholmCatalog, StockholmProduct } from './data/structures/StockholmCatalog';

var log4js = require("log4js");
var log = log4js.getLogger("SearchResultsPage");

/**
 * Search Results Page
 */

describe('User views the search results page page', () => {
  const dataFile = require('./data/SearchPage.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
  let storeFront: StoreFront;
  let banner: Banner;

  beforeAll(function () {
  });

  beforeEach(function () {
    storeFront = new StoreFront();
    banner = storeFront.banner();
  });

  afterEach(function () {
  });

  it('test01: to search for a product', () => {
    console.log('test01: to search for a product');
    let testData = dataFile.test01;
    let product : StockholmProduct = CATALOG.Bath.Accessories[testData.productResultName].productInfo;
    
    banner.typeSearchInputField(testData.searchTerm);
    let searchResultPage: SearchPage = banner.clickSearch(testData.productNumResult);

    //check the tab if product tab is selected
    searchResultPage.isProductsTabActive().then(isActive => {
      expect(isActive).toBe(true);
    });

    //expected product present
    searchResultPage.getProductResultList().then(list => {
      expect(list).toBeDefined();
    });
    searchResultPage.getProdNumberOfResult().then(numberOfRes => {
      expect(numberOfRes).toBe(testData.productNumResult);
    });
    searchResultPage.getProdResultByName(testData.productResultName).then(productName => {
      expect(productName).toBe(product.name);
    });
  });

  it('test02: to search for a product with no matching results, but suggest other keywords', () => {
    console.log('test02: to search for a product with no matching results, but suggest other keywords');
    let testData = dataFile.test02;
    let product : StockholmProduct = CATALOG.Bath.Accessories[testData.productResultName].productInfo;

    banner.typeSearchInputField(testData.searchTerm);
    let searchResultPage: SearchPage = banner.clickSearch(testData.productNumResult);

    //no results page displayed in product tab
    searchResultPage.isProductsTabActive().then(isActive => {
			expect(isActive).toBe(true);
    });
    searchResultPage.getEmptyProdNumOfResult().then(numberOfRes => {
      expect(numberOfRes).toBe(testData.productNumResult);
    });
    searchResultPage.getEmptyProdResult().then(emptyResultMsg => {
      expect(emptyResultMsg).toBe(testData.prodEmptyResult);
    });

    //check suggestive search term and its result
    searchResultPage.getSuggestedProdKeyword().then(keyword => {
      expect(keyword).toBe(testData.suggestedSearchTerm);
    });
    searchResultPage.getProductResultList().then(list => {
      expect(list).toBeDefined();
    });
    searchResultPage.getProdNumberOfResult().then(numberOfRes => {
      expect(numberOfRes).toBe(testData.suggestedProdNumResult);
    });
    searchResultPage.getProdResultByName(testData.productResultName).then(productName => {
      expect(productName).toBe(product.name);
    });

    //check articles tab for no results
    searchResultPage.clickArticlesTab(testData.articleNumResult);
    searchResultPage.isArticlesTabActive().then(isActive => {
			expect(isActive).toBe(true);
		});

    searchResultPage.getEmptyArticleResult().then(result => {
      expect(result).toBe(testData.articlesEmptyResult);
    });
  });

  it('test03: to search for an article', () => {
    console.log('test03: to search for an article');
    let testData = dataFile.test03;

    banner.typeSearchInputField(testData.searchTerm);
    let searchResultPage: SearchPage = banner.clickSearch(testData.productNumResult);

    //select the article tab
    searchResultPage.clickArticlesTab(testData.articlesNumResult);
    searchResultPage.isArticlesTabActive().then(isActive => {
			expect(isActive).toBe(true);
		});

    //expect article title/text
    searchResultPage.getArticleResultList().then(list => {
      expect(list).toBeDefined();
    });
    searchResultPage.getArticlesNumberOfResult().then(numberOfRes => {
      expect(numberOfRes).toBe(testData.articlesNumResult);
    });
    searchResultPage.getArticleResultByName(testData.articlesResultName).then(productName => {
      expect(productName).toBe(testData.articlesResultName);
    });
  });

  it('test04: to search for an article and apply filter', () => {
    console.log('test04: to search for an article and apply filter');
    let testData = dataFile.test04;

    banner.typeSearchInputField(testData.searchTerm);
    let searchResultPage: SearchPage = banner.clickSearch(testData.productNumResult);

    //check the tab
    searchResultPage.clickArticlesTab(testData.articlesNumResult);
    searchResultPage.isArticlesTabActive().then(isActive => {
			expect(isActive).toBe(true);
    });
    
    //filter by type
    searchResultPage.clickArticleTypeFilter(testData.filterByArticleType1, testData.filteredArticlesNumResult);
    searchResultPage.clickArticleTypeFilter(testData.filterByArticleType2, testData.filteredArticlesNumResult);

    //check filter at the top of the article result
    searchResultPage.getArticlesFilteredBy(testData.filterByArticleType).then(filterName => {
      expect(filterName).toBe(testData.filterByArticleType);
    });

    //expect filtered article result
    searchResultPage.getArticleResultList().then(list => {
      expect(list).toBeDefined();
    });

    searchResultPage.articlesResultNames().then(numberOfRes => {
      for(let i =0; i < numberOfRes.length ; i ++){
        expect(numberOfRes).toContain(testData.articlesResultName[i]);
      }
    });

    searchResultPage.getArticleResultByName(testData.articleName).then(productName => {
      expect(productName).toBe(testData.articleName);
    });

    //clear all filter
    searchResultPage.clearAllArticleFilter(testData.articlesNumResult);

    // expect cleared filtered article result
    searchResultPage.getArticleResultList().then(list => {
      expect(list).toBeDefined();
    });
    searchResultPage.getArticlesNumberOfResult().then(numberOfRes => {
      expect(numberOfRes).toBe(testData.articlesNumResult);
    });
    searchResultPage.getArticleResultByName(testData.articlesResultName).then(productName => {
      expect(productName).toBe(testData.articlesResultName);
    });
  });

});