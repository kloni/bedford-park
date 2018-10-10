import { CategoryRecommendationListComponent } from "app/commerce/components/generic/category-recommendation-list/category-recommendation-list.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { ESpotService } from "app/commerce/services/rest/transaction/eSpot.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { CategoryService } from "app/commerce/services/category.service";
import { ActivePageService } from "ibm-wch-sdk-ng";
import { Logger } from "angular2-logger/core";
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

describe('CategoryRecommendationListComponent', () => {

    let component: CategoryRecommendationListComponent;
    let fixture: ComponentFixture<CategoryRecommendationListComponent>;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CategoryRecommendationListComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                Logger
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(CategoryRecommendationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should generate lists', (done) => {
        __karma__.config.testGroup = 'stockholmCatalog';
        let categoryIds: string[] = ['10505', '10506'];
        component.fetchCatList(categoryIds).then(res => {
            component.generateLists(res);
            expect(component.lists.length).toBe(2);
            expect(component.lists[0].id).toBe('DiningRoom');
            expect(component.lists[1].id).toBe('DiningTables');
            done();
        });
    });

    it('should fetch category list by input list of category identifiers', (done) => {
        __karma__.config.testGroup = 'stockholmCatalog';
        let categoryIds: string[] = ['10505', '10506'];
        component.fetchCatList(categoryIds).then(res => {
            expect(res.length).toBe(2);
            expect(res[0].identifier).toBe('DiningRoom');
            expect(res[1].identifier).toBe('DiningTables');
            done();
        });
    });

    it('should generate lists from ESpot', (done) => {
        let eSpotName = 'HomePagePromotion';
        let eSpotTypeSelection = 'common';
        component.generateListsFromEspot(eSpotName, eSpotTypeSelection).then(res => {
            let marketingSpotActivityList = res.body.MarketingSpotData[0].filteredResult;
            expect(marketingSpotActivityList.length).toBe(2);
            expect(marketingSpotActivityList[0].filteredResultId).toBe('10505');
            expect(marketingSpotActivityList[1].filteredResultId).toBe('10506');
            done();
        });
    });
});

describe('CategoryRecommendationListComponent - Error Case', () => {

    let component: CategoryRecommendationListComponent;
    let fixture: ComponentFixture<CategoryRecommendationListComponent>;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CategoryRecommendationListComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                Logger
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(CategoryRecommendationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should generate lists with only one of invalid category', (done) => {
        __karma__.config.testGroup = 'oneInvalidCat';
        let categoryIds: string[] = ['10505', '0'];
        component.fetchCatList(categoryIds).then(res => {
            component.generateLists(res);
            expect(component.lists.length).toBe(1);
            expect(component.lists[0].id).toBe('DiningRoom');
            done();
        });
    });

    it('should NOT fetch category list by input list of invalid category identifiers', (done) => {
        __karma__.config.testGroup = 'twoInvalidCat';
        let categoryIds: string[] = ['0', '0'];
        component.fetchCatList(categoryIds).then(res => {
            expect(res.length).toBe(0);
            done();
        });
    });

    it('should NOT generate lists from ESpot due to non-existent eSpotName', (done) => {
        __karma__.config.testGroup = 'invalidESpot';
        let eSpotName = 'Invalid_Espot';
        let eSpotTypeSelection = 'common';
        component.generateListsFromEspot(eSpotName, eSpotTypeSelection).then(res => {
            expect(res.body).toBeNull();
            expect(res.url).toBeNull();
            done();
        });
    });
});