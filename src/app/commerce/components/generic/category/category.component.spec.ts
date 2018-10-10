import { CategoryComponent } from "app/commerce/components/generic/category/category.component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { RecommendationService } from "app/commerce/services/recommendation.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { CategoryService } from "app/commerce/services/category.service";
import { Logger } from "angular2-logger/core";
import { ActivePageService, RenderingContext, ExtendedContext } from "ibm-wch-sdk-ng";
import { EventService } from "app/commerce/services/rest/transaction/event.service";
import { Constants } from "app/Constants";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';

declare var __karma__: any;

describe('CategoryComponent', () => {

    let component: CategoryComponent;
    let fixture: ComponentFixture<CategoryComponent>;
    let ctx:ExtendedContext = { site: { id: "", pages: {} }, sibling: [], breadcrumb: [], children: [] } as ExtendedContext;
    let rc: any = {
        categoryInternal: {
            childCatalogGroupID: { 0: "10502_10001" },
            identifier: "Women",
            storeID: "10501",
            name: "Women",
            uniqueID: "3",
            shortDescription: "Women"
        },
        eSpotDescInternal: { },
        eSpotInternal:{ },
        id:"Women",
        layouts: { default: { template:"category-card", templateType:"angular" } },
        context: ctx,
        selectedLayouts: { 0: { layout: { id:"category-card" } } },
        type: "Child PIM categories",
        typeId: "com.ibm.commerce.store.angular-types.child-pim-categories",
        markups: { }
    };

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CategoryComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                RecommendationService,
                CategoryViewService,
                CategoryService,
                EventService,
                ActivePageService,
                ProductViewService,
                Logger
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(CategoryComponent);
        component = fixture.componentInstance;
        component.renderingContext = rc;
        fixture.detectChanges();
    }));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should inform marketing click event for espot on category page', () => {
        component.ctx = rc;
        component.informMarketingOfClick();
    });

});