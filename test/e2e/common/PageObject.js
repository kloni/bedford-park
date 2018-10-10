'use strict'

var log4js = require('log4js');
var log = log4js.getLogger('PageObject');

var PageObject = {

  /**
  * Waits for an element to appear on screen
  * @global
  * @alias waitForElementEC
  * @param {String} p_element The element to wait for
  */
  waitForElementEC: function(p_element) {
    browser.wait(protractor.ExpectedConditions.visibilityOf(p_element));
  },

  /**
  * Waits for element with browser refresh
  * @global
  * @alias waitForElementWithRefresh
  * @param {String} p_element The element to wait for
  * @param {long} p_refreshes The number of refreshes with 10-second interval
  */
  waitForElementWithRefresh: function(p_element, p_refreshes, p_retrycount) {
    var EC = protractor.ExpectedConditions;
    p_refreshes = p_refreshes ? p_refreshes : 3;
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = p_refreshes*2*10000;

    browser.getCurrentUrl().then(function(actualUrl) {
      var page = actualUrl.substring(actualUrl.lastIndexOf("/") + 1).split("?")[0];

      p_retrycount = p_retrycount ? p_retrycount : 0;

      browser.wait(EC.elementToBeClickable(p_element), 10000,
        "Expected " + p_element.locator() + " to exist on page '" + page + "' in " + p_refreshes + " refreshes.")
          .then( function() {
              console.log("Found "+p_element.locator());
              return true;
            },
            function(err) {
              console.log("Expected element doesn't exist on refresh "+p_retrycount);
              if (p_retrycount<p_refreshes) {
                browser.refresh();
                return waitForElementWithRefresh(p_element, p_refreshes, p_retrycount+1);
              } else {
                log.error("Expected element to exist: "+p_element.locator());
                throw err;
              }
            }
          );
    });
  },

  waitForTitleWithRefresh: function(p_title, p_refreshes) {
    waitForElementWithRefresh(element(by.css('[title="'+p_title+'"]')), p_refreshes);
  },

  /**
  * Waits for element to disappear with browser refresh
  * @global
  * @alias waitForElementDisappearWithRefresh
  * @param {String} p_element The element to wait for
  * @param {long} p_refreshes The number of refreshes with 10-second interval
  */
  waitForElementDisappearWithRefresh: function(p_element, p_refreshes, p_retrycount) {
    var EC = protractor.ExpectedConditions;
    p_refreshes = p_refreshes ? p_refreshes : 3;
    //jasmine.DEFAULT_TIMEOUT_INTERVAL = p_refreshes*2*10000;

    browser.getCurrentUrl().then(function(actualUrl) {
      var page = actualUrl.substring(actualUrl.lastIndexOf("/") + 1).split("?")[0];

      p_retrycount = p_retrycount ? p_retrycount : 0;

	  waitForElement(element(by.css('[ng-class="authoringTableCtrl.config.cssClasses"]')));

      browser.wait(EC.invisibilityOf(p_element), 10000,
        "Expected " + p_element.locator() + " to disappear from page '" + page + "' in " + p_refreshes + " refreshes.")
          .then( function() {
              console.log("Gone "+p_element.locator());
              return true;
            },
            function(err) {
              console.log("Expected element still exist on refresh "+p_retrycount);
              if (p_retrycount<p_refreshes) {
                browser.refresh();
                return waitForElementDisappearWithRefresh(p_element, p_refreshes, p_retrycount+1);
              } else {
                log.error("Expected element to disappear: "+p_element.locator());
                throw err;
              }
            }
          );
    });
  },

  waitForTitleDisappearWithRefresh: function(p_title, p_refreshes) {
    // Check for no results
	var EC = protractor.ExpectedConditions;
	var noresult=element(by.className("authoring-loading-jumbotron"));

	browser.wait(EC.presenceOf(noresult), 3000,
      "Expected no result or title not existing")
        .then( function() {
			console.log("No results");
		    return true;
          },
		  function(err) {
			// check title doesn't exist
			waitForElementDisappearWithRefresh(element(by.css('[title="'+p_title+'"]')), p_refreshes);
		  }
        );
  },

  /**
  * Waits for an element to appear on screen
  * @global
  * @alias waitForElement
  * @param {String} p_element The element to wait for
  * @param {Number} [p_timeout] An optional timeout to use. Default is 15s.
  */
  waitForElement: function(p_element, p_timeout) {
    var EC = protractor.ExpectedConditions;
    log.trace("Waiting for " + p_element.locator() + " for " + (p_timeout ? p_timeout : "15000"));
    browser.getCurrentUrl().then(function(actualUrl) {
      var page = actualUrl.substring(actualUrl.lastIndexOf("/") + 1).split("?")[0];
      browser.wait(EC.elementToBeClickable(p_element), p_timeout ? p_timeout : 15000,
        "Expected " + p_element.locator() + " to exist on page '" + page + "'.")
          .then( function() { },
            function(err) {
              browser.getCurrentUrl().then(function(url) {
                console.error("URL at failure is " + url)
              })
              .then(function() {
                throw err;
              })
            }
          );
    });


    browser.wait(p_element.isDisplayed().then(
      function(present){
        return present;
      },
      function(error){
        log.error("Expected element to be displayed");
        return false;
      }
    ), 10000);
  },

  waitForElementToDisappear: function(p_element, p_timeout) {
    log.trace("Waiting for " + p_element.locator() + " to disappear for " + (p_timeout ? p_timeout : "15000"));
    var EC = protractor.ExpectedConditions;

    browser.wait(function() {
      return p_element.isDisplayed().then(
        function(present){
          // console.log(present)
          // if(present == false)
          //   console.log("GONE!!!!")
          return !present;
        },
        function(error){
          return true;
        }
      )}, p_timeout ? p_timeout : 15000, "Expected " + p_element.locator() + " to disappear.");



  },

  waitForPromiseTest: function(promiseFn, testFn, parameter1, parameter2) {
    return browser.wait(function () {
      var deferred = protractor.promise.defer();
      if(parameter1) {
        promiseFn(parameter1, parameter2).then(function (data) {
          deferred.fulfill(testFn(data));
        }, function(err){
          deferred.reject(err);
        });
      }
      else {
        promiseFn().then(function (data) {
          deferred.fulfill(testFn(data));
        });
      }
      return deferred.promise;
    }, 360000, "Promise fulfillment took longer than expected");
  }
}

module.exports = PageObject;
