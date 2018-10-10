import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { HomePage } from '../../pageobjects/page/HomePage.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { by, element, protractor, browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { PrivacyPolicyDialog } from '../../pageobjects/dialog/PrivacyPolicyDialog';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { MyAccountPage } from '../../pageobjects/page/MyAccountPage.po';
import { EditPersonalInformationDialog } from '../../pageobjects/dialog/EditPersonalInformationDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("SEO RichText");

describe('User views privacy policy consent ', () => {
  let storeFront : StoreFront = new StoreFront();
  var dataFile;
  dataFile = require('./data/GDPR.json');

  var date = new Date();
  var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var todayDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

  beforeAll(function () {
    let base = new BaseTest();
  });

  beforeEach(function () {
    let storeFront : StoreFront = new StoreFront();
    protractor.browser.executeScript('window.sessionStorage.clear();');
    protractor.browser.executeScript('window.localStorage.clear();');
  });

  it(' and accept: test01', () => {
    console.log(' as a guest and accept: test01'); 
    var testData = dataFile.test01;

    //launch storefront
    let gdprDialog : PrivacyPolicyDialog= new PrivacyPolicyDialog();
    gdprDialog.getGDPRConsentText().then(text => {
      expect(text).toContain(testData.privacyPolicyConsentText);
      expect(text).toContain(testData.privacyPolicyConsentText2);
      expect(text).toContain(testData.privacyPolicyConsentText3);
      expect(text).toContain(testData.privacyPolicyConsentText4);
      expect(text).toContain(testData.privacyPolicyConsentText5);
      expect(text).toContain(testData.privacyPolicyConsentText6);
    });
  
    /**MArketing Tracking */
    //marketing consent text validation
    gdprDialog.getMarketingConsentText().then(text => {
      expect(text).toContain(testData.marketingConsentText);
      expect(text).toContain(testData.marketingConsentText2);
      expect(text).toContain(testData.marketingConsentText3);
      expect(text).toContain(testData.marketingConsentText4);
      expect(text).toContain(testData.marketingConsentText5);
      expect(text).toContain(testData.marketingConsentText6);
    });

    //accpet option
    gdprDialog.marketingContentToggleSelected().then(on => {
      expect(on).toEqual(false);
    });

    gdprDialog.selectMarketingContentToggle(true);
    gdprDialog.marketingContentToggleSelected().then(on => {
      expect(on).toEqual(true);
    });

    gdprDialog.selectMarketingContentToggle(false);
    gdprDialog.marketingContentToggleSelected().then(on => {
      expect(on).toEqual(false);
    });
    gdprDialog.selectMarketingContentToggle(true);


    //Validate the content in the privacy policy 
    //anomynous toggle not active
    gdprDialog.anomynousToggleInactive().then(inactive=>{
      expect(inactive).toEqual(true);
    });
    gdprDialog.getDAConsentText().then(text => {
      expect(text).toContain(testData.DAConsentText);
      expect(text).toContain(testData.DAConsentText2);
    });

    //accept digital analytics
    gdprDialog.DAConsentToggleSelected().then(on => {
      expect(on).toEqual(false);
    });

    gdprDialog.selectDAConsentToggle(true);
    gdprDialog.DAConsentToggleSelected().then(on => {
      expect(on).toEqual(true);
    });

    //now anomynous toggle is active
    gdprDialog.anomynousToggleInactive().then(active => {
      expect(active).toEqual(false);
    });
    gdprDialog.anomynousToggleSelected().then( on => {
      expect(on).toEqual(false);
    });

    //select collect digital analytics anomynously
    gdprDialog.selectAnomynousToggle(true);
    gdprDialog.anomynousToggleSelected().then(on=>{
      expect(on).toEqual(true);
    }); 

    gdprDialog.selectAnomynousToggle(false);
    gdprDialog.anomynousToggleSelected().then(on=>{
      expect(on).toEqual(false);
    });

    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });
  });

  it(' and does not accept marketing nor digital analytics consent: test02', () => {
    console.log(' and does not accept: test02'); 
    var testData = dataFile.test01;

    //launch storefront
    let gdprDialog : PrivacyPolicyDialog= new PrivacyPolicyDialog();
    gdprDialog.getGDPRConsentText().then(text => {
      expect(text).toContain(testData.privacyPolicyConsentText);
    });
  
    //anomynous toggle not clickable
    gdprDialog.anomynousToggleNotClickable().then(notClickable =>{
      expect(notClickable).toEqual(true);
    });

    //Save without accepting anything
    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

  });

  it(', and views the accpet persisting within browser session: test03', () => {
    console.log(' and views the accpet persisting within browser session: test03'); 
    var testData = dataFile.test03;

    //in Tab 1
    let gdprDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog();

    //select marketing tracking consent toggle
    gdprDialog.selectMarketingContentToggle(true);

    //select DA consent toggle
    gdprDialog.selectDAConsentToggle(true);

    //select collect digital analytics anomynously
    gdprDialog.selectAnomynousToggle(true);

    //Save without accepting anything
    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    protractor.browser.sleep(3000);

    //open a new tab
    protractor.browser.executeScript("window.open('" + protractor.browser.baseUrl + "')");
    
    // In tab 2
    protractor.browser.getAllWindowHandles().then(function(handles){
      protractor.browser.switchTo().window(handles[1]).then(function(){
        let notDisplayedDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog(false);

        //Dialog is not displayed
        notDisplayedDialog.GDPRDialogDisplayed().then(notDisplayed => {
          expect(notDisplayed).toEqual(false);
        });
      });
    });

    //In tab 1
    protractor.browser.getAllWindowHandles().then(function(handles){
      protractor.browser.switchTo().window(handles[0]).then(function(){

        //refresh the page
        new StoreFront();

        //Dialog is not displayed
        gdprDialog.GDPRDialogDisplayed().then(notDisplayed => {
          expect(notDisplayed).toEqual(false);
        });
      });
    });

    protractor.browser.getAllWindowHandles().then(function (handles) {
        protractor.browser.switchTo().window(handles[1]);
        protractor.browser.driver.close();
        protractor.browser.switchTo().window(handles[0]);
    });
  });

  
  it(' when registering, user consents to markting an tracking: test05', () => {
    console.log(' when registering, user consents to markting an tracking: test05'); 
    var testData = dataFile.test05;

    //close the privacy policy dialog without selecting anything
    let gdprDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog();

    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });
    
    //go to Sign in page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    banner.clickSignIn(RegistrationPage);
    var register = new RegistrationPage(true);
    
    //check consent texts
    register.getMarketingConsentText().then(text => {
      expect(text).toEqual(testData.marketingConsent);
    });

    register.getDAConsentText().then(text => {
      expect(text).toEqual(testData.DAConsentText);
    });

    register.getAnomynousConsentText().then(text => {
      expect(text).toEqual(testData.anomynousConsentText);
    });

    
    //accept the marketing consent
    register.selectMarketingContentToggle(true);
    register.marketingConsentToggleSelected().then(on => {
      expect(on).toEqual(true);
    });


    //Anomynous toggle is unclickable
    register.anomynousToggleSelected().then(on => {
      expect(on).toEqual(false);
    });
    
    register.anomynousToggleNotClickable().then(clickable=>{
      expect(clickable).toEqual(true);
    });

    //select DA toggle
    register.selectDAToggle(true);
    register.DAConsentToggleSelected().then(on => {
      expect(on).toEqual(true);
    });

    register.anomynousToggleClickable().then(clickable => {
      expect(clickable).toEqual(true);
    });

    //select anomynous toggle
    register.selectAnomynousToggle(true);
    register.anomynousToggleSelected().then(selected => {
      expect(selected).toEqual(true);
    });

    var registerData = testData.register;    
      
    //create user
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp+ registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();

    new HomePage();

    //Go to my account page
    let myAccount : MyAccountPage = banner.clickMyAccount();

    //open personal information dialog
    myAccount.clickEditPersonalInformation();
    var personalInfoDialog : EditPersonalInformationDialog = new EditPersonalInformationDialog(true);

    // privacy policy consents are selected from registration
    personalInfoDialog.marketingConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
    personalInfoDialog.DAConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
    personalInfoDialog.anomynousToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
  });

  it(' when registering, user does not consents to markting tracking and able to update in the personal information: test06', () => {
    console.log(' when registering, user does not consents to markting tracking and able to update in the personal information: test06'); 
    var testData = dataFile.test06;

    //close the privacy policy dialog without selecting anything
    let gdprDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog();

    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });
    
    //go to Sign in page
    var banner = new Banner();
    banner.signInDisplayed().then(displayed=> {
      expect(displayed).toEqual(true);
    });
    banner.clickSignIn(RegistrationPage);
    var register = new RegistrationPage(true);
      
    //create user without accepting the privacy policy
    var registerData = testData.register;    
    register.typeFirstName(registerData.firstName)
    .typeLastName(registerData.lastName + timeStamp)
    .typeEmail(timeStamp+ registerData.logonId)
    .typePassword(registerData.password)
    .typeVerifyPassword(registerData.password)
    .clickRegister();
    new HomePage();

    //Go to my account page
    let myAccount : MyAccountPage = banner.clickMyAccount();

    //open personal information dialog
    myAccount.clickEditPersonalInformation();
    var personalInfoDialog : EditPersonalInformationDialog = new EditPersonalInformationDialog(true);

    // privacy policy consents are not selected 
    personalInfoDialog.marketingConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(false);
    });
    personalInfoDialog.DAConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(false);
    });
    personalInfoDialog.anomynousToggleSelected().then(selected =>{
      expect(selected).toEqual(false);
    });

    //select marketing privacy policy
    personalInfoDialog.selectMarketingContentToggle(true);
    personalInfoDialog.marketingConsentToggleSelected().then(selected => {
      expect(selected).toEqual(true);
    });

    //anomynous toggle not clickable
    personalInfoDialog.anomynousToggleNotClickable().then(notclickable => {
        expect(notclickable).toEqual(true);
    });

    //accept DA privacy policy
    personalInfoDialog.selectDAToggle(true);
    personalInfoDialog.DAConsentToggleSelected().then(selected => {
      expect(selected).toEqual(true);
    });

    //anomynous toggle is not clickable
    personalInfoDialog.anomynousToggleClickable().then(clickable => {
      expect(clickable).toEqual(true);
    });

    //acccept anomynous privacy policy
    personalInfoDialog.selectAnomynousToggle(true);
    personalInfoDialog.anomynousToggleSelected().then(clickable => {
      expect(clickable).toEqual(true);
    });

    //save the settings
    personalInfoDialog.save();

    personalInfoDialog.editPersonalInformationDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //update succesful message is displayed
    myAccount.getAlertMsg().then(alert => {
      expect(alert).toEqual(testData.alertMsg);
    });

    //open the personal information dialog again
    myAccount.clickEditPersonalInformation();
    var personalInfoDialog : EditPersonalInformationDialog = new EditPersonalInformationDialog(true);

    // privacy policy consents are selected from registration
    personalInfoDialog.marketingConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
    personalInfoDialog.DAConsentToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
    personalInfoDialog.anomynousToggleSelected().then(selected =>{
      expect(selected).toEqual(true);
    });
  });

  it(', and views the accpet persisting within browser session when the browser is restarted: test04', () => {
    console.log(', and views the accpet persisting within browser session when the browser is restarted: test04'); 

    //in Tab 1
    let gdprDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog();

    //select marketing tracking consent toggle
    gdprDialog.selectMarketingContentToggle(true);

    //select DA consent toggle
    gdprDialog.selectDAConsentToggle(true);

    //select collect digital analytics anomynously
    gdprDialog.selectAnomynousToggle(true);

    //Save without accepting anything
    gdprDialog.clickSave();
    gdprDialog.GDPRDialogNotDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(true);
    });

    //close and open another window
    protractor.browser.restart();

    //launch the storefront
    new StoreFront();
    let notDisplayedDialog : PrivacyPolicyDialog = new PrivacyPolicyDialog(false);

    //Dialog is not displayed
    notDisplayedDialog.GDPRDialogDisplayed().then(notDisplayed => {
      expect(notDisplayed).toEqual(false);
    });

  });
});
