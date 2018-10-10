import { Banner } from '../../pageobjects/banner/Banner.po';
import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StockholmCatalog } from '../app/data/structures/StockholmCatalog';


var log4js = require("log4js");
var log = log4js.getLogger("ProductListing");

/**
 * Product Page listing page
 */

describe('User views ProductListing', () => {
  var dataFile = require('./data/ProductListing.json');
  const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');

  var product1 = CATALOG.LivingRoom.LivingRoomFurniture["Wooden Angled Chair"].productInfo;
  var product3 = CATALOG.LivingRoom.LivingRoomFurniture["Supreme LoungeStyle Double Sofa"].productInfo;
  var category = CATALOG.LivingRoom.LivingRoomFurniture;

  let storeFront : StoreFront = new StoreFront();
  var banner : Banner;

  var maxProducts = 12;

  beforeAll(function () {
  });

  beforeEach(function () {
    storeFront = new StoreFront();
    banner = storeFront.banner();
  });

  it('test01: to toggle filter panes', () => {
    console.log('test01: to toggle filter panes');

    //go to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

     plp = new ProductListingPage(maxProducts);

    //check all the filter pane exists : price/brand/occassion/materia/color/size/
    plp.getFilterHeading().then(heading => {
      expect(heading).toEqual('Filter by');
    });

    //check heading for the filter panes
    plp.getFilterPaneNameByIndex(0).then(name => {
      expect(name).toEqual("PRICE");
    });
    plp.filterPaneDisplayedByIndex(0).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    plp.getFilterPaneNameByIndex(1).then(name => {
      expect(name).toEqual("BRAND");
    });
    plp.filterPaneDisplayedByIndex(1).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    plp.getFilterPaneNameByIndex(2).then(name => {
      expect(name).toEqual("COLOR");
    });
    plp.filterPaneDisplayedByIndex(2).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    plp.getFilterPaneNameByIndex(3).then(name => {
      expect(name).toEqual("PRODUCT DIMENSIONS");
    });
    plp.filterPaneDisplayedByIndex(3).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    plp.getFilterPaneNameByIndex(4).then(name => {
      expect(name).toEqual("SIZE");
    });
    plp.filterPaneDisplayedByIndex(4).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    plp.getFilterPaneNameByIndex(5).then(name => {
      expect(name).toEqual("ITEM WEIGHT");
    });
    plp.filterPaneDisplayedByIndex(5).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    //close filter panes
    plp.clickFilterPaneByIndex(0);
    plp.clickFilterPaneByIndex(1);

    //verify the closed panes do not display
    plp.filterPaneNotDisplayedByIndex(0).then(displayed =>{
      expect(displayed).toEqual(true);
    });
    plp.filterPaneNotDisplayedByIndex(1).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    //open the filter panes
    plp.clickFilterPaneByIndex(0);
    plp.clickFilterPaneByIndex(1);

    //verify the panes are displayed
    plp.filterPaneDisplayedByIndex(0).then(displayed =>{
      expect(displayed).toEqual(true);
    });
    plp.filterPaneDisplayedByIndex(1).then(displayed =>{
      expect(displayed).toEqual(true);
    });
  });

  it('test02: to filter by brand/collection/occasion', () => {
    console.log('test02: to filter by brand/collection/occasion');
    var testData = dataFile.test02

    //go to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //count the options displayed
    plp.countFiltersByIndex(1).then(count => {
      expect(count).toEqual(6);
    });

    //check the filters available in the brand filter pane
    plp.getFilterNamesInPaneByIndex(1).then(names => {
      var expectedFilters = testData.expectedFilters;
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toContain(expectedFilters[n]);
        n++;
      }
    });

    // use 'show more' to display more options
    plp.showMoreDisplayedByIndex(2).then(displayed => {
      expect(displayed).toEqual(true);
    });
    plp.countFiltersByIndex(2).then(count => {
      expect(count).toEqual(20);
    });

    //click show more
    plp.clickShowMoreByIndex(2);

    //Show Less is displayed
    plp.showLessDisplayedByIndex(2).then(displayed => {
      expect(displayed).toEqual(true);
    });

    //check the number of options displayed is greater than the original display
    plp.countFiltersByIndex(2).then(count => {
      expect(count).toEqual(21);
    });

    //click 'Show Less'
    plp.clickShowLessByIndex(2);
    plp.showMoreDisplayedByIndex(1).then(displayed => {
      expect(displayed).toEqual(true);
    });
    browser.sleep(5000);
    plp.countFiltersByIndex(2).then(count => {
      expect(count).toEqual(20);
    });

    //select some filter values from the brand pane
    //select brand 'Stockholm'
    plp.selectFilterLabelByIndexAndValue(1,testData.filters[0]);

    //the listing widget has the selection at the top
    plp.filteredByPresent().then(present => {
      expect(present).toEqual(true);
    });

    plp.filterPresent(testData.filters[0]).then(present => {
      expect(present).toEqual(true);
    });
    plp = new ProductListingPage(9 ,1);

    //number of products have changed when the filter is applied
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(9);
    });
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('9 products');
    });

    //select size dimension 30"x24"x24"
    plp.filterPaneDisplayedByIndex(3);
    plp.selectFilterInputByIndex(3,1);

    //Check the filter present  and the product count correct
    new ProductListingPage(1,1);
    plp.waitForAppliedFilterCountToUpdate(2);

    plp.filterPresent(testData.filters[1]).then(present => {
      expect(present).toEqual(true);
    });
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(1);
    });
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('1 product');
    });

    // product list shows filtered results for 2 filters
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts;
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });
  });


  it('test03: to filter by price', () => {
    console.log('test03: to filter by price');
    var testData = dataFile.test03

    //go to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //enter invalid price range
    //check the button disabled
    plp.enterMinPrice(testData.invalidPrice).enterMaxPrice(testData.invalidPrice).priceFilterButtonDisabled().then(disabled => {
      expect(disabled).toEqual(true);
    });

    //enter a price range
    plp.clearMaxPrice().clearMinPrice().enterMinPrice(testData.minPrice).enterMaxPrice(testData.maxPrice).priceFilterButtonEnabled().then(enabled => {
      expect(enabled).toEqual(true);
    });

    //click filter
    plp.clickPriceFilterButton();
    plp = new ProductListingPage(maxProducts);

    //check expected products appear
    plp.filteredByPresent().then(present => {
      expect(present).toEqual(true);
    });
    browser.sleep(10000);
    plp.filterPresent(testData.expectedFilter).then(present => {
      expect(present).toEqual(true);
    });

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('23 products');
    });
    plp.getTotalProductDisplayed().then(count=> {
      expect(count).toEqual(maxProducts);
    });

    //product list shows filtered results
    plp.getAllDisplayedProductPrice().then(prices => {
      var n = 0;
      while (n < prices.length) {
        let price = prices[n];

        expect(price).toBeGreaterThan(1);
        expect(price).toBeLessThan(1000);
        n++;
      }
    });

    plp.goToNextPage();
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(testData.expectedProducts[1]);

    plp.getAllDisplayedProductPrice().then(prices => {
      var n = 0;
      while (n < prices.length) {
        let price = prices[n];

        expect(price).toBeGreaterThan(1);
        expect(price).toBeLessThan(1000);
        n++;
      }
    });

    //price filter is dispalyed in the left filter pane with the correct values
    plp.priceFilterDislpayedInFilterPane(0, testData.expectedFilter).then(displayed => {
      expect(displayed).toEqual(true);
    });

    //click on the remove button
    plp.removePriceFilterFromPane();
    plp = new ProductListingPage(maxProducts);

    //price filter pane  displayed
    plp.filterPaneNotDisplayedByIndex(0).then(displayed =>{
      expect(displayed).toEqual(true);
    });

    //price filter inputs displayed
    plp.priceFilterDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });

    //price filter should not be displayed
    plp.filteredByNotPresent().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //price filter gone
    plp.filterNotPresent(testData.expectedFilter).then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

  });

  it('test04: to filter by color', () => {
    console.log('test04: to filter by multiple color');
    var testData = dataFile.test04

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //select two colours from the filter
    plp.getSwatchCountByIndex(2).then(count => {
      expect(count).toEqual(20);
    });

    plp.selectSwatchByIndex(2, 0);

    plp = new ProductListingPage(11);
    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('11 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(11);
    });

    //selected color displayed in the filtered list
    plp.filteredByPresent().then(present=>{
      expect(present).toEqual(true);
    });
    plp.filterPresent(testData.color).then(present=>{
      expect(present).toEqual(true);
    });

    //verify the products
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts[0];
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });

    //check the border around the selected swatches
    plp.getSwatchCSSByIndex(dataFile.css.attr,2,0).then(css =>{
      expect(css).toEqual(dataFile.css.value);
    });

    //deselect one colour
    plp.selectSwatchByIndex(2, 0);

    plp = new ProductListingPage(maxProducts);
    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });
    plp.filterNotPresent(testData.color).then(notPresent=>{
      expect(notPresent).toEqual(true);
    });

    //select the same swatch
    plp.selectSwatchByIndex(2, 0);

    plp = new ProductListingPage(11);
    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('11 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(11);
    });

    //select another filter from BRAND pane
    plp.selectFilterLabelByIndexAndValue(1,testData.brandFilter);

    //When 2 filters are displayed, 'ClearAll' is displayed in the product grid
    plp.clearAllFiltersDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });

    //Border applied on the select color swatch
    plp.getSwatchCSSByIndex(dataFile.css.attr,2,0).then(css =>{
      expect(css).toEqual(dataFile.css.value);
    });

    //Click 'Clear All'
    plp.clearAllFilters();

    //price filter should not be displayed
    plp.filteredByNotPresent().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //Filters are removed
    plp.filterNotPresent(testData.color).then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //Border removed from the color swatch by Clear All
    plp.getSwatchCSSByIndex(dataFile.css.attr,2,0).then(css =>{
      expect(css).toBeUndefined();
    });

  });


  it('test05: to clear multiple filters', () => {
    console.log('test05: to clear multiple filter');
    var testData = dataFile.test05

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //count the options displayed
    plp.countFiltersByIndex(1).then(count => {
      expect(count).toEqual(6);
    });

    //apply one filters
    //select brand 'Stockholm'
    plp.selectFilterLabelByIndexAndValue(1,testData.brandFilter);


    //the listing widget has the selection at the top
    plp.filteredByPresent().then(present => {
      expect(present).toEqual(true);
    });


    //only 2 products displayed
    plp = new ProductListingPage(11);
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('11 products');
    });

    //clear the brand filter
    plp.filterClearButtonByIndex(0);

    //28 products in the list but 12 displayed in a page
    plp = new ProductListingPage(maxProducts);
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //now 28 products displayed
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //apply 2 filters
    //select 'Stockholm' brand filter
    plp.selectFilterLabelByIndexAndValue(1,testData.brandFilter);

    //the listing widget has the selection at the top
    plp.filteredByPresent().then(present => {
      expect(present).toEqual(true);
    });
    plp.filterPresent('Stockholm').then(present => {
      expect(present).toEqual(true);
    });
    plp = new ProductListingPage(9);

    //enter a price range
    plp.enterMinPrice('1').enterMaxPrice('800')
    .priceFilterButtonEnabled().then(enabled => {
      expect(enabled).toEqual(true);
    });

    //click Go b0utton
    plp.clickPriceFilterButton();
    plp = new ProductListingPage(9);
    plp.waitForAppliedFilterCountToUpdate(2);

    //price filter is present
    plp.filterPresent('$1.00 - $800.00').then(present => {
      expect(present).toEqual(true);
    });

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('9 products');
    });
    plp.getTotalProductDisplayed().then(count=> {
      expect(count).toEqual(9);
    });

    // clear all filters
    plp.clearAllFilters();
    plp = new ProductListingPage(maxProducts);

    //check the filters gone
    //'filter by' gone
    plp.filteredByNotPresent().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //brand filter gone
    plp.filterNotPresent('Stockholm').then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //price filter gone
    plp.filterNotPresent('$1.00 - $800.00').then(notDisplayed => {
        expect(notDisplayed).toEqual(true);
    });

    //cleared are back in the panes
    plp.getFilterNamesInPaneByIndex(1).then(names => {
      var expectedFilters = testData.expectedFilters;
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toContain(expectedFilters[n]);
        n++;
      }
    });

  });

  it('test06: to use pagination', () => {
    console.log('test06: to use pagination');
    var testData = dataFile.test06

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //product list shows  all products in the category
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts[0];
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });

    //use pagination to go to the next page
    plp.goToNextPage();
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(testData.expectedProducts[1][0]);

    //Page 2 is selected
    plp.pageNumberSelected('2').then(classNames => {
      expect(classNames).toContain('active');
    });

    //check the product list
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //product list shows filtered results
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts[1];
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });

    //go to the previous page
    plp.goToPrevPage();
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(testData.expectedProducts[0][0]);

    //Page 1 is selected
    plp.pageNumberSelected('1').then(classNames => {
      expect(classNames).toContain('active');
    });

    //check the product list
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the product shows page 2
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts[0];
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });

    //click on a page number
    plp.goToPage('3');
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(testData.expectedProducts[2][0]);

    //Page 3 is selected
    plp.pageNumberSelected('3').then(classNames => {
      expect(classNames).toContain('active');
    });

    //Page 3 list is displayed
    plp.getAllDisplayedProductName().then(names => {
      var expectedProducts = testData.expectedProducts[2];
      var n = 0;
      while (n < names.length) {
        expect(names[n]).toEqual(expectedProducts[n]);
        n++;
      }
    });
  });

  it('test07: to use sorting', () => {
    console.log('test07: to use sorting');
    var testData = dataFile.test07

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(maxProducts);
    });

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //sort the list by price
    plp.selectSortOptionByText('Price (Low to High)');
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(product1.name).then(dispalyed=> {
      expect(dispalyed).toEqual(true);
    });

    //get the list of prices from products
    //get the prices from the first page
    plp.getAllDisplayedMinProductPrice().then(productPrices => {
      var n=0;
      while (n < productPrices.length-1) {
        expect(productPrices[n]).toBeLessThanOrEqual(productPrices[n+1]);
        n++;
      }
    });

    //get the prices from the second page
    plp.goToNextPage();
    plp = new ProductListingPage(maxProducts);
    plp.waitForFirstProductTobe(testData.expectedProduct);

    plp.getAllDisplayedMinProductPrice().then(productPrices => {
      var n=0;
      while (n < productPrices.length-1) {
        expect(productPrices[n]).toBeLessThanOrEqual(productPrices[n+1]);
        n++;
      }
    });

    //get the prices from the third page
    plp.goToNextPage();
    plp = new ProductListingPage(12);
    plp.waitForFirstProductTobe(product3.name);

    //sorting is done by max price in the range
    plp.getAllDisplayedMinProductPrice().then(productPrices => {
      var n=0;
      while (n < productPrices.length-1) {
        expect(productPrices[n]).toBeLessThanOrEqual(productPrices[n+1]);
        n++;
      }
    });
  });

  it('test08: to navigate to a product', () => {
    console.log('test08: to navigate to a product');
    var testData = dataFile.test08

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //check the number of products in the page
    plp.getTotalCountText().then(countText => {
      expect(countText).toContain('28 products');
    });

    //check the number of products displayed in the listing
    plp.getTotalProductDisplayed().then(count => {
      expect(count).toEqual(12);
    });

    //click on the product image
    let pdp : ProductPage = plp.clickProductAtIndex(0);

    //verify the product heading name
    pdp.getProductName().then(name => {
      expect(name).toEqual(product1.name);
    });

  });

  it('test09: to view no result pop up', () => {
    log.info('test09: to view no result result pop up');
    var testData = dataFile.test09

    //nagiate to a product listing page
    var megaMenu = banner.openMenu();
    var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, maxProducts);

    //enter a price range in the price filter with a range that shows no results
    plp.clearMaxPrice().clearMinPrice().enterMinPrice(testData.minPrice).enterMaxPrice(testData.maxPrice).priceFilterButtonEnabled().then(enabled => {
      expect(enabled).toEqual(true);
    })

    //click the price filter button
    plp.clickPriceFilterButton();

    //No results modals is displayed
    plp.noResultsModalDisplayed().then(displayed => {
      expect(displayed).toEqual(true)
    });

    //check the modal text
    plp.getNoResultsText().then(displayed => {
      expect(displayed).toEqual(testData.noResultsText)
    });

    plp.getNoResultsHeading().then(heading => {
      expect(heading).toEqual(testData.noResultsHeading)
    });


    // //wait for the browser to be gone after 4 seconds
    //Check the modal is not displayed anymore
    plp.noResultsModalNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });
  });
});