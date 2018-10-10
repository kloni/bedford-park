/*******************************************************************************
 * order-details.dynamic.component.ts
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

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationTransactionService } from '../../../commerce/services/componentTransaction/authentication.transaction.service';
import { OrderTransactionService } from '../../../commerce/services/componentTransaction/order.transaction.service';
import { CartTransactionService } from '../../../commerce/services/componentTransaction/cart.transaction.service';
import { CommerceEnvironment } from '../../commerce.environment';
import { ProductService } from '../../services/product.service';
import { StorefrontUtils } from '../../common/storefrontUtils.service';
import { CountryService } from '../../../commerce/services/rest/transaction/country.service';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'app-dynamic-order-details-layout-component',
    templateUrl: './order-details.dynamic.html',
    styleUrls: ['./order-details.dynamic.scss'],
    preserveWhitespaces: false
})
export class DynamicOrderDetailsLayoutComponent implements OnInit {
    @Input() title: any;
    order: any;
    orderId: number;
    storeId: number;
    id: string;
    countryList: any[];
    quantity = 0;
    adjustment: string;
    countryShippingDescription: string;
    countryBillingDescription: string;
    public VATEnabled = false;
    public VAT;

    isCSR: boolean;

    constructor(private route: ActivatedRoute, private router: Router,
        private orderService: OrderTransactionService,
        private authService: AuthenticationTransactionService,
        private productService: ProductService,
        private store: StorefrontUtils,
        private cartTransactionService: CartTransactionService,
        private countrySvc: CountryService,
        private storeConfigCache: StoreConfigurationsCache) {
    }

    ngOnInit() {
        this.id = uniqueId();
        this.route.queryParams.subscribe(params => {
            this.orderId = params['orderId'];
        });
        this.getCountries().then((r) => {
            this.countryList = r.body.countries;
            if (this.orderId) {
                this.initializeOrderDetails().then(() => {
                    this.storeConfigCache.isEnabled(CommerceEnvironment.VATFeatureName).then(isVATEnabled => {
                        this.VATEnabled = isVATEnabled;
                        if(this.VATEnabled){
                            this.VAT = parseInt(this.order.totalShippingTax) + parseInt(this.order.totalSalesTax);
                        }
                    });

                    this.isCSR = StorefrontUtils.getCurrentUser().isCSR;
                    this.getCountryDescription();
                    this.getBillingCountryDescription();
                });
            } else {
                this.store.gotoNotFound();
            }
        }).catch(
            /* istanbul ignore next */
            (e) => {
                /* istanbul ignore next */
                this.store.handleErrorCase(e, 'Unable to retrieve country and state list')
            });
    }

    private initializeOrderDetails() {
        return this.orderService.getOrderDetails(this.orderId).then(order => {
            this.order = order;
            this.adjustment = this.order.totalAdjustment.substr(1);
            this.productService.normalizeOrderItems(order.orderItem);
            for (const item of order.orderItem) {
              this.quantity = Number(item.quantity) + this.quantity;
            }
        }).catch((error) => {
            console.error('Error getting order details: ', error);
            this.store.gotoNotFound();
        });
    }

    // function for order again button
    reOrder(orderId: number) {
        return this.cartTransactionService
            .copyOrder(orderId.toString()).then(res => {
                this.router.navigate(['/cart']);
            });
    }

    // get country list using service
    getCountries(): Promise<HttpResponse<any>> {
        if (!this.countryList) {
            return this.countrySvc.findCountryStateList({ storeId: this.store.commerceStoreId }).toPromise();
        } else {
            return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
        }
    }

    // create method to match country list to country in address and return a country description
    getCountryDescription() {
        if (this.countryList) {
            for (const a of this.countryList) {
                if (a.code == this.order.orderItem[0].country) {
                    this.countryShippingDescription = a.displayName;
                }
            }
        }
    }

    getBillingCountryDescription() {
        if (this.countryList) {
            for (const a of this.countryList) {
                if (a.code == this.order.paymentInstruction[0].country) {
                    this.countryBillingDescription = a.displayName;
                }
            }
        }
    }

    // method to display status of order
    getOrderStatusDescription(orderStatus: string): string {
        return CommerceEnvironment.order.orderStatus[orderStatus];
    }
}
