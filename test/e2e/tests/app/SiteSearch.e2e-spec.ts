import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { SearchPage } from '../../pageobjects/page/SearchPage.po';
import { StockholmProduct, StockholmCatalog } from './data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("Search");

/**
 * Search
 */

describe('User searches from banner', () => {
  const dataFile = require('./data/SearchInput.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
  let base: BaseTest = new BaseTest();
  let storeFront: StoreFront = new StoreFront();
  let banner: Banner;
  let homePage: HomePage;

  beforeAll(function () {
  });

  beforeEach(function () {
    homePage = storeFront.navigateToHomePage();
    banner = storeFront.banner();
  });

  afterEach(function () {
  });

  it('test01: user can search for products from the input box', () => {
    console.log('test01: user can search for products from the input box');
    let testData = dataFile.test01;
    let product : StockholmProduct = CATALOG.Bath.Accessories[testData.searchTerm].productInfo;

    //type a complete product name
    banner.typeSearchInputField(product.name);

    //dropdown with suggestion pops up
    banner.isSuggestionVisible().then(isVisible => {
      expect(isVisible).toBe(true);
    });
    banner.getNumberOfSuggestion().then(numberOfSuggestion => {
      expect(numberOfSuggestion).toBe(testData.numberOfSuggestion);
    });
    banner.getSuggestedKeywordBySearchTerm(testData.searchTerm).then(keyword => {
      expect(keyword).toBe(testData.searchTerm);
    });
    
    //click the search button
    let searchResultPage: SearchPage = banner.clickSearch(testData.productNumResult);

    //check the user is navigated to search results page
    searchResultPage.getProductResultList().then(list => {
      expect(list).toBeDefined();
    });
  });

  it('test02: user can search for products from the suggestion list', () => {
    console.log('test02: user can search for products from the suggestion list');
    let testData = dataFile.test02;

    //type a substring of a product name that is part of more than 1 product
    banner.typeSearchInputField(testData.searchTerm);

    //dropdown with suggestion pops up
    banner.isSuggestionVisible().then(isVisible => {
      expect(isVisible).toBe(true);
    });
    banner.getNumberOfSuggestion().then(numberOfSuggestion => {
      expect(numberOfSuggestion).toBe(testData.numberOfSuggestion);
    });
    banner.getSuggestedKeywordBySearchTerm(testData.suggestionKeyword).then(keyword => {
      expect(keyword).toBe(testData.suggestionKeyword);
    });

    //click on one of the suggestion
    let searchResultPage: SearchPage = banner.clickOnSuggestion(testData.suggestionKeyword, testData.productNumResult);

    //check the user is navigated to search results page
    searchResultPage.getProductResultList().then(list => {
      expect(list).toBeDefined();
    });
  });

  it('test03: user can search for categories from the suggestion list', () => {
    console.log('test03: user can search for categories from the suggestion list');
    let testData = dataFile.test03;

    //type a complete category name (that has products)
    banner.typeSearchInputField(testData.searchTerm);

    //dropdown with suggestion pops up
    banner.isSuggestionVisible().then(isVisible => {
      expect(isVisible).toBe(true);
    });
    banner.getNumberOfSuggestion().then(numberOfSuggestion => {
      expect(numberOfSuggestion).toBe(testData.numberOfSuggestion);
    });
    banner.getSuggestedKeywordBySearchTerm(testData.suggestionKeyword).then(keyword => {
      expect(keyword).toBe(testData.suggestionKeyword);
    });
    
    //click the suggested category
    let productListingPage: ProductListingPage = banner.clickOnPLPSuggestion(testData.suggestionKeyword, testData.productNumResult);

    //check the user is navigated to product listing page
    productListingPage.getTotalProductDisplayed().then(total => {
      expect(total).toBe(testData.productNumResult);
    });
  });  

  it('test04: user can search for department from the suggestion list', () => {
    console.log('test04: user can search for department from the suggestion list');
    let testData = dataFile.test04;

    //type a department category name
    banner.typeSearchInputField(testData.searchTerm);

    //dropdown with suggestion pops up
    banner.isSuggestionVisible().then(isVisible => {
      expect(isVisible).toBe(true);
    });
    banner.getNumberOfSuggestion().then(numberOfSuggestion => {
      expect(numberOfSuggestion).toBe(testData.numberOfSuggestion);
    });
    banner.getSuggestedKeywordBySearchTerm(testData.suggestionKeyword).then(keyword => {
      expect(keyword).toBe(testData.suggestionKeyword);
    });

    //click the suggested department
    let categoryPage: CategoryPage = banner.clickOnCategorySuggestion(testData.suggestionKeyword, testData.productNumResult);
    
    //check the user is navigated to the department page
    categoryPage.getCategoryName().then(categoryName => {
      expect(categoryName).toBe(testData.categoryTitle);
    });
  }); 

  it('test05: user can delete the text input using the clear button', () => {
    console.log('test05: user can delete the text input using the clear button');
    let testData = dataFile.test05;

    //when the home page is loaded, the ‘X’ button does not show
    banner.isClearButtonDisplayed().then(isDisplayed => {
      expect(isDisplayed).toBe(false);
    });
      
    //type a something in the search box
    banner.typeSearchInputField(testData.searchTerm);

    //check the ‘X’ button is displayed
    banner.isClearButtonDisplayed().then(isDisplayed => {
      expect(isDisplayed).toBe(true);
    })

    //click on the ‘X’ button
    banner.clickSearchInputClearButton();
      
    //check the text input is not displayed
    banner.getSearchInput().then(input => {
      expect(input).toBe('');
    });
  });

  it('test06: to land on the product page when only one match is returned', () => {
    console.log('test06: to land on the product page when only one match is returned');
    let testData = dataFile.test06;
    let product : StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture[testData.productName].productInfo;

    //type a partnumber for a product (LR-FNTR-0001-0001)
    banner.typeSearchInputField(testData.searchTerm);

    //click the search button
    let productPage: ProductPage = banner.clickRedirectToProductPage();
    
    //check the user is directed to the product page, check the product name in the page
    productPage.getProductName().then(result => {
      expect(result).toBe(product.name);
    });
  });

});