import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { CategoryRecommended } from '../../pageobjects/widget/CategoryRecommended.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Category Recommendation");

/**
 * Category Recommendation
 */
describe('User views Category Recommendation', () => {
  var dataFile = require('./data/CategoryRecommendation.json');
  let storeFront: StoreFront = new StoreFront();
  let testData = dataFile;
  beforeAll(function () {
    let base = new BaseTest();
  });

  beforeEach(function () {
    storeFront.navigateToHomePage().heroSlideshowExists();
  });

  it('test01: to view recommended category list', () => {
    console.log('test01: to view recommended category list');

    //Navigate to home page that has a category recommendation widget

    //verify the correct categories are displayed
    let categoryRecommendation: CategoryRecommended = new CategoryRecommended(0);

    //furniture and lighting expected
    categoryRecommendation.getName(0).then(name => {
      expect(name).toBe(testData.test01.category0);

    });

    categoryRecommendation.getImageUrl(0).then(url => {
      expect(url).toContain(testData.test01.category0Url);

    });

    categoryRecommendation = new CategoryRecommended(1);
    categoryRecommendation.getName(1).then(name => {
      expect(name).toBe(testData.test01.category1);

    });

    categoryRecommendation.getImageUrl(1).then(url => {
      expect(url).toContain(testData.test01.category1Url);

    });

  });

  it('test02: to Navigate to category page', () => {
    console.log('test02: to Navigate to category page');

    //use category recommendation widget to go to a category
    let categoryRecommendation: CategoryRecommended = new CategoryRecommended(1);

    //Click on a category link
    let categoryPage: CategoryPage = new CategoryPage(0,2);
    categoryPage = categoryRecommendation.clickOnImage(1);

    categoryPage.getContenByTag(testData.department).then(tag => {
      expect(tag).toEqual(true);
    });
  });

});