import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { WchNgModule, PageComponent, ComponentsService, RenderingContext } from 'ibm-wch-sdk-ng';
import { FormsModule } from '@angular/forms';
import { SearchBoxComponent } from './search-box.component';
import { TranslateService } from '@ngx-translate/core';
import { CategoryViewService } from '../../commerce/services/rest/search/categoryView.service';
import { SiteContentService } from '../../commerce/services/rest/search/siteContent.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Logger } from 'angular2-logger/core';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

/**
 * entries in navigationViewReferences looks like
 * [{
        "term": "applique",
        "frequency": 36,
        "displayName": "<b>ap</b>plique",
        "name": "applique"
    },
    {
        "term": "applique sequined",
        "frequency": 36,
        "displayName": "<b>ap</b>plique sequined",
        "name": "applique sequined"
    },
    {
        "term": "appearance",
        "frequency": 25,
        "displayName": "<b>ap</b>pearance",
        "name": "appearance"
    },
    {
        "term": "appliqued",
        "frequency": 22,
        "displayName": "<b>ap</b>pliqued",
        "name": "appliqued"
    },
    {
        "value": "1",
        "fullPath": "Apparel",
        "fullPathCategoryIds": "1",
        "image": "https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/ExtendedSitesCatalogAssetStore/images/catalog/apparel/women/category/catr_wcl_pants.png",
        "name": "Apparel",
        "shortDescription": "The latest styles for the entire family.",
        "displayName": "<b>Ap</b>parel"
    },
    {
        "value": "10024",
        "fullPath": "Electronics > Laptops",
        "fullPathCategoryIds": "6 > 10024",
        "image": "https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/ExtendedSitesCatalogAssetStore/images/catalog/electronics/category/catr_cla_laptops.png",
        "name": "Laptops",
        "shortDescription": "Laptops",
        "displayName": "Electronics > L<b>ap</b>tops"
    },
    {
        "value": "10038",
        "fullPath": "Home & Furnishing > Appliances",
        "fullPathCategoryIds": "9 > 10038",
        "image": "https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/ExtendedSitesCatalogAssetStore/images/catalog/homefurnishings/category/catr_hap_appliances.png",
        "name": "Appliances",
        "shortDescription": "Appliances",
        "displayName": "Home & Furnishing > <b>Ap</b>pliances"
    },
    {
        "name": "Captain Stewarts",
        "value": "mfName_ntk_cs%3A%22Captain+Stewarts%22",
        "count": "6",
        "displayName": "C<b>ap</b>tain Stewarts"
    }
]
 */
describe('SearchBoxComponent', () => {
    let component: any;
    let fixture: ComponentFixture<SearchBoxComponent>;
    let keyword = "ap"; //in test data
    // let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                CommonModule,
                HttpClientModule,
                HttpModule,
                RouterTestingModule.withRoutes([
                    { path: '**', component: RouterMockTestComponent }
                ]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader
                    }
                }),
                CommonTestModule
            ],
            providers: [
                SiteContentService,
                CategoryViewService,
                TranslateService,
                Logger
            ],
            declarations: [SearchBoxComponent, RouterMockTestComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(SearchBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.keyDown({});
    });

    it('should initialize cachedSuggestionView', ((done) => {
        component.ngOnInit();
        setTimeout(() => {
            expect(component.cachedSuggestionView.length).toBeGreaterThan(0);
            done();
        }, 500);
    }))

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to search', (done) => {
        component.query = "";
        component.search();
        component.query = keyword;
        component.removeFocus();
        component.setFocus();
        component.keyDown({});
        setTimeout(() => {
            component.search();
            done();
        }, 1000);
    });

    it('should be able to arrow down, arrow up and search keyword', (done) => {

        component.query = keyword;
        expect(component.query).toEqual(keyword);
        setTimeout(() => {
            expect(component.suggestionView.length).toBeGreaterThan(0);
            expect(component.navigationViewReferences.entries.length).toBeGreaterThan(0);
            component.navigationViewReferences.pointerIndex = 0;
            component.query = keyword;
            component.arrowUp({});
            for (let i = 0; i < 5; i++) {

                component.arrowDown({});
            }
            component.arrowUp({});
            //at keyword "appliqued"
            expect(component.query).toEqual("appliqued");
            component.search();
            done();
        }, 1000);

    });

    it('should be able to arrow down, arrow up and search category', (done) => {

        component.query = keyword;
        setTimeout(() => {
            expect(component.suggestionView.length).toBeGreaterThan(0);
            expect(component.navigationViewReferences.entries.length).toBeGreaterThan(0);
            component.navigationViewReferences.pointerIndex = -1;
            for (let i = 0; i < 5; i++) {

                component.arrowDown({});
            }
            //at category "Apparel"
            component.hoverSelect(component.selectedSuggestion);
            component.search();
            setTimeout(() => {
                done();
            }, 1000);
        }, 1000);

    });

    it('should be able to arrow down, arrow up and search category with products', (done) => {

        component.query = keyword;
        setTimeout(() => {
            expect(component.suggestionView.length).toBeGreaterThan(0);
            expect(component.navigationViewReferences.entries.length).toBeGreaterThan(0);
            component.navigationViewReferences.pointerIndex = -1;
            for (let i = 0; i < 6; i++) {

                component.arrowDown({});
            }
            //at category "Laptops"
            component.search();
            setTimeout(() => {
                done();
            }, 1000);
        }, 1000);

    });

    it('should be able to arrow down, arrow up and search Brand', (done) => {

        component.query = keyword;
        setTimeout(() => {
            expect(component.suggestionView.length).toBeGreaterThan(0);
            expect(component.navigationViewReferences.entries.length).toBeGreaterThan(0);
            for (let i = 0; i < 8; i++) {
                component.arrowDown({});
            }
            //at Brand "Captain Stewarts"
            component.search();
            done();
        }, 1000);

    });

    it('should be able to arrow down, arrow up and search History keyword', (done) => {

        component.query = keyword;
        setTimeout(() => {
            expect(component.cachedSuggestionView.length).toBeGreaterThan(0);
            component.addSearchTermToHistory(keyword);
            expect(component.suggestionView.length).toBeGreaterThan(0);
            expect(component.navigationViewReferences.entries.length).toBeGreaterThan(0);

            for (let i = 0; i < 19; i++) {

                component.arrowDown({});
            }
            //at Brand "Captain Stewarts"
            component.search();
            done();
        }, 500);

    });

    it('should be able clear search', () => {

        component.query = keyword;
        expect(component.query).toEqual(keyword);

        component.clearSearch();
        component.removeFocus();
        expect(component.query).toEqual("");
    });

    it('should be able to get redirect keywords to respective URLs', () => {

        let spy = spyOn(component.router, "navigate");
        component.query = "keyword1"; //matches the redirect keyword Data from storefrontUtilsTest.service

        component.search()
        expect(component.router.navigate).toHaveBeenCalled();
        

    });

});

@Component({
    template: `
    <a routerLink="/test/page/{{pageName}}">link</a>
    <router-outlet></router-outlet>
  `
})

@Component({
    template: ''
})

/**
 * Mocks routerLink
 */
class RouterMockTestComponent {
}
