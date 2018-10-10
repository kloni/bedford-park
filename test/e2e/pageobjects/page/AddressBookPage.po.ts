import { browser, by, element } from 'protractor';
import { BaseTest } from '../base/BaseTest.po';
import { AddressDialog } from '../dialog/AddressDialog.po';
import { RemoveAddressDialog } from '../dialog/RemoveAddressDialog.po';

var log4js = require("log4js");
var log = log4js.getLogger("AddressBookPage");


export const addressBookObjs = {
    pageTitle: element.all(by.css("[id^=addressBook_title_]")).first(),
    addAddressButton: element.all(by.css('[id^=addressBook_addAddressButton_]')).first(),
    addressCount: element.all(by.css('[id^=addressBook_count_]')).first(),
    addressCards: element.all(by.css('[id^=address_card_]')),
    confirmSaveAlert: element.all(by.css('[id^=addressBook_confirmSave_]')).first(),
    confirmDeleteAlert: element.all(by.css('[id^=addressBook_confirmDelete_]')).first(),
    firstName: element.all(by.css('[id^=address_firstName_]')),
    lastName: element.all(by.css('[id^=address_lastName_]')),
    nickName: element.all(by.css('[id^=address_nickName_]')),
    addressLines: element.all(by.css('[id^=address_lines_]')),
    city: element.all(by.css('[id^=address_city_]')),
    state: element.all(by.css('[id^=address_state_]')),
    zipCode: element.all(by.css('[id^=address_zip_]')),
    country: element.all(by.css('[id^=address_country_]')),
    email: element.all(by.css('[id^=address_email_]')),
    phone: element.all(by.css('[id^=address_phone_]'))
};

export class AddressBookPage extends BaseTest {

    constructor(expectedCount : number = 0) {
        super();
        this.waitForElementDisplayed(addressBookObjs.pageTitle);
        this.waitForElementDisplayed(addressBookObjs.addAddressButton);
        this.waitForElementDisplayed(addressBookObjs.addressCount);
        if (expectedCount > 0){
            this.waitForCountToBeUpdated(addressBookObjs.firstName, expectedCount);
        }
        
    }

    getPageName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.pageTitle.getText().then(pageTitle => {
                resolve(pageTitle);
            });
        });

    }

    waitForNumberOfAddressCardsToUpdate(addressCount: string): Promise<boolean> {
        return this.waitForTextToUpdate(addressBookObjs.addressCount, addressCount);
    }

    getAddreessCardCount(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.addressCount.getText().then(count => {
                console.log('text count: ', count);
                resolve(count);
            });
        });
    }

    getNumberOfAddressCardsDisplayed(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            addressBookObjs.addressCards.count().then(count => {
                console.log('display count: ', count);
                resolve(count);
            });
        });
    }

    clickAddAddressButton(): AddressDialog {
        //TODO: need better check between address creations before clicking another time
        browser.sleep(2000);
        addressBookObjs.addAddressButton.click();
        return new AddressDialog();
    }

    addAddressButtonClickable(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementEnabled(addressBookObjs.addAddressButton).then(count => {
                console.log('Add address button clickable');
                resolve(count);
            });
        });
    }

    clickRemoveLink(index: number): RemoveAddressDialog {
        var removeLink = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkRemove_]')).first();
        removeLink.click();
        return new RemoveAddressDialog(index);
    }

    clickEditLink(index: number): AddressDialog {
        var editLink = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkEdit_]')).first();
        this.verifyElementDisplayed(editLink);
        editLink.click();
        return new AddressDialog();
    }

    clickSetAsDefaultLink(index: number): AddressBookPage {
        var setAsDefault = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkSetDefault_]')).first(); setAsDefault.click();
        return this;
    }

    waitForAddressIsDefault(index: number): AddressBookPage {
        var isDefault = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_isDefault_]')).first();
        this.waitForElementDisplayed(isDefault);
        return this;
    }

    addressIsDefault(index: number):Promise<boolean>{
        var setAsDefault = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkSetDefault_]')).first();                    
        return new Promise<boolean>((resolve, reject) => {           
            this.waitForElementNotPresent(setAsDefault).then(result => {
                console.log("Set as default button not displayed for index: ", index + "is : " + result);
                resolve(result);
            });
        });
    }

    addressCannotBeRemoved(index: number): Promise<boolean> {
        var removeLink = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkRemove_]'));
        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementNotPresent(removeLink.first()).then(text => {
                console.log("Set as remove link not displayed for index: ", index);
                resolve(text);
            });
        });

    }

    addressNotDefault(index: number): Promise<boolean> {
        var setAsDefault = element.all(by.css('[id^=address_card]')).get(index).all(by.css('[id^=address_linkSetDefault_]'));
        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementDisplayed(setAsDefault.first()).then(text => {
                console.log("Set as default button displayed for index: ", index);
                resolve(text);
            });
        });
    }


    getSaveAlertMessage(): Promise<string> {
        this.waitForElementDisplayed(addressBookObjs.confirmSaveAlert);
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.confirmSaveAlert.getText().then(msg => {
                console.log('alert msg: ', msg);

                resolve(msg);
            });
        });
    }

    getDeleteAlertMessage(): Promise<string> {
        this.waitForElementDisplayed(addressBookObjs.confirmDeleteAlert);
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.confirmDeleteAlert.getText().then(msg => {
                console.log('delete alert msg: ', msg);

                resolve(msg);
            });
        });
    }

    getAddressCardFirstName(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.firstName.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }

    getAddressCardLastName(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.lastName.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }
    getAddressCardNickName(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.nickName.get(index).getText().then(text => {
                resolve(text.replace(/,/g,''));
            });
        });
    }
    getAddressCardAddressLine(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.addressLines.get(index).getText().then(text => {
                resolve(text.replace(/,/g,''));
            });
        });
    }
    getAddressCardCity(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.city.get(index).getText().then(text => {
                resolve(text.replace(/,/g,''));
            });
        });
    }
    getAddressCardState(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.state.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }
    getAddressCardZipCode(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.zipCode.get(index).getText().then(text => {
                resolve(text.replace(/,/g,''));
            });
        });
    }
    getAddressCardCountry(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.country.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }
    getAddressCardEmail(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.email.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }
    getAddressCardPhone(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            addressBookObjs.phone.get(index).getText().then(text => {
                resolve(text);
            });
        });
    }

    waitForLastNameToUpdate(index: number, expectedText: string):  Promise<boolean>{
        return this.waitForTextToUpdate(element.all(by.css('[id^=address_lastName_]')).get(index), expectedText );
    }

}
