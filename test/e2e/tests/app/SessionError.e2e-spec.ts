import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { SessionErrorDialog } from '../../pageobjects/dialog/SessionErrorDialog.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { browser} from 'protractor';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { AddressBookPage } from '../../pageobjects/page/AddressBookPage.po';
import { OrderHistoryPage } from '../../pageobjects/page/OrderHistoryPage.po';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';
import { AddressDialog } from '../../pageobjects/dialog/AddressDialog.po';
import { CheckOutPage } from '../../pageobjects/page/CheckOutPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Session Error");

/**
 * Session Erorr
 * Timeout
 * Session Kickout
 * relogin
 * redirect after relogin
 *
 */
describe('User encounters session error', () => {
  var dataFile = require('./data/SessionError.json');
  var storeFront : StoreFront;
  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

  var banner1 : Banner;
  var banner2: Banner;
  var login: LoginPage;


  beforeAll(function () {
    storeFront= new StoreFront()
    banner1 = storeFront.banner();

    console.log("Creating user: " + timeStamp + dataFile.register.logonId);

    banner1.signInDisplayed();
    var register = banner1.clickSignIn(RegistrationPage);
    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp+ registerData.loginId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();

    banner1.signInNotDisplayed();

    //add an address
    banner1.myAccountDisplayed();
    var myAccount = banner1.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    var addressDialog = myAccount.goToAddressBookPage().clickEditLink(0);

    var addressBookData = registerData.AddressBook;
    addressDialog.enterFirstName(addressBookData.firstName)
    .enterLastName(addressBookData.lastName)
    .enterPhoneNumber(addressBookData.phone)
    .enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode).clickSave();

    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    banner1.myAccountDisplayed();

    banner1.clickMyAccount().clickSignOut();
    banner1.signInDisplayed();

    //create second user
    banner1.clickSignIn(RegistrationPage);

    //create user
    register.typeFirstName(registerData.firstName2)
    .typeLastName(registerData.lastName )
    .typeEmail(timeStamp+ registerData.loginId2)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();

    banner1.signInNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });
    banner1.myAccountDisplayed();
    banner1.clickMyAccount().clickSignOut();
    banner1.signInDisplayed();

  });

  beforeEach(function () {

    var banner = new Banner();
    banner.signOutIfSignedIn();
  })

  afterEach(function () {
    //close the second tab
    //switch to main tab in case a test fails
    browser.getAllWindowHandles().then(function (handles) {
      for(let i = 1; i < handles.length; i++) {
        browser.switchTo().window(handles[i]);
        browser.driver.close();
      }
      browser.switchTo().window(handles[0]);
    });
  });

  //31 minute long testcase, skipped
  xit('test01: from timing out and re-logs in', () => {
    console.log('test01: from timing out');

    //go to the sign in page
    var testData = dataFile.test01;
    banner1 = new Banner();
    banner1.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    login = banner1.clickSignIn(LoginPage);

    // user signs in
    login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();
    banner1.signInNotDisplayed().then(notDisplayed =>{
      expect(notDisplayed).toEqual(true, 'sign in still displayed');
    });

    var myAccount = banner1.clickMyAccount();

    //Sessions times out : wait 31min
    browser.sleep(1860000);

    //Attempt to navigate to myaccount page
    //timeout dialog is displayed
    //check the heading
    var sessionErrorDialog = myAccount.goToAddressBookPageError();
    sessionErrorDialog.getHeading().then(heading => {
      expect(heading).toContain('Timeout');
    });

  });

  it('test02: from logging in from another place and re-logs in', () => {
    console.log('test02: from logging in from another place');

    var testData = dataFile.test02;
    var myAccount: MyAccountPage;

    //open a new tab
    browser.executeScript("window.open('" + browser.baseUrl + "')");

    //in tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //go to sign in
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });
        login = banner1.clickSignIn(LoginPage);

        // user signs in
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();
        banner1.signInNotDisplayed().then(notDispalyed => {
          expect(notDispalyed).toEqual(true);
        });

        //go to the myaccount page
        myAccount = banner1.clickMyAccount();
     });
    });
    browser.sleep(3000);

    //in the tab2
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //go to the sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });
        login = banner2.clickSignIn(LoginPage);

        // user signs in as the same user as tab 1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();
        banner1.signInNotDisplayed().then(notDispalyed => {
          expect(notDispalyed).toEqual(true);
        });
      });
    });
    browser.sleep(3000);

    //go back to tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){
        //when the user tries to go to the address book
        //session invalidation dialog is displayed
        var sessionErrorDialog = myAccount.goToAddressBookPageError();

        sessionErrorDialog.getHeading().then(heading => {
          expect(heading).toEqual('Invalid Session Error');
        });

        //login from the dialog
        sessionErrorDialog.enterPw(testData.password).clickLogin(AddressBookPage);
        let addressBook =  new AddressBookPage(1);

        //check the name in the addresscard
        //the user is on the addressbook page for the same user
        addressBook.getAddressCardNickName(0).then(nickName => {
          expect(nickName).toContain(timeStamp + testData.login);
        });
      });
    });

  });

  it('test03: from middle of checkout and then re-log in, verify that user can resume checkout', () => {
    console.log('test03: from middle of checkout and then re-log in, verify that user can resume checkout');

    var testData = dataFile.test03;
    var myAccount: MyAccountPage;
    var checkout : CheckOutPage;

    //open a new tab
    browser.executeScript("window.open('" + browser.baseUrl + "')");

    //in Tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //go to sign in page
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        login = banner1.clickSignIn(LoginPage);

        // user signs in, and the user is on the home page
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner1.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign out not displayed');
        });

        //click on the second item in the product recommendation carousel
        var pRecommended = new ProductRecommended(1);
        var productPage = pRecommended.clickOnName();

        //product page is loaded and product name is correct
        productPage.getProductName().then(result => {
          expect(result).toBe(testData.expectedProductName);
        });

        //add the product to the cart
        productPage.addToCart(1);
        var shopCart : ShoppingCartPage = productPage.clickViewCart();

        //there is 1 product in Cart
        shopCart.getNumberOfProductsLoaded().then(products => {
          expect(products).toBe(1, " shopcart does not have correct number of products loaded");
        });

        //When user clicks on check out
        //checkout page is loaded
        checkout= shopCart.clickCheckOut();

      });
    });
    browser.sleep(3000);

    // open tab 2
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //go to sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in as the same user as tab 1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner2.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign in still displayed');
        });
      });
    });
    browser.sleep(3000);

    //go back to tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //when we click SAVE AND CONTINUE button
        //Session Error dialog is displayed
        var sessionErrorDialog = checkout.saveAndContinueSessionError();

        //sign in from the dialog
        checkout = sessionErrorDialog.clearLogin()
        .enterPw(testData.password)
        .clickLogin(CheckOutPage);

        //check the product name again,
        //the user is in the same checkout page
        checkout.getProductNames().first().getText().then(text => {
          expect(text).toBe(testData.expectedProductName, " for product name on checkout page.");
        });
        checkout.getProductNames().count().then(count => {
          expect(count).toBe(1, " incorrect number of products");
        });

        //click SAVE AND CONTINUE
        checkout.saveAndContinue();

        //click PLACE ORDER button
        var orderConf = checkout.placeOrder();

        //user is on the the order confirmation page
        var orderId: string;
        orderConf.waitForOrderIdToLoad();

        //get the order id
        orderConf.getOrderId().then(id =>{
          orderId= id;
        });

        //go to the myaccount page
        myAccount = banner1.clickMyAccount();

        //user is logged in as the same user
        //verify the heading
        myAccount.getHeadingName().then(heading => {
          expect(heading).toEqual(testData.heading);
        });

        //go to the order history page
        myAccount.goToOrderHistoryPage();

        //order id is in the order history page
        //order is successfully created
        var orderHistory= new OrderHistoryPage(1);
        orderHistory.getOrderIdByIndex(0).then(history =>{
          expect(history).toEqual(orderId);
        });

      });
    });
  });

  it('test04: from a session sentivie page to re-login as a different user', () => {
    console.log('test04: from a session sentivie page to re-login as a different user');
    var testData = dataFile.test04;
    var myAccount: MyAccountPage;

    browser.executeScript("window.open('" + browser.baseUrl + "')");

    //In tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //go to the sign in
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner1.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign out not displayed');
        });
     });
    });
    browser.sleep(3000);

    //go to tab 2
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //go to the sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in as the same user as tab 1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner2.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign in still displayed');
        });
      });
    });
    browser.sleep(3000);

    //go back to tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //when the user tries to go to myaccount page
        //Session Error dialog is displayed
        var sessionErrorDialog = banner1.clickMyAccountError(SessionErrorDialog);

        //log in from the session error dialog
        //user is redirected to the myaccount page
        myAccount = sessionErrorDialog.clearLogin()
        .enterLogin(timeStamp + testData.login2)
        .enterPw(testData.password)
        .clickLogin(MyAccountPage);

        //check the user is on the myaccount page
        myAccount.getHeadingName().then(heading => {
          expect(heading).toEqual(testData.heading );
        });
      });
      });
  });

  it('test05: from a session invalidation, and close when a modal is displayed', () => {
    console.log('test05: from a session invalidation, and close when a modal is displayed');

    var testData = dataFile.test05;
    var myAccount: MyAccountPage;
    var addressDialog: AddressDialog;

    browser.executeScript("window.open('" + browser.baseUrl + "')");

    //in tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //go to sign in page
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner1.signInNotDisplayed().then(notDisplayed => {
          expect(notDisplayed).toEqual(true);
        });

        //Go to addressbook and open a Add Address modal
        myAccount = banner1.clickMyAccount();
        addressDialog=  myAccount.goToAddressBookPage().clickAddAddressButton();

        //Add existing users details with a valid US address
        //don't click save
        var addressBookData = testData.AddressBook;
        addressDialog.enterAddressNickName(addressBookData.nickName)
        .enterFirstName(addressBookData.firstName)
        .enterLastName(addressBookData.lastName)
        .enterEmail(addressBookData.email)
        .enterPhoneNumber(addressBookData.phone)
        .enterAddress1(addressBookData.address)
        .selectShipping(addressBookData.country)
        .enterCity(addressBookData.city)
        .enterState(addressBookData.state)
        .enterZipCode(addressBookData.zipCode);;

     });
    });
    browser.sleep(3000);

    //go to tab2
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //go to sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in as the same user as tab 1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner2.signInNotDisplayed().then(notDisplayed => {
          expect(notDisplayed).toEqual(true);
        });
      });
    });
    browser.sleep(3000);

    //back to tab 1
    browser.getAllWindowHandles().then(function(handles){
        browser.switchTo().window(handles[0]).then(function(){

          //when the user tries to hit save
          //Session Error dialog is displayed
          var sessionErrorDialog = addressDialog.clickSaveError(SessionErrorDialog);

          //close the dialog
          var loginPage = sessionErrorDialog.clickClose(LoginPage);

          //user is directed back to sign in page
          loginPage.forgotPasswordDisplayed().then(displayed => {
            expect(displayed).toBe(true);
          });
        });
      });
  });

  it('test06: from a session timeout, and cancels the dialog', () => {
    console.log('test06: from a session timeout, and cancels the dialog');

    var testData = dataFile.test06;
    var myAccount: MyAccountPage;

    //open a new tab
    browser.executeScript("window.open('" + browser.baseUrl + "')");

    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //GO to sign in page
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // user signs in
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner1.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign out not displayed');
        });

        //go to myaccount page
        myAccount = banner1.clickMyAccount();
     });
    });
    browser.sleep(3000);

    //open another tab
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //go to sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // sign in as the same user as tab 1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner2.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign out not displayed');
        });
      });
    });
    browser.sleep(3000);

    // go back to tab 1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //when the user tries to go to addressbook
        //Session Error dialog is displayed
        var sessionErrorDialog = myAccount.goToAddressBookPageError();

        //cancel the dialog
        var loginPage = sessionErrorDialog.clickCancel(LoginPage);

        //user is not logged in, so goes to sign in page
        loginPage.forgotPasswordDisplayed().then(displayed => {
          expect(displayed).toBe(true);
        });
      });
    });
  });

  it('test07: from a session timeout, validate the form', () => {
    console.log('test07: from a session timeout, validate the form');

    var testData = dataFile.test07;
    var myAccount: MyAccountPage;

    browser.executeScript("window.open('" + browser.baseUrl + "')");

    //In tab1
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[0]).then(function(){

        //Go to Sign in page
        banner1 = new Banner();
        banner1.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // User signs in
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner1.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign in still displayed');
        });

        //go to the myaccount page
        myAccount = banner1.clickMyAccount();
     });
    });
    browser.sleep(3000);

    //In Tab2
    browser.getAllWindowHandles().then(function(handles){
      browser.switchTo().window(handles[1]).then(function(){

        //Go to the sign in page
        banner2 = new Banner();
        banner2.signInDisplayed().then(displayed=> {
          expect(displayed).toEqual(true);
        });

        var login = banner1.clickSignIn(LoginPage);

        // Sign in as the same user as Tab1
        login.typeUserName(timeStamp + testData.login).typePassword(testData.password).clickLogin();

        banner2.signInNotDisplayed().then(notDisplayed =>{
          expect(notDisplayed).toEqual(true, 'sign in still displayed');
        });
      });
    });
    browser.sleep(3000);

    //Back to tab 1
    browser.getAllWindowHandles().then(function(handles){
        browser.switchTo().window(handles[0]).then(function(){

          //Go to
          var sessionErrorDialog = myAccount.goToAddressBookPageError();

          //Session Error dialog is displayed
          sessionErrorDialog.waitForEmailCss(dataFile.css.textField.valid[0],dataFile.css.textField.valid[1]);
          sessionErrorDialog.waitForPwCss(dataFile.css.textField.valid[0],dataFile.css.textField.valid[1]);

          //Check input css
          sessionErrorDialog.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
          });
          sessionErrorDialog.getPwInputCss(dataFile.css.textField.valid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
          });

          //Both empty
          sessionErrorDialog.clearLogin().enterLogin('s').deleteLogin().removeFocus().clickLogin(SessionErrorDialog);

          sessionErrorDialog.waitForEmailCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
          sessionErrorDialog.waitForPwCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);

          //Check input css
          sessionErrorDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
          });
          sessionErrorDialog.getPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
          });

          //Put whitespace in the login
          sessionErrorDialog.enterLogin(' ');

          //Check pw shows invalid input highlight
          sessionErrorDialog.waitForEmailCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);

          sessionErrorDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
          });

          //Put valid input in login
          sessionErrorDialog.clearLogin().enterLogin(timeStamp + testData.login);

          //Make pw input dirty and invalid
          sessionErrorDialog.enterPw('s');
          sessionErrorDialog.deletePw().removeFocus();

          //Check email input is not highlighted  but pw input is highlighted
          sessionErrorDialog.waitForEmailCss(dataFile.css.textField.valid[0],dataFile.css.textField.valid[1]);
          sessionErrorDialog.waitForPwCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
          sessionErrorDialog.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
          });
          sessionErrorDialog.getPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
          });

          //put a valid input for pw
          sessionErrorDialog.enterPw(testData.password).removeFocus();

          //Check no inputs are highlighted
          sessionErrorDialog.waitForPwCss(dataFile.css.textField.valid[0],dataFile.css.textField.valid[1]);
          sessionErrorDialog.getPwInputCss(dataFile.css.textField.valid[0]).then(css => {
            expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
          });
        });
      });
    });

});