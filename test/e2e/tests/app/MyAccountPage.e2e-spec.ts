import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { StoreFront, storeFrontObj } from '../../pageobjects/StoreFront.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("MyAccountPageTest");
/**
 * MyAccount Page
 * 	validate info and  + Edit personal info
	Change password
	Go to Order History + go to address book  + 2 other pages?

	error scenario:
	invalid input in personal info +  invalid input in password
 *
 */
describe('User views My Account Page', () => {
    let myAccount: MyAccountPage;
    var dataFile;
    var date = new Date();
    var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
    var storeFront : StoreFront;
    var banner : Banner;

    beforeAll(function () {
      dataFile = require('./data/MyAccount.json');

      storeFront = new StoreFront();
      banner = storeFront.banner();

      banner.signOutIfSignedIn();
      var register = banner.clickSignIn(RegistrationPage);

      console.log("Creating user: " + timeStamp + dataFile.register.logonId);

      var registerData = dataFile.register;

      //create user
      register.typeFirstName(registerData.firstName)
      .typeLastName(registerData.lastName + timeStamp)
      .typeEmail(timeStamp + registerData.logonId)
      .typePassword(registerData.password)
      .typeVerifyPassword(registerData.password)
      .clickRegister();
      banner.signInNotDisplayed();
      banner.myAccountDisplayed();

      banner.signOutIfSignedIn();
      banner.signInDisplayed();
    });

    beforeEach(function () {

      //GIVEN a user has an empty shopping cart, a valid address in address book, and the homepage is loaded
      storeFront = new StoreFront();
      banner = storeFront.banner();

      var commonTestData = dataFile.commonLogin;

      //Login
      var logon = timeStamp + commonTestData.logonId;
      banner.signInDisplayed();
      banner.signInDisplayed();

      var login = banner.clickSignIn(LoginPage);

      login.typeUserName(logon)
      .typePassword(commonTestData.logonPassword)
      .clickLogin();

      banner.signInNotDisplayed();
      banner.myAccountDisplayed();

      //Naviagate to MyAccount Page
      myAccount = banner.clickMyAccount();
      myAccount.addressBookLinkDisplayed();
      myAccount.orderHistoryLinkDisplayed();
    });

    afterEach(function() {
      var banner = new Banner().signOutIfSignedIn();
    });

  it('test01: to edit personal information', () => {
    var testData = dataFile.test1

    //Click on the 'Edit' button in Personal information page
    var editPIDialog = new MyAccountPage().clickEditPersonalInformation();

    //Edit info
    editPIDialog.modifyFirstName(testData.firstName)
    .modifyLastName(testData.lastName)
    .modifyEmail(testData.email)
    .modifyPhone(testData.phone)
    .modifyCurrency(testData.currency)

    //temporarily removed
    // editPIDialog.modifyGender(testData.gender);
    // editPIDialog.modfiyBirthYear(testData.birthYear);
    // editPIDialog.modfiyBirthMonth(testData.birthMonth);
    // editPIDialog.modfiyBirthDay(testData.birthDay);

    //Click Save
    .save();

    editPIDialog.editPersonalInformationDialogNotDisplayed();

    //Check alert msg
    myAccount.getAlertMsg().then(msg => {
      expect(msg).toEqual(testData.updateMsg, " Alert msg not correct");
    });

    myAccount.closeAlert();

    myAccount.waitForHeadingToUpdate(testData.expectedHeadingName);

    //Verify the updated info in My Account Page
    myAccount.getHeadingName().then( heading => {
      expect(heading).toEqual(testData.expectedHeadingName, " Heading name not correct");
    });

    myAccount.getEmail().then( email => {
      expect(email).toEqual(testData.expectedEmail, "Email not correct");
    });

    myAccount.getPhone(true).then(phone => {
      expect(phone).toEqual(testData.expectedPhone, " Phone not correct");
    });

    myAccount.getCurrency().then(currency => {
      expect(currency).toEqual(testData.expectedCurrency, " Currency not correct");
    });

    //temporarily removed
    // myAccount.clickEditPersonalInformation();
    // editPIDialog.verifyBirthYear(testData.expectedYear);
    // editPIDialog.verifyBirthMonth(testData.expectedMonth);
    // editPIDialog.verifyBirthDay(testData.expectedDay);
    // editPIDialog.cancel();

    //switch it back to the old data
    myAccount.clickEditPersonalInformation();

    //Edit info
    editPIDialog.modifyFirstName(testData.cleanUpFirstName)
    .modifyLastName(testData.cleanUpLastName)
    .modifyEmail(testData.cleanUpEmail)
    .modifyPhone(testData.cleanUpPhone)
    .modifyCurrency(testData.cleanUpCurrency);

    // editPIDialog.modifyGender(testData.cleanUpGender);
    // editPIDialog.modfiyBirthYear(testData.cleanUpBirthYear);
    // editPIDialog.modfiyBirthMonth(testData.cleanUpBirthMonth);
    // editPIDialog.modfiyBirthDay(testData.cleanUpBirthDay);

    //Click Save
    editPIDialog.save();
    editPIDialog.editPersonalInformationDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, " Edit personal information dialog still diaplyed");
    });

    //sign out
    banner.signOutIfSignedIn();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
  });

  it('test02: to change password', () => {
    var testData = dataFile.test2

    //Click on the 'Edit' button in Password section
    var editPwDialog = myAccount.clickEditPassword();

    //Edit password
    editPwDialog.typeCurrentPw(testData.currentPw)
    .typeNewPw1(testData.newPw)
    .typeNewPw2(testData.newPw);

    //click Save
    editPwDialog.clickSave().editPasswordDialogNotDisplayed().then(result => {
      expect(result).toBe(true, " Edit personal information dialog still diaplyed");
    })

    //Log out
    banner.clickMyAccount().clickSignOut();
    banner.signInDisplayed().then(displayed => {
      expect(displayed).toEqual(true);
    });
    var login = banner.clickSignIn(LoginPage);

    //Login with then new Pw
    testData=dataFile.commonLogin;
    login.typeUserName(timeStamp + testData.logonId);

    testData=dataFile.test2;
    login.typePassword(testData.newPw).clickLogin();

    //Go to My Account
    banner.clickMyAccount();

    //Edit passwor and save
    var editPwDialog = myAccount.clickEditPassword()
    .typeCurrentPw(testData.newPw)
    .typeNewPw1(testData.currentPw)
    .typeNewPw2(testData.currentPw)
    .clickSave();

    //save
    editPwDialog.clickSave().editPasswordDialogNotDisplayed().then(result => {
      expect(result).toBe(true, " Edit password  dialog still diaplyed");
    });

    //sign out
    banner.clickMyAccount().clickSignOut();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
  });

  it('test03: to navigate to other pages', () => {
    var testData = dataFile.test3

    //go to addressbook page
    var addrBook = myAccount.goToAddressBookPage();

    //verify heading
    addrBook.getPageName().then(pageName => {
      expect(pageName).toEqual('Address Book', " Page name not correct");
    });

    //Go to My Account
    banner.clickMyAccount();

    //Navigate to other pages linked
    var orderHistory = myAccount.goToOrderHistoryPage();
    orderHistory.getPageName().then(pageName => {
      expect(pageName).toEqual('Order History', " Page name not correct");
    });

    //sign out
    banner.clickMyAccount().clickSignOut();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
  });

  //Edited as part of form validation e2e
  it('test04: to save invalid personal information and password', () => {
    console.log('to save invalid personal information and password')
    var testData = dataFile.test4

    //click on the 'Edit' button on personal infomration section
    var editPIDialog= myAccount.clickEditPersonalInformation();

    //populate fields with invalid inputs
    editPIDialog.modifyFirstName(testData.blankInput).modifyLastName(testData.blankInput).modifyEmail(testData.blankInput).modifyPhone(testData.blankInput);

    /**
     * PI dialog with no inputs
     */
    //click save
    editPIDialog.save();
    editPIDialog.waitForFirstNameCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);
    editPIDialog.waitForPhoneCss(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

    //Check the fields have invalid input highlights
    editPIDialog.getFirstNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPIDialog.getLastNameInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPIDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPIDialog.getPhoneInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /**
     * PI dialog with special character
     * first and last name valid
     * email and phone not valid
     */
    //Fill the form out with with special characters
    editPIDialog.modifyFirstName(testData.invalidInput).modifyLastName(testData.invalidInput).modifyEmail(testData.invalidInput).modifyPhone(testData.invalidInput);

    editPIDialog.save();
    editPIDialog.waitForFirstNameCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    //Check the fields have invalid input highlights for email and phone only
    editPIDialog.getFirstNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    editPIDialog.getLastNameInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    editPIDialog.getEmailInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPIDialog.getPhoneInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /**
     * PI dialog with valid inputs
     * all valid
     */
    //fill the form with valid inputs
    editPIDialog.modifyFirstName(testData.firstName).modifyLastName(testData.lastName).modifyEmail(testData.email).modifyPhone(testData.phone).modifyCurrency(testData.currency);
    editPIDialog.waitForEmailCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);
    editPIDialog.waitForPhoneCss(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    //check the remaining form now has highlights gone
    editPIDialog.getEmailInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    editPIDialog.getPhoneInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });

    //click save
    editPIDialog.save();

    //Dialog is not displayed
    editPIDialog.editPersonalInformationDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toBe(true, 'dialog still displayed!');
    });

    /**
     * Edit password with no input
     * all invalid
     */
    //click on the 'Edit' button on password section
    var editPwDialog =myAccount.clickEditPassword();

    //click save without filling the form out
    editPwDialog.clickSave();

    editPwDialog.waitForPw2Css(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    //Check all inputs have the highlight
    editPwDialog.getCurrentPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPwDialog.getNewPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPwDialog.getNewPwVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /**
     * Edit password valid but not correct current password,
     * and new pw not matching
     */
    //Update password with valid(incorrect) current pw and new pw and pw verify not matching
    editPwDialog.typeCurrentPw(testData.invalidCurrentPw)
    .typeNewPw1(testData.badPw1)
    .typeNewPw2(testData.badPw2);

    editPwDialog.waitForPw2Css(dataFile.css.textField.invalid[0], dataFile.css.textField.invalid[1]);

    //new password fields have invalid input highlight
    editPwDialog.getNewPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPwDialog.getNewPwVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });

    /**
     * Edit password with valid but not correct pw, new matching pw
     * only current pw not valid
     */
    //Change the pw to match
    editPwDialog.typeNewPw1(testData.badPw1).typeNewPw2(testData.badPw1);
    editPwDialog.waitForPw2Css(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    //click save
    editPwDialog.clickSave();
    editPwDialog.waitForPw2Css(dataFile.css.textField.valid[0], dataFile.css.textField.valid[1]);

    // current pw has the highlight gone
    // Defect
    editPwDialog.getCurrentPwInputCss(dataFile.css.textField.valid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.valid[1], 'invalid css');
    });
    //new password fields have invalid input highlight
    editPwDialog.getNewPwInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });
    editPwDialog.getNewPwVerifyInputCss(dataFile.css.textField.invalid[0]).then(css => {
      expect(css).toBe(dataFile.css.textField.invalid[1], 'invalid css');
    });


    //Cancel and close the dialog
    editPwDialog.clickCancel();
  });

  it('test05: to open and close all the modals', () => {
    //click on the 'Edit' button on personal infomration section
    var editPIDialog= myAccount.clickEditPersonalInformation();
    editPIDialog.dialogClose();
    editPIDialog.editPersonalInformationDialogNotDisplayed();

     //click on the 'Edit' button on password section
     var editPwDialog  =myAccount.clickEditPassword()
     .dialogClose()
     .editPasswordDialogNotDisplayed().then(notDisplayed => {
       expect(notDisplayed).toBe(true , " Edit password  dialog still diaplyed");
     })

     banner.myAccountDisplayed();
     banner.signInNotDisplayed();

     //sign out
     myAccount = banner.clickMyAccount();
     myAccount.orderHistoryLinkDisplayed();
     myAccount.addressBookLinkDisplayed();

     myAccount.clickSignOut();
     banner.signInDisplayed().then(displayed=> {
       expect(displayed).toEqual(true);
     });
  });

});