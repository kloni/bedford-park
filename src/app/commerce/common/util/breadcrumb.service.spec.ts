import { BreadcrumbService } from "app/commerce/common/util/breadcrumb.service";
import { async, TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { CategoryService } from "app/commerce/services/category.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { ProductService } from "app/commerce/services/product.service";
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import { ActivePageService } from "ibm-wch-sdk-ng";
import { Logger } from "angular2-logger/core";
import { CommonTestModule } from "app/commerce/common/common.test.module";


declare var __karma__: any;

describe('BreadcrumbService', () => {

    let breadcrumbService: BreadcrumbService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [  CommonTestModule,
                        HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
            ],
            providers: [
				BreadcrumbService,
                CategoryService,
                CategoryViewService,
                ProductService,
                ProductViewService,
                ActivePageService,
                Logger
            ]
        });
	}));

	beforeEach(inject([BreadcrumbService], (_breadcrumbService : BreadcrumbService) => {
        breadcrumbService = _breadcrumbService;

        __karma__.config.testGroup = "";
    }));

    it('should instantiate', () => {
        expect(breadcrumbService).toEqual(jasmine.any(BreadcrumbService));
    });

    it('should get breadcrumb trail by category', (done) => {
        breadcrumbService.getBreadcrumbTrail('Home Furnishings').then(res => {
            expect(res[0][0].label).toBe("Home & Furnishing");
            done();
        });
    });

    it('should get category by identifer', (done) => {
        breadcrumbService.getCategoryByIdentifier('Home Furnishings').then(res => {
            expect(res.name).toBe("Home & Furnishing");
            done();
        });
    });

    it('should get category by unique id', (done) => {
        breadcrumbService.getCategoryByUniqueId('9').then(res => {
            expect(res.name).toBe("Home & Furnishing");
            done();
        });
    });

    it('should get product by part number', (done) => {
        breadcrumbService.getProductByPartNumber('HFU032_3201').then(res => {
            expect(res.name).toBe("StyleHome Modern Rimmed 3 Piece Sofa Set");
            done();
        });
    });
});

describe('BreadcrumbService - Error Case', () => {

    let breadcrumbService: BreadcrumbService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [ CommonTestModule, HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
            ],
            providers: [
				BreadcrumbService,
                CategoryService,
                CategoryViewService,
                ProductService,
                ProductViewService,
                ActivePageService,
                Logger
            ]
        });
	}));

	beforeEach(inject([BreadcrumbService], (_breadcrumbService : BreadcrumbService) => {
        breadcrumbService = _breadcrumbService;

        __karma__.config.testGroup = "";
    }));

    it('should NOT get breadcrumb trail by INVALID category', (done) => {
        __karma__.config.testGroup = "invalidCategory";

        breadcrumbService.getBreadcrumbTrail('Wrong Home Furnishings').then(res => {
            expect(res.body).toBeNull();
            expect(res.url).toBeNull();
            done();
        });
    });

    it('should NOT get category by INVALID category identifer', (done) => {
        __karma__.config.testGroup = "invalidCategory";

        breadcrumbService.getCategoryByIdentifier('Wrong Home Furnishings').then(res => {
            expect(res).toBeUndefined();
            done();
        });
    });

    it('should NOT get category by BLANK category identifer', (done) => {
        __karma__.config.testGroup = "blankCategory";

        breadcrumbService.getCategoryByIdentifier('blankString').then(res => {
            expect(res.body).toBeNull();
            expect(res.url).toBeNull();
            done();
        });
    });

    it('should NOT get category by INVALID category unique id', (done) => {
        __karma__.config.testGroup = "invalidCategory";

        breadcrumbService.getCategoryByUniqueId('0').then(res => {
            expect(res).toBeUndefined();
            done();
        });
    });

    it('should NOT get product by INVALID product part number', (done) => {
        __karma__.config.testGroup = "invalidProduct";

        breadcrumbService.getProductByPartNumber('a').then(res => {
            expect(res).toBeUndefined();
            done();
        });
    });

    it('should NOT get product by BLANK product part number', (done) => {
        __karma__.config.testGroup = "blankProduct";

        breadcrumbService.getProductByPartNumber('').then(res => {
            expect(res.body).toBeNull();
            expect(res.url).toBeNull();
            done();
        });
    });
});
