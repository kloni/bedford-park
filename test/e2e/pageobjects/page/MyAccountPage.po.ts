import { browser, by, element } from 'protractor';
import {BaseTest} from  '../base/BaseTest.po';
import {AddressBookPage} from './AddressBookPage.po';
import {OrderHistoryPage} from './OrderHistoryPage.po';
import {WishListPage} from './WishListPage.po';
import {CustomerServicePage, customerServicePageObjs} from './CustomerServicePage.po';
import { EditPassswordDialog} from '../dialog/EditPasswordDialog.po';
import { EditPersonalInformationDialog } from '../dialog/EditPersonalInformationDialog.po';
import { SessionErrorDialog } from '../dialog/SessionErrorDialog.po';
import { HomePage } from './HomePage.po';
import { Banner } from '../banner/Banner.po';

var log4js = require("log4js");
var log = log4js.getLogger("MyAccountPage");



export const myAccountPageObjs = {
    addressBookLink: element.all(by.cssContainingText("[id^=myaccountlink_a_7_]", "ADDRESS BOOK")).first(),
    orderHistoryLink: element.all(by.cssContainingText("[id^=myaccountlink_a_7_]", "ORDER HISTORY")).first(),
    customerServiceLink: element.all(by.cssContainingText("[id^=myaccountlink_a_7_]", "CUSTOMER SERVICE")).first(),
    wishListLink: element.all(by.cssContainingText("[id^=myaccountlink_a_7_]", "Wish List")).first(),

    editPersonalInformation: element.all(by.css("[id^=personalinfo_a_17_]")).first(),
    editPassword: element.all(by.css("[id^=personalinfo_a_22_]")).first(),

    changePassword: element.all(by.css("[id^=personalinfo_a_21_]")).first(),
    alertMsg: element.all(by.css("[id^=personalinfo_span_5_]")).first(),
    alertClose: element.all(by.css("[id^=personalinfo_button_6_]")).first(),

    //Personal information verification
    nameHeading: element.all(by.css("[id^=personalinfo_h4_9_]")).first(),
    emailLabel: element.all(by.css("[id^=personalinfo_span_13_]")).first(),
    phoneLabel: element.all(by.css("[id^=personalinfo_span_14_]")).first(),
    currencyLabel: element.all(by.css("[id^=personalinfo_span_15_]")).first(),
    signOutButton: element.all(by.css("[id^=personalinfo_button_71_]")).first(),

    //Customer Service Representative
    actingAsUserName: element.all(by.css("[id^=personalinfo_actingAsUser_]")).first(),
    actingAsUserStopButton: element.all(by.css("[id^=personalinfo_stopActingButton_]")).first(),
    csrRegisterGuest: element.all(by.css("[id^=personalinfo_registerThisGuestButton_]")).first(),
    actingAsInfo : element.all(by.css("[id^=personalinfo_h4_9_")).first(),

};

export class MyAccountPage extends BaseTest {

    constructor(){
        super();
        this.waitForElementDisplayed(myAccountPageObjs.nameHeading);
        this.waitForTextToNotBe(myAccountPageObjs.nameHeading, '');
        this.waitForElementPresent(myAccountPageObjs.addressBookLink);
        this.waitForElementPresent(myAccountPageObjs.orderHistoryLink);
        this.waitForElementDisplayed(myAccountPageObjs.orderHistoryLink);
        this.waitForElementDisplayed(myAccountPageObjs.addressBookLink);
        this.waitForElementDisplayed(myAccountPageObjs.signOutButton);
        this.waitForElementPresent(myAccountPageObjs.signOutButton);
        this.waitForElementDisplayed(myAccountPageObjs.editPersonalInformation);
    }

    addressBookLinkDisplayed(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            myAccountPageObjs.addressBookLink.getText().then(heading => {
                resolve(true);
            });
        });
    }

    addressBookLinkNotPresent(): Promise<boolean>{
        return this.waitForElementNotPresent(myAccountPageObjs.addressBookLink);
    }

    orderHistoryLinkDisplayed():Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            myAccountPageObjs.orderHistoryLink.getText().then(heading => {
                resolve(true);
            });
        });
    }

    clickSignOut():Banner{
        myAccountPageObjs.signOutButton.click();
        return new Banner(false);
    }

    goToAddressBookPage(expectedAddress : number = 0): AddressBookPage{
        myAccountPageObjs.addressBookLink.click().then(()=>{
            console.log("Clicked on address book link from my account page");
        });
        return new AddressBookPage(expectedAddress);
    }

    goToOrderHistoryPage(orderNumber= 0): OrderHistoryPage{
        myAccountPageObjs.orderHistoryLink.click();
        return new OrderHistoryPage(orderNumber);
    }

    goToCustomerServicePage(): CustomerServicePage{
        myAccountPageObjs.customerServiceLink.click();
        this.waitForElementDisplayed(customerServicePageObjs.fcSelector);
        return new CustomerServicePage();
    }

    goToWishListPage(): WishListPage{
        myAccountPageObjs.wishListLink.click();
        return new WishListPage();
    }


    getHeadingName():Promise<string> {
        return new Promise<string>((resolve, reject) => {
            myAccountPageObjs.nameHeading.getText().then(heading => {
                console.log("Page heading : " + heading);

                resolve(heading);
            })
        });
    }

    getEmail():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            myAccountPageObjs.emailLabel.getText().then(text => {
                console.log("email : " + text);
                resolve(text);
            })
        });
    }

    getPhone(exists: boolean):Promise<any>{
        if (exists){
            return new Promise<string>((resolve, reject) => {
                myAccountPageObjs.phoneLabel.getText().then(text => {
                    console.log("phone : " + text);
                    resolve(text);
                })
            });
        }else{
            return this.waitForElementNotPresent(myAccountPageObjs.phoneLabel);
        }
    }
    getCurrency():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            myAccountPageObjs.currencyLabel.getText().then(text => {
                console.log("currency : " + text);
                resolve(text);
            })
        });
    }

    clickEditPersonalInformation(): EditPersonalInformationDialog {
        myAccountPageObjs.editPersonalInformation.click();
        return new EditPersonalInformationDialog();
    }

    clickEditPassword(): EditPassswordDialog {
        myAccountPageObjs.editPassword.click();
        return new EditPassswordDialog();
    }

    getAlertMsg(): Promise<string>{
        this.waitForElementPresent(myAccountPageObjs.alertMsg);
        return new Promise<string>((resolve, reject) => {
            myAccountPageObjs.alertMsg.getText().then(text => {
                console.log("Alert msg : " + text);
                resolve(text);
            })
        });
    }

    closeAlert(): MyAccountPage{
        myAccountPageObjs.alertClose.click();
        this.waitForElementNotDisplayed(myAccountPageObjs.alertMsg);
        return this;
    }

    waitForHeadingToUpdate(heading: string):Promise<boolean>{
        return this.waitForTextToUpdate(myAccountPageObjs.nameHeading, heading);
    }

    goToAddressBookPageError(): SessionErrorDialog{
        myAccountPageObjs.addressBookLink.click();
        return new SessionErrorDialog();
    }

    //CUSTOMER SERVICE REPRESENTATIVE
    clickStopActingAs(): MyAccountPage{
        this.waitForStableHeight(myAccountPageObjs.actingAsUserStopButton);
        myAccountPageObjs.actingAsUserStopButton.click().then(() =>{
            console.log("clicked on stopped acting as user");
        });
        this.waitForElementNotDisplayed(myAccountPageObjs.customerServiceLink);
        this.waitForElementDisplayed(myAccountPageObjs.signOutButton);
        return this;
    }

    getActingAsUserInfo():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            myAccountPageObjs.actingAsInfo.getText().then(text => {
                console.log("Acting as user account info for csr : " + text);
                resolve(text);
            });
        });
    }

    isCsrLinkDisplayed (index : number = 0 ) : Promise<boolean> {
        return this.waitForElementDisplayed(myAccountPageObjs.customerServiceLink);
    }

    isCsrActingAsUserNameNotPresent (index : number = 0 ) : Promise<boolean> {
        return this.waitForElementNotPresent(myAccountPageObjs.actingAsUserName);
    }

    ifCrsStopActingAsDisplayed(timeout: number = 10000) : Promise<boolean>{
        return this.waitForElementDisplayed(myAccountPageObjs.actingAsUserStopButton);
    }

    clickRegisterGuest(): CustomerServicePage{
        myAccountPageObjs.csrRegisterGuest.click();
        this.waitForElementDisplayed(myAccountPageObjs.customerServiceLink);
        return new CustomerServicePage();
    }

}