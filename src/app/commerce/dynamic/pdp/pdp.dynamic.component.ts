import {
    LayoutComponent, RenderingContext, RenderingContextBinding, Category
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, AfterViewInit } from '@angular/core';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from "rxjs/Subscription";
import { Subject } from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';

import { Logger } from "angular2-logger/core";
import { ProductService } from "app/commerce/services/product.service";
import { InventoryavailabilityService } from "app/commerce/services/rest/transaction/inventoryavailability.service";
import { AssociatedPromotionCodeService } from "app/commerce/services/rest/transaction/associatedPromotionCode.service";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

import { Constants } from 'app/Constants';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { Meta } from '@angular/platform-browser';

import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
const sharelink = require('../../../../../images/icon-share-link.png');
const facebook = require('../../../../../images/icon-facebook.png');
const twitter = require('../../../../../images/icon-twitter.png');
const attachmentLink = require('../../../../images/attachments/usages/doc_icon.jpg');

import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from 'app/commerce/services/category.service';
import { filterNotNil } from 'ibm-wch-sdk-utils';
import { ProductCommonMixin } from 'app/commerce/components/generic/product-common/product-common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Router } from '@angular/router';
import { CartTransactionService } from '../../services/componentTransaction/cart.transaction.service';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { OrderTransactionService } from '../../services/componentTransaction/order.transaction.service';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { MenuService } from 'app/responsiveHeader/services/MenuService';

const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');

@Component({
    selector: 'app-dynamic-pdp-layout-component',
    templateUrl: './pdp.dynamic.html',
    preserveWhitespaces: false
})
export class DynamicPDPLayoutComponent extends ProductCommonMixin(class {}) implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
    parentCategory: string;
    productCtx: any;
    product: any;
    daTagCreated: boolean = false;
    productDetailSubscriptions: Subscription[] = [];
    slideshowConfig: any;
    slides: any[];
    reAnimate: boolean;
    displayAssets: boolean = false;
    displayAttachment: any[] = [];
    componentsSrc:Subject<any[]> = new AsyncSubject<any[]>();
    onComponents:Observable<any[]> = this.componentsSrc.asObservable();
    rcSubj:Subject<RenderingContext> = new ReplaySubject<RenderingContext>();
    onRenderingContext:Observable<RenderingContext> = this.rcSubj.asObservable();
    promotion: any[];
    onProduct:Observable<any>;
    pdpLayout: string="compressed";
    cartLink:string="";
    private readonly pdpLink: string;
    VATEnabled = false;
    private readonly wishlistLink: string;
    @ViewChild("newForm") newForm: NgForm;
    catSubj: Subject<Category> = new ReplaySubject<Category>();
    onAvailableServices: Observable<Category> = this.catSubj.asObservable();
    onAvailableServiceTypes : Observable<string[]>;
    serviceTypes: any[] = [];

    icon: any = {
        sharelink: sharelink,
        facebook: facebook,
        twitter: twitter,
        attachmentLink: attachmentLink
    };

    constructor(
        protected productService: ProductService,
        protected storefrontUtils: StorefrontUtils,
        protected logger: Logger,
        protected inventoryAvailability: InventoryavailabilityService,
        protected associatedPromotionCodeService: AssociatedPromotionCodeService,
        protected da: DigitalAnalyticsService,
        protected meta: Meta,
        protected categoryService: CategoryService,
        protected router: Router,
        protected cartTxnSvc: CartTransactionService,
        private storeConfigCache: StoreConfigurationsCache,
        protected orderTranSvc: OrderTransactionService,
        private authSvc: AuthenticationTransactionService,
        private menuService: MenuService
    ) {
        super();
        this.pdpLink=this.storefrontUtils.getPageLink(Constants.productDetailPageIdentifier);
        this.cartLink=this.storefrontUtils.getPageLink(Constants.shoppingCartPageIdentifier);
        this.wishlistLink = this.storefrontUtils.getPageLink(Constants.wishListPageIdentifier);
        this.signInLink = this.storefrontUtils.getPageLink(Constants.signInPageIdentifier);

        this.slideshowConfig =
        {
            'speed': 500, 'slidesToShow': 1, 'slidesToScroll': 1, 'dots': true, 'arrows': true,
            'customPaging': function (c, i) {
                var __thumb = c.$slides.eq(i).find('img').data('thumb') || '';
                return '<a id="pdpCarThumbId_'+i+'"><img src="' + __thumb + '"/></a>';
            },
            'responsive': [
                {
                    'breakpoint': 1024,
                    'settings': {
                        'customPaging': function (slider, i) {
                            return $('<button type="button" />').text(i + 1);
                        }
                    }
                }]
        };

        this.isGuest = StorefrontUtils.isGuestOrActingAs();
        if (!this.isGuest) {
            this.getWishLists();
        }

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
        this.productDetailSubscriptions.push(onAvailableServiceTypes.subscribe( service => { this.serviceTypes = service }));
    }

    ngOnInit() {
        this.id = uniqueId();
        this.productCtx = null;

        this.onProduct = this.onRenderingContext.pipe(
            filterNotNil(),
            pluck<any, any[]>('context', 'breadcrumb'),
            map( breadcrumb => breadcrumb[breadcrumb.length -1]),
            distinctUntilChanged(isEqual)
        );

        let subscription = this.onProduct.subscribe( productCtx => {
            if ($(`.wci_toolbar`).length) {
                $(`.wci_toolbar`).remove();
            }
            this.reAnimate = !!this.productCtx;
            this.productCtx = productCtx;
            let productId = this.storefrontUtils.getPropertyFromIdcContext(productCtx, 'identifier');
            this.getProduct(productId).then( product => {
                this.product = product;

                this.meta.updateTag({"name": "description", "content": productCtx.description});
                this.meta.updateTag({"name": "name" , "content": productCtx.name});

                let productParam: any = {
                    product: product,
                    category: this.getParentCategoryIdentifier(this.productCtx),
                    facet: this.da.analyticsFacet
                };
                this.da.viewProduct(productParam);
            }).catch( error => {
                this.storefrontUtils.gotoNotFound();
            })
        });
        this.productDetailSubscriptions.push(subscription);

        let resizeSub = Observable.fromEvent(window, 'resize')
        .debounceTime(100)
        .distinctUntilChanged()
        .subscribe((screen: any) => {
            let screenWidth = screen.target.innerWidth;
            this.onResize(screenWidth);
        });

        this.productDetailSubscriptions.push(resizeSub);
        let screenWidth = window.innerWidth;
        this.onResize(screenWidth);

        this.productDetailSubscriptions.push(
            this.menuService.preferredStore$.subscribe(() => {
                // when the preferred store is updated, re-trigger the inventory status by updating the onAttributeChange
                this.onAttributeChange();
            })
        );
    }

    ngAfterViewInit() {
        (<any>$(`#confirmationModal_${this.id}`)).foundation();
        (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation();
        (<any>$(`#${this.signInModelId}${this.id}`)).foundation();
        (<any>$(`#${this.newWishListModalId}_${this.id}`)).foundation();
        (<any>$(`#${this.storeLocatorModelId}${this.id}`)).foundation();
	}

    getProduct(productNumber): Promise<any> {
        this.productType = '';

        if (sessionStorage.getItem('currentUserCurrency')) {
            this.currency = sessionStorage.getItem('currentUserCurrency');
        } else {
            this.currency = this.storefrontUtils.commerceCurrency;
        }
        this.storeConfigCache.isEnabled(CommerceEnvironment.VATFeatureName).then(isVATEnabled => {
            this.VATEnabled = isVATEnabled;
        });

        return this.productService.findProductByPartNumber(productNumber, this.storefrontUtils.commerceStoreId, this.storefrontUtils.commerceCatalogId, this.currency, "catalogEntryView")
        .then((product:any) => {
            if (product.catalogEntryTypeCode == "ProductBean" || product.catalogEntryTypeCode == "PackageBean" || product.catalogEntryTypeCode == "BundleBean") {
                if (product.catalogEntryTypeCode == "PackageBean") {
                    this.productType = "package";
                    this.createCards(product.components, this.PRODUCT_CARD);
                }
                else if (product.catalogEntryTypeCode == "BundleBean") {
                    this.productType = "bundle";
                    this.createCards(product.components, this.COLLECTION_CARD);
                }
                return this.initializeProduct(product, this.inventoryAvailability, this.storefrontUtils);
            }
            else if (product.catalogEntryTypeCode == "ItemBean" && product.parentCatalogEntryID) {
                return this.productService.findProductByIds(this.storefrontUtils.commerceStoreId, product.parentCatalogEntryID, "catalogEntryView")
                .then((item: any) => {
                    return this.initializeProduct(item[0], this.inventoryAvailability, this.storefrontUtils, product.attributes);
                })
            }

        })
        .catch( e => {
            this.logger.error(this.storefrontUtils.handleErrorCase(e, 'Could not retrieve product'));
            this.storefrontUtils.gotoNotFound();
        })
    }

    getParentCategoryIdentifier(breadcrumbObj): string {
        let parentCategoryElements = breadcrumbObj.parentId.split('-');
        return parentCategoryElements.pop();
    }

    getSeoUrlByIds(products) : Promise<any> {
        let ids = [];
        for (let prod of products) {
            ids.push(prod.uniqueID);
        }
        return this.storefrontUtils.getPageSeoUrlByIds(ids, 'product');
    }

    createCards(items:any[],layout:string) {
        let buffer:any[]=[];
        this.getSeoUrlByIds(items)
        .then( urlIdMap => {
            for (let ctx of items) {
                let card = JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
                card.id=ctx.partNumber;
                card.productDesc=ctx;
                card.productDesc.seoUrl=urlIdMap['idc-product-'+ctx.uniqueID];
                card.selectedLayouts[0].layout.id=layout;
                card.layouts.default.template=layout;
                buffer.push(card);
            }
            this.componentsSrc.next(buffer);
            this.componentsSrc.complete();
        })
    }

    tbFn(index,ctx) {
        return `${index}_${ctx.id}`;
    }

    ngOnDestroy(){
        this.productDetailSubscriptions.forEach( sub => {
            sub.unsubscribe();
        });
        this.productDetailSubscriptions = [];
        this.productCtx = null;
        this.wishLists = [];

        ['confirmationModal_', this.addToWishListModelId, this.signInModelId, this.newWishListModalId, this.storeLocatorModelId]
        .forEach(mId=>{
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

    ngAfterViewChecked() {
        if (this.reAnimate && this.productCtx) {
            this.reAnimate = false;
            let a = document.getElementsByClassName("animated");
            for (let i = 0; i < a.length; ++i) {
                let e = a.item(i) as HTMLElement;
                e.classList.remove("fadeInUp");
                void e.offsetWidth;
            }
            for (let i = 0; i < a.length; ++i) {
                let e = a.item(i);
                e.classList.add("fadeInUp");
            }
        }
    }

    scroll(el): void {
        var element = document.getElementById(el);
        element.scrollIntoView();
    }

    extraAssetWork(prod:any) {
        this.getPromotion(prod.uniqueID);
        this.associatedAsset(prod.attachments);
        if (this.currentSelection.sku.attachments) {
            this.generateSlides(this.currentSelection.sku.attachments);
        }
    }

    associatedAsset(attachments: any[]): void {
        if (attachments) {
            const excludeUsage: Set<string> = new Set<string>(['ANGLEIMAGES_THUMBNAIL', 'ANGLEIMAGES_FULLIMAGE', 'ANGLEIMAGES_HDIMAGE', 'IMAGE_SIZE_55', 'IMAGE_SIZE_40', 'IMAGE_SIZE_330', 'IMAGE_SIZE_1000', 'SWATCH_IMAGE', 'images_', 'attachments_thumbnail']);
            for (let a of attachments) {
                if (a.usage && !excludeUsage.has(a.usage) && !a.usage.startsWith('images_')) {
                    this.displayAssets = true;
                    if (Constants['DOMAIN_NAME']) {
                        a.attachmentAssetPath = a.attachmentAssetPath.replace('/store/0/storeAsset?assetPath=', `${Constants.PROTOCOL}//${Constants['DOMAIN_NAME']}`)
                    }
                    else {
                        a.attachmentAssetPath = a.attachmentAssetPath.replace('/store/0/storeAsset?assetPath=', "");
                    }
                    a.usage = (a.usage == "USERMANUAL" ? "User Manual" : a.usage.toLowerCase());
                    this.displayAttachment.push(a);
                }
            }
        }
    }

    getPromotion(productId) {
        this.associatedPromotionCodeService.findPromotionsByProduct({ "storeId": this.storefrontUtils.commerceStoreId, "q": 'byProduct', "qProductId": productId }).toPromise().then(res => {
            if (res.body.associatedPromotions) {
                for (let promo of res.body.associatedPromotions) {
                    if (promo.description)
                        this.promotion = promo.description.shortDescription;
                }
            }
        }).catch(
            e => {
                return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
            }
        );
    }

    extraSlideWork() {
        delete this.slides;
        if (this.currentSelection.sku.attachments)
            this.generateSlides(this.currentSelection.sku.attachments);
    }

    showCreateModal() {
        this.newForm.reset();
        super.showCreateModal();
    }

    generateSlides(attachments: any[]) {
        let b: boolean = false;
        let r: any[] = [];
        let s: any;
        let m: Map<String, any> = new Map<String, any>();
        let o: any;
        let k: string;

        for (let a of attachments) {
            if (a.usage === "ANGLEIMAGES_FULLIMAGE" || a.usage === "ANGLEIMAGES_THUMBNAIL") {
                k = a.identifier.replace(/_(thumbnail|fullimage)$/i, "");
                o = m.get(k);
                if (!o) {
                    o = JSON.parse(JSON.stringify({ thumb: "", full: "" }));
                    m.set(k, o);
                }

                if (a.usage === "ANGLEIMAGES_THUMBNAIL") {
                    o.thumb = a.attachmentAssetPath;
                } else {
                    o.full = a.attachmentAssetPath;
                }
                if (o.full && o.thumb) {
                    s = JSON.parse(JSON.stringify(CommerceEnvironment.productImageSkeleton));
                    s.id = `${k}_${r.length}`;
                    s.selectedLayouts[0].layout.id = s.layouts.default.template = this.getLayoutId();
                    s.images = o;
                    r.push(s);
                }
            }
        }

        this.currentSelection.isAngleImage = (r.length > 1);
        this.slides = r;
        m.clear();
    }

    getInvSvc():InventoryavailabilityService { return this.inventoryAvailability; }

    getStoreUtils():StorefrontUtils { return this.storefrontUtils; }

    setLayout(l: string) { this.pdpLayout = l; }

    getDASvc():DigitalAnalyticsService { return this.da; }

    getCartSvc():CartTransactionService { return this.cartTxnSvc; }

    getLogger():Logger { return this.logger; }

    getRouter():Router { return this.router; }

    getCartLink():string { return this.cartLink; }

    getOrderSvc(): OrderTransactionService { return this.orderTranSvc; }

    getAuthSvc(): AuthenticationTransactionService { return this.authSvc; }

    getWishListLink():string { return this.wishlistLink; }
}