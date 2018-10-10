import {BaseTest } from  '../base/BaseTest.po';
import { by, element, browser, protractor } from 'protractor';
import { MyAccountPage } from './MyAccountPage.po';
import { HomePage } from './HomePage.po';
import { OrderDetailPage } from './OrderDetailPage.po';

export const customerServicePageObjs = {

    //Find a customer
    fcLoginId: element.all(by.css("[id^=csrSearch_loginInput_")).first(),
    fcFirstName: element.all(by.css("[id^=csrSearch_firstNameInput_")).first(),
    fcLastName: element.all(by.css("[id^=csrSearch_lastNameInput_")).first(),
    fcEmailAddress: element.all(by.css("[id^=csrSearch_emailInput_")).first(),
    fcPhoneNumber: element.all(by.css("[id^=csrSearch_phoneInput_")).first(),
    fcAddress: element.all(by.css("[id^=csrSearch_addressInput_")).first(),
    fcZipCode: element.all(by.css("[id^=csrSearch_zipInput_")).first(),
    fcCountry: element.all(by.css("[id^=csrSearch_countryLabel_")).first(),
    fcState: element.all(by.css("[id^=csrSearch_stateInput_")).first(),
    fcSearchButton: element.all(by.css("[id^=csrSearch_searchButton_")).first(),
    fcClearFilterButton: element.all(by.css("[id^=csrSearch_clear_clearAll_")).first(),
    fcNoResultsFoundText: element.all(by.css("[id^=csrSearchResultsNone_")).first(),
    fcResultsHeader: element.all(by.css("[id^=csrSearchResultsHeaders_")).first(),
    fcSelector : element.all(by.css("[id^=itemCsrSearch_content_")).first(),
    fcCriteria : element.all(by.css("[id^=itemUserAccordion_")).first(),
    fcEnableDisableUserButton : element.all(by.css("[id^=csrSearch_enableDisableButton_")),
    fcStartActingAs : element.all(by.css("[id^=csrSearch_actButton_")),
    fcNoResults : element.all(by.css("[id^=csrSearchResultsNone_msg_")).first(),

    //Search results for find customers
    fcsrUserName: element.all(by.css("[id^=csrSearchResultsBody_login_")).first(),
    fcsrFullName: element.all(by.css("[id^=csrSearchResultsBody_customer_")).first(),
    fcsrAddress: element.all(by.css("[id^=csrSearchResultsBody_address_")).first(),

    //Find an order
    foOrderNumber: element.all(by.css("[id^=csrOrderSearch_orderInput_")).first(),
    foEmailAddress: element.all(by.css("[id^=csrOrderSearch_emailInput_")).first(),
    foStartDate: element.all(by.css("[id^=csrOrderSearch_startInput_")).first(),
    foEndDate: element.all(by.css("[id^=csrOrderSearch_endInput_")).first(),
    foFirstname: element.all(by.css("[id^=csrOrderSearch_firstNameInput_")).first(),
    foLastName: element.all(by.css("[id^=csrOrderSearch_lastNameInput_")).first(),
    foPhoneNumber: element.all(by.css("[id^=csrOrderSearch_phoneInput_")).first(),
    foAddress: element.all(by.css("[id^=csrOrderSearch_addressInput_")).first(),
    foZipCode: element.all(by.css("[id^=csrOrderSearch_zipInput_")).first(),
    foCity: element.all(by.css("[id^=csrOrderSearch_cityInput_")).first(),
    foCountry: element.all(by.css("[id^=csrOrderSearch_countryLabel_")).first(),
    foState: element.all(by.css("[id^=csrOrderSearch_stateInput_")).first(),
    foSelector : element.all(by.css("[id^=itemOrderSearch_")).first(),
    foSearchButton : element.all(by.css("[id^=csrOrderSearch_searchButton_")).first(),
    foClearFilterButton: element.all(by.css("[id^=csrOrderSearch_clear_")).first(),
    foStartActingAs : element.all(by.css("[id^=csrOrderSearch_actButton_")),
    foOrderSummary : element.all(by.css("[id^=csrOrderSearch_viewSummaryButton_")),
    foNoResults : element.all(by.css("[id^=csrOrderResultsNone_")).first(),
    //Search results for find customers
    fosrOrderNumber: element.all(by.css("[id^=csrOrderSearchResult_")),
    fosrOrderDate: element.all(by.css("[id^=csrOrderResultsBody_date_")),
    fosrEmail: element.all(by.css("[id^=csrOrderResultsBody_email_")),
    fosrAddress: element.all(by.css("[id^=csrOrderResultsBody_address_")),

    //Add a customer
    acFirstName: element.all(by.css("[id^=registration_input_7")).first(),
    acLastName: element.all(by.css("[id^=registration_input_9_")).first(),
    acLoginId: element.all(by.css("[id^=registration_input_11_")).first(),
    acPhone: element.all(by.css("[id^=registration_input_15_")).first(),
    acSelector : element.all(by.css("[id^=itemCustomerAdd_")).first(),
    acRegisterButton : element.all(by.css("[id^=registration_button_25_")).first(),

    //Shop as a Guest
    shopAsGuestButton: element.all(by.css("[id^=csrShopAsGuest_shopButton_")).first(),
    shopAsGuestSelector: element.all(by.css("[id^=itemShopAsGuest_")).first()
}

export class CustomerServicePage extends BaseTest {

    constructor() {
      super();
      this.waitForElementDisplayed(customerServicePageObjs.shopAsGuestSelector);
    }

    clickFindCustomerSearch(expectedResults : boolean = true) : CustomerServicePage{
        customerServicePageObjs.fcSearchButton.click().then(()=>{
            console.log("clicked on search in find customer");
        });

        if (expectedResults){
            this.waitForElementDisplayed(customerServicePageObjs.fcEnableDisableUserButton.get(0));
            this.waitForStableHeight(customerServicePageObjs.fcEnableDisableUserButton.get(0));
        }else{
            this.waitForElementDisplayed(customerServicePageObjs.fcNoResults);
            this.waitForStableHeight(customerServicePageObjs.fcNoResults);
        }

        return this;
    }

    clickFindOrderSearch(expectedResults : boolean = true) : CustomerServicePage{
        customerServicePageObjs.foSearchButton.click().then(()=>{
            console.log("clicked on search in find order");
        });

        if (expectedResults){
            this.waitForElementDisplayed(customerServicePageObjs.fosrEmail.get(0));
            this.waitForStableHeight(customerServicePageObjs.fosrEmail.get(0));
        }else{
            this.waitForElementDisplayed(customerServicePageObjs.foNoResults);
            this.waitForStableHeight(customerServicePageObjs.foNoResults);
        }

        return this;
    }

    clickFindCustomerClearFilter() : CustomerServicePage{
        this.waitForStableHeight(customerServicePageObjs.fcClearFilterButton);
        customerServicePageObjs.fcClearFilterButton.click().then(()=>{
            console.log("clicked on clear search filter in find customer");
        });
        return this;
    }

    clickAddCustomerRegisterButton() : HomePage{
        customerServicePageObjs.acRegisterButton.click().then(()=>{
            console.log("clicked register button for add customer");
        });
        return new HomePage();
    }

    clickShopAsGuestButton() : CustomerServicePage{
        customerServicePageObjs.shopAsGuestButton.click().then(()=>{
            console.log("clicked on shop as guest");
        });
        this.waitForElementDisplayed(customerServicePageObjs.acRegisterButton);
        return this;
    }

    clickOnOrderNumber(index: number = 0) : OrderDetailPage{
        customerServicePageObjs.fosrOrderNumber.get(index).click().then(()=>{
            console.log("clicked on order number at index: " + index);
        });
        return new OrderDetailPage();
    }

    clickOnViewOrderSummary(index: number = 0) : OrderDetailPage{
        customerServicePageObjs.fosrOrderNumber.get(index).click().then(()=>{
            console.log("clicked on order summary at index: " + index);
        });
        return new OrderDetailPage();
    }


    openAddCustomer() : CustomerServicePage {
        customerServicePageObjs.acSelector.click();
        this.waitForElementDisplayed(customerServicePageObjs.acRegisterButton);
        this.waitForStableHeight(customerServicePageObjs.acRegisterButton);
        return this;
    }

    openFindCustomer() : CustomerServicePage {
        customerServicePageObjs.fcSelector.click();
        this.waitForElementDisplayed(customerServicePageObjs.fcClearFilterButton);
        this.waitForStableHeight(customerServicePageObjs.fcClearFilterButton);

        return this;
    }

    openShopAsGuest() : CustomerServicePage {
        customerServicePageObjs.shopAsGuestSelector.click();
        this.waitForElementDisplayed(customerServicePageObjs.shopAsGuestButton);
        this.waitForStableHeight(customerServicePageObjs.shopAsGuestButton);
        return this;
    }

    openFindCustomerCriteria() : CustomerServicePage {
        customerServicePageObjs.fcCriteria.click();
        this.waitForElementDisplayed(customerServicePageObjs.fcClearFilterButton);
        this.waitForStableHeight(customerServicePageObjs.fcClearFilterButton);
        return this;
    }

    openFindOrder() : CustomerServicePage {
        customerServicePageObjs.foSelector.click();
        this.waitForElementDisplayed(customerServicePageObjs.foClearFilterButton);
        this.waitForStableHeight(customerServicePageObjs.foClearFilterButton);
        return this;
    }


    disableUser (index : number = 0) : CustomerServicePage{
        customerServicePageObjs.fcEnableDisableUserButton.click().then(()=>{
            console.log("Disabled user at index: " + index);
        });
        browser.sleep(2500); //sleep for one second because this button is removed and added back to the DOM, removing sleep will cause not attached to to DOM errors
        this.waitForTextToBeUpdated(customerServicePageObjs.fcEnableDisableUserButton.get(index), "Enable user");
        return this;
    }

    enableUser (index : number = 0) : CustomerServicePage{
        customerServicePageObjs.fcEnableDisableUserButton.click().then(()=>{
            console.log("Enabled user at index: " + index);
        });
        browser.sleep(2500); //sleep for one second because this button is removed and added back to the DOM, removing sleep will cause not attached to to DOM errors
        this.waitForTextToBeUpdated(customerServicePageObjs.fcEnableDisableUserButton.get(index), "Disable user");
        return this;
    }

    startActingAs (index : number = 0) : CustomerServicePage{
        customerServicePageObjs.fcStartActingAs.click().then(()=>{
            console.log("Started acting as user at index: " + index);
        });
        return this;
    }

    isUserEnabled (index : number = 0 ) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            customerServicePageObjs.fcEnableDisableUserButton.getText().then(result => {
                if (result == "Disable user"){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        });
    }

    typeAddCustomerLoginId(acLoginId: string):CustomerServicePage{
        customerServicePageObjs.acLoginId.clear();
        customerServicePageObjs.acLoginId.sendKeys(acLoginId).then(()=>{
            console.log("Typed acLoginId : " + acLoginId);
        });
        return this;
    }

    typeAddCustomerLastName(acLastName: string):CustomerServicePage{
        customerServicePageObjs.acLastName.clear();
        customerServicePageObjs.acLastName.sendKeys(acLastName).then(()=>{
            console.log("Typed acLastName : " + acLastName);
        });
        return this;
    }

    typeAddCustomerFirstName(acFirstName: string):CustomerServicePage{
        customerServicePageObjs.acFirstName.clear();
        customerServicePageObjs.acFirstName.sendKeys(acFirstName).then(()=>{
            console.log("Typed acFirstName : " + acFirstName);
        });
        return this;
    }

    typeAddCustomerPhone(acPhone: string):CustomerServicePage{
        customerServicePageObjs.acPhone.clear();
        customerServicePageObjs.acPhone.sendKeys(acPhone).then(()=>{
            console.log("Typed acPhone : " + acPhone);
        });
        return this;
    }

    typeFindOrderEmailAddress(foEmailAddress: string):CustomerServicePage{
        customerServicePageObjs.foEmailAddress.clear();
        customerServicePageObjs.foEmailAddress.sendKeys(foEmailAddress).then(()=>{
            console.log("Typed foEmailAddress : " + foEmailAddress);
        });
        return this;
    }
    typeFindOrderStartDate(year: string, month : string, date : string):CustomerServicePage{
        customerServicePageObjs.foStartDate.sendKeys(year + protractor.Key.TAB + month + date).then(()=>{
            console.log("Typed foStartDate : " + year + "&Tab" + month + "&Tab" + date);
        });
        return this;
    }
    typeFindOrderEndDate(year: string, month : string, date : string):CustomerServicePage{
        //customerServicePageObjs.foEndDate.clear();
        customerServicePageObjs.foEndDate.sendKeys(year + protractor.Key.TAB + month + date).then(()=>{
            console.log("Typed foEndDate : " + year + "&Tab" + month + "&Tab" + date);
        });
        return this;
    }


    getFindCustomerLoginId():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcLoginId.getText().then(text => {
                console.log("fcLoginId : " + text);
                resolve(text);
            })
        });
    }

    typefcLoginId(fcLoginId: string):CustomerServicePage{
        customerServicePageObjs.fcLoginId.clear();
        customerServicePageObjs.fcLoginId.sendKeys(fcLoginId).then(()=>{
            console.log("Typed fcLoginId : " + fcLoginId);
        });
        return this;
    }

    getFindCustomerFirstName():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcFirstName.getText().then(text => {
                console.log("fcFirstName : " + text);
                resolve(text);
            })
        });
    }

    typefcFirstName(fcFirstName: string):CustomerServicePage{
        customerServicePageObjs.fcFirstName.clear();
        customerServicePageObjs.fcFirstName.sendKeys(fcFirstName).then(()=>{
            console.log("Typed fcFirstName : " + fcFirstName);
        });
        return this;
    }

    getFindCustomerLastName():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcLastName.getText().then(text => {
                console.log("fcLastName : " + text);
                resolve(text);
            })
        });
    }

    typefcLastName(fcLastName: string):CustomerServicePage{
        customerServicePageObjs.fcLastName.clear();
        customerServicePageObjs.fcLastName.sendKeys(fcLastName).then(()=>{
            console.log("Typed fcLastName : " + fcLastName);
        });
        return this;
    }

    getFindCustomerEmailAddress():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcEmailAddress.getText().then(text => {
                console.log("fcEmailAddress : " + text);
                resolve(text);
            })
        });
    }

    typefcEmailAddress(fcEmailAddress: string):CustomerServicePage{
        customerServicePageObjs.fcEmailAddress.clear();
        customerServicePageObjs.fcEmailAddress.sendKeys(fcEmailAddress).then(()=>{
            console.log("Typed fcEmailAddress : " + fcEmailAddress);
        });
        return this;
    }

    getFindCustomerPhoneNumber():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcPhoneNumber.getText().then(text => {
                console.log("fcPhoneNumber : " + text);
                resolve(text);
            })
        });
    }

    typefcPhoneNumber(fcPhoneNumber: string):CustomerServicePage{
        customerServicePageObjs.fcPhoneNumber.clear();
        customerServicePageObjs.fcPhoneNumber.sendKeys(fcPhoneNumber).then(()=>{
            console.log("Typed fcPhoneNumber : " + fcPhoneNumber);
        });
        return this;
    }

    getFindCustomerAddress():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcAddress.getText().then(text => {
                console.log("fcAddress : " + text);
                resolve(text);
            })
        });
    }

    typefcAddress(fcAddress: string):CustomerServicePage{
        customerServicePageObjs.fcAddress.clear();
        customerServicePageObjs.fcAddress.sendKeys(fcAddress).then(()=>{
            console.log("Typed fcAddress : " + fcAddress);
        });
        return this;
    }

    getFindCustomerZipCode():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcZipCode.getText().then(text => {
                console.log("fcZipCode : " + text);
                resolve(text);
            })
        });
    }

    typefcZipCode(fcZipCode: string):CustomerServicePage{
        customerServicePageObjs.fcZipCode.clear();
        customerServicePageObjs.fcZipCode.sendKeys(fcZipCode).then(()=>{
            console.log("Typed fcZipCode : " + fcZipCode);
        });
        return this;
    }

    getFindCustomerCountry():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcCountry.getText().then(text => {
                console.log("fcCountry : " + text);
                resolve(text);
            })
        });
    }

    typefcCountry(fcCountry: string):CustomerServicePage{
        customerServicePageObjs.fcCountry.clear();
        customerServicePageObjs.fcCountry.sendKeys(fcCountry).then(()=>{
            console.log("Typed fcCountry : " + fcCountry);
        });
        return this;
    }

    getFindCustomerState():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcState.getText().then(text => {
                console.log("fcState : " + text);
                resolve(text);
            })
        });
    }

    typefcState(fcState: string):CustomerServicePage{
        customerServicePageObjs.fcState.clear();
        customerServicePageObjs.fcState.sendKeys(fcState).then(()=>{
            console.log("Typed fcState : " + fcState);
        });
        return this;
    }

    getSearchResultUserName():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcsrUserName.getText().then(text => {
                console.log("getSearchResultUserName : " + text);
                resolve(text);
            })
        });
    }


    getSearchResultFullName():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcsrFullName.getText().then(text => {
                console.log("getSearchResultLastName : " + text);
                resolve(text);
            })
        });
    }

    getSearchResultAddress():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fcsrAddress.getText().then(text => {
                console.log("getSearchResultAddress : " + text);
                resolve(text);
            });
        });
    }

    getFindOrderSearchResultAddress():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fosrAddress.get(0).getText().then(text => {
                console.log("getFindOrderSearchResultAddress : " + text);
                resolve(text);
            });
        });
    }
    getFindOrderSearchResultEmail():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fosrEmail.get(0).getText().then(text => {
                console.log("getFindOrderSearchResultEmail : " + text);
                resolve(text);
            });
        });
    }
    getFindOrderSearchResultOrderDate():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fosrOrderDate.get(0).getText().then(text => {
                console.log("getFindOrderSearchResultOrderDate : " + text);
                resolve(text);
            });
        });
    }
    getFindOrderSearchResultOrderNumber():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            customerServicePageObjs.fosrOrderNumber.get(0).getText().then(text => {
                console.log("getFindOrderSearchResultorderNmber : " + text);
                resolve(text);
            });
        });
    }

    getFindOrderSearchAllResultOrderNumber():Promise<string[]>{
        return new Promise<string[]>((resolve, reject) => {
            customerServicePageObjs.fosrOrderNumber.getText().then(text => {
                console.log("getFindOrderSearchResultorderNmber : " + text + typeof(text));
            resolve(text.toString().split(',')/*text.replace(/\s'/,'').split(',')*/);
            });
        });
    }

    waitDisplayedFindCustomerNoResultsFound(): Promise<boolean> {
        return this.waitForElementDisplayed(customerServicePageObjs.fcNoResultsFoundText);
    }

    waitNotPresentFindCustomerNoResultsFound(): Promise<boolean> {
        return this.waitForElementNotPresent(customerServicePageObjs.fcNoResultsFoundText);
    }

    waitNoResultsPresent(): Promise<boolean> {
        return this.waitForElementNotPresent(customerServicePageObjs.fcResultsHeader);
    }

  }