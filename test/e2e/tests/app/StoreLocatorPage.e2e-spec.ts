import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreLocatorPage } from '../../pageobjects/page/StoreLocatorPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("StoreLocatorPage");

/**
 * Store Locator page
 *
 * Manual testing:
 * 1) Search based on current location
 * 2) Search based on address search
 * 3) Filter result
 * 4) Action / response on search result and map
 * 5) Clicking on map’s marker
 * 6) Dragging on map
 * 7) search by city name (not very unique)  +  state
 * 8) If user selects to have their location blocked upon entering the site, the disabled "Use my location" button should inform the user why it is disabled
 */

describe('User views store locator page', () => {
  var dataFile = require('./data/StoreLocatorPage.json');
  let storeFront: StoreFront;
  let storeLocator : StoreLocatorPage;
  let banner : Banner;

  beforeAll(function () {
  });

  beforeEach(function () {
    //WHEN user navigates to store locator page
    storeFront = new StoreFront();
    banner = storeFront.banner();
    storeLocator= banner.clickStoreLocator();
    console.log("store locator should be clicked by now");
  });

  it('test01: to search for stores by location', () => {
    console.log('test01: to search for stores by location');
    const testData = dataFile.test01;

    //GIVEN store locator page is loaded
    //WHEN user enters target search location
    storeLocator.typeSearchText(testData.searchLocation).clickStoreSearch(testData.searchResults);

    //THEN the correct results are shown
    storeLocator.getResultsText().then(text => {
      expect(text).toBe(testData.searchResults, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //THEN the correct store is down in first result of list of stores
    storeLocator.getStoreInfoFromList().then(text => {
      expect(text).toBe(testData.store1Info, " for first store in results");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //WHEN user clicks on first result in the list
    storeLocator.clickStoreInfoFromList(testData.store1PopUp);

    //check the selected location is highlighted
    storeLocator.waitForActiveLocationCss(dataFile.css.active[0], dataFile.css.active[1], 0);
    storeLocator.getActiveLocationCssByIndex(dataFile.css.active[0], 0).then(css => {
      expect(css).toEqual(dataFile.css.active[1]);
    });

    //inactive location doesn't have the highlight
    storeLocator.getActiveLocationCssByIndex(dataFile.css.inactive[0], 1).then(css => {
      expect(css).toEqual(dataFile.css.inactive[1]);
    });

    //THEN the correct store information is displayed in pop up, including store services
    storeLocator.getStoreInfoFromPopUp().then(text => {
      expect(text).toBe(testData.store1PopUp, " for first store in results");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

  });

  it('test02: to search for stores and get no results back', () => {
    console.log('test02: to search for stores and get no results back');
    const testData = dataFile.test02;

    //GIVEN store locator page is loaded
    //WHEN user enters target search location that has no stores
    storeLocator.typeSearchText(testData.searchLocation).clickStoreSearch(testData.searchResults);

    //THEN no results are shown
    storeLocator.getResultsText().then(text => {
      expect(text).toBe(testData.searchResults, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });
  });

  it('test03: to search for store with search keyword suggestions for city and state', () => {
    console.log('test03: to search for store with search ketyword suggestions for city and state');
    const testData = dataFile.test03;

    //GIVEN store locator page is loaded
    //city name is ambigious so need to put a state
    //slowly type the location
    storeLocator.typeSearchTextWithoutClear(testData.searchLocation[0]);
    storeLocator.typeSearchTextWithoutClear(testData.searchLocation[1]);
    storeLocator.typeSearchTextWithoutClear(testData.searchLocation[2]);
    storeLocator.typeSearchTextWithoutClear(testData.searchLocation[3]);
    storeLocator.typeSearchTextWithoutClear(testData.searchLocation[4]);

    //type ahead UI will be displayed
    storeLocator.typeAheadDropdownDisplayed(5).then( displayed => {
      expect(displayed).toEqual(true);
    });

    //verify the list returned in typeahead UI
    storeLocator.getTypeAheadDropdownResults().then( storeNames => {
      var expectedLocations = testData.expectedLocations;
      var n = 0;
      while (n < expectedLocations.length) {
        expect(storeNames).toContain(expectedLocations[n]);
        n++;
      }
    });

    //select one from the list
    storeLocator.selectDropdownContainingText(testData.selectLocation, testData.searchResultsText, testData.storeInfo.length);

    //THEN the correct result text is shown
    storeLocator.getResultsText().then(text => {
      expect(text).toBe(testData.searchResultsText, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //THEN the correct stores are shown in the results
    storeLocator.getAllStoreInfoFromList().then( storeInfo => {
      var expectedStoreInfo = testData.storeInfo;
      var n = 0;
      while (n < expectedStoreInfo.length) {
        expect(storeInfo[n]).toEqual(expectedStoreInfo[n], ' returned store info not correct');
        n++;
      }
    });

  });

  it('test04: to search and filter stores by services', () => {
    console.log('test04: to search and filter stores by services');
    const testData = dataFile.test04;

    //GIVEN store locator page is loaded
    //WHEN user enters target search location
    storeLocator.typeSearchText(testData.searchLocation).clickStoreSearch(testData.searchResults);

    //THEN the correct results are shown
    storeLocator.getResultsText().then(text => {
      expect(text).toBe(testData.searchResults, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //WHEN filters popup is opened
    storeLocator.clickSelectFilters();

    //AND
    //WHEN financing filter is applied and user applies filter
    storeLocator.clickFilterAtIndex(testData.selectFilterIndex).clickApplyFilters(testData.filteredResults);

    //THEN the correct number of results are shown
    storeLocator.getResultsText().then(text => {
      expect(text).toBe(testData.filteredResults, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //AND
    //THEN the correct store is down in result of list of stores
    storeLocator.getStoreInfoFromList(testData.filteredLocation1Index).then(text => {
      console.log("todo: remove FILTERED INFO FROM LIST " + text)
      expect(text).toBe(testData.filteredStoreInfo, " for first store in results");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });
  });

  xit('test05: to search and add the store', () => {
    console.log('test05: to search and add the store');

    //search for a keyword to get multiple store results
    //add a store
    //check the store cannot be added now
    //go to my account?
    //validate that the store is now added to this user profile
    // go to store locator page
    // search for the same store
    //verify the store cannot be added
  });

  xit('test06: to remove the store', () => {
    console.log('test06: to search and remove the store');

    //search for a keyword to get multiple store results
    //add a store
    //remove the store on the spot? <- is this possible?
    //re-add the store back
    //go to my account?
    //remove the store from the user profile
    // go back to the store locator page
    //search for the same store
    //verify the store can be re-added back
  });

  it('test07: to click on the store phone number and view direction', () => {
    console.log('test07: to click on the store phone number');
    const testData = dataFile.test07;

    //GIVEN store locator page is loaded
    //WHEN user enters target search location
    storeLocator.typeSearchText(testData.searchLocation).clickStoreSearch(testData.searchResults);

    //Phone number from the store list is clickable
    storeLocator.phoneNumberClickableByIndex(0).then(clickable => {
      expect(clickable).toEqual(true);
    });

    //Phone number link points to right number and call action
    storeLocator.getPhoneNumberLinkFromStoreInfoByIndex(0).then(phoneNumberLink => {
      expect(phoneNumberLink).toEqual(testData.expectedPhoneNumberLink1);
    });

    //click on the store to launch the popover
    storeLocator.clickStoreInfoFromList(testData.store1PopUp);

    //Phone number from the popover is clickable
    storeLocator.phoneNumberClickableInPopOver().then(clickable => {
      expect(clickable).toEqual(true);
    });

    //Phone number link points to right number and call action
    storeLocator.getPhoneNumberLinkFromPopOver().then(phoneNumberLink => {
      expect(phoneNumberLink).toEqual(testData.expectedPhoneNumberLink2);
    });

    //Direction link from the popover is clickable
    storeLocator.directionClickableInPopOver().then(clickable => {
      expect(clickable).toEqual(true);
    });

    //Direction link from the popover  points to the right address and google map launch link
    storeLocator.getDirectionLinkFromPopOver().then(directionLink => {
      expect(directionLink).toContain(testData.expectedGoogleLink);
      expect(directionLink).toContain(testData.expectedDestination);
    });

  });

  it('test08: view pagination', () => {
    console.log('test08: view pagination');
    const testData = dataFile.test08;

    //GIVEN store locator page is loaded
    //AND
    //Clear default search results otherewise there is a timing issue when executing in markham
    storeLocator.typeSearchText(testData.clearSearchLocation).clickStoreSearch(testData.clearSearchResults);

    //WHEN user enters target search location
    storeLocator.typeSearchText(testData.searchLocation).clickStoreSearch(testData.searchResults);

    //THEN the correct results are shown
    storeLocator.getResultsText().then(text => {
      console.log(text + "todo:remove");
      expect(text).toBe(testData.searchResults, " for results text");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });

    //verify css values for scroll box are present
    storeLocator.getCssValuesForResultsContainer(dataFile.css.scrollX[0]).then(result =>{
      expect(result).toBe(dataFile.css.scrollX[1], " for css value in results container");
    });
    storeLocator.getCssValuesForResultsContainer(dataFile.css.scrollY[0]).then(result =>{
      expect(result).toBe(dataFile.css.scrollY[1], " for css value in results container");
    });

    //WHEN last store in Markham is selected at index 15
    storeLocator.clickStoreInfoFromList(testData.storeInfo, testData.storeIndex);

    //THEN the correct store information is displayed in pop up, including store services
    storeLocator.getStoreInfoFromPopUp().then(text => {
      expect(text).toBe(testData.storeInfoFromPopUp, " for first store in results");
    }).then(null, error => {
      expect(true).toBe(false, "Failure to getResultsText() from StoreLocatorPage: " + error);
    });
  });

});