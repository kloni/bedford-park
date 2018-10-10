import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { StorefrontUtils } from './../../../../commerce/common/storefrontUtils.service';
import { CountryService } from './../../../services/rest/transaction/country.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
import { AuthenticationTransactionService } from './../../../services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from './../../../services/rest/transaction/personContact.service';
import { HttpResponse } from '@angular/common/http';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

const uniqueId = require('lodash/uniqueId');

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


@Component( {
  selector: 'commerce-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
} )
export class OrderAddressComponent implements OnInit, OnDestroy {

  id: any;
  private shippingEstimateAddressPattern: RegExp = /^ApplePhoneContact_(\d)+/;
  protected _addressList: any;

   constructor(
    protected authService: AuthenticationTransactionService,
    protected cartTransactionService: CartTransactionService,
    protected contactSvc: PersonContactService,
    protected countryService: CountryService,
    protected storefrontUtils: StorefrontUtils,
    protected personservice: PersonService,
    protected da: DigitalAnalyticsService
  ) {
  }

  ngOnInit() {
    this.id = uniqueId();
    this.initAddressList();
  }

  ngOnDestroy() {

  }

  initAddressList(): Promise<any>{
    return null;
  }

  protected isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

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

  isShippingEstimateAddress(address: string): boolean{
    return  this.shippingEstimateAddressPattern.test(address);
  }


}
