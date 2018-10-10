import { HomePage } from '../../pageobjects/page/HomePage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { AddressBookPage, addressBookObjs } from '../../pageobjects/page/AddressBookPage.po';
import {browser} from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import {RegistrationPage} from '../../pageobjects/page/RegistrationPage.po';
import {AddressDialog} from '../../pageobjects/dialog/AddressDialog.po';
import { notDeepEqual } from 'assert';


var log4js = require("log4js");
var log = log4js.getLogger("AddressBookPageTest");

/**
 * AddressBook Page
 *
 */
describe('User views address book', () => {
    let addressBookPage : AddressBookPage;
    var storeFront: StoreFront;
    var banner : Banner;

    var dataFile;
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();

    beforeAll(function () {
      dataFile = require('./data/AddressBookPage.json');
    });

    beforeEach(function () {
      storeFront = new StoreFront();
      banner = storeFront.banner();
      banner.signOutIfSignedIn();
    });

    afterEach(function() {
      var banner = new Banner().signOutIfSignedIn();
    });

  //edited as part of form validation e2e
  it('to add a new address with invalid data', () => {
    console.log('test 09: to add a new address with invalid data');
    var testData = dataFile.test9

    // Register user
    //WHEN user goes to registration page
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "09" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "09" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();

    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //WHEN user goes to registration page
    //go to myaccount
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();
    //click add address button
    var addressDialog = addressBookPage.clickAddAddressButton();

    var addressBookData = dataFile.register.AddressBook;

    /*  All blank
    * only phone and address2 should be valid
    */
    //Submit the form without putting any input
    addressDialog.clickSave();

    //Check if the input has invalid input highlight
    addressDialog.waitForNickNameCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
    addressDialog.waitForShippingCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);

    addressDialog.getNickNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getFirstNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getLastNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getPhoneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getAddressOneInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getAddressOneInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getAddressTwoInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getShipsToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getCityToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getStateToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getZipCodeToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /* All special character
    *  fields that are valid:
    *  first/last name
    *  address1 and address2
    *  city and state
    */
    //fill the form with special character values
    addressDialog.enterAddressNickName(testData.speicialChar)
    .enterFirstName(testData.speicialChar)
    .enterLastName(testData.speicialChar)
    .enterEmail(testData.speicialChar)
    .enterPhoneNumber(testData.speicialChar)
    .enterAddress1(testData.speicialChar)
    .enterAddress2(testData.speicialChar)
    .enterCity(testData.speicialChar)
    .enterState(testData.speicialChar)
    .enterZipCode(testData.speicialChar)
    .clickSave();


    addressDialog.waitForNickNameCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
    addressDialog.waitForShippingCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);

    addressDialog.getNickNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getFirstNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getLastNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getPhoneInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getAddressOneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getAddressTwoInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getShipsToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    addressDialog.getCityToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getStateToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getZipCodeToInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /**
     * All valid info
     * all fields should be valid
     */
    //Enter all the info
    addressDialog.enterAddressNickName(testData.nickName)
    .enterFirstName(testData.firstName)
    .enterLastName(testData.lastName)
    .enterEmail(testData.email)
    .enterPhoneNumber(testData.enterPhoneNumber)
    .enterAddress1(testData.address1)
    .enterAddress2(testData.address2)
    .selectShipping(testData.shipsTo)
    .enterCity(testData.city)
    .enterState(testData.state)
    .enterZipCode(testData.zipCode).removeFocus();

    addressDialog.waitForNickNameCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
    addressDialog.getNickNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getFirstNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getLastNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getPhoneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getAddressOneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getAddressTwoInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getShipsToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getCityToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getStateToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    addressDialog.getZipCodeToInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave().addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true , " Add Address dialog still displayed");
    });

    /**
     * Same nickname as an existing address
     */
    // click on the 'Add a new Adress' button
    var addressDialog = addressBookPage.clickAddAddressButton();

    addressDialog.enterAddressNickName(testData.nickName2)
    .enterFirstName(testData.firstName2)
    .enterLastName(testData.lastName2)
    .enterEmail(testData.email2)
    .enterPhoneNumber(testData.enterPhoneNumber2)
    .enterAddress1(testData.address1_2)
    .enterAddress2(testData.address2_2)
    .selectShipping(testData.shipsTo2)
    .enterCity(testData.city2)
    .enterState(testData.state2)
    .enterZipCode(testData.zipCode2);

    //click save
    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

    //verify the error message
    addressDialog.getErrorMessage().then(errorMsg  => {
      expect(errorMsg).toEqual(testData.errorMessage);
    });
    addressDialog.clickCancel();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //Sign out if signed in
    new Banner().signOutIfSignedIn();
  });

  it('to add a new address', () => {
    console.log('test 01: to add a new address');

    var testData = dataFile.test1

    // Register user
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "01" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "01" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();
    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Testcase starts
    // click on the 'Add a new Adress' button
    var addressDialog = addressBookPage.clickAddAddressButton();

    //Enter all the info
    addressDialog.enterAddressNickName(testData.nickName)
    .enterFirstName(testData.firstName)
    .enterLastName(testData.lastName)
    .enterEmail(testData.email)
    .enterPhoneNumber(testData.enterPhoneNumber)
    .enterAddress1(testData.address1)
    .enterAddress2(testData.address2)
    .selectShipping(testData.shipsTo)
    .enterCity(testData.city)
    .enterState(testData.state)
    .enterZipCode(testData.zipCode);

    //click save
    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

    //Verify the alert message
    addressBookPage.getSaveAlertMessage().then(msg => {
      expect(msg).toEqual(testData.saveAlertMsg);
    })

    //Check the count of the cards
    addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('2');
    });

    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(2);
    });

    //Verify the address info
    addressBookPage.getAddressCardFirstName(1).then( firstName => {
      expect(firstName).toEqual(testData.expectedFirstName);
    });
    addressBookPage.getAddressCardLastName(1).then( lastName => {
      expect(lastName).toEqual(testData.expectedLastName);
    });
    addressBookPage.getAddressCardNickName(1).then( nickName => {
      expect(nickName).toEqual(testData.expectedNickName);
    });
    addressBookPage.getAddressCardAddressLine(1).then( address => {
      expect(address).toEqual(testData.expectedAddress);
    });
    addressBookPage.getAddressCardCity(1).then( city => {
      expect(city).toEqual(testData.expectedCity);
    });
    addressBookPage.getAddressCardState(1).then( state => {
      expect(state).toEqual(testData.expectedState);
    });
    addressBookPage.getAddressCardZipCode(1).then( zip => {
      expect(zip).toEqual(testData.expectedZipCode);
    });
    addressBookPage.getAddressCardCountry(1).then( country => {
      expect(country).toEqual(testData.expectedCountry);
    });

    addressBookPage.getAddressCardEmail(0).then( email => {
      expect(email).toEqual(testData.expectedEmail);
    });
    addressBookPage.getAddressCardPhone(1).then( phone => {
      expect(phone).toEqual(testData.expectedPhone);
    });

    addressBookPage.addressIsDefault(1).then(isDefaut => {
      expect(isDefaut).toBe(false);
    });

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });

  });


  it('to Cancel adding an address', () => {
    console.log('test 02: to Cancel adding an address');

    var testData = dataFile.test2

    // Register user
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "02" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "02" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Testcase starts
     // click on the 'Add a new Adress' button
     var addressDialog = addressBookPage.clickAddAddressButton();

     //Cancel
     addressDialog.clickCancel();
     addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toBe(true , " Add Address dialog still displayed");
     });
  });


  it('to Cancel removing an address', () => {
    console.log('test 03: to Cancel removing an address');

    var testData = dataFile.test3

    // Register user
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "03" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "03" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });


    //Testcase starts
    // click on the 'Add a new Adress' button
    var addressDialog = addressBookPage.clickAddAddressButton();

    //Enter all the info
    addressDialog.enterAddressNickName(testData.nickName)
    .enterFirstName(testData.firstName)
    .enterLastName(testData.lastName)
    .enterEmail(testData.email)
    .enterPhoneNumber(testData.enterPhoneNumber)
    .enterAddress1(testData.address1)
    .enterAddress2(testData.address2)
    .selectShipping(testData.shipsTo)
    .enterCity(testData.city)
    .enterState(testData.state)
    .enterZipCode(testData.zipCode);

    //click save
    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

    //Verify the alert message
    addressBookPage.getSaveAlertMessage().then(msg => {
      expect(msg).toEqual(testData.saveAlertMsg);
    });

    // //verify the address is there
    //verify if properly displayed? <- pagination?
    addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('2');
    });

    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(2);
    });

    //Verify the address info
    addressBookPage.getAddressCardFirstName(1).then( firstName => {
      expect(firstName).toEqual(testData.expectedFirstName);
    });
    addressBookPage.getAddressCardLastName(1).then( lastName => {
      expect(lastName).toEqual(testData.expectedLastName);
    });
    addressBookPage.getAddressCardNickName(1).then( nickName => {
      expect(nickName).toEqual(testData.expectedNickName);
    });
    addressBookPage.getAddressCardAddressLine(1).then( address => {
      expect(address).toEqual(testData.expectedAddress);
    });
    addressBookPage.getAddressCardCity(1).then( city => {
      expect(city).toEqual(testData.expectedCity);
    });
    addressBookPage.getAddressCardState(1).then( state => {
      expect(state).toEqual(testData.expectedState);
    });
    addressBookPage.getAddressCardZipCode(1).then( zip => {
      expect(zip).toEqual(testData.expectedZipCode);
    });
    addressBookPage.getAddressCardCountry(1).then( country => {
      expect(country).toEqual(testData.expectedCountry);
    });

    addressBookPage.getAddressCardEmail(0).then( email => {
      expect(email).toEqual(testData.expectedEmail);
    });
    addressBookPage.getAddressCardPhone(1).then( phone => {
      expect(phone).toEqual(testData.expectedPhone);
    });
    addressBookPage.addressIsDefault(1).then(isDefaut => {
      expect(isDefaut).toBe(false);
    });

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickCancel();

    //verify the address is there
    addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('2');
    });
    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(2);
    });

    //Remove Address
    addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });

    //address is removed
    addressBookPage.waitForNumberOfAddressCardsToUpdate('1');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('1');
    });
    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(1);
    });
  });

it('test 05: to see unsaved changes in an address is discarded', () => {
  console.log('test 05: to see unsaved changes in an address is discarded');

  var testData = dataFile.test5

  // Register user
  var register = banner.clickSignIn(RegistrationPage);

  console.log("Creating user: " + timeStamp + "05" + dataFile.register.logonId);

  var registerData = dataFile.register;

  //create user
  register.typeFirstName(registerData.firstName)
  .typeLastName(registerData.lastName + timeStamp)
  .typeEmail(timeStamp + "05" + registerData.logonId)
  .typePassword(registerData.password)
  .typeVerifyPassword(registerData.password)
  .clickRegister();
  banner.signInNotDisplayed();
  banner.myAccountDisplayed();

  //go to my account
  var myAccount = banner.clickMyAccount();
  myAccount.addressBookLinkDisplayed();
  myAccount.orderHistoryLinkDisplayed();

  //go to addressbook
  addressBookPage= myAccount.goToAddressBookPage();

  //click edit on the first address card
  addressDialog = addressBookPage.clickEditLink(0);

  var addressBookData = dataFile.register.AddressBook;

  //EDIT existing users details with a valid US address
  addressDialog.enterAddress1(addressBookData.address)
  .selectShipping(addressBookData.country)
  .enterCity(addressBookData.city)
  .enterState(addressBookData.state)
  .enterZipCode(addressBookData.zipCode)
  .enterPhoneNumber(addressBookData.phone)
  .clickSave();
  addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
    expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
  });

    //Testcase starts
   // click on the 'Add a new Adress' button
   var addressDialog = addressBookPage.clickAddAddressButton();

   // Enter all the info
   addressDialog.enterAddressNickName(testData.nickName)
   .enterFirstName(testData.firstName)
   .enterLastName(testData.lastName)
   .enterEmail(testData.email)
   .enterPhoneNumber(testData.enterPhoneNumber)
   .enterAddress1(testData.address1)
   .enterAddress2(testData.address2)
   .selectShipping(testData.shipsTo)
   .enterCity(testData.city)
   .enterState(testData.state)
   .enterZipCode(testData.zipCode);

   //click save
   addressDialog.saveButtonClickable().then(clickable => {
    expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

   //Verify the alert message
   addressBookPage.getSaveAlertMessage().then(msg => {
    expect(msg).toEqual(testData.saveAlertMsg);
  });

   // //verify the address is there
   addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
   addressBookPage.getAddreessCardCount().then(cardCount => {
     expect(cardCount).toBe('2');
   });
   addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
     expect(count).toEqual(2);
   });

   //Verify the address info
    addressBookPage.getAddressCardFirstName(1).then( firstName => {
      expect(firstName).toEqual(testData.expectedFirstName);
    });
    addressBookPage.getAddressCardLastName(1).then( lastName => {
      expect(lastName).toEqual(testData.expectedLastName);
    });
    addressBookPage.getAddressCardNickName(1).then( nickName => {
      expect(nickName).toEqual(testData.expectedNickName);
    });
    addressBookPage.getAddressCardAddressLine(1).then( address => {
      expect(address).toEqual(testData.expectedAddress);
    });
    addressBookPage.getAddressCardCity(1).then( city => {
      expect(city).toEqual(testData.expectedCity);
    });
    addressBookPage.getAddressCardState(1).then( state => {
      expect(state).toEqual(testData.expectedState);
    });
    addressBookPage.getAddressCardZipCode(1).then( zip => {
      expect(zip).toEqual(testData.expectedZipCode);
    });
    addressBookPage.getAddressCardCountry(1).then( country => {
      expect(country).toEqual(testData.expectedCountry);
    });

    addressBookPage.getAddressCardEmail(0).then( email => {
      expect(email).toEqual(testData.expectedEmail);
    });
    addressBookPage.getAddressCardPhone(1).then( phone => {
      expect(phone).toEqual(testData.expectedPhone);
    });
    addressBookPage.addressIsDefault(1).then(isDefaut => {
      expect(isDefaut).toBe(false);
    });

   //Try to edit the address, but cancel in the middle
   var editDialog= addressBookPage.clickEditLink(1);
   editDialog.enterLastName(testData.updateLastName).enterFirstName(testData.updateFirstName)
   .clickCancel();

    //Verify the address info displays the first address
    addressBookPage.getAddressCardFirstName(1).then( firstName => {
      expect(firstName).toEqual(testData.expectedFirstName);
    });
    addressBookPage.getAddressCardLastName(1).then( lastName => {
      expect(lastName).toEqual(testData.expectedLastName);
    });

   //Verify the info stays the same in the dialog
   editDialog= addressBookPage.clickEditLink(1);
   editDialog.getFirstName().then(firstName => {
    expect(firstName).toEqual(testData.expectedFirstName);;
   });

   editDialog.getLastName().then(lastName => {
    expect(lastName).toEqual(testData.expectedLastName);;
   });
   editDialog.clickCancel();

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });
 });

  it('to edit an address', () => {
    console.log('test 06: to edit an address');

   var testData = dataFile.test6

   // Register user
   var register = banner.clickSignIn(RegistrationPage);

   console.log("Creating user: " + timeStamp + "06" + dataFile.register.logonId);

   var registerData = dataFile.register;

   //create user
   register.typeFirstName(registerData.firstName)
   .typeLastName(registerData.lastName + timeStamp)
   .typeEmail(timeStamp + "06" + registerData.logonId)
   .typePassword(registerData.password)
   .typeVerifyPassword(registerData.password)
   .clickRegister();
   banner.signInNotDisplayed();
   banner.myAccountDisplayed();

  //go to my account
  var myAccount = banner.clickMyAccount();
  myAccount.addressBookLinkDisplayed();
  myAccount.orderHistoryLinkDisplayed();

  //go to addressbook
  addressBookPage= myAccount.goToAddressBookPage();

  //click edit on the first address card
  addressDialog = addressBookPage.clickEditLink(0);

   var addressBookData = dataFile.register.AddressBook;

   //EDIT existing users details with a valid US address
   addressDialog.enterAddress1(addressBookData.address)
   .selectShipping(addressBookData.country)
   .enterCity(addressBookData.city)
   .enterState(addressBookData.state)
   .enterZipCode(addressBookData.zipCode)
   .enterPhoneNumber(addressBookData.phone)
   .clickSave();
   addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
     expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
   });

   //Testcase starts
   // click on the 'Add a new Adress' button
   var addressDialog = addressBookPage.clickAddAddressButton();

   // Enter all the info
   addressDialog.enterAddressNickName(testData.nickName)
   .enterFirstName(testData.firstName)
   .enterLastName(testData.lastName)
   .enterEmail(testData.email)
   .enterPhoneNumber(testData.enterPhoneNumber)
   .enterAddress1(testData.address1)
   .enterAddress2(testData.address2)
   .selectShipping(testData.shipsTo)
   .enterCity(testData.city)
   .enterState(testData.state)
   .enterZipCode(testData.zipCode);

   //click save
   addressDialog.saveButtonClickable().then(clickable => {
    expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

   //Verify the alert message
   addressBookPage.getSaveAlertMessage().then(msg => {
      expect(msg).toEqual(testData.saveAlertMsg);
    });

   //verify the address is there
   addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
   addressBookPage.getAddreessCardCount().then(cardCount => {
     expect(cardCount).toBe('2');
   });
   addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
     expect(count).toEqual(2);
   });

    //Enter new address info
    var editDialog = addressBookPage.clickEditLink(1);
    editDialog.enterLastName(testData.updateLastName)
    .enterFirstName(testData.updateFirstName)
    .enterEmail(testData.updateEmail)
    .enterPhoneNumber(testData.updatePhoneNumber)
    .enterAddress1(testData.updateAddress1)
    .enterAddress2(testData.updateAddress2)
    .selectShipping(testData.updateShipsTo)
    .enterCity(testData.updateCity)
    .enterState(testData.updateState)
    .enterZipCode(testData.updateZipCode);

    //click Save
    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Verify the updated address
    addressBookPage.waitForLastNameToUpdate(1, testData.updateLastName);
    browser.sleep(5000);
    addressBookPage.getAddressCardLastName(1).then( lastName => {
      expect(lastName).toEqual(testData.updateLastName);
    });

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });

  });

  it('to remove an address', () => {
    console.log('test 07:to remove an address');

    var testData = dataFile.test7

    // Register user
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "07" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "07" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();

    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Testcase starts
    // click on the 'Add a new Adress' button
   var addressDialog = addressBookPage.clickAddAddressButton();

   // Enter all the info
   addressDialog.enterAddressNickName(testData.nickName)
   .enterFirstName(testData.firstName)
   .enterLastName(testData.lastName)
   .enterEmail(testData.email)
   .enterPhoneNumber(testData.enterPhoneNumber)
   .enterAddress1(testData.address1)
   .enterAddress2(testData.address2)
   .selectShipping(testData.shipsTo)
   .enterCity(testData.city)
   .enterState(testData.state)
   .enterZipCode(testData.zipCode);

   //click save
   addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();


   //Verify the alert message
   addressBookPage.getSaveAlertMessage().then(msg => {
      expect(msg).toEqual(testData.saveAlertMsg);
    });

   //verify the address is there
   addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
   addressBookPage.getAddreessCardCount().then(cardCount => {
     expect(cardCount).toBe('2');
   });
   addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
     expect(count).toEqual(2);
   });

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });

    //verify the remove alert
    addressBookPage.getDeleteAlertMessage().then(deleteAlertMsg => {
      expect(deleteAlertMsg).toEqual(testData.deleteAlertMsg);
    });

  });

  it('to set an address as default', () => {
    console.log('test 08: to set an address as default');

    var testData = dataFile.test8

    // Register user
    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "08" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "08" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Testcase starts
    // click on the 'Add a new Adress' button
    var addressDialog = addressBookPage.clickAddAddressButton();

    // Enter all the info
    addressDialog.enterAddressNickName(testData.nickName)
    .enterFirstName(testData.firstName)
    .enterLastName(testData.lastName)
    .enterEmail(testData.email)
    .enterPhoneNumber(testData.enterPhoneNumber)
    .enterAddress1(testData.address1)
    .enterAddress2(testData.address2)
    .selectShipping(testData.shipsTo)
    .enterCity(testData.city)
    .enterState(testData.state)
    .enterZipCode(testData.zipCode);

    //click save
    addressDialog.saveButtonClickable().then(clickable => {
      expect(clickable).toBe(true);
    });
    addressDialog.clickSave();

    //Verify the alert message
    addressBookPage.getSaveAlertMessage().then(msg => {
      expect(msg).toEqual(testData.saveAlertMsg);
    });

    //verify the address is there
    addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('2');
    });
    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(2);
    });

    //set the address as default
    addressBookPage.clickSetAsDefaultLink(1);

    //verify the name of the addresscard and see if it's default
    addressBookPage.waitForAddressIsDefault(1)

    addressBookPage.addressIsDefault(1).then(isDefaut => {
      expect(isDefaut).toBe(true);
    });

    //verify the default address does not have 'Remove Link'
    addressBookPage.addressCannotBeRemoved(1).then(cannotBeRemoved => {
      expect(cannotBeRemoved).toBe(true);
    });

    //Verify non-default address displays 'Set as Default' link
    addressBookPage.addressNotDefault(0);

    //Verify profile address does not have 'Remove' link
    addressBookPage.addressCannotBeRemoved(0);

    ///////////////workaround///////////////
    //Go to My Account
    storeFront = new StoreFront();

    myAccount = storeFront.banner().clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //Go to AddressBook
    addressBookPage=  myAccount.goToAddressBookPage();
    addressBookPage.getPageName().then(pageName => {
      expect(pageName).toEqual('Address Book');
    });
    /////////////////////////////////////////

    //Set the original profile address as the default link
    addressBookPage.clickSetAsDefaultLink(0);

    //verify the name of the addresscard and see if it's default
    addressBookPage.waitForAddressIsDefault(0).addressIsDefault(0).then(isDefaut => {
      expect(isDefaut).toBe(true);
    });

    //verify if the count of address cards are correct
    addressBookPage.waitForNumberOfAddressCardsToUpdate('2');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('2');
    });

    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(2);
    });

    //Remove Address
    var removeDialog= addressBookPage.clickRemoveLink(1);
    removeDialog.clickConfirm();
    removeDialog.removeDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true);
    });
  });

  it('to add multiple new addresses and verify that non-profile addresses are sorted by nickname', () => {
    console.log('test 10: to add multiple new addresses and verify that non-profile addresses are sorted by nickname');

    var testData = dataFile.test10

    var num:number = 0
    var count:number = 0;
    var addressDialog;

    var register = banner.clickSignIn(RegistrationPage);

    console.log("Creating user: " + timeStamp + "10" + dataFile.register.logonId);

    var registerData = dataFile.register;

    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp + "10" + registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    banner.signInNotDisplayed();
    banner.myAccountDisplayed();

    //go to my account
    var myAccount = banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();

    //go to addressbook
    addressBookPage= myAccount.goToAddressBookPage();

    //click edit on the first address card
    addressDialog = addressBookPage.clickEditLink(0);

    var addressBookData = dataFile.register.AddressBook;

    //EDIT existing users details with a valid US address
    addressDialog.enterAddress1(addressBookData.address)
    .selectShipping(addressBookData.country)
    .enterCity(addressBookData.city)
    .enterState(addressBookData.state)
    .enterZipCode(addressBookData.zipCode)
    .enterPhoneNumber(addressBookData.phone)
    .clickSave();
    addressDialog.addAddressDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Add Address dialog still displayed");
    });

    //Testcase starts
    //add 5+ new addresses
    for(num=0;num<5;num++) {

      // click on the 'Add a new Adress' button
      addressBookPage.addAddressButtonClickable().then( clickable => {
        expect(clickable).toBe(true , " address button is not clickable");
      });
      browser.sleep(5000);

      addressDialog = addressBookPage.clickAddAddressButton();

      browser.sleep(5000);

      //Enter all the info
      var nickName= testData.nickName.concat(''+num);
      addressDialog.enterAddressNickName(nickName)
      .enterFirstName(testData.firstName)
      .enterLastName(testData.lastName)
      .enterEmail(testData.email)
      .enterPhoneNumber(testData.enterPhoneNumber)
      .enterAddress1(testData.address1)
      .enterAddress2(testData.address2)
      .selectShipping(testData.shipsTo)
      .enterCity(testData.city)
      .enterState(testData.state)
      .enterZipCode(testData.zipCode);

      //click save
      addressDialog.saveButtonClickable().then(clickable => {
        expect(clickable).toBe(true, " Save button it not clickable");
      });

      //Dialog is not displayed anymore
      addressDialog.clickSave().addAddressDialogNotDisplayed().then(notDisplayed => {
        expect(notDisplayed).toBe(true, "Add Address Dialog it still displayed");
      });

    }


    //verify if the count of address cards are correct
    addressBookPage.waitForNumberOfAddressCardsToUpdate('6');
    addressBookPage.getAddreessCardCount().then(cardCount => {
      expect(cardCount).toBe('6');
    });

    addressBookPage.getNumberOfAddressCardsDisplayed().then(count => {
      expect(count).toEqual(6);
    });

    //Sign out
    banner.clickMyAccount();
    myAccount.addressBookLinkDisplayed();
    myAccount.orderHistoryLinkDisplayed();
    myAccount.clickSignOut();
    banner.signInDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });
  });

});