/*******************************************************************************
 * product.component.ts
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

import {
    ActivePageService
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypeProductComponent } from './../../product/typeProductComponent';
import { Logger } from 'angular2-logger/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ProductService } from 'app/commerce/services/product.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Constants } from 'app/Constants';
import { InventoryavailabilityService } from '../../../services/rest/transaction/inventoryavailability.service';
import { DigitalAnalyticsService } from '../../../services/digitalAnalytics.service';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { CategoryService } from 'app/commerce/services/category.service';
import { ProductCommonMixin } from '../product-common/product-common';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { CommerceEnvironment } from "../../../commerce.environment";
import { OrderTransactionService } from '../../../services/componentTransaction/order.transaction.service';
import { AssociatedPromotionCodeService } from '../../../services/rest/transaction/associatedPromotionCode.service';
import { AuthenticationTransactionService } from '../../../services/componentTransaction/authentication.transaction.service';
import { Title, Meta } from '@angular/platform-browser';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/shareReplay';
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filterNotNil, shareLast } from "ibm-wch-sdk-utils";

const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');
const isEmpty = require('lodash/isEmpty');

@Component({
    selector: 'app-product-component',
    template: ``
})
export class ProductComponent extends ProductCommonMixin(TypeProductComponent) implements OnInit, OnDestroy {
    readonly pageLink: string;
    readonly cartLink: string;

    ctx: any;
    click: Subscription;
    productName: string;
    productInBreadcrumb: any;
    categoryInBreadcrumb: any;
    paramSub: Subscription;
    subscriptions: Subscription[] = [];
    extraUrlParam = '';
    pageName = '';
    VATEnabled = false;
    private readonly wishlistLink: string;
    onCategoryId: Observable<any>;
    categoryId: number;

    constructor(
        protected productService: ProductService,
        protected recSvc: RecommendationService,
        protected storefrontUtils: StorefrontUtils,
        protected cartTransactionService: CartTransactionService,
        protected logger: Logger,
        protected router: Router,
        protected inventoryAvailability: InventoryavailabilityService,
        protected associatedPromotionCodeService: AssociatedPromotionCodeService,
        protected title: Title,
        protected da: DigitalAnalyticsService,
        protected breadcrumbService: BreadcrumbService,
        protected activePageService: ActivePageService,
        protected meta: Meta,
        protected categoryService: CategoryService,
        private storeConfigCache: StoreConfigurationsCache,
        private orderTranService: OrderTransactionService,
        protected authSvc: AuthenticationTransactionService
    ) {
        super();
        this.pageLink = this.storefrontUtils.getPageLink(Constants.productDetailPageIdentifier);
        this.cartLink = this.storefrontUtils.getPageLink(Constants.shoppingCartPageIdentifier);
        this.wishlistLink = this.storefrontUtils.getPageLink(Constants.wishListPageIdentifier);
        this.signInLink = this.storefrontUtils.getPageLink(Constants.signInPageIdentifier);

        const pageOnRenderingContext: Observable<any> =
            this.activePageService.onRenderingContext
            .filter(Boolean)
            .pluck('name')
            .debounceTime(500);

        const pageRc = pageOnRenderingContext.subscribe( pageName => {
            this.pageName = pageName;
        });

        this.subscriptions.push(pageRc);

        // get the context of current page
        try {
            const onCurrentPage = this.activePageService.onRenderingContext.pipe(
                filterNotNil(),
                pluck<any, any[]>('context', 'breadcrumb'),
                map(breadcrumb => breadcrumb[breadcrumb.length - 1])
            );

            // get id of current categorypage
            this.onCategoryId = onCurrentPage.pipe(
                filterNotNil(),
                pluck<any, any>('externalContext'),
                filterNotNil(),
                shareLast(),
                pluck<any, any>('identifier'),
                distinctUntilChanged(isEqual)
            );

            let catIdSubscription = this.onCategoryId.subscribe( identifier => {
                this.breadcrumbService.getCategoryByIdentifier(identifier).then(categoryInfo => {
                    if (typeof categoryInfo !== 'undefined') {
                        this.categoryId = categoryInfo.uniqueID;
                    }
                });
            });

            this.subscriptions.push(catIdSubscription);
        }
        catch (e) {
            console.log("Failed to get the context of current page", e);
        }

        const parentCatSub = this.breadcrumbService.directParentCategory$.subscribe( cat => {
            this.parentCategoryIdentifier = cat.identifier;
        });
        this.subscriptions.push(parentCatSub);
    }

    ngOnInit() {
        super.ngOnInit();
        this.id = uniqueId();

        if (sessionStorage.getItem('currentUserCurrency')) {
            this.currency = sessionStorage.getItem('currentUserCurrency');
        } else {
            this.currency = this.storefrontUtils.commerceCurrency;
        }

        this.storeConfigCache.isEnabled(CommerceEnvironment.VATFeatureName).then(isVATEnabled => {
            this.VATEnabled = isVATEnabled;
        });

        const prod: Observable<any> = this.onRenderingContext
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .map(rc => Object.keys(rc).filter(k => this.VALID_PROPERTIES.includes(k)).reduce((o, k) => {o[k] = rc[k]; return o; }, {}))
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .shareReplay(1);

        this.safeSubscribe(prod, /* istanbul ignore next */(filteredProd) => {
            this.ctx = filteredProd;
            this.productName = this.ctx.productInternal;
            if (this.productName) {
                this.productService.findProductByPartNumber(this.productName, this.storefrontUtils.commerceStoreId, this.storefrontUtils.commerceCatalogId, this.currency, this.getFields())
                    .then((p: any) => this.initializeProduct(p, this.needInventoryService(), this.storefrontUtils))
                    .catch((e: any) => this.logger.warn('Error getting product: %o', e));
            } else if (this.ctx.productDesc) {
                this.initializeProduct(this.ctx.productDesc, this.needInventoryService(), this.storefrontUtils);
                if (this.product.parentCatalogGroupID !== undefined) {
                    for (let parentCat of this.product.parentCatalogGroupID) {
                        if (parentCat.includes(this.storefrontUtils.commerceCatalogId)) {
                            parentCat = parentCat.replace(this.storefrontUtils.commerceCatalogId+'_', '');
                            this.categoryId = parentCat;
                        }
                    }
                }
            }
        });

        let resizeSub = Observable.fromEvent(window, 'resize')
        .debounceTime(100)
        .distinctUntilChanged()
        .subscribe((screen: any) => {
            let screenWidth = screen.target.innerWidth;
            this.onResize(screenWidth);
        });

        this.subscriptions.push(resizeSub);
        let screenWidth = window.innerWidth;
        this.onResize(screenWidth);
    }

    needInventoryService(): InventoryavailabilityService {
        return this.isInventoryServiceRequired() ? this.inventoryAvailability : null;
    }

    onClick() {
        this.informMarketingOfClick();
        if (this.hasESpotRule()) {
            this.da.clearAnalyticsFacet();
            this.da.sendESpotTag(this.ctx, this.pageName);
        }
    }

    hasESpotRule() {
        return this.ctx.eSpotDescInternal && !isEmpty(this.ctx.eSpotDescInternal);
    }

    informMarketingOfClick() {
        if (this.ctx.eSpotDescInternal && !isEmpty(this.ctx.eSpotDescInternal)) {
            this.click = this.recSvc.performClickEvent(this.ctx.eSpotInternal, this.ctx.eSpotDescInternal).subscribe();
        }
    }

    ngOnDestroy() {
        if (this.click) {
            this.click.unsubscribe();
        }
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];

        /** clear wishlists */
        this.wishLists = [];

        /** close all modal */
        ['confirmationModal_', this.addToWishListModelId, this.signInModelId, this.newWishListModalId+'_', this.storeLocatorModelId].forEach(mId=>{
            const obj=(<any>$(`#${mId}${this.id}`))
            if (obj.length > 0) {
                if (typeof obj.foundation === 'function') {
                    obj.foundation('close');
                    obj.foundation('_destroy');
                }
                obj.remove();
            }
        });
    }

    getFields():string { return null; }

    getInvSvc():InventoryavailabilityService { return this.inventoryAvailability; }

    getStoreUtils():StorefrontUtils { return this.storefrontUtils; }

    getDASvc():DigitalAnalyticsService { return this.da; }

    getCartSvc():CartTransactionService { return this.cartTransactionService; }

    getLogger():Logger { return this.logger; }

    getRouter():Router { return this.router; }

    getCartLink():string { return this.cartLink; }

    getOrderSvc():OrderTransactionService { return this.orderTranService; }

    getWishListLink():string { return this.wishlistLink; }

    isInventoryServiceRequired():boolean { return false; }

    goToRegistrationPage(){
        this.router.navigate( [this.signInLink] );
    }

    getAuthSvc(): AuthenticationTransactionService { return this.authSvc; }
}
