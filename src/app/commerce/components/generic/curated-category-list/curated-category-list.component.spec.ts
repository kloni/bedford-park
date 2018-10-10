import { CuratedCategoryListComponent } from "app/commerce/components/generic/curated-category-list/curated-category-list.component";
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

describe('CuratedCategoryListComponent', () => {

    let component: CuratedCategoryListComponent;
    let fixture: ComponentFixture<CuratedCategoryListComponent>;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CuratedCategoryListComponent],
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
        fixture = TestBed.createComponent(CuratedCategoryListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should generate lists', (done) => {
        let categoryIdentifiers: string[] = ['Apparel', 'Furniture'];
        component.fetchCatList(categoryIdentifiers).then(res => {
            component.generateLists(res).then(()=>{
                expect(component.lists.length).toBe(2);
                expect(component.lists[0].id).toBe('Apparel');
                expect(component.lists[1].id).toBe('Furniture');
                done();
            })
        });
    });

    it('should fetch category list by input list of category identifiers', (done) => {
        let categoryIdentifiers: string[] = ['Apparel', 'Furniture'];
        component.fetchCatList(categoryIdentifiers).then(res => {
            expect(res.length).toBe(2);
            expect(res[0].identifier).toBe('Apparel');
            expect(res[1].identifier).toBe('Furniture');
            done();
        });
    });
});

describe('CuratedCategoryListComponent - Error Case', () => {

    let component: CuratedCategoryListComponent;
    let fixture: ComponentFixture<CuratedCategoryListComponent>;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CuratedCategoryListComponent],
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
        fixture = TestBed.createComponent(CuratedCategoryListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should generate lists with only one of invalid category', (done) => {
        __karma__.config.testGroup = 'invalidCategory';
        let categoryIdentifiers: string[] = ['Apparel', 'Invalid-Furniture'];
        component.fetchCatList(categoryIdentifiers).then(res => {
            component.generateLists(res).then(()=>{
                expect(component.lists.length).toBe(1);
                expect(component.lists[0].id).toBe('Apparel');
                done();
            });
        });
    });

    it('should NOT fetch category list by input list of invalid category identifiers', (done) => {
        __karma__.config.testGroup = 'invalidCategoryFail';
        let categoryIdentifiers: string[] = ['Invalid-Apparel', 'Invalid-Furniture'];
        component.fetchCatList(categoryIdentifiers).then(res => {
            expect(res.length).toBe(2);
            expect(res[0]).toBeNull();
            expect(res[1]).toBeNull();
            done();
        });
    });
});