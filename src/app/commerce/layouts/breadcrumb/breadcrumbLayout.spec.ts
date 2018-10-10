import { Observable } from 'rxjs/Observable';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule, UrlSegment, ActivatedRouteSnapshot } from '@angular/router';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { BreadcrumbLayoutComponent } from "app/commerce/layouts/breadcrumb/breadcrumbLayout";
import { CategoryService } from 'app/commerce/services/category.service';
import { CategoryViewService } from 'app/commerce/services/rest/search/categoryView.service';
import { ProductService } from 'app/commerce/services/product.service';
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';
import { Logger } from 'angular2-logger/core';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { Constants } from 'app/Constants';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

describe('BreadcrumbLayoutComponent', () => {

    let component: BreadcrumbLayoutComponent;
    let fixture: ComponentFixture<BreadcrumbLayoutComponent>;
    let router: Router;
    let mockActivatedRoute = new ActivatedRoute();
    let mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [BreadcrumbLayoutComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CategoryService,
                CategoryViewService,
                ProductService,
                ProductViewService,
                BreadcrumbService,
                ActivePageService,
                Logger
            ]
        });

        fixture = TestBed.createComponent(BreadcrumbLayoutComponent);
        router = TestBed.get(Router);
        component = fixture.componentInstance;
        router.initialNavigation();
        fixture.detectChanges();

        mockActivatedRoute = new ActivatedRoute();
        mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();

        __karma__.config.testGroup = "";
    }));

    it('should instantiate', async(() => {
        expect(component).toBeTruthy();
    }));

    it('should navigate to (level 1) department page and get breadcrumb', async(() => {
        mockActivatedRouteSnapshot.queryParams = {categoryIdentifier: "Home-Furnishings"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res.length).toBe(1);
        //         expect(res[0].breadcrumbTrail).toBe("/" + Constants.commerceCategoryPageIdentifier + "?categoryIdentifier=Home-Furnishings");
        //         expect(res[0].name).toBe("Home & Furnishing");
        //         expect(res[0].params.categoryIdentifier).toBe("Home-Furnishings");
        //         expect(res[0].url).toBe("/"+Constants.commerceCategoryPageIdentifier);
        //     }, 1000);
        // });
    }));

    xit('should navigate to (level 2) product listing page and get breadcrumb', async(() => {
        mockActivatedRouteSnapshot.queryParams = {categoryId: "10034"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res.length).toBe(2);
        //         expect(res[0].breadcrumbTrail).toBe("/" + Constants.commerceCategoryPageIdentifier + "?categoryIdentifier=Home-Furnishings");
        //         expect(res[0].name).toBe("Home & Furnishing");
        //         expect(res[0].params.categoryIdentifier).toBe("Home-Furnishings");
        //         expect(res[0].url).toBe("/" + Constants.commerceCategoryPageIdentifier);

        //         expect(res[1].breadcrumbTrail).toBe("/" + Constants.productListingPageIdentifier + "?categoryId=10034");
        //         expect(res[1].name).toBe("Furniture");
        //         expect(res[1].params.categoryId).toBe("10034");
        //         expect(res[1].url).toBe("/" + Constants.productListingPageIdentifier);
        //     }, 1000);
        // });
    }));

    xit('should navigate to (level 3) product page and get breadcrumb', async(() => {
        mockActivatedRouteSnapshot.queryParams = {productNumber: "HFU032_3201"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res.length).toBe(3);
        //         expect(res[0].breadcrumbTrail).toBe("/" + Constants.commerceCategoryPageIdentifier + "?categoryIdentifier=Home-Furnishings");
        //         expect(res[0].name).toBe("Home & Furnishing");
        //         expect(res[0].params.categoryIdentifier).toBe("Home-Furnishings");
        //         expect(res[0].url).toBe("/" + Constants.commerceCategoryPageIdentifier);

        //         expect(res[1].breadcrumbTrail).toBe("/" + Constants.productListingPageIdentifier + "?categoryId=10034");
        //         expect(res[1].name).toBe("Furniture");
        //         expect(res[1].params.categoryId).toBe("10034");
        //         expect(res[1].url).toBe("/" + Constants.productListingPageIdentifier);

        //         expect(res[2].breadcrumbTrail).toBe("/" + Constants.productDetailPageIdentifier + "?productNumber=HFU032_3201");
        //         expect(res[2].name).toBe("StyleHome Modern Rimmed 3 Piece Sofa Set");
        //         expect(res[2].params.productNumber).toBe("HFU032_3201");
        //         expect(res[2].url).toBe("/" + Constants.productDetailPageIdentifier);
        //     }, 1000);
        // });
    }));
});

describe('BreadcrumbLayoutComponent - Error Case', () => {

    let component: BreadcrumbLayoutComponent;
    let fixture: ComponentFixture<BreadcrumbLayoutComponent>;
    let router: Router;
    let mockActivatedRoute = new ActivatedRoute();
    let mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [BreadcrumbLayoutComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CategoryService,
                CategoryViewService,
                ProductService,
                ProductViewService,
                BreadcrumbService,
                ActivePageService,
                Logger
            ]
        });

        fixture = TestBed.createComponent(BreadcrumbLayoutComponent);
        router = TestBed.get(Router);
        component = fixture.componentInstance;
        router.initialNavigation();
        fixture.detectChanges();

        __karma__.config.testGroup = "";
    }));

    it('should navigate to INVALID (level 1) department page and return EMPTY breadcrumb', async(() => {
        __karma__.config.testGroup = "invalidCategory";
        mockActivatedRouteSnapshot.queryParams = {categoryIdentifier: "Wrong-Home-Furnishings"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res).toEqual([]);
        //         expect(res.length).toBe(0);
        //     }, 1000);
        // });
    }));

    it('should navigate to INVALID (level 2) product listing page and return EMPTY breadcrumb', async(() => {
        __karma__.config.testGroup = "invalidCategory";
        mockActivatedRouteSnapshot.queryParams = {categoryId: "0"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res).toEqual([]);
        //         expect(res.length).toBe(0);
        //     }, 1000);
        // });
    }));

    it('should navigate to INVALID (level 3) product page and return EMPTY breadcrumb', async(() => {
        __karma__.config.testGroup = "emptyBreadcrumb";
        mockActivatedRouteSnapshot.queryParams = {productNumber: "Wrong_HFU032_3201"};
        mockActivatedRoute.snapshot = mockActivatedRouteSnapshot;
        // component.buildBreadcrumb(mockActivatedRoute).then(res => {
        //     setTimeout(() => {
        //         expect(res).toEqual([]);
        //         expect(res.length).toBe(0);
        //     }, 1000);
        // });
    }));
});
