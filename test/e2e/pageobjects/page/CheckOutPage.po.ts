import { BaseTest } from '../base/BaseTest.po';
import { by, element, ElementArrayFinder, browser } from 'protractor';
import { OrderConfirmationPage } from "./OrderConfirmationPage.po";
import { SessionErrorDialog } from '../dialog/SessionErrorDialog.po';
import { StoreLocatorPage } from '../page/StoreLocatorPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("CheckOutPage");

export const checkOutPageObj = {
  heading: element.all(by.css("[id^=checkout-layout-component_h2_1_")).first(),
  saveAndContinueButtonShipping: element.all(by.css("[id^=commerce-ship-payment_button_1_")).first(),
  saveAndContinueButtonCreateAddress: element.all(by.css("[id^=commerce-checkout-address_button_49_")).first(),
  saveAndContinueButtonStoreLocator: element.all(by.css("[id^=checkout-store-locator_button_1_")).first(),
  placeOrderButton: element.all(by.css("[id^=checkout-layout-component_button_10_")).first(),

  sameBillingAddressCheckbox: element.all(by.css("[id^=commerce-checkout-address_input_32_")).first(),
  shippingAddressDropDown: element.all(by.css("[id^=commerce-checkout-address_Shipping_select_53_")).first(),
  shippingBillingAddressDropDown: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_select_53_")).first(),

  billingAddressDropDown: element.all(by.css("[id^=commerce-checkout-address_Billing_select_53_")).first(),
  shippingMethodDropDown: element.all(by.css("[id^=commerce-ship-payment__select_1_")).first(),
  promotionCodeInput: element.all(by.css("[id^=commerce-order-promotion_input_3_")).first(),

  subTotal: element.all(by.css("[id^=commerce-order-total_span_56_")).first(),
  discount: element.all(by.css("[id^=commerce-order-total_span_62_")).first(),
  shipping: element.all(by.css("[id^=commerce-order-total_span_71_")).first(),
  total: element.all(by.css("[id^=commerce-order-total_span_79_")).first(),

  shippingAndBilling: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_p_19_")).first(),

  productNames: element.all(by.css("[id^=commerce-order-items_a_2_")),
  productQuantities: element.all(by.css("[id^=commerce-order-items_p_21_")),
  productPrice: element.all(by.css("[id^=commerce-order-items_p_33_")),

  promotionCodeAccordion: element.all(by.css("[id^=commerce-order-promotion_a_8_")).first(),
  promotionCode: element.all(by.css("[id^=commerce-order-promotion_input_3_")).first(),
  promotionRemoveButton: element.all(by.css("[id^=commerce-order-promotion_span_49_")).first(),
  promotionApplyButton: element.all(by.css("[id^=commerce-order-promotion_a_9_")).first(),

  //Guest Checkout
  billingFormCheckbox: element.all(by.css("[id^=commerce-checkout-address_input_32_")).first(),

  shippingBillingAddressNickname: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputNickName_")).first(),
  shippingBillingFirstName: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputFirstName_")).first(),
  shippingBillingLastName: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputLastName_")).first(),
  shippingBillingEmail: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputEmail_")).first(),
  shippingBillingPhoneNumber: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputPhone_")).first(),
  shippingBillingAddressLine1: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputLine1_")).first(),
  shippingBillingAddressLine2: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputLine2_")).first(),
  shippingBillingCountryDropDown: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputShipTo_")).first(),
  shippingBillingCity: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputCity_")).first(),
  shippingBillingState: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputState_")).first(),
  shippingBillingZipCode: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputZip_")).first(),

  shippingBillingFullAddress: element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_p_54_")).first(),
  guestShippingBillingFullAddress: element.all(by.css("[id^=commerce-checkout-address_guest_ShippingAndBilling_span_")).get(1),
  editShippingBillingAddress: element.all(by.css("[id^=commerce-checkout-address_guest_ShippingAndBilling_a_61_")).first(),


  shippingAddressNickname: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputNickName_")).first(),
  shippingFirstName: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputFirstName_")).first(),
  shippingLastName: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputLastName_")).first(),
  shippingEmail: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputEmail_")).first(),
  shippingPhoneNumber: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputPhone_")).first(),
  shippingAddressLine1: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputLine1_")).first(),
  shippingAddressLine2: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputLine2_")).first(),
  shippingCountryDropDown: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputShipTo_")).first(),
  shippingCity: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputCity_")).first(),
  shippingState: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputState_")).first(),
  shippingZipCode: element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputZip_")).first(),
  shippingFullAddress: element.all(by.css("[id^=commerce-checkout-address_Shipping_p_54_")).first(),

  guestShippingFullAddress: element.all(by.css("[id^=commerce-checkout-address_guest_Shipping_span_")).get(1),
  billingAddressNickname: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputNickName_")).first(),
  billingFirstName: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputFirstName_")).first(),
  billingLastName: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputLastName_")).first(),
  billingEmail: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputEmail_")).first(),
  billingPhoneNumber: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputPhone_")).first(),
  billingAddressLine1: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputLine1_")).first(),
  billingAddressLine2: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputLine2_")).first(),
  billingCountryDropDown: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputShipTo_")).first(),
  billingCity: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputCity_")).first(),
  billingState: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputState_")).first(),
  billingZipCode: element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputZip_")).first(),
  billingFullAddress: element.all(by.css("[id^=commerce-checkout-address_Billing_p_54_")).first(),
  guestBillingFullAddress: element.all(by.css("[id^=commerce-checkout-address_guest_Billing_span_")).get(1),
  VATTax: element.all(by.css("[id^=commerce-order-total_p_566_]")).first(),
  billingForm: element.all(by.css("[id^=commerce-checkout-address_Billing_form_div_34_]")).first(),

  //pickup option
  buyOnline: element.all(by.css("[id^=onlineOption]")).first(),
  pickUp: element.all(by.css("[id^=pickUpOption]")).first(),
  selectedStoreAddress: element.all(by.css("[id^=selected_store_address_]")).first(),
  selectStore: element.all(by.css("[id^=select_store_a_1_]")).first(),
  storeLocatorModal : element.all(by.css("[id^=storeLocator_modal_]")).first(),
  storeModalCloseButton : element.all(by.css("[id^=storeLocator_modal_close_]")).first(),

  //payment option
  payInStore: element.all(by.css("[id^=payInStoreOption]")).first(),
  payCreditCard: element.all(by.css("[id^=payWithCreditCardOption]")).first(),
  errorMessage: element.all(by.css("[id^=commerce-message_p_1_]")).first(),
};

export class CheckOutPage extends BaseTest {

  constructor(nProducts: number = 1, guest: boolean = false) {
    super();
    this.waitForPossibleProductLoaded();
    this.waitForMinimumOneElementPresent(checkOutPageObj.shippingAndBilling, checkOutPageObj.shippingBillingZipCode, checkOutPageObj.shippingBillingAddressDropDown);
    if (guest) {
      this.waitForStableHeight(checkOutPageObj.saveAndContinueButtonCreateAddress);
    }
    //When optional constructor parameter is used, waits for all checkout products to be loaded
    if (nProducts > 0) {
      browser.wait(function () {
        let itemsLoaded: number = 0;
        return checkOutPageObj.productPrice.getWebElements().then(elements => {
          itemsLoaded = elements.length;
          if (nProducts > 0 && itemsLoaded === nProducts) {
            return true;
          } else if (itemsLoaded > nProducts) {
            console.log("WARNING: checkout has " + itemsLoaded + " when expected is: " + nProducts);
            return true;
          }
        });
      }, 10000).then(null, error => {
        console.log("WARNING: checkout did not have #product loaded:" + nProducts + ", " + error);
      });
    }
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  waitShippingBillingZipCodeCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
    return this.waitForCssPropertyToUpdate(checkOutPageObj.shippingBillingZipCode, cssStyleProperty, cssValue);
  }

  waitBillingZipCodeCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
    return this.waitForCssPropertyToUpdate(checkOutPageObj.billingZipCode, cssStyleProperty, cssValue);
  }

  waitShippingZipCodeCss(cssStyleProperty: string, cssValue: string): Promise<boolean> {
    return this.waitForCssPropertyToUpdate(checkOutPageObj.shippingZipCode, cssStyleProperty, cssValue);
  }

  saveAndContinue(): CheckOutPage {
    this.waitForElementPresent(checkOutPageObj.saveAndContinueButtonShipping);
    this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonShipping);
    this.waitForStableHeight(checkOutPageObj.saveAndContinueButtonShipping);
    checkOutPageObj.saveAndContinueButtonShipping.click();
    return this;
  }

  saveAndContinueStoreLocator(): CheckOutPage {
    this.waitForElementPresent(checkOutPageObj.saveAndContinueButtonStoreLocator);
    this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonStoreLocator);
    this.waitForStableHeight(checkOutPageObj.saveAndContinueButtonStoreLocator);
    checkOutPageObj.saveAndContinueButtonStoreLocator.click();
    console.log("click saveAndContinue Button on StoreLocator ")
    return this;
  }

  saveAndContinueSessionError(): SessionErrorDialog {
    this.waitForElementPresent(checkOutPageObj.saveAndContinueButtonShipping);
    this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonShipping);
    this.waitForStableHeight(checkOutPageObj.saveAndContinueButtonShipping);
    checkOutPageObj.saveAndContinueButtonShipping.click();
    return new SessionErrorDialog();
  }

  clickSaveAndContinueCreateAddress(): CheckOutPage {
    this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonCreateAddress);
    this.waitForStableHeight(checkOutPageObj.saveAndContinueButtonCreateAddress);
    checkOutPageObj.saveAndContinueButtonCreateAddress.click().then(function () {
      console.log('Click save and continue button for create address');
    });
    this.waitForElementEnabled(checkOutPageObj.shippingMethodDropDown);
    return this;
  }

  openBillingFormCheckbox(): CheckOutPage {
    checkOutPageObj.billingFormCheckbox.click();
    this.waitForMinimumOneElementPresent(checkOutPageObj.billingZipCode, checkOutPageObj.guestBillingFullAddress, checkOutPageObj.billingFullAddress);
    this.waitForElementDisplayed(checkOutPageObj.billingAddressDropDown);
    return this;
  }

  closeBillingFormCheckbox(): CheckOutPage {
    checkOutPageObj.billingFormCheckbox.click();
    this.waitForElementNotPresent(checkOutPageObj.billingZipCode);
    return this;
  }

  editButtonShippingBillingIsDisplayed(): Promise<boolean> {
    this.waitForElementPresent(checkOutPageObj.editShippingBillingAddress);
    return this.waitForElementDisplayed(checkOutPageObj.editShippingBillingAddress);
  }

  placeOrder() : OrderConfirmationPage {
    this.waitForElementEnabled(checkOutPageObj.placeOrderButton);
    this.waitForStableHeight(checkOutPageObj.placeOrderButton);
    checkOutPageObj.placeOrderButton.click().then(() => {
      console.log("Place order button clicked");
    });
    return new OrderConfirmationPage();
  }

  waitSaveAndContinueShippingDisplayed(): Promise<boolean> {
    this.waitForElementPresent(checkOutPageObj.saveAndContinueButtonShipping);
    return this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonShipping);
  }

  waitSaveAndContinueShippingNotDisplayed(): Promise<boolean> {
    return this.waitForElementNotPresent(checkOutPageObj.saveAndContinueButtonShipping);
  }


  waitSaveAndContinueCreateAddressDisplayed(): Promise<boolean> {
    return this.waitForElementDisplayed(checkOutPageObj.saveAndContinueButtonCreateAddress);
  }

  waitSaveAndContinueCreateAddressNotDisplayed(): Promise<boolean> {
    return this.waitForElementNotPresent(checkOutPageObj.saveAndContinueButtonCreateAddress);
  }

  getProductNames(): ElementArrayFinder {
    return checkOutPageObj.productNames;
  }

  getProductQuantities(): ElementArrayFinder {
    return checkOutPageObj.productQuantities;
  }
  getProductPrices(): ElementArrayFinder {
    return checkOutPageObj.productPrice;
  }

  getShipping(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      checkOutPageObj.shipping.getText().then(resultShipping => {
        var shipping = Number(resultShipping.replace(/[^0-9\.]+/g, ""));
        resolve(shipping);
      })
    });
  }

  getSubtotal(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      checkOutPageObj.subTotal.getText().then(resultSubTotal => {
        var subTotal = Number(resultSubTotal.replace(/[^0-9\.]+/g, ""));
        resolve(subTotal);
      })
    });
  }

  getTotal(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      checkOutPageObj.total.getText().then(resultTotal => {
        var total = Number(resultTotal.replace(/[^0-9\.]+/g, ""));
        resolve(total);
      })
    });
  }

  waitForTotalToUpdate(expectedValue: Number): Promise<boolean> {
    return this.waitForTextToUpdate(checkOutPageObj.total, "$" + this.numberWithCommas(expectedValue.toFixed(2)));
  }

  getDiscount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      checkOutPageObj.discount.getText().then(resultDiscount => {
        var discount = Number(resultDiscount.replace(/[^0-9\.]+/g, ""));
        resolve(discount);
      })
    });
  }

  getShippingAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.shippingFullAddress);
    this.waitForElementDisplayed(checkOutPageObj.shippingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.shippingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getBillingAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.billingFullAddress);
    this.waitForElementDisplayed(checkOutPageObj.billingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.billingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getShippingBillingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.shippingBillingFullAddress);
    this.waitForElementDisplayed(checkOutPageObj.shippingBillingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.shippingBillingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getGuestShippingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.guestShippingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.guestShippingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getGuestBillingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.guestBillingFullAddress);
    this.waitForTextToNotBe(checkOutPageObj.guestBillingFullAddress, '');
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.guestBillingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getGuestShippingBillingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.guestShippingBillingFullAddress);
    this.waitForTextToNotBe(checkOutPageObj.guestShippingBillingFullAddress, '');
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.guestShippingBillingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getBillingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.billingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.billingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  getShippingFullAddress(): Promise<string> {
    this.waitForElementPresent(checkOutPageObj.shippingFullAddress);
    return new Promise<string>((resolve, reject) => {
      checkOutPageObj.shippingFullAddress.getText().then(text => {
        resolve(text);
      })
    });
  }

  promotionCode(promotionCode: string): CheckOutPage {
    this.openPromotionAccordian();
    this.waitForElementDisplayed(checkOutPageObj.promotionCode).then(isDisplayed => {
      if (isDisplayed) {
        checkOutPageObj.promotionCode.sendKeys(promotionCode);
      } else {
        throw new Error("Promotion code input field not displayed to enter code.");
      }
    });
    this.closePromotionAccordian();
    this.waitForElementNotDisplayed(checkOutPageObj.promotionCode);
    return this;
  }

  openShippingBillingEditAddress(): CheckOutPage {
    checkOutPageObj.editShippingBillingAddress.click();
    this.waitForElementPresent(checkOutPageObj.shippingBillingZipCode);
    this.waitForElementDisplayed(checkOutPageObj.shippingBillingZipCode);
    this.waitForElementDisplayed(checkOutPageObj.shippingBillingFirstName);
    return this;
  }

  openPromotionAccordian(): CheckOutPage {

    this.waitForElementNotDisplayed(checkOutPageObj.promotionCode).then(isNotDisplayed => {
      if (!isNotDisplayed) {
        throw new Error("Promotion code accordian is being opened when already opened");
      }

      checkOutPageObj.promotionCodeAccordion.click();
      this.waitForElementDisplayed(checkOutPageObj.promotionCode).then(isDisplayed => {
        if (!isDisplayed) {
          throw new Error("Checkout page promotion apply button is not present after opening accordian2");
        }
      });
    });

    return this;
  }

  closePromotionAccordian() {
    this.waitForElementDisplayed(checkOutPageObj.promotionCode).then(isDisplayed => {
      if (!isDisplayed) {
        throw new Error("Promotion code accordian is being closed when not open");
      }
      checkOutPageObj.promotionCodeAccordion.click();
      this.waitForElementNotDisplayed(checkOutPageObj.promotionCode).then(isNotDisplayed => {
        if (!isNotDisplayed) {
          throw new Error("Checkout page promotion apply button is displayed after closing promotion accordian");
        }
      });
    });
    return this;
  }

  clearPromotionCode(): CheckOutPage {
    checkOutPageObj.promotionCodeAccordion.click();
    this.waitForElementDisplayed(checkOutPageObj.promotionCode).then(isDisplayed => {
      if (isDisplayed) {
        checkOutPageObj.promotionCode.clear();
      } else {
        throw new Error("Promotion code accordian not displayed to clear promotion text.");
      }
    });
    checkOutPageObj.promotionCodeAccordion.click();
    this.waitForElementNotDisplayed(checkOutPageObj.promotionCode);

    return this;
  }

  applyPromotion(): CheckOutPage {
    this.openPromotionAccordian();
    this.waitForElementDisplayed(checkOutPageObj.promotionApplyButton).then(isDisplayed => {
      if (isDisplayed) {
        checkOutPageObj.promotionApplyButton.click();
      } else {
        throw new Error("Promotion code accordian apply button not displayed to apply promotion.");
      }
    });
    this.closePromotionAccordian();
    this.waitForElementNotDisplayed(checkOutPageObj.promotionCode);
    return this;
  }

  removePromotion(): CheckOutPage {
    checkOutPageObj.promotionCodeAccordion.click();
    this.waitForElementDisplayed(checkOutPageObj.promotionCode).then(isDisplayed => {
      if (isDisplayed) {
        checkOutPageObj.promotionRemoveButton.click();
      } else {
        throw new Error("Promotion code accordian not displayed to remove a promotion.");
      }
    });
    checkOutPageObj.promotionCodeAccordion.click();
    this.waitForElementNotDisplayed(checkOutPageObj.promotionCode);
    return this;
  }

  openBillingAddress(): CheckOutPage {
    checkOutPageObj.sameBillingAddressCheckbox.click();
    this.waitForElementPresent(checkOutPageObj.billingAddressDropDown).then(isPresent => {
      if (isPresent) {
        this.waitForElementDisplayed(checkOutPageObj.billingAddressDropDown).then(isDisplayed => {
          if (!isDisplayed) {
            console.log("WARNING: Checkout page billing address dropdown is not displayed after opening accordian");
          } else {
            this.waitForStableHeight(checkOutPageObj.billingAddressDropDown);
          }
        });
      } else {
        console.log("WARNING: Checkout page billing address dropdown is not present after opening billing accordian");
      }
    });

    return this;
  }

  selectBillingAddress(addressNickName: string = "New Address"): CheckOutPage {
    //TODO: should be able to remove this wait after new css change comes in
    this.waitForElementDisplayed(checkOutPageObj.billingAddressDropDown);

    checkOutPageObj.billingAddressDropDown.sendKeys(addressNickName).then(() => {
      console.log("Select billing address: " + addressNickName);
    });

    if (addressNickName !== "New Address") {
      this.waitForMinimumOneElementPresent(checkOutPageObj.guestBillingFullAddress, checkOutPageObj.billingFullAddress, checkOutPageObj.billingFullAddress);
    }
    this.waitForStableHeight(checkOutPageObj.placeOrderButton);
    return this;
  }

  selectShippingAddress(addressNickName: string = "New Address"): CheckOutPage {
    checkOutPageObj.shippingAddressDropDown.sendKeys(addressNickName).then(() => {
      console.log("Select shipping address: " + addressNickName);
    });
    this.waitForElementEnabled(checkOutPageObj.shippingMethodDropDown);

    if (addressNickName !== "New Address") {
      this.waitForMinimumOneElementPresent(checkOutPageObj.guestShippingFullAddress, checkOutPageObj.shippingFullAddress, checkOutPageObj.shippingFullAddress);
    }

    this.waitForStableHeight(checkOutPageObj.placeOrderButton);
    return this;
  }

  selectShippingBillingAddress(addressNickName: string = "New Address"): CheckOutPage {
    checkOutPageObj.shippingBillingAddressDropDown.sendKeys(addressNickName).then(() => {
      console.log("Select shipping and billing address: " + addressNickName);
    });
    this.waitForElementEnabled(checkOutPageObj.shippingMethodDropDown);

    if (addressNickName !== "New Address") {
      this.waitForMinimumOneElementPresent(checkOutPageObj.guestShippingBillingFullAddress, checkOutPageObj.shippingBillingFullAddress, checkOutPageObj.shippingBillingFullAddress);
    }
    this.waitForStableHeight(checkOutPageObj.placeOrderButton);
    return this;
  }

  shippingMethod(shippingMethod: string): CheckOutPage {
    this.waitForElementPresent(checkOutPageObj.shippingMethodDropDown);
    this.waitForElementEnabled(checkOutPageObj.shippingAddressDropDown);
    checkOutPageObj.shippingMethodDropDown.sendKeys(shippingMethod);
    return this;
  }

  /**
  * @param timeout maximum time before, defaulted to 3000
  * @returns true if any products loaded, and false if 0 products loaded
  * this function will wait for atleast 1 element to be loaded for maximum of timeout
  * becuase this function returns as soon as 1 element is loaded there still may be more
  * more elements to be loaded
  * Return false is no element is loaded
  */
  waitForPossibleProductLoaded(timeout: number = 3000): Promise<boolean> {
    var itemsLoaded: number = -1;
    return new Promise<boolean>((resolve, reject) => {
      return browser.wait(function () {
        checkOutPageObj.productNames.getWebElements().then(elements => {
          itemsLoaded = elements.length;
          if (itemsLoaded >= 1) {
            resolve(true);
          }
        });
      }, timeout)
        .then(null, function (error) {
          resolve(false);
        });
    });
  }

  waitForDiscountToBe(expectedDiscount: number) {
    this.waitForTextToBeUpdated(checkOutPageObj.discount, "$-" + expectedDiscount.toFixed(2))
  }

  //GUEST CHECKOUT
  typeShippingBillingAddressNickname(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingAddressNickname.sendKeys(newValue);
    return this;
  }
  clearShippingBillingAddressNickname(): CheckOutPage {
    checkOutPageObj.shippingBillingAddressNickname.clear();
    return this;
  }

  typeShippingBillingFirstName(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingFirstName.sendKeys(newValue);
    return this;
  }
  clearShippingBillingFirstName(): CheckOutPage {
    checkOutPageObj.shippingBillingFirstName.clear();
    return this;
  }

  typeShippingBillingLastName(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingLastName.sendKeys(newValue);
    return this;
  }
  clearShippingBillingLastName(): CheckOutPage {
    checkOutPageObj.shippingBillingLastName.clear();
    return this;
  }

  typeShippingBillingEmail(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingEmail.sendKeys(newValue);
    return this;
  }

  clearShippingBillingEmail(): CheckOutPage {
    checkOutPageObj.shippingBillingEmail.clear();
    return this;
  }

  typeShippingBillingPhoneNumber(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingPhoneNumber.sendKeys(newValue);
    return this;
  }

  clearShippingBillingPhoneNumber(): CheckOutPage {
    checkOutPageObj.shippingBillingPhoneNumber.clear();
    return this;
  }

  typeShippingBillingAddressLine1(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingAddressLine1.sendKeys(newValue);
    return this;
  }

  clearShippingBillingAddressLine1(): CheckOutPage {
    checkOutPageObj.shippingBillingAddressLine1.clear();
    return this;
  }

  typeShippingBillingAddressLine2(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingAddressLine2.sendKeys(newValue);
    return this;
  }

  clearShippingBillingAddressLine2(): CheckOutPage {
    checkOutPageObj.shippingBillingAddressLine2.clear();
    return this;
  }

  typeShippingBillingCountryDropDown(newValue: string): CheckOutPage {
    element.all(by.css("[id^=commerce-checkout-address_ShippingAndBilling_form_inputShipTo_]")).first().element(by.cssContainingText('option', newValue)).click();
    return this;
  }
  clearShippingBillingCountryDropDown(): CheckOutPage {
    checkOutPageObj.shippingBillingCountryDropDown.clear();
    return this;
  }

  typeShippingBillingCity(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingCity.sendKeys(newValue);
    return this;
  }
  clearShippingBillingCity(): CheckOutPage {
    checkOutPageObj.shippingBillingCity.clear();
    return this;
  }

  typeShippingBillingState(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingState.sendKeys(newValue);
    return this;
  }

  typeShippingBillingZipCode(newValue: string): CheckOutPage {
    checkOutPageObj.shippingBillingZipCode.sendKeys(newValue);
    return this;
  }

  clearShippingBillingZipCode(): CheckOutPage {
    checkOutPageObj.shippingBillingZipCode.clear();
    return this;
  }

  /* Shipping form */
  typeShippingAddressNickname(newValue: string): CheckOutPage {
    checkOutPageObj.shippingAddressNickname.sendKeys(newValue);
    return this;
  }

  typeShippingFirstName(newValue: string): CheckOutPage {
    checkOutPageObj.shippingFirstName.sendKeys(newValue);
    return this;
  }

  typeShippingLastName(newValue: string): CheckOutPage {
    checkOutPageObj.shippingLastName.sendKeys(newValue);
    return this;
  }

  typeShippingEmail(newValue: string): CheckOutPage {
    checkOutPageObj.shippingEmail.sendKeys(newValue);
    return this;
  }

  typeShippingPhoneNumber(newValue: string): CheckOutPage {
    checkOutPageObj.shippingPhoneNumber.sendKeys(newValue);
    return this;
  }

  typeShippingAddressLine1(newValue: string): CheckOutPage {
    checkOutPageObj.shippingAddressLine1.sendKeys(newValue);
    return this;
  }

  typeShippingAddressLine2(newValue: string): CheckOutPage {
    checkOutPageObj.shippingAddressLine2.sendKeys(newValue);
    return this;
  }

  typeShippingCountryDropDown(newValue: string): CheckOutPage {
    element.all(by.css("[id^=commerce-checkout-address_Shipping_form_inputShipTo_]")).first().element(by.cssContainingText('option', newValue)).click();
    return this;
  }

  typeShippingCity(newValue: string): CheckOutPage {
    checkOutPageObj.shippingCity.sendKeys(newValue);
    return this;
  }

  typeShippingState(newValue: string): CheckOutPage {
    checkOutPageObj.shippingState.sendKeys(newValue);
    return this;
  }

  typeShippingZipCode(newValue: string): CheckOutPage {
    checkOutPageObj.shippingZipCode.sendKeys(newValue);
    return this;
  }

  typeBillingAddressNickname(newValue: string): CheckOutPage {
    checkOutPageObj.billingAddressNickname.sendKeys(newValue);
    return this;
  }

  typeBillingFirstName(newValue: string): CheckOutPage {
    checkOutPageObj.billingFirstName.sendKeys(newValue);
    return this;
  }

  typeBillingLastName(newValue: string): CheckOutPage {
    checkOutPageObj.billingLastName.sendKeys(newValue);
    return this;
  }

  typeBillingEmail(newValue: string): CheckOutPage {
    checkOutPageObj.billingEmail.sendKeys(newValue);
    return this;
  }

  typeBillingPhoneNumber(newValue: string): CheckOutPage {
    checkOutPageObj.billingPhoneNumber.sendKeys(newValue);
    return this;
  }

  typeBillingAddressLine1(newValue: string): CheckOutPage {
    checkOutPageObj.billingAddressLine1.sendKeys(newValue);
    return this;
  }

  typeBillingAddressLine2(newValue: string): CheckOutPage {
    checkOutPageObj.billingAddressLine2.sendKeys(newValue);
    return this;
  }

  typeBillingCountryDropDown(newValue: string): CheckOutPage {
    element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputShipTo_]")).first().element(by.cssContainingText('option', newValue)).click();
    return this;
  }


  typeBillingCity(newValue: string): CheckOutPage {
    checkOutPageObj.billingCity.sendKeys(newValue);
    return this;
  }

  typeBillingState(newValue: string): CheckOutPage {
    element.all(by.css("[id^=commerce-checkout-address_Billing_form_inputState_]")).first().element(by.cssContainingText('option', newValue)).click();
    return this;
  }

  typeBillingZipCode(newValue: string): CheckOutPage {
    checkOutPageObj.billingZipCode.sendKeys(newValue);
    return this;
  }

  //getCssValues

  getShippingBillingNicknameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingAddressNickname);
  }

  getShippingBillingFirstNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingFirstName);

  }

  getShippingBillingLastNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingLastName);
  }

  getShippingBillingEmailCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingEmail);
  }

  getShippingBillingPhoneNumberCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingPhoneNumber);
  }

  getShippingBillingAddressLine1Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingAddressLine1);
  }

  getShippingBillingAddressLine2Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingAddressLine2);
  }

  getShippingBillingCountryDropDownCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingCountryDropDown);
  }

  getShippingBillingCityCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingCity);
  }

  getShippingBillingStateCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingState);
  }

  getShippingBillingZipCodeCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingBillingZipCode);
  }

  getShippingNicknameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingAddressNickname);
  }

  getShippingFirstNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingFirstName);
  }

  getShippingLastNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingLastName);
  }

  getShippingEmailCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingEmail);
  }

  getShippingPhoneNumberCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingPhoneNumber);
  }

  getShippingAddressLine1Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingAddressLine1);
  }

  getShippingAddressLine2Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingAddressLine2);
  }

  getShippingCountryDropDownCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingCountryDropDown);
  }

  getShippingCityCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingCity);
  }

  getShippingStateCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingState);
  }

  getShippingZipCodeCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.shippingZipCode);
  }

  getBillingNicknameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingAddressNickname);
  }

  getBillingFirstNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingFirstName);
  }

  getBillingLastNameCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingLastName);
  }

  getBillingEmailCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingEmail);
  }

  getBillingPhoneNumberCss(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingPhoneNumber);
  }

  getBillingAddressLine1Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingAddressLine1);
  }

  getBillingAddressLine2Css(cssStyleProperty: string): Promise<string> {
    return this.getCssValue(cssStyleProperty, checkOutPageObj.billingAddressLine2);
  }

    getBillingCountryDropDownCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, checkOutPageObj.billingCountryDropDown);
    }

    getBillingCityCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, checkOutPageObj.billingCity);
    }

    getBillingStateCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, checkOutPageObj.billingState);
    }

    getBillingZipCodeCss(cssStyleProperty: string): Promise<string> {
        return this.getCssValue(cssStyleProperty, checkOutPageObj.billingZipCode);
    }

    removeFocus() {
        checkOutPageObj.heading.click();
        return this;
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(checkOutPageObj.VATTax);
    }

    pickupOption(option: string) {
        this.waitForElementPresent(checkOutPageObj.pickUp);
        this.waitForElementDisplayed(checkOutPageObj.pickUp);
        this.waitForStableHeight(checkOutPageObj.pickUp);
        switch (option) {
            case "onlineOption":
            checkOutPageObj.buyOnline.click();
                break;
            case "pickUpOption":
                checkOutPageObj.pickUp.click();
                break;
            default:
                break;
        }
        console.log("select pickupOption:"+option);
    }

    selectPayMethod(option: string) {
        this.waitForElementPresent(checkOutPageObj.payInStore);
        this.waitForElementDisplayed(checkOutPageObj.payInStore);
        this.waitForStableHeight(checkOutPageObj.payInStore);
        switch (option) {
            case "payWithCreditCardOption":
            checkOutPageObj.payCreditCard.click();
                break;
            case "payInStoreOption":
                checkOutPageObj.payInStore.click();
                break;
            default:
                break;
        }
        console.log("select "+ option);
    }

    clickSelectStore() {
        let elem = checkOutPageObj.selectStore;
        this.waitForElementPresent(elem);
        this.waitForElementDisplayed(elem);
        this.waitForStableHeight(elem);
        elem.click().then(()=>{
            console.log("Select store clicked on Checkout Page")
        });
        this.waitForElementDisplayed(checkOutPageObj.storeLocatorModal);
        return new StoreLocatorPage();
    }

    closeStoreModel() : CheckOutPage {
        checkOutPageObj.storeModalCloseButton.click().then(function(){
            console.log("Click on close button of store location modal.")
        });
        this.waitForElementNotDisplayed(checkOutPageObj.storeLocatorModal);
        return this;
    }
}