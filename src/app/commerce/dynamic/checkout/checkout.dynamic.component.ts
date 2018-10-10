/*******************************************************************************
 * checkout.dynamic.component.ts
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

import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { uniqueId } from 'lodash';
import { Router } from '@angular/router';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Constants } from 'app/Constants';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { OrderTransactionService } from 'app/commerce/services/componentTransaction/order.transaction.service';
import { CartTransactionService } from './../../services/componentTransaction/cart.transaction.service';
import {environment} from '../../../environment/environment';
import { Category } from 'ibm-wch-sdk-utils/api';
const isEqual = require('lodash/isEqual');

@Component( {
    selector: 'app-checkout-layout-component',
    templateUrl: './checkout.dynamic.component.html',
    styleUrls: ['./checkout.dynamic.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class CheckoutDynamicComponent implements OnInit, OnDestroy{

    private _cartSubscriber: Subscription[] = [];
    private _cart: any;
    private _checkoutFallback = 'checkoutLayout.checkoutFallback';
    closeFunc: Function;
    errorMessage: string;
    cartReady = false;
    shipPaymentUpdateEnabled = false;
    addressSaved = false;
    selectedAddress: any = {};
    selectedBopisOption: any;
    componentName = 'checkout-layout-component';
    deliveryUrl = environment.deliveryUrl.origin;
    creditCardImage: any;
    enablePromotionCode: any;
    title: string;
    pickUpInStoreShipModeId: string = '';
    catSubj: Subject<Category> = new ReplaySubject<Category>();
    onAvailableServices: Observable<Category> = this.catSubj.asObservable();
    onAvailableServiceTypes : Observable<string[]>;
    serviceTypes: any[] = [];
    id: any;
    private readonly confirmLink: string;

    constructor(
        private cartTransactionService: CartTransactionService,
        private orderTransactionService: OrderTransactionService,
        private router: Router,
        private storeUtils: StorefrontUtils,
        private da: DigitalAnalyticsService
    ) {
        this.confirmLink = this.storeUtils.getPageLink( Constants.orderConfirmationPageIdentifier );
        this.cartTransactionService.getCart();


        const onAvailableServiceTypes: Observable<string[]> = this.onAvailableServiceTypes =
            this.onAvailableServices
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .pluck('categoryPaths')
            .filter(Boolean)
            /* istanbul ignore next */
            .map(paths => Object.keys(paths).map(key => paths[key][1]))
            .distinctUntilChanged(isEqual)
            .shareReplay(1);

        /* istanbul ignore next */
        this._cartSubscriber.push(onAvailableServiceTypes.subscribe( service => { this.serviceTypes = service }));
    }

    ngOnInit() {
        this.closeFunc = this.closeErrrorMessage.bind( this );
        this.id = uniqueId();
        this._cartSubscriber.push(this.cartTransactionService.cartSubject.subscribe( ( cart ) => {
            if (cart) {
                this.cartTransactionService.normalizeOrderItems( cart.orderItem ).then((r) => {
                    this.cartReady = true;
                    return this.cart = cart;
                }).then(() => {
                    this.orderTransactionService.getOrderPromotions(cart.orderId).then(res => {
                        return this.cart.orderPromotions = res.resultList[0];
                    });
                });
            }
        } ));
    }

    ngOnDestroy() {
        this._cartSubscriber.forEach( sub => {
            sub.unsubscribe();
        });
        this._cartSubscriber = [];
    }

    set cart( cart: any ) {
        this._cart = cart;
    }

    get cart(): any {
        return this._cart;
    }

    onSaveShipPayment( saved: boolean ) {
        //use null to distingush address selected and shipping method updated.
        this.shipPaymentUpdateEnabled = saved ? null : true;
    }

    onSaveBOPIS( saved: any ) {
        this.selectedBopisOption = saved;
    }

    onSelectAddress( address: any ) {
        if (address == false || !this.selectedBopisOption) {
            this.addressSaved = false;
            this.shipPaymentUpdateEnabled = false;
        } else {
            this.selectedAddress = address;
            this.addressSaved = true;
            this.shipPaymentUpdateEnabled = true;
        }
    }

    onPickUpshipModeId( shipModeId: string ) {
        this.pickUpInStoreShipModeId = shipModeId;
    }

    onErrorMessage( message: string ) {
        this.errorMessage = message;
    }

    closeErrrorMessage() {
        this.errorMessage = null;
    }

    submitOrder(): Promise<any> {
        return this.cartTransactionService.preCheckout().then((x) => {
            return this.cartTransactionService.checkout(this.selectedAddress).then(
                // goto order confirmation
                (r) => {
                    return this.router.navigate([this.confirmLink], { queryParams: { orderId: r.body.orderId, storeId: this.storeUtils.commerceStoreId } })
                    .then(
                            (y) => {
                                const orderParam: any = {
                                    pageName: Constants.orderConfirmationPageIdentifier,
                                    cart: this.cart,
                                    address: this.selectedAddress,
                                    currency: sessionStorage.getItem('currentUserCurrency') === null ? 'USD' : sessionStorage.getItem('currentUserCurrency')
                                };
                                this.da.orderComplete(orderParam);
                                this.cartTransactionService.cartSubject.next(null);
                    })
                    .catch(
                        (e) => { this.cartTransactionService.cartSubject.next(null); }
                    );
                })
                .catch( r => {
                    console.error("Error", r);
                });
        })
        .catch(
            (e) => { this.errorMessage = this.storeUtils.handleErrorCase( e, this._checkoutFallback ); }
        );
    }

    onPickUpInStoreShipMode(shipModeId: string) {
        this.pickUpInStoreShipModeId = shipModeId;
    }

}
