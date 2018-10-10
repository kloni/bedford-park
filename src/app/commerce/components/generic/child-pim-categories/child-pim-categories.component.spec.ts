import { ChildPimCategoriesComponent } from "app/commerce/components/generic/child-pim-categories/child-pim-categories.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { CategoryService } from "app/commerce/services/category.service";
import { ActivePageService } from "ibm-wch-sdk-ng";
import { Logger } from "angular2-logger/core";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { Constants } from "app/Constants";
import { HttpTestingController } from "@angular/common/http/testing";
import { Observable } from "rxjs/Observable";
import { MockRouter } from "mocks/angular-class/router";
import { MockActivatedRoute } from "mocks/angular-class/activated-route";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from "app/commerce/services/digitalAnalytics.service";

declare var __karma__: any;

describe('ChildPimCategoriesComponent', () => {

    let component: ChildPimCategoriesComponent;
    let fixture: ComponentFixture<ChildPimCategoriesComponent>;
    let da: DigitalAnalyticsService;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ChildPimCategoriesComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CategoryViewService,
                CategoryService,
                ActivePageService,
                Logger
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        da = TestBed.get(DigitalAnalyticsService);
        fixture = TestBed.createComponent(ChildPimCategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should generate lists', (done) => {
        let spy = spyOn(component, 'getSeoUrls').and.returnValue(Promise.resolve({
            'idc-category-Girls': '/seoUrl/girls'
        }));
        component._title = "All {name}";
        component.fetchChildCatList('Apparel').then(res => {
            component.generateLists(res).then(()=>{
                expect(spy).toHaveBeenCalled();
                expect(component.lists.length).toBe(4);
                expect(component.lists[0].id).toBe('Girls');
                expect(component.lists[0].categoryInternal.seoUrl).toBe('/seoUrl/girls');
                expect(component.lists[1].id).toBe('Boys');
                expect(component.lists[2].id).toBe('Women');
                expect(component.lists[3].id).toBe('Men');
                done();
            });
        });
    });

    it('should fetch child (sub) category list by category identifier', async(() => {
        component._title = "All {name}";
        component.fetchChildCatList('Apparel').then(res => {
            expect(res.length).toBe(4);
            expect(res[0].identifier).toBe('Girls');
            expect(res[1].identifier).toBe('Boys');
            expect(res[2].identifier).toBe('Women');
            expect(res[3].identifier).toBe('Men');
        });
    }));

    it('should get subcategories by category identifier and get current category heading', (done) => {
        component._title = "All {name}";
        component.getSubCategories('Apparel').then(res => {
            expect(res.length).toBe(4);
            expect(res[0].identifier).toBe('Girls');
            expect(res[1].identifier).toBe('Boys');
            expect(res[2].identifier).toBe('Women');
            expect(res[3].identifier).toBe('Men');
            expect(component.categoryTitle).toBe('All Apparel');
            done();
        });
    });

    it('should call digital analytic service when loading department/category page', () => {
        let daSpy = spyOn(da, 'viewPage');
        setTimeout(function(){
            expect(da.viewPage).toHaveBeenCalled();
        }, 2000);
    });
});

describe('ChildPimCategoriesComponent - Error Case', () => {

    let component: ChildPimCategoriesComponent;
    let fixture: ComponentFixture<ChildPimCategoriesComponent>;
    let httpMock: HttpTestingController;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ChildPimCategoriesComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CategoryViewService,
                CategoryService,
                ActivePageService,
                Logger,
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: Observable.from([MockActivatedRoute]) },
                },
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(ChildPimCategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockRouter.initialNavigation();
    }));

    it('should NOT get any subcategories because it is leaf category (Product Listing Page)', (done) => {
        component.getSubCategories('Furniture').then(res => {
            expect(res).toBeUndefined();
            done();
        });
    });

    it('should NOT generate lists due to invalid category identifier', (done) => {
        __karma__.config.testGroup = 'invalidCategory';
        component._title = "All {name}";
        component.fetchChildCatList('Wrong-Home-Furnishings').then(res => {
            expect(res).toBeUndefined();
            expect(component.lists).toEqual([]);
            done();
        });
    });

    it('should NOT fetch child (sub) category list due to invalid category identifier', (done) => {
        __karma__.config.testGroup = 'invalidCategory';
        component._title = "All {name}";
        component.fetchChildCatList('Wrong-Apparel').then(res => {
            expect(res).toBeUndefined();
            done();
        });
    });

    it('should NOT get subcategories due to invalid category identifier and get EMPTY current category heading', (done) => {
        __karma__.config.testGroup = 'invalidCategory';
        component._title = "All {name}";
        component.getSubCategories('Wrong-Apparel').then(res => {
            expect(res).toBeUndefined();
            expect(component.categoryTitle).toBe('');
            done();
        });
    });

    it('should NOT get subcategories due to non-existent response', (done) => {
        __karma__.config.testGroup = 'nonExistentResponse';
        component._title = "All {name}";
        component.getSubCategories('Home-Furnishings').then(res => {
            expect(res).toBeUndefined();
            expect(component.errorMessage).toBe('Could not retrieve category');
            done();
        });
    });
});