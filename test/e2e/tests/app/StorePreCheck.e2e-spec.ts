import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { by, element, protractor, browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Store Precheck");

/**
 * Store Precheck 
 * Before running e2e, running this script will prevent 
 */
describe('Check if the store is loaded and contents are published', () => {
  let storeFront : StoreFront = new StoreFront();
  var date = new Date();    
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  

  beforeAll(function () {
    let base = new BaseTest();
  });

  beforeEach(function () {
  });

  //Valid parameters with invalid session
  it('to start the e2e preparation', () => {
    console.log('to start the e2e preparation');
    let storeFront : StoreFront = new StoreFront();

    var count = 0
    checkUI();
    

    function checkUI(): Promise<boolean>{

      return Promise.all([
        
        storeFront.navigateToHomePage().heroSlideshowExists(), 
        storeFront.banner().checkMegamenuExists(),
        storeFront.navigateToURL('/product?productNumber=BR-ACCE-0002-0001', ProductPage).productNameExists(),
        storeFront.navigateToURL('/plp?categoryId=10602', ProductListingPage).priceFilterDisplayed(),
        storeFront.navigateToLogin().forgotPasswordDisplayed(),
        storeFront.navigateToRegistration().typeFirstName('testFirstName')
        .typeLastName('testFirstName' + timeStamp)
        .typeEmail(timeStamp+ count + 'precheck@isc4sb.com')
        .typePassword('diet4coke')
        .typeVerifyPassword('diet4coke')
        .clickRegister().clickMyAccount().addressBookLinkDisplayed(),
        
      ]).then(function(results){

        var pass = results[0] && results[1] && results[2];
        if(pass && count <25){
          let passed = true;
          expect(passed).toEqual(true);
          return true;
        }else if(!pass && count < 5){
          count++;
          browser.sleep(120000);
          checkUI();
        }else{
          let passed = false;
          expect(passed).toEqual(true);
          return false;
        }
      });
    }

      
  });


});
