/*******************************************************************************
 * ship-payment.dynamic.component.ts
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

import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckoutSelectedAddress } from '../checkout-address/checkout-address.dynamic.component';
import { StorefrontUtils } from './../../../common/storefrontUtils.service';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as $ from 'jquery';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { Constants } from 'app/Constants';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';

const uniqueId = require('lodash/uniqueId');

@Component( {
    selector: 'commerce-dynamic-ship-payment',
    templateUrl: './ship-payment.dynamic.component.html',
    styleUrls: ['./ship-payment.dynamic.component.scss']
} )
export class ShipPaymentDynamicComponent implements OnInit, OnDestroy {

    usableShippingMethods: any;
    selectedShipMethod: any;
    usablePaymentMethods: any;
    selectedPaymentMethod: any;
    id: any;
    isGuest: boolean = true;
    componentName: string = "commerce-ship-payment";

    private _shipPaymentSaved: boolean;
    private _cartSubscriber: Subscription;
    private _initSub: Subscription;
    private _previouseSelectedAddress:CheckoutSelectedAddress;
    private _selectedAddress: CheckoutSelectedAddress;
    private _usableShippingModeNotFound: string = "ship-payment.usableShippingModeNotFound";
    private _usableShippingModeFallback: string = "ship-payment.usableShippingModeFallback";
    private _usablePaymentInfoNotFound: string = "ship-payment.usablePaymentInfoNotFound";
    private _usablePaymentInfoFallback: string = "ship-payment.usablePaymentInfoFallback";
    private _updateShipppingInfoFallback: string = "ship-payment.updateShippingInfoFallback";
    private _updateUpatePaymentInstructionFallback: string = "ship-payment.updateUpatePaymentInstructionFallback";
    private _saveShipppingInfoFallback: string = "ship-payment.saveShipppingInfoFallback";
    private _payWithCreditCardOption: string = 'payWithCreditCardOption';
    private _payInStoreOption: string = 'payInStoreOption';
    _updatingShippingMethod: boolean = true;
    _shipPaymentUpdateEnabled: boolean = false;
    _gettingUsableShipMode: boolean = false;
    _bopisOption: any = {};
    paymentSelection: string = this._payWithCreditCardOption; // default payment selection for BOPIS
    showCreditCardPayment: boolean = true;
    _toggling: boolean = false;
    _pendingToggle: boolean = false;
    shipPaymentDivId: string;

    constructor(
        protected authService: AuthenticationTransactionService,
        private cartTransactionService: CartTransactionService,
        private storefrontUtils: StorefrontUtils,
        protected da: DigitalAnalyticsService
    ) { }

    @Input() enablePromotionCode: boolean = true;
    @Input() imageSrcContext: string;
    @Input() creditCardImage: any;
    @Output() onSaveShipPayment = new EventEmitter<boolean>();
    @Output() onErrorMessage = new EventEmitter<string>();
    @Output() onPickUpInStoreShipMode = new EventEmitter<string>();

    @Input()
    set selectedAddress( addresses: CheckoutSelectedAddress ) {
        this._updatingShippingMethod = true;
        this._previouseSelectedAddress = this._selectedAddress;
        this._selectedAddress = addresses;
        this.updateShippingAddress();
    }
    get selectedAddress(): CheckoutSelectedAddress {
        return this._selectedAddress;
    }

    @Input() set shipPaymentUpdate(enabled: boolean|any){
        this._shipPaymentUpdateEnabled = enabled;
        this.toggleShipPaymentDiv();
    }
    get shipPaymentUpdate(): boolean|any {
        return this._shipPaymentUpdateEnabled && !this._updatingShippingMethod;
    }

    @Input() set bopisOptionUpdate(bopisOption){
        this._bopisOption = bopisOption;
        this.paymentSelection = this._payWithCreditCardOption;
        this.showCreditCardPayment = true;
    }
    get bopisOptionUpdate(): any {
        return this._bopisOption;
    }

    ngOnInit() {
        this.id = uniqueId();
        this._toggling = false;
        this.shipPaymentDivId = `${this.componentName}_div_shipPayment_${this.id}`;
        this.isGuest = StorefrontUtils.isGuestOrActingAs();
        this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe(( cart ) => {
            if (!!cart) {
                // update payment instruction whenever the cart is updated
                this.setPaymentMethod().then(() => {
                    return this.updatePaymentInstruction();
                });
            }
        });
        this._initSub = this.cartTransactionService.cartSubject.subscribe( ( cart ) => {
            if (cart) {
                let promiseArray: Promise<any>[] = [];
                promiseArray.push(this.getUsableShipMode());
                promiseArray.push(this.setPaymentMethod());
                Promise.all(promiseArray).then(()=>{
                    this._initSub.unsubscribe();
                }).catch( e => {
                    /* istanbul ignore next */
                    this.onErrorMessage.emit( this.storefrontUtils.handleErrorCase( e, this._usablePaymentInfoFallback ) );
                    this._initSub.unsubscribe();
                } );
            }
        });
    }

    ngOnDestroy() {
        this._cartSubscriber.unsubscribe();
    }

    setPaymentMethod(): Promise<any> {
        return this.cartTransactionService.getUsablePaymentInfo().then(
            res => {
                let pIs = this.cartTransactionService.cartSubject.getValue().paymentInstruction;
                let pId = "";
                if ( pIs ) {
                    pId = pIs[0].payMethodId;
                }
                let paymentMethods = res.body.usablePaymentInformation;
                if (paymentMethods.length > 0) {
                    paymentMethods = paymentMethods.filter( e => {
                        if ( e.paymentMethodName === "COD" && this.paymentSelection === this._payWithCreditCardOption) {
                            this.selectedPaymentMethod = e;
                            return true;
                        }
                        else if ( e.paymentMethodName === 'PayInStore' && this.paymentSelection === this._payInStoreOption) {
                            this.selectedPaymentMethod = e;
                            return true;
                        }
                        else {
                            return false;
                        }
                    } );
                    this.usablePaymentMethods = paymentMethods;
                }
            }
        ).catch( e => {
            if ( e.status == 404 ) {
                /* istanbul ignore next */
                this.onErrorMessage.emit( this._usablePaymentInfoNotFound );
            }
            else {
                throw e;
            }
        });
    }

    getUsableShipMode(): Promise<any> {
        if (this._gettingUsableShipMode !== true){
            this._gettingUsableShipMode = true;
            return this.cartTransactionService.getUsableShippingMode().then(
                ( res ) => {
                    this._gettingUsableShipMode = false;
                    let orderItem = this.cartTransactionService.cartSubject.getValue().orderItem;
                    let shipModeId = "";
                    if ( orderItem && orderItem.length > 0 ) {
                        shipModeId = orderItem[0].shipModeId;
                        //use addressId from first orderItem, since we are not doing multiple shipments.
                    }
                    if (this.selectedShipMethod && this.selectedShipMethod.shipModeId){
                        //if the call is initialized by address selection change.
                        shipModeId = this.selectedShipMethod.shipModeId;
                    }
                    //remove usable shipping method = PickupInStore
                    let usableShippingMethods: any[] = res.body.usableShippingMode.filter(elem => {
                        if (elem.shipModeCode === 'PickupInStore') {
                            this.onPickUpInStoreShipMode.next(elem.shipModeId);
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                    if ( !!shipModeId ) {
                        this.selectedShipMethod = undefined;
                        usableShippingMethods.forEach( element => {
                            if ( element.shipModeId == shipModeId ) {
                                this.selectedShipMethod = element;
                            }
                        } );
                    }
                    if (!this.selectedShipMethod){
                        this.selectedShipMethod = usableShippingMethods[0];
                    }
                    this.usableShippingMethods = usableShippingMethods;
                    this._updatingShippingMethod = false;
                }
            ).catch( ( e: HttpErrorResponse ) => {
                this._gettingUsableShipMode = false;
                this._updatingShippingMethod = false;
                if ( e.status == 404 ) {
                    this.onErrorMessage.emit( this._usableShippingModeNotFound );
                }
                else {
                    throw e;
                }

            } );
        }
        else {
            return Promise.resolve();
        }
    }

    updateShippingAddress(): Promise<any> | void{
        let previousShippingAddressId = this._previouseSelectedAddress && this._previouseSelectedAddress.Shipping? this._previouseSelectedAddress.Shipping.addressId : "";
        if ( previousShippingAddressId == "" ) {
            //first time init the component
            let order = this.cartTransactionService.cartSubject.getValue();
            previousShippingAddressId = order && order.orderItem && order.orderItem[0] ? order.orderItem[0].addressId : "";
        }
        if ( this.selectedAddress && this.selectedAddress.Shipping && this.selectedAddress.Shipping.addressId != previousShippingAddressId && (!this.bopisOptionUpdate || !this.bopisOptionUpdate.storeId)) {
            return this.cartTransactionService.updateOrderShippingAddress( this.selectedAddress.Shipping.addressId )
                .then( r => {
                    return this.getUsableShipMode();
                } )
                .catch( ( e ) => {
                    this.onErrorMessage.emit( this.storefrontUtils.handleErrorCase( e, this._updateShipppingInfoFallback ) );
                } );
        }
        else {
            this._updatingShippingMethod = false;
        }
    }

    updateShippingInfo(): Promise<any> {
        if (this.bopisOptionUpdate && this.bopisOptionUpdate.storeId) {
            return Promise.resolve();
        }
        else {
            return this.cartTransactionService.updateOrderShippingInfo( this.selectedAddress.Shipping.addressId, null, this.selectedShipMethod.shipModeId )
                .catch( ( e ) => {
                    this.onErrorMessage.emit( this.storefrontUtils.handleErrorCase( e, this._updateShipppingInfoFallback ) );
                }
            );
        }
    }

    onShippingPaymentSave(): Promise<any> {
        if (!!this.shipPaymentUpdate){
            return this.updateShippingInfo().then( () => {
                this._shipPaymentSaved = true;
                this.cartTransactionService.getCart();

                let pageParam = {
                    pageName: CommerceEnvironment.checkoutSummarySection
                };
                this.da.viewPage(pageParam);
            }).catch( e => {
                    this.onErrorMessage.emit( this.storefrontUtils.handleErrorCase( e, this._saveShipppingInfoFallback ) );
                }
            );
        } else {
            return Promise.resolve();
        }
    }

    onShippingPaymentChange() {
        this._shipPaymentSaved = false;
        this.onSaveShipPayment.emit( this._shipPaymentSaved );
    }

    edit(event){
        event.preventDefault();
        this._shipPaymentSaved = false;
        this.onSaveShipPayment.emit( this._shipPaymentSaved );
    }

    updatePaymentInstruction(): Promise<any> | void {
        if ( this.selectedPaymentMethod && this.selectedAddress && this.selectedAddress.Billing && this.selectedAddress.Billing.addressId && this.selectedAddress.Billing.addressId != "" ) {
            return this.cartTransactionService.addPaymentInstruction( this.selectedPaymentMethod.paymentMethodName, this.selectedAddress.Billing.addressId ).then(
                () => {
                    this.onSaveShipPayment.emit( this._shipPaymentSaved );
                }
            ).catch( e => {
                this.onErrorMessage.emit( this.storefrontUtils.handleErrorCase( e, this._updateUpatePaymentInstructionFallback ) );
            } );
        }
    }

    toggleShipPaymentDiv() {
        if (this._toggling){
            this._pendingToggle = true;
        }
        else {
            const target = `#${this.shipPaymentDivId}`;
            if ( !this._shipPaymentUpdateEnabled && $(target).is(':visible')){
                this._toggling = true;
                setTimeout(function(){
                    $(target).toggle("slow", function(){
                        this.completeToggle();
                    }.bind(this));
                }.bind(this));

            }
            else if ( this._shipPaymentUpdateEnabled && !$(target).is(':visible')){
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
                this.toggleShipPaymentDiv();
            }
    }

    onPaymentSelectionChange(event: any) {
        this.paymentSelection = event.target.id;
        this.showCreditCardPayment = this.paymentSelection === this._payWithCreditCardOption ? true : false;
    }

}
