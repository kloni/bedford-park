
/*******************************************************************************
 * checkout-address.dynamic.component.ts
 *
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import * as $ from 'jquery';
import {uniqueId} from 'lodash';

import { CurrentUser } from './../../../common/util/currentUser';
import { StorefrontUtils } from './../../../common/storefrontUtils.service';
import { PersonService } from './../../../services/rest/transaction/person.service';
import { CommerceEnvironment } from './../../../commerce.environment';
import {DigitalAnalyticsService} from '../../../services/digitalAnalytics.service';
import {CountryService} from '../../../services/rest/transaction/country.service';
import {PersonContactService} from '../../../services/rest/transaction/personContact.service';
import {CartTransactionService} from '../../../services/componentTransaction/cart.transaction.service';
import {AuthenticationTransactionService} from '../../../services/componentTransaction/authentication.transaction.service';

export interface Address {
  isNew?: boolean,
  isEdit?: boolean,
  country?: string,
  addressType?: string,
  nickName?: string,
  addressId?: string,
  primary?: string,
  lastName?: string,
  zipCode?: string,
  firstName?: string,
  email1?: string,
  city?: string,
  state?: string,
  addressLine?: string[],
  displayName?: string,
  newAddressForm?: any,
  countryObject?: any
}

export interface CheckoutSelectedAddress {
  Shipping?: Address;
  Billing?: Address;
  ShippingAndBilling? :Address;
}

@Component({
    selector: 'commerce-dynamic-checkout-address',
    templateUrl: './checkout-address.dynamic.component.html',
    styleUrls: ['./checkout-address.dynamic.component.scss']
})
export class CheckoutAddressDynamicComponent implements OnInit {

    private _initializeAddressErrorMessageFallback: string = "checkout-address.initializeAddressErrorFallback";
    private _createNewAddressErrorMessageFallback: string = "checkout-address.newAddressErrorFallback";
    private _initializeCountriesErrorMessageFallback: string = "checkout-address.initCountriesErrorFallback";
    private shippingEstimateAddressPattern: RegExp = /^ApplePhoneContact_(\d)+/;

    private _newAddress: Address = {
        isNew: true,
        addressLine: [],
        displayName: 'checkout-address.newAddress'
    };
    private currentUser: CurrentUser;
    id: any;
    _addressNickNames: any = {};

    componentName: string = "commerce-checkout-address";
    countries: any = [];
    //to show invalid input indicator in html
    addressFormChecked: boolean;
    sameSB: boolean = true;
    shippingAddresses: Address[] = [];
    billingAddresses: Address[] = [];
    shippingAndBillingAddresses: Address[] = [];
    selectedAddress: CheckoutSelectedAddress = {};
    addressTypes: any = CommerceEnvironment.address.type;
    addressContext: any = {
        Shipping: {
            $implicit: CommerceEnvironment.address.type.shipping,
            'addresses': this.shippingAddresses,
            "selectedAddress": this.selectedAddress.Shipping
        },
        Billing: {
            $implicit: CommerceEnvironment.address.type.billing,
            'addresses': this.billingAddresses,
            "selectedAddress": this.selectedAddress.Billing
        },
        ShippingAndBilling: {
            $implicit: CommerceEnvironment.address.type.shippingAndBilling,
            'addresses': this.billingAddresses,
            "selectedAddress": this.selectedAddress.Shipping
        }
    };

    showBilling: boolean;
    isGuest: boolean;

    //toggling
    billingId: string;
    billingFormId: string;
    shippingFormId: string;
    billingAndShippingFormId: string;
    private formToggleTarget: string[] = [];
    private saveAndContinueClicked: boolean = false;
    _bopisOption: any = {};

    @Output() onSelectAddress = new EventEmitter<CheckoutSelectedAddress | boolean>();
    @Output() onErrorMessage = new EventEmitter<string>();

    private _addressList: any;
    set addresses( addresses: any[] ) {
      this._addressList = addresses;
    }

    get addresses(): any[] {
      if ( !this._addressList || this._addressList.length < 1 ) {
        return null;
      }
      else {
        return this._addressList;
      }
    }

    @Input() set bopisOptionUpdate(bopisOption){
        this._bopisOption = bopisOption;
        if (bopisOption !== undefined) {
            if (bopisOption && bopisOption.storeId) {
                this.sameSB = false;
                this.updateSameSB();

                // only update this.selectedAddress.Shipping (changing shipping triggers async update on billing address)
                let billingAddrEditChange = this.selectedAddress.Billing.isEdit ? this.deepCopy(this.selectedAddress.Billing.isEdit) : null;
                let billingAddrNewChange = this.selectedAddress.Billing.isNew ? this.deepCopy(this.selectedAddress.Billing.isNew) : null;
                this.selectedAddress.Shipping.isEdit = false;
                this.selectedAddress.Shipping.isNew = false;
                this.selectedAddress.Billing.isEdit = billingAddrEditChange;
                this.selectedAddress.Billing.isNew = billingAddrNewChange;
            }
            else if ((!bopisOption || !bopisOption.storeId) && !this.sameSB) {
                this.sameSB = true;
                this.updateSameSB();
                this.selectedAddress.ShippingAndBilling = this.selectedAddress.Billing;
                this.selectedAddress.ShippingAndBilling.isEdit = true;
            }
            else if ((!bopisOption || !bopisOption.storeId) && this.sameSB) {
                this.updateSameSB();
            }

            this.toggleCheckoutAddressSection();
        }
    }
    get bopisOptionUpdate(): any {
        return this._bopisOption;
    }

    _toggling: boolean = false;
    _pendingToggle: boolean = false;
    checkoutAddressSectionId: string;

  constructor(
    private authService: AuthenticationTransactionService,
    private cartTransactionService: CartTransactionService,
    private contactSvc: PersonContactService,
    private countryService: CountryService,
    private storefrontUtils: StorefrontUtils,
    private personService: PersonService,
    private da: DigitalAnalyticsService
  ) {
  }


  ngOnInit() {
        this.id = uniqueId();
        this.initAddressList();
        this.initCountries();
        this.billingId = this.componentName + '_div_showSameSB_' + this.id;
        this.billingFormId = this.componentName + '_div_billing_form_' + this.id;
        this.shippingFormId = this.componentName + '_div_shipping_form_' + this.id;
        this.billingAndShippingFormId = this.componentName + '_div_billingAndShipping_form_' + this.id;
        this.checkoutAddressSectionId = `${this.componentName}_div_checkout_address_${this.id}`;
        this.currentUser = StorefrontUtils.getCurrentUser();
        this.isGuest = StorefrontUtils.isGuestOrActingAs(this.currentUser);
        if ( this.currentUser && this.isGuest && this.currentUser.isCheckoutAsGuest ){
            this.currentUser.isCheckoutAsGuest = false;
            StorefrontUtils.saveCurrentUser(this.currentUser);
        }
    }

    initCountries() {
        return this.countryService.findCountryStateList({ "storeId": this.storefrontUtils.commerceStoreId }).toPromise().then(
            response => {
                this.countries = response.body.countries;
                this.updateNewAddressSelectedCountry();
                this.updateEditAddressSelectedCountry();
            }).catch(
            e => {
                this.onErrorMessage.emit(this.storefrontUtils.handleErrorCase(e, this._initializeCountriesErrorMessageFallback));
            }
            );
    }

    initAddressList(): Promise<any> {
        return this.personService.findPersonBySelf({ storeId: this.storefrontUtils.commerceStoreId }).toPromise().then(r => {
            //we are not getting address from person self service, since the address created during registration is not complete.
            let book = r.body.contact;
            if (!book) {
                book = [];
            }
            delete r.body.contact;
            book.push(r.body);
            book = book.filter(e => {
                this.addressEditRequired(e);
                return !this.isShippingEstimateAddress(e.nickName);
            });

            let pageParam: any
            if (book[0] && book[0].addressId) {
                pageParam = {
                    pageName: CommerceEnvironment.checkoutShippingSection
                };
            }
            else {
                pageParam = {
                    pageName: CommerceEnvironment.checkoutAddressSection
                };
            }
            this.da.viewPage(pageParam);

            let shippingAddresses = book;
            let billingAddresses = book;
            let shippingAndBillingAddresses = book;
            return this.cartTransactionService.getUsableShippingInfo().then(
                //get usable shipping address
                (res) => {
                    let uAddress = res.body.usableShippingAddress;
                    let shipAddressNicknames = [];
                    let newAddress = this.deepCopy(this._newAddress);
                    for (let e of uAddress || []) {
                        shipAddressNicknames.push(e.nickName);
                    }
                    let orderItem = this.cartTransactionService.cartSubject.getValue().orderItem;
                    let pi = this.cartTransactionService.cartSubject.getValue().paymentInstruction;

                    if (!this._addressNickNames[CommerceEnvironment.address.type.shipping] && orderItem && orderItem.length > 0) {
                        this._addressNickNames[CommerceEnvironment.address.type.shipping] = orderItem[0].nickName;
                        //use addressId from first orderItem, since we are not doing multiple shipments.
                    }
                    if (!this._addressNickNames[CommerceEnvironment.address.type.billing] && pi && pi.length > 0 && pi[0].nickName) {
                        this._addressNickNames[CommerceEnvironment.address.type.billing] = pi[0].nickName;
                    }
                    if (this._addressNickNames[CommerceEnvironment.address.type.shipping] && this._addressNickNames[CommerceEnvironment.address.type.billing] && this._addressNickNames[CommerceEnvironment.address.type.shipping] != this._addressNickNames[CommerceEnvironment.address.type.billing]) {
                        //existing shipping and billing using different address
                        this.sameSB = false;
                    }
                    if (this.sameSB && this._addressNickNames[CommerceEnvironment.address.type.billing] && shipAddressNicknames.indexOf(this._addressNickNames[CommerceEnvironment.address.type.billing]) < 0) {
                        //billing address is not empty, billing address does not exist in list of available shipping
                        this.sameSB = false;
                    }
                    this.shippingAddresses = shippingAddresses.filter((b) => {
                        if (shipAddressNicknames.indexOf(b.nickName) > -1) {
                            if (this._addressNickNames[CommerceEnvironment.address.type.shipping] && b.nickName == this._addressNickNames[CommerceEnvironment.address.type.shipping]) {
                                this.selectedAddress.Shipping = b;
                                if (this.bopisOptionUpdate && this.bopisOptionUpdate.storeId) {
                                    this.selectedAddress.Shipping.isEdit = false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    this.shippingAddresses.push(newAddress);
                    return this.cartTransactionService.getUsablePaymentInfo().then(
                        //get usable billing address
                        (p) => {
                            const usablePayments = p.body.usablePaymentInformation;
                            let up = null;
                            if (usablePayments && usablePayments.length > 0) {
                                up = usablePayments.filter(i => {
                                    return i.paymentMethodName == 'COD';//IDC only support COD
                                })[0];
                            }
                            let usableBillingAddresses = up ? up.usableBillingAddress : [];
                            let billAddressNicknames = [];
                            for (let e of usableBillingAddresses || []) {
                                billAddressNicknames.push(e.nickName);
                            }
                            if (this.sameSB && this._addressNickNames[CommerceEnvironment.address.type.shipping] && billAddressNicknames.indexOf(this._addressNickNames[CommerceEnvironment.address.type.shipping]) < 0) {
                                //current shipping address does not exist in list of available billing addresses.
                                this.sameSB = false;
                            }
                            this.shippingAndBillingAddresses = shippingAndBillingAddresses.filter((b) => {
                                //shall be in both usable shipping and billing address
                                if (shipAddressNicknames.indexOf(b.nickName) > -1 && billAddressNicknames.indexOf(b.nickName) > -1) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });

                            this.billingAddresses = billingAddresses.filter((b) => {
                                if (billAddressNicknames.indexOf(b.nickName) > -1) {
                                    if (this._addressNickNames[CommerceEnvironment.address.type.billing] && b.nickName == this._addressNickNames[CommerceEnvironment.address.type.billing]) {
                                        this.selectedAddress.Billing = b;
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });

                            this.shippingAndBillingAddresses.push(newAddress);
                            this.billingAddresses.push(this.deepCopy(this._newAddress));
                            //billing use differen new address
                            this.updateAddressContextAddress();
                            this.updateSameSB();
                        }
                    )
                }
            );
        }).catch(
            (e) => {
                this.onErrorMessage.emit(this.storefrontUtils.handleErrorCase(e, this._initializeAddressErrorMessageFallback));
                this.saveAndContinueClicked = false;
            }
            )
    }

    updateSameSB() {
        const target = '#' + this.billingId;
        if (!this.sameSB) {
            this.setShowBilling();
            setTimeout(() => {
                $(target).toggle("slow", function(){
                    if (!$(target).is(":visible") && this.bopisOptionUpdate && this.bopisOptionUpdate.storeId) {
                        $(target).show("slow");
                    }
                    if (this.selectedAddress.Billing.isEdit || this.selectedAddress.Billing.isNew){
                        $("#" + this.billingFormId).show("slow");
                    }
                }.bind(this));
            }, 500);
        }
        else if (this.sameSB) {
            if (this.showBilling) {
                $(target).toggle("slow");
                setTimeout(
                    () => {
                        this.setShowBilling();
                    }, 1000
                );
            }
            else {
                this.setShowBilling();
            }
        }
        //For animation effect above
    }

    private setShowBilling() {
        this.addressFormChecked = false;
        this.showBilling = !this.sameSB;
        if (!this.sameSB && this.shippingAddresses.length > 0 && !this.selectedAddress.Shipping) {
            this.selectedAddress.Shipping = this.shippingAddresses[0];
        }
        if (!this.sameSB && this.billingAddresses.length > 0 && !this.selectedAddress.Billing) {
            this.selectedAddress.Billing = this.billingAddresses[0];
        }
        if (!this.selectedAddress.Shipping || this.shippingAndBillingAddresses.indexOf(this.selectedAddress.Shipping) < 0) {
            this.selectedAddress.ShippingAndBilling = this.shippingAndBillingAddresses[0];
        }
        else {
            this.selectedAddress.ShippingAndBilling = this.selectedAddress.Shipping;
        }
        if (this.sameSB) {
            this.selectedAddress.Shipping = this.selectedAddress.ShippingAndBilling;
            this.selectedAddress.Billing = this.selectedAddress.Shipping;
        }
        this.updateAddressContextNewAddress();
        this.updateAddressContextSelectedAddress();
        this.initializeCountry(this.selectedAddress.Shipping);
        this.initializeCountry(this.selectedAddress.Billing);

        let formToggleTargets = [];
        let formToggelToHide = [];
        if (this.sameSB){
            if (this.selectedAddress.ShippingAndBilling.isEdit || this.selectedAddress.ShippingAndBilling.isNew){
                formToggleTargets.push("#" + this.billingAndShippingFormId);
            }
            formToggelToHide.push("#" + this.shippingFormId);
            formToggelToHide.push("#" + this.billingFormId);
        }
        else {
            if (this.selectedAddress.Billing.isEdit || this.selectedAddress.Billing.isNew){
                formToggleTargets.push("#" + this.billingFormId);
            }
            if (this.selectedAddress.Shipping.isEdit || this.selectedAddress.Shipping.isNew){
                formToggleTargets.push("#" + this.shippingFormId);
            }
            formToggelToHide.push("#" + this.billingAndShippingFormId);
        }
        let hideTargets = null;
        if (formToggelToHide != null && formToggelToHide.length > 0){
            hideTargets = $(formToggelToHide.join(", ")).filter(":visible");
        }
        if (hideTargets != null && hideTargets.length > 0 ){
            hideTargets.toggle(false);
            if (formToggleTargets != null && formToggleTargets.length > 0){
                    $(formToggleTargets.join(", ")).toggle(true);
            }
        }
        else if (formToggleTargets != null && formToggleTargets.length > 0){
            setTimeout(function(){
                const toggleTarget:any = $(formToggleTargets.join(', '));
                for (let t of toggleTarget){
                    $(t).show("slow");
                }
            }, 500)
        }

        if ( this.selectedAddress.Shipping.isEdit != true && this.selectedAddress.Billing.isEdit != true && this.selectedAddress.Shipping.isNew != true && this.selectedAddress.Billing.isNew != true ) {
            this.onSelectAddress.emit( this.deepCopy( this.selectedAddress ) );
        }
        else {
            this.onSelectAddress.emit(false);
        }
        this.saveAndContinueClicked = false;
    }

    private updateAddressContextNewAddress() {
        if (this.sameSB) {
            const lastIndex = this.addressContext.Shipping.addresses.length - 1;
            this.addressContext.Billing.addresses.pop();
            //use pop not splice, so we do not need to worry empty address case
            //if billing is same as shipping, make the new address the same also
            this.addressContext.Billing.addresses.push(this.addressContext.Shipping.addresses[lastIndex]);
        }
        else {
            if (!this.isLoggedIn() && this.selectedAddress.Billing == this.selectedAddress.Shipping) {
                this.selectedAddress.Billing = this.deepCopy(this.selectedAddress.Billing);
                delete this.selectedAddress.Billing.nickName;
                delete this.selectedAddress.Billing.addressId;
                this.selectedAddress.Billing.isNew = true;
                this.addressContext.Billing.addresses.pop();
                this.addressContext.Billing.addresses.push(this.selectedAddress.Billing);
            }
            else {
                if (this.selectedAddress.Billing.isNew) {
                    this.selectedAddress.Billing = this.deepCopy(this.selectedAddress.Billing);
                    /*
                    making a copy of new address, since user may modify the address
                    to have different new address for shipping and billing
                    */
                    this.addressContext.Billing.addresses.pop();
                    this.addressContext.Billing.addresses.push(this.selectedAddress.Billing);
                }
                else if (this.selectedAddress.Billing.isEdit) {
                    //use first address instead
                    this.selectedAddress.Billing = this.billingAddresses[0];
                }
                else {
                    //make sure the Billing newAddress are different from Shipping newAddress
                    const lSIndex = this.addressContext.Shipping.addresses.length - 1;
                    const lBIndex = this.addressContext.Billing.addresses.length - 1;
                    if (this.addressContext.Shipping.addresses[lSIndex] == this.addressContext.Billing.addresses[lBIndex]) {
                        //new address is the last one
                        this.addressContext.Billing.addresses.pop();
                        this.addressContext.Billing.addresses.push(this.deepCopy(this._newAddress));
                    }
                }
            }
        }

        this.updateNewAddressSelectedCountry();
        this.updateEditAddressSelectedCountry();
    }

    private updateAddressContextAddress() {
        this.addressContext.ShippingAndBilling.addresses = this.shippingAndBillingAddresses;
        this.addressContext.Billing.addresses = this.billingAddresses;
        this.addressContext.Shipping.addresses = this.shippingAddresses;
        // this.updateAddressContextSelectedAddress();
    }

    private updateAddressContextSelectedAddress() {
        this.addressContext.Shipping.selectedAddress = this.selectedAddress.Shipping;
        this.addressContext.Billing.selectedAddress = this.selectedAddress.Billing;
        this.addressContext.ShippingAndBilling.selectedAddress = this.selectedAddress.ShippingAndBilling;
        this._addressNickNames[CommerceEnvironment.address.type.billing] = this.selectedAddress.Billing.nickName;
        this._addressNickNames[CommerceEnvironment.address.type.shipping] = this.selectedAddress.Shipping.nickName;
    }

    onSelectChange(addressType: string) {
        this.addressFormChecked = false;
        if ( this.sameSB ) {
            this.selectedAddress.Billing = this.selectedAddress.ShippingAndBilling;
            this.selectedAddress.Shipping = this.selectedAddress.ShippingAndBilling;
        }
        else {
            this.selectedAddress.ShippingAndBilling = this.selectedAddress.Shipping;
        }
        if (this.bopisOptionUpdate && this.bopisOptionUpdate.storeId && (!this.selectedAddress.Billing.addressLine || this.selectedAddress.Billing.addressLine.length == 0)) {
            this.selectedAddress.Billing.isEdit = true;
        }
        if (!this.sameSB && this.selectedAddress.Billing == this.selectedAddress.Shipping && (!this.bopisOptionUpdate || !this.bopisOptionUpdate.storeId)) {
            this.sameSB = true;
            this.updateSameSB();
        }
        else {
            let toggleTarget = null;
            let toggleShow = true;
            if (addressType == CommerceEnvironment.address.type.shipping){
                toggleTarget = "#" + this.shippingFormId;
                if (this.selectedAddress.Shipping.isEdit || this.selectedAddress.Shipping.isNew){
                    toggleShow = true;
                }
                else {
                    toggleShow = false;
                }
            }
            else if (addressType == CommerceEnvironment.address.type.billing){
                toggleTarget = "#" + this.billingFormId;
                if (this.selectedAddress.Billing.isEdit || this.selectedAddress.Billing.isNew){
                    toggleShow = true;
                }
                else {
                    toggleShow = false;
                }
            }
            else if (addressType == CommerceEnvironment.address.type.shippingAndBilling){
                toggleTarget = "#" + this.billingAndShippingFormId;
                if (this.selectedAddress.ShippingAndBilling.isEdit || this.selectedAddress.ShippingAndBilling.isNew){
                    toggleShow = true;
                }
                else {
                    toggleShow = false;
                }
            }
            if (toggleTarget != null){
                if (toggleShow){
                    $(toggleTarget).show("slow");
                }
                if (!toggleShow){
                    $(toggleTarget).hide("slow");
                }
            }
            if (this.selectedAddress.Shipping.isEdit != true && this.selectedAddress.Billing.isEdit != true && this.selectedAddress.Shipping.isNew != true && this.selectedAddress.Billing.isNew != true) {
                this.onSelectAddress.emit(this.deepCopy(this.selectedAddress));
            }
            else {
                this.onSelectAddress.emit(false);
            }
            this.updateEditAddressSelectedCountry();
            this.updateAddressContextSelectedAddress();//TODO: Do not update this if it is new
        }
        this.initializeCountry(this.selectedAddress.Shipping);
        this.initializeCountry(this.selectedAddress.Billing);
    }

    deepCopy(o: any): any {
        return JSON.parse(JSON.stringify(o));
    }

    saveAndContinue(f) {
        if (f.valid) {
            if (!this.saveAndContinueClicked){
                this.saveAndContinueClicked = true;
                this.formToggleTarget = [];
                let add2save: Promise<any>[] = [];
                let addressNickNames = this.deepCopy(this._addressNickNames);
                if (this.sameSB) {
                    //save address and re initialize address list
                    //add2save.push(...)
                    if (this.selectedAddress.ShippingAndBilling.isNew) {
                        this.formToggleTarget.push("#" + this.billingAndShippingFormId);
                        if (!this.selectedAddress.ShippingAndBilling.nickName){
                            this.selectedAddress.ShippingAndBilling.nickName = "address" + (new Date()).getTime() + "_" + this.id;
                        }
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.ShippingAndBilling, nickName: this.selectedAddress.ShippingAndBilling.nickName };
                        add2save.push(this.contactSvc.addPersonContact(param).toPromise());
                    }
                    else if (this.selectedAddress.ShippingAndBilling.isEdit) {
                        this.formToggleTarget.push("#" + this.billingAndShippingFormId);
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.ShippingAndBilling, nickName: this.selectedAddress.ShippingAndBilling.nickName };
                        add2save.push(this.contactSvc.updatePersonContact(param).toPromise());
                    }
                    addressNickNames[CommerceEnvironment.address.type.billing] = this.selectedAddress.ShippingAndBilling.nickName;
                    addressNickNames[CommerceEnvironment.address.type.shipping] = this.selectedAddress.ShippingAndBilling.nickName;
                }
                else if (!this.sameSB) {
                    if (this.selectedAddress.Billing.isNew) {
                        this.formToggleTarget.push("#" + this.billingFormId);
                        // add2save.push(...)
                        if (!this.selectedAddress.Billing.nickName){
                            this.selectedAddress.Billing.nickName = "address" + (new Date()).getTime() + "_" + this.id;
                        }
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.Billing };
                        add2save.push(this.contactSvc.addPersonContact(param).toPromise());
                        addressNickNames[CommerceEnvironment.address.type.billing] = this.selectedAddress.Billing.nickName;
                    }
                    else if (this.selectedAddress.Billing.isEdit) {
                        this.formToggleTarget.push("#" + this.billingFormId);
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.Billing, nickName: this.selectedAddress.Billing.nickName };
                        add2save.push(this.contactSvc.updatePersonContact(param).toPromise());
                        addressNickNames[CommerceEnvironment.address.type.billing] = this.selectedAddress.Billing.nickName;
                    }
                    if (this.selectedAddress.Shipping.isNew) {
                        this.formToggleTarget.push("#" + this.shippingFormId);
                        if (!this.selectedAddress.Shipping.nickName){
                            this.selectedAddress.Shipping.nickName = "address" + (new Date()).getTime() + "_" + this.id;
                        }
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.Shipping, nickName: this.selectedAddress.Shipping.nickName };
                        add2save.push(this.contactSvc.addPersonContact(param).toPromise());
                        addressNickNames[CommerceEnvironment.address.type.shipping] = this.selectedAddress.Shipping.nickName;
                    }
                    else if (this.selectedAddress.Shipping.isEdit) {
                        this.formToggleTarget.push("#" + this.shippingFormId);
                        const param = { storeId: this.storefrontUtils.commerceStoreId, body: this.selectedAddress.Shipping, nickName: this.selectedAddress.Shipping.nickName };
                        add2save.push(this.contactSvc.updatePersonContact(param).toPromise());
                        addressNickNames[CommerceEnvironment.address.type.shipping] = this.selectedAddress.Shipping.nickName;
                    }
                }
                if (add2save.length > 0) {
                    return Promise.all(add2save).then(
                        () => {
                            if (this.formToggleTarget != null && this.formToggleTarget.length > 0){
                                let toggleTarget = $(this.formToggleTarget.join(", "));
                                if (toggleTarget.is(':visible')){
                                        let visibleTargets = toggleTarget.filter(":visible")
                                        //the complete initAddressList needs to be called
                                        //upon the last toggle finish
                                        if (visibleTargets.length == 2){
                                            $(visibleTargets[0]).toggle("slow", function(){
                                                    $(visibleTargets[1]).toggle("slow", function(){
                                                        this._addressNickNames = addressNickNames;
                                                        this.showBilling = false;
                                                        this.initAddressList();
                                                }.bind(this));
                                            }.bind(this));
                                        }
                                        else {
                                            visibleTargets.toggle("slow", function(){
                                                this._addressNickNames = addressNickNames;
                                                this.showBilling = false;
                                                this.initAddressList();
                                            }.bind(this));
                                        }
                                }
                                else {
                                    this._addressNickNames = addressNickNames;
                                    this.showBilling = false;
                                    this.initAddressList();
                                }
                            }
                            else {
                                this._addressNickNames = addressNickNames;
                                this.showBilling = false;
                                this.initAddressList();
                            }

                            let pageParam = {
                                pageName: CommerceEnvironment.checkoutShippingSection
                            };
                            this.da.viewPage(pageParam);
                        }
                    ).catch(
                        e => {
                            this.onErrorMessage.emit(this.storefrontUtils.handleErrorCase(e, this._createNewAddressErrorMessageFallback));
                            this.saveAndContinueClicked = false;
                        }
                    )
                }
                else {
                    this.saveAndContinueClicked = false;
                }
            }
        }
        else {
            this.addressFormChecked = true;
        }
    }

    onCountrySelect(selectedAddr: any) {
        selectedAddr.countryObject = null;
        if ( selectedAddr.country ) {
            selectedAddr.state = null;
            selectedAddr.countryObject = this.countries.filter(
                (e) => {
                    if (e.displayName == selectedAddr.country) {
                        selectedAddr.country = e.code;
                    }
                    return e.code == selectedAddr.country;
                }
            ).pop();
            if (selectedAddr.countryObject && selectedAddr.countryObject.states.length > 0) {
                selectedAddr.state = selectedAddr.countryObject.states[0].code;
                selectedAddr.stateObject = selectedAddr.countryObject.states.filter(
                    ( e ) => {
                        return e.code == selectedAddr.state;
                    }
                ).pop();
            }
        }
    }

    onStateSelect( selectedAddr: any ) {
        if ( selectedAddr.state && selectedAddr.countryObject && selectedAddr.countryObject.states.length > 0 ) {
            selectedAddr.stateObject = selectedAddr.countryObject.states.filter(
                ( e ) => {
                    return e.code == selectedAddr.state;
                }
            ).pop();
        }
    }

    initializeCountry(selectedAddr: any){
        if ( selectedAddr.country && !selectedAddr.countryObject) {
            selectedAddr.countryObject = this.countries.filter(
                ( e ) => {
                    return e.code == selectedAddr.country;
                }
            ).pop();
        }
        if ( selectedAddr.countryObject && selectedAddr.state && selectedAddr.countryObject.states.length > 0 && !selectedAddr.stateObject) {
            selectedAddr.stateObject = selectedAddr.countryObject.states.filter(
                ( e ) => {
                    return e.code == selectedAddr.state;
                }
            ).pop();
        }
    }

    updateNewAddressSelectedCountry() {
        if (this.billingAddresses.length > 0) {
            let newAddress = this.billingAddresses[this.billingAddresses.length - 1];
            this.addCountryAddressLineToAddress(newAddress);
        }
        if (this.shippingAddresses.length > 0) {
            // shipping and billing should be same
            let newAddress = this.shippingAddresses[this.shippingAddresses.length - 1];
            this.addCountryAddressLineToAddress(newAddress);
        }
    }

    updateEditAddressSelectedCountry() {
        // add country to address, so the first country is selected in the form
        this.addCountryAddressLineToAddress(this.selectedAddress.Shipping);
        this.addCountryAddressLineToAddress(this.selectedAddress.Billing);
        this.addCountryAddressLineToAddress(this.selectedAddress.ShippingAndBilling);
    }

    addCountryAddressLineToAddress(address: Address) {
        if (address && this.countries && (address.isNew || address.isEdit) && address.country === undefined) {
            address.country = "US";
        }
        if (address && (address.isNew || address.isEdit) && address.addressLine === undefined) {
            address.addressLine = [];
        }
    }

    addressEditRequired(address: Address): boolean {
        if (address.addressLine && address.addressLine[0]) {
            return false;
        }
        else {
            address.isEdit = true;
            return true;
        }
    }

    edit(event: any, address: Address, addressType: string) {
        event.preventDefault();
        this.onSelectAddress.emit(false);
        address.isEdit = true;
        let toggleTarget = null;
        if (addressType == CommerceEnvironment.address.type.shipping){
            toggleTarget = "#" + this.shippingFormId;
        }
        else if (addressType == CommerceEnvironment.address.type.billing){
            toggleTarget = "#" + this.billingFormId;
        }
        else if (addressType == CommerceEnvironment.address.type.shippingAndBilling){
            toggleTarget = "#" + this.billingAndShippingFormId;
        }
        if (toggleTarget != null){
            setTimeout(
                function(){
                    $(toggleTarget).show("slow");
                }, 500
            );
        }
    }

    isShippingEstimateAddress(address: string): boolean{
      return  this.shippingEstimateAddressPattern.test(address);
    }

    private isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
    }

    toggleCheckoutAddressSection() {
        if (this._toggling){
            this._pendingToggle = true;
        }
        else {
            const target = `#${this.checkoutAddressSectionId}`;
            if ( !this.bopisOptionUpdate && $(target).is(':visible')){
                this._toggling = true;
                setTimeout(function(){
                    $(target).toggle("slow", function(){
                        this.completeToggle();
                    }.bind(this));
                }.bind(this));

            }
            else if ( this.bopisOptionUpdate && !$(target).is(':visible')){
                this._toggling = true;
                setTimeout(function(){
                    $(target).toggle("slow", function(){
                        this.completeToggle();
                    }.bind(this));
                }.bind(this));
            }
        }
    }

    completeToggle(){
            //wait element animation done and element visible
            this._toggling = false;
            if (this._pendingToggle){
                this._pendingToggle = false;
                this.toggleCheckoutAddressSection();
            }
    }

}
