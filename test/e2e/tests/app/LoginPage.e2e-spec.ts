import { StoreFront } from '../../pageobjects/StoreFront.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { ForgotPasswordModal } from '../../pageobjects/dialog/ForgotPasswordDialog.po';
import { } from 'jasmine';

var log4js = require("log4js");
var log = log4js.getLogger("LoginPage.e2e");

/**
* Login Page
*/
describe('Sign into Stockholm store', () => {
  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  var dataFile;
  let storeFront: StoreFront = new StoreFront();

  beforeAll(function () {
    dataFile = require('./data/LoginPage.json');
    var banner = new Banner();
    banner.signInDisplayed();
    var register = banner.clickSignIn(RegistrationPage);

    //create user
    console.log(timeStamp + dataFile.user01.email)
    register.typeFirstName(dataFile.user01.firstName);
    register.typeLastName(dataFile.user01.lastName + timeStamp);
    register.typeEmail(timeStamp + dataFile.user01.email);
    register.typePassword(dataFile.user01.password);
    register.typeVerifyPassword(dataFile.user01.password);
    register.clickRegister();

    banner.signOutIfSignedIn();

  });

  beforeEach(function () {
  });

  afterEach(function () {
    var banner = new Banner();
    banner.signOutIfSignedIn();
  });

  it('to login as a registered shopper: test01', () => {
    console.log('to login as a registered shopper: test01');
    let testData = dataFile.test01;

    //GIVEN a user is created and the homepage is loaded
    storeFront = new StoreFront();

    var banner = storeFront.banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var login = banner.clickSignIn(LoginPage);

    //AND
    //WHEN the user signs in
    login.typeUserName(timeStamp + testData.logonId);
    login.typePassword(testData.logonPassword);
    login.clickLogin();

    //THEN the sign in button is not diplayed in header
    banner.signInNotDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });

    //AND
    //WHEN the user navigates to the 'my account' page
    var myAccount = banner.clickMyAccount();
    //THEN the current signed in user is displayed
    myAccount.getHeadingName().then(heading => {
      expect(heading).toEqual(dataFile.user01.firstName + " " + dataFile.user01.lastName + timeStamp);
    });

  });

  it('to login with invalid credentials: test02', () => {
    console.log('to login with invalid credentials: test02');
    let testData = dataFile.test02;

    //GIVEN a user is created and the homepage is loaded
    storeFront = new StoreFront();

    //WHEN the user navigates to the sign-in page
    var banner = storeFront.banner();
    var login = banner.clickSignIn(LoginPage);

    //AND
    //WHEN the user signs in using invalid password
    login.typeUserName(timeStamp + testData.logonId).typePassword(testData.invalidLogonPassword).clickLogin();

    //THEN an appropriate password error message is displayed
    login.checkCredentialsErrorMessage(testData.passwordErrorMessage);

    //AND
    //WHEN the user signs in with an invalid user name
    login.typeUserName(timeStamp + testData.logonId + 'a').typePassword(testData.logonPassword).clickLogin();

    //THEN an appropriate username error message is displayed
    login.checkCredentialsErrorMessage(testData.passwordErrorMessage);

    //AND
    //WHEN the user signs in with correct credentials
    login.typeUserName(timeStamp + testData.logonId).clickLogin();

    banner.signInNotDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });

    //AND
    //WHEN the user navigates to the 'my account' page
    let myAccount: MyAccountPage = banner.clickMyAccount();

    //THEN the current signed in user is displayed
    myAccount.getHeadingName().then(heading => {
      expect(heading).toEqual(dataFile.user01.firstName + " " + dataFile.user01.lastName + timeStamp);
    });
  });

  it('to open Forgot password pops up modal: test03', () => {
    console.log('to open Forgot password pops up modal: test03');
    let testData = dataFile.test03;

    //GIVEN a user is created and the homepage is loaded
    storeFront = new StoreFront();

    //WHEN the user navigates to the sign-in page
    var banner= storeFront.banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var login = banner.clickSignIn(LoginPage);

    //AND
    //WHEN the user click 'forgot password'
    let forgotPasswordModal: ForgotPasswordModal = login.clickForgotPassword();

    //THEN the 'forgot password' modal is displayed
    forgotPasswordModal.checkForgotPasswordModalExists();
    forgotPasswordModal.clickClose();

  });

  //edited as part of form validatoin
  it('to attempt to login with empty/invalid form: test04', () => {
    console.log('to attempt to login with empty/invalid form: test04');

    let testData = dataFile.test04;

    //GIVEN a user is created and the homepage is loaded
    storeFront = new StoreFront();

    //WHEN the user navigates to the sign-in page
    //go to sign in
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var login = banner.clickSignIn(LoginPage);

    //Login without filling the form in
    login.clickLogin();

    //wait for the style to update
    login.waitForLogonIdCss(dataFile.css.textField.invalid[0],
      dataFile.css.textField.invalid[1]
    );

    //logon id input has invalid highlight
    login.getLogonIdInputClassName().then(classNames => {
      expect(classNames).toContain('ng-invalid' , 'invalid classname');
    });
    login.getLogonIdInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //password input has invalid highlight
    login.getPasswordInputClassName().then(classNames => {
      expect(classNames).toContain('ng-invalid', 'invalid classname');
    });
    login.getPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //type username
    login.typeUserName(timeStamp + testData.logonId).clickLogin();

    //logon id input now does not have the highlight
    login.getLogonIdInputClassName().then(classNames => {
      expect(classNames).toContain('ng-valid');
      expect(classNames).not.toContain('ng-invalid');
    });

    //password input has invalid highlight
    login.getPasswordInputClassName().then(classNames => {
      expect(classNames).toContain('ng-invalid');
    });

    login.typePassword(testData.logonPassword);

    //password input now does not have the highlight
    login.getPasswordInputClassName().then(classNames => {
      expect(classNames).toContain('ng-valid');
      expect(classNames).not.toContain('ng-invalid');
    });

    //user is able to login
    login.clickLogin();
  });

  //part of form validation
  it('to see error when submitting empty email in forgot password dalog: test05', () => {
    console.log('to see error when submitting empty email in forgot password dalog: test05');
    let testData = dataFile.test05;

    //GIVEN a user is created and the homepage is loaded
    storeFront = new StoreFront();

    //WHEN the user navigates to the sign-in page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    var login = banner.clickSignIn(LoginPage);

    //Open forgot password dialog
    var forgotPw :ForgotPasswordModal = login.clickForgotPassword();

    //submit the form with empty field
    /** empty field */
    forgotPw.typeEmail('a').clearEmail();
    forgotPw.submit();

    // Check the invalid input highlight is present with empty email
    forgotPw.waitForEmailCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
    forgotPw.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //enter valid email
    forgotPw.clearEmail().typeEmail(testData.logonId).removeFocus();

    //Check the invalid input highlight is not valid
    forgotPw.waitForEmailCss(dataFile.css.textField.valid[0],dataFile.css.textField.valid[1]);
    forgotPw.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    //enter valid email
    /** speical field */
    forgotPw.clearEmail().typeEmail('@#!$@').removeFocus();
    forgotPw.waitForEmailCss(dataFile.css.textField.invalid[0],dataFile.css.textField.invalid[1]);
    forgotPw.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    //close the dialog
    forgotPw.clickClose();
  });
});