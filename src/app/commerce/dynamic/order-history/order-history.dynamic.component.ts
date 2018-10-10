/*******************************************************************************
 * order-history.dynamic.component.ts
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

import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderTransactionService } from '../../services/componentTransaction/order.transaction.service';

import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { CommerceEnvironment } from '../../commerce.environment';

import { ProductService } from '../../services/product.service';
import { AccountTransactionService } from '../../services/componentTransaction/account.transaction.service';
import { StorefrontUtils } from '../../common/storefrontUtils.service';
import { Logger } from 'angular2-logger/core';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'app-dynamic-order-history-layout-component',
    templateUrl: './order-history.dynamic.html',
    styleUrls: ['./order-history.dynamic.scss'],
    preserveWhitespaces: false,
})
export class DynamicOrderHistoryLayoutComponent implements OnInit {
    @Input() title: any;
    isLoggedIn = false;
    authSub: any;
    @Input() acctSmry = false;
    buyerId: string;
    orders: any[];
    loading = false;
    total = 0;
    pageNumber = 1;
    pageSize = 5;
    processed = '';
    errorMsg = '';
    orderStatus = '';
    id: any;
    activeOrders: any[];     
    public VATEnabled = false;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private orderService: OrderTransactionService,
        private authService: AuthenticationTransactionService,
        private logger: Logger,
        private productService: ProductService,
        private storeUtils: StorefrontUtils,
        private acctSvc: AccountTransactionService,
        private prodSvc: ProductService,
        private storeConfigCache: StoreConfigurationsCache) {
        this.authSub = this.authService.authUpdate.subscribe(status => this.isLoggedIn = status);
    }

    ngOnInit() {
        this.id = uniqueId();
        this.acctSvc.getCurrentUserPersonalInfo().then(r => {
            this.buyerId = r.body.userId;
            this.fetchRecords();
        });
        this.storeConfigCache.isEnabled(CommerceEnvironment.VATFeatureName).then(isVATEnabled => {
            this.VATEnabled = isVATEnabled;
        });
    }
    private fetchRecords() {
        this.processed = '';
        this.getOrderHistory();
    }
    private getOrderHistory() {
        this.loading = true;
        return this.orderService.getCurrentUserOrderHistory(this.pageNumber, this.pageSize).then(res => {
            this.activeOrders = [];
            for (const order of res.Order) {
                this.initializeOrderDetails(order);
            }
            this.orders = res.Order;
            this.total = res.recordSetTotal;
            this.loading = false;

        }).catch((error: any) => {
            this.errorMsg = this.storeUtils.handleErrorCase(error, 'Unable to get order history');

        });
    }

    private initializeOrderDetails(order: any) {
        return this.orderService.getOrderDetails(order.orderId).then(d => {
            order.orderDetails = d;
            order.orderDetails.Qty = 0;

            for (const item of d.orderItem) {
              order.orderDetails.Qty =
                order.orderDetails.Qty + Number(item.quantity);
            }
            this.productService.normalizeOrderItems(d.orderItem);
        }).catch((error: any) => {
            this.errorMsg = this.storeUtils.handleErrorCase(error, 'Error getting order details: %o');
        });
    }

    goToPage(n: number): void {
        this.pageNumber = n;
        this.fetchRecords();
    }

    onNext(): void {
        this.pageNumber++;
        this.fetchRecords();
    }

    onPrev(): void {
        this.pageNumber--;
        this.fetchRecords();
    }

    getOrderStatusDescription(orderStatus: string): string {
        this.orderStatus = CommerceEnvironment.order.orderStatus[orderStatus];
        return CommerceEnvironment.order.orderStatus[orderStatus];

    }
}
