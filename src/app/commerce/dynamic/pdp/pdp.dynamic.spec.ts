import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { DynamicPDPLayoutComponent } from './pdp.dynamic.component';
import { Logger } from "angular2-logger/core";
import { InventoryavailabilityService } from "app/commerce/services/rest/transaction/inventoryavailability.service";
import { AssociatedPromotionCodeService } from "app/commerce/services/rest/transaction/associatedPromotionCode.service";
import { HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from 'app/commerce/services/product.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { OrderTransactionService } from "app/commerce/services/componentTransaction/order.transaction.service";

import { Subscription } from "rxjs/Subscription";
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommerceModule } from 'app/commerce/commerce.module';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { Constants } from 'app/Constants';
import { MockRouter } from 'mocks/angular-class/router';
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { CategoryViewService } from 'app/commerce/services/rest/search/categoryView.service';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CarouselComponent } from 'app/components/generic/carousel/carousel.component';
import { WchSlickModule } from 'app/components/generic/carousel/wch-slick/wch-slick.module';
import { WchNgComponentsModule } from 'ibm-wch-sdk-ng';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('DynamicPDPLayoutComponent', () => {

    let component: DynamicPDPLayoutComponent;
    let fixture: ComponentFixture<DynamicPDPLayoutComponent>;
    let httpMock: HttpTestingController;
    let pSvc: ProductService;
    let cartTransactionService: CartTransactionService;
    let storefrontUtils: StorefrontUtils;
    let inv: InventoryavailabilityService;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;
    let ngAfterViewInitSpy;

    let orderTranSvc: OrderTransactionService;
    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicPDPLayoutComponent,CarouselComponent],
            imports: [
                HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                CommonTestModule,
                CommercePipesModule,
                WchSlickModule,
                WchNgComponentsModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                Logger,
                InventoryavailabilityService,
                AssociatedPromotionCodeService,
                OrderTransactionService,
                { provide: ActivatedRoute, useValue: { queryParamMap: Observable.of(convertToParamMap({ productNumber: "" })) } },
                { provide: Router, useClass: MockRouter }
            ]
        });
    });

    beforeEach(async(inject([ProductService,StorefrontUtils,InventoryavailabilityService],
        (_pSvc: ProductService,_storeUtils:StorefrontUtils,_inv:InventoryavailabilityService) => {
        __karma__.config.testGroup = '';
        pSvc = _pSvc;
        storefrontUtils = _storeUtils;
        inv = _inv;
        mockRouter = TestBed.get(Router);
        da = TestBed.get(DigitalAnalyticsService);
        fixture = TestBed.createComponent(DynamicPDPLayoutComponent);
        cartTransactionService = TestBed.get(OrderTransactionService);
        component = fixture.componentInstance;
        ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
        fixture.detectChanges();
    })));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should get product', (done) => {
        component.getProduct('AuroraWMDRS-1');
        done();
    });

    xit('should call Digital Analytics Service when viewing product', (done) => {
        let daSpy = spyOn(da, 'viewProduct');
        setTimeout(function(){
            expect(da.viewProduct).toHaveBeenCalled();
            done();
        }, 2000);
    });

    it('should get item', (done) => {
        component.getProduct('AuroraWMDRS-001');
        done();
    });

    // getProduct used to accept PartNumber, now it's product ID
    it('should get bundle', (done) => {
        component.getProduct('BCL014_1417');
        setTimeout(function () {
            expect(component.productType).toEqual('bundle');
            done();
        }, 200);
    });

    // getProduct used to accept PartNumber, now it's product ID
    it('should get kit', (done) => {
        component.getProduct('HTA029_2932');
        setTimeout(function () {
            expect(component.productType).toEqual('package');
            done();
        }, 200);
    });

    it('should go to page not found', (done) => {
        component.getProduct('BCL014_1417777');
        setTimeout(function () {
            expect(mockRouter.navigate).toHaveBeenCalledWith([Constants.PAGE_NOT_FOUND_PATH], { skipLocationChange: true });
            done();
        }, 100);
    });

    it("should be able to resolve skus", (done) => {
        pSvc.findProductByPartNumber("AuroraWMDRS-1", storefrontUtils.commerceStoreId, storefrontUtils.commerceCatalogId).then((r) => {
            component.currentSelection.sku = r.sKUs[0];
            component.currentSelection.selectedAttributes = {};
            for (let att of component.currentSelection.sku.attributes) {
                component.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
            }
            component.resolveSKU(r.sKUs, component.currentSelection.selectedAttributes);
            component.addToCart();
            done();
        });
    });

    it("should be able to handle attribute change", (done) => {
        pSvc.findProductByPartNumber("AuroraWMDRS-25", storefrontUtils.commerceStoreId, storefrontUtils.commerceCatalogId).then((r) => {
            component.product = r;
            component.currentSelection.sku = r.sKUs[0];
            component.currentSelection.selectedAttributes = {};
            for (let att of component.currentSelection.sku.attributes) {
                component.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
            }
            component.onAttributeChange();
            done();
        });
    });

    it("should be able to initialize a sku", (done) => {
        pSvc.findProductByPartNumber("AuroraWMDRS-001", storefrontUtils.commerceStoreId, storefrontUtils.commerceCatalogId).then((r) => {
            component.initializeProduct(r,inv,storefrontUtils);
            done();
        });
    });


  it("should be able to get wishlist ", (done) => {
    component.getWishLists();
    setTimeout(function () {
      expect(component.wishLists.length).toBeGreaterThanOrEqual(1);
      done();
    }, 200);
  });

  xit("should be able to add to wishlist ", (done) => {
    component.addToWishList('10007').then(res => {
        done();
    });
  });

  it("should log in successfully", (done) => {

    component.login().then(res => {
        expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
        done();
    });
 });

});

describe('DynamicPDPLayoutComponent- Without partnumber', () => {

    let component: DynamicPDPLayoutComponent;
    let fixture: ComponentFixture<DynamicPDPLayoutComponent>;
    let httpMock: HttpTestingController;
    let pSvc: ProductService;
    let cartTransactionService: CartTransactionService;
    let mockRouter: Router;
    let ngAfterViewInitSpy;

    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicPDPLayoutComponent,CarouselComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                CommonTestModule,
                CommercePipesModule,
                WchSlickModule,
                WchNgComponentsModule
            ],
            providers: [
                Logger,
                InventoryavailabilityService,
                AssociatedPromotionCodeService,
                { provide: ActivatedRoute, useValue: { queryParamMap: Observable.of(convertToParamMap({})) } },
                { provide: Router, useClass: MockRouter }
            ]
        });
    });


    beforeEach(async(inject([ProductService], (_pSvc: ProductService) => {
        __karma__.config.testGroup = '';
        pSvc = _pSvc;
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(DynamicPDPLayoutComponent);
        component = fixture.componentInstance;
        ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
        fixture.detectChanges();
        mockRouter.initialNavigation();
    })));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });
})
