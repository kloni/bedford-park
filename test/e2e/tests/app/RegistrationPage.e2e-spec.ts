import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("RegistrationPage.e2e");

/**
* Registration Page
*/
describe('Register in Stockholm store', () => {
  var dataFile;
  dataFile = require('./data/RegistrationPage.json');
  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  let storeFront : StoreFront = new StoreFront();

  beforeAll(()=> {

  });

  beforeEach(function() {
    var banner = new Banner().signOutIfSignedIn();
  });

  afterEach(function() {
    var banner = new Banner().signOutIfSignedIn();
  });

  it('to register with with all mandatory and optional fields and view in MyAccount Page: test01', () => {
    console.log('to register with with all mandatory and optional fields and view in MyAccount Page: test01');
    var testData = dataFile.test01;

    //GIVEN user has store front loaded a
    //WHEN user goes to registration page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var register = banner.clickSignIn(RegistrationPage);

    //AND
    //WHEN user enter all user info button disabled or enabled throughout
    register.typeFirstName(testData.firstName);
    register.typeLastName(testData.lastName + timeStamp);
    register.typeEmail(timeStamp + testData.email);
    register.typePhone(testData.phone);
    register.typePassword(testData.password);
    register.typeVerifyPassword(testData.password);

    //When user click submit and wiats for sign out presence
    register.clickRegister();

    banner.signInNotDisplayed().then(displayed => {
        expect(displayed).toEqual(true, " :sign is dispalyed when it should not be");
    });
    console.log("created user: " + timeStamp + testData.email);

    //WHEN user go to My Account page
    var myAccount = banner.clickMyAccount();
    myAccount.orderHistoryLinkDisplayed();
    myAccount.addressBookLinkDisplayed();

    //THEN validate account information
    myAccount.getHeadingName().then( heading => {
      expect(heading).toEqual(testData.firstName + " " + testData.lastName + timeStamp);
    });
    myAccount.getEmail().then( heading => {
      expect(heading).toEqual(timeStamp + testData.email);
    });
    myAccount.getPhone(true).then( phone => {
      expect(phone).toEqual(testData.phone);
    });
  });

  it('to register with only with mandatory fields: test02', () => {
    console.log('to register with only with mandatory fields: test02');
    var testData = dataFile.test02;

    //WHEN user goes to registration page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var register = banner.clickSignIn(RegistrationPage);

    //AND
    //WHEN user enters all mandatory user info button disabled or enabled throughout
    register.typeFirstName(testData.firstName);
    register.typeLastName(testData.lastName + timeStamp);
    register.typeEmail(timeStamp + testData.email);
    register.typePassword(testData.password);
    register.typeVerifyPassword(testData.password);

    //WHEN user clicks submit
    register.clickRegister();
    banner.signInNotDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });
    console.log("created user: " + timeStamp + testData.email);

    //WHEN user waits for banner to update and navigates to my account page
    var myAccount = banner.clickMyAccount();
    myAccount.orderHistoryLinkDisplayed();
    myAccount.addressBookLinkDisplayed();

    //THEN validate account information
    myAccount.getHeadingName().then( heading => {
      expect(heading).toEqual(testData.firstName + " " + testData.lastName + timeStamp);
    });
    myAccount.getEmail().then( heading => {
      expect(heading).toEqual(timeStamp + testData.email);
    });
    myAccount.getPhone(false).then( phone => {
      expect(phone).toEqual(true);
    });
  });


  //Edited as part of form invalidation e2e
  it('to register with missing mandatory fields: test03', () => {
    console.log('to register with missing mandatory fields: test03');
    var testData = dataFile.test03;

    //WHEN user goes to registration page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var register = banner.clickSignIn(RegistrationPage);

    //click register button
    register.checkRegisterButtonEnabled();
    register.clickRegister();
    register.waitForFirstNameCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

    //Validate all the form inputs have invalid input highlight
    register.getFirstNameClassName().then(className => {
      expect(className).toContain('ng-invalid');
      expect(className).not.toContain('ng-valid');
    });
    register.getFirstNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    register.getLastNameClassName().then(className => {
      expect(className).toContain('ng-invalid');
      expect(className).not.toContain('ng-valid');
    });
    register.getLastNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    register.getEmailClassName().then(className => {
      expect(className).toContain('ng-invalid');
      expect(className).not.toContain('ng-valid');
    });
    register.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    register.getPasswordClassName().then(className => {
      expect(className).toContain('ng-invalid');
      expect(className).not.toContain('ng-valid');
    });
    register.getPasswordInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    register.getPasswordVerifyClassName().then(className => {
      expect(className).toContain('ng-invalid');
      expect(className).not.toContain('ng-valid');
    });
    register.getPasswordVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    register.getPhoneVerifyClassName().then(className => {
      expect(className).toContain('ng-valid');
      expect(className).not.toContain('ng-invalid');
    });
    register.getPasswordVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //enter all mandatory user info
    register.typeVerifyPassword(testData.password)
    .typePassword(testData.password)
    .typeEmail(testData.email)
    .typeLastName(testData.lastName)
    .typeFirstName(testData.firstName)
    .selectReceiveHomeIdea()
    .waitForFirstNameCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    //Validate all the form inputs does not have invalid input highlight
    register.getFirstNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    register.getLastNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    register.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    register.getPasswordInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    register.getPasswordVerifyInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    //type invalid values for each field
    register.typeVerifyPassword('         ')
    .typePassword('     ')
    .typeEmail('     ')
    .typeLastName('     ')
    .typeFirstName('         ')
    .waitForFirstNameCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

    //verify the inputs have invalid input highlight
    register.getFirstNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    register.getLastNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    register.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    register.getPasswordInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    register.getPasswordVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //Enter an invalid value for phone
    register.typePhone('$#%@#^').selectReceiveHomeIdea();

    //Verify the phone input has invalid input highlight
    register.waitForPhoneCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);
    register.getPhoneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).not.toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    //Enter a valid value for phone
    register.clearPhone().typePhone(testData.phone).selectReceiveHomeIdea();

    //Verify the invalid input highlight is not displayed
    register.waitForPhoneCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);
    register.getPhoneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    /**
     * passsword mismatch
     */
    register.waitForPwCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);
    register.typePassword('wrongPassword1').typeVerifyPassword('wrongPassword2');
    register.getPasswordInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    register.getPasswordVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //Clear and fill the form up with valid values
    register.clearFirstName().clearLastName().clearEmail().clearVerifyPassword().clearPassword().clearPhone();
    register.typeVerifyPassword(testData.password).typePassword(testData.password).typeEmail(timeStamp + testData.email).typeLastName(testData.lastName).typeFirstName(testData.firstName);

    //Click submit
    register.clickRegister();
    console.log("created user: " + timeStamp + testData.email);

    //WHEN user wait for banner to update and navigates to my account page
    var banner = new Banner();
    var myAccount = banner.clickMyAccount();
    myAccount.orderHistoryLinkDisplayed();
    myAccount.addressBookLinkDisplayed();

    //THEN validate account information
    myAccount.getHeadingName().then( heading => {
      expect(heading).toEqual(testData.firstName + " " + testData.lastName);
    });
    myAccount.getEmail().then( heading => {
      expect(heading).toEqual(timeStamp + testData.email);
    });
    myAccount.getPhone(false).then(phone => {
      expect(phone).toEqual(true);
    });

  });


});