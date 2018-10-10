import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ProductFilterLayoutComponent } from './productFilterLayout';
import { ProductViewService } from '../../services/rest/search/productView.service';
import { Logger } from 'angular2-logger/core';
import { FormsModule } from '@angular/forms';
import { CategoryViewService } from '../../services/rest/search/categoryView.service';
import { ProductListingTransactionService } from '../../services/componentTransaction/productlist.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Constants } from 'app/Constants';
import { MockRouter } from 'mocks/angular-class/router';
import { Router, ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from 'mocks/angular-class/activated-route';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { DigitalAnalyticsService } from '../../services/digitalAnalytics.service';

export class ProductFilterMockRouter extends MockRouter {
    public url = `/${Constants.searchResultsPageIdentifier}`;
}

declare var __karma__: any;

describe('ProductFilterLayoutComponent', () => {

    let component: ProductFilterLayoutComponent;
    let fixture: ComponentFixture<ProductFilterLayoutComponent>;
    let productListingTransactionService: ProductListingTransactionService;
    let da: DigitalAnalyticsService;
    let route: ActivatedRoute;
    let router: Router;

    //TODO delete this const if its not being used
    const activeFacets = {
        'price': {
            "minPrice": "20",
            "maxPrice": "200"
        },
        'facet': {
            "test": "test facet"
        },
        'category': [{
            "name": "Women",
            "value": "3",
            "count": "2",
            "parentIds": "1_4"
        }]
    };

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ProductFilterLayoutComponent],
            imports: [HttpClientModule, HttpModule, FormsModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateFakeLoader,
                    }
                }),
                CommonTestModule
            ],
            providers: [
                ProductListingTransactionService,
                ProductViewService,
                CategoryViewService,
                Logger,
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: Router, useClass: ProductFilterMockRouter }
            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
    }));

    beforeEach(() => {

        __karma__.config.testGroup = "";
        productListingTransactionService = TestBed.get(ProductListingTransactionService);
        da = TestBed.get(DigitalAnalyticsService);
        route = TestBed.get(ActivatedRoute);
        router = TestBed.get(Router)
        fixture = TestBed.createComponent(ProductFilterLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('should instantiate', (done) => {
        // instatiation test case
        expect(component).toBeTruthy();
        let sampleResponse = {
            'facet': [
                { name: 'Price', value: 'price_USD' },
                { name: 'Color', value: 'ads_f10106ntk_cs'}
            ],
            'breadCrumbTrailView': "testBreadcrumbView"
        };
        productListingTransactionService.facetSource.next(sampleResponse);
        setTimeout(function(){
            expect(component.breadCrumbTrailView).toBe(sampleResponse.breadCrumbTrailView);
            expect(component.currencyCode).toBeDefined();
            done();
        }, 1000);
    });

    it('should getDisplayValue', () => {

        //create entry data unitID != C62

        let inputEntryData = {

            extendedData: {
                unitOfMeasure: "testvalue",
                unitID: 100
            },
            label: "testLabel"
        }

        //verify that output of getDisplayValue includes label and unitOfMeasure
        expect(component.getDisplayValue(inputEntryData)).toEqual('testLabel testvalue');

        //create entry data unitID = C62
        let inputEntryData2 = {

            extendedData: {
                unitOfMeasure: "testvalue",
                unitID: 'C62'
            },
            label: "testLabel"
        }

        //verify that output of getDisplayValue includes only label
        expect(component.getDisplayValue(inputEntryData2)).toEqual('testLabel');
    });

    it('should isPriceFacet', () => {

        //pass in object with value for isPriceFacet to return true
        let inputEntryData = {
            value: "price_"
        }

        //verify isPriceFacet returns true
        expect(component.isPriceFacet(inputEntryData)).toBeTruthy();

        //pass in object with value for isPriceFacet to return false
        inputEntryData.value = "falsePrice";
        //verify isPRiceFacet returns false
        expect(component.isPriceFacet(inputEntryData)).toBeFalsy();

    });

    it('should initPriceFacet', () => {

        let spy: any;
        //pass in object with value for isPriceFacet to return true
        let inputEntryData = {
            value: "price_"
        }

        spy = spyOn(component, 'isPriceFacet');


        //return value of initPriceFacet to this var; then check values
        let outputPriceFacet: any = component.initPriceFacet(inputEntryData);

        //verify isPriceFacet returns true
        expect(component.isPriceFacet).toHaveBeenCalled();
        expect(outputPriceFacet.name).toEqual("PRICE");
        expect(outputPriceFacet.value).toEqual("price_");
        expect(outputPriceFacet.minPrice).toBeUndefined();//checking for undefined is fine because this is tested in other UT
        expect(outputPriceFacet.maxPrice).toBeUndefined();
        expect(outputPriceFacet.priceFacet).toBeTruthy();

        //pass in object with value for isPriceFacet to return false
        inputEntryData.value = "falsePrice";

        //verify isPriceFacet returns false
        expect(component.initPriceFacet(inputEntryData)).toEqual({});

    });

    it('should isCategoryFacet', () => {

        //pass in object with value for isCategoryFacet to return true
        let inputEntryData = {
            value: "parentCatgroup_id_search"
        }

        //verify isPriceFacet returns true
        expect(component.isCategoryFacet(inputEntryData)).toBeTruthy();

        //pass in object with value for isCategoryFacet to return false
        inputEntryData.value = "falseCat";
        //verify isPRiceFacet returns false
        expect(component.isCategoryFacet(inputEntryData)).toBeFalsy();

    });

    it('should getFacetTitle', () => {

        let spy: any;
        //pass in object with value for condition to evaluate to true
        let inputEntryData = {
            extendedData: {
                fname: "testName"
            },
            value: "mfName_ntk_cs",
            name: "testName2"
        }

        //verify isPriceFacet returns true
        expect(component.getFacetTitle(inputEntryData)).toEqual("testName");

        //pass in object with value for isCategoryFacet to return false
        inputEntryData.value = "falsemfName";

        //verify facet title is facet name
        expect(component.getFacetTitle(inputEntryData)).toEqual("testName2");

    });

    it('should isSubcategoryFacet', () => {

        let test: boolean;
        let facetItem = {
            value: "equalValue"
        }

        let breadCrumbArray = [

            {
                value: "equalValue"
            },

            {
                value: "equalValue2"
            },
        ];

        test = component.isSubcategoryFacet(breadCrumbArray, facetItem);
        expect(test).toBeTruthy();
    });

    it('should toggleMoreFacetEntries', () => {

        let spy: any;
        let inputEntryData = {
            value: "equalValue"
        }

        spy = spyOn(productListingTransactionService, 'getProductsByQuery');
        component.toggleMoreFacetEntries(inputEntryData, 'more');
        expect(component.expandedFacets).toEqual(['equalValue:-1']);

        component.expandedFacets = ["1", "2", "3"];

        component.toggleMoreFacetEntries(inputEntryData, 'testElse');
        expect(component.expandedFacets).toEqual(['1', '2']);


        inputEntryData.value = 'parentCatgroup_id_search';
        component.toggleMoreFacetEntries(inputEntryData, 'more');
        expect(productListingTransactionService.showMoreCategoriesClicked).toBeTruthy();

        component.toggleMoreFacetEntries(inputEntryData, 'testFalse');
        expect(productListingTransactionService.showMoreCategoriesClicked).toBeFalsy();
        expect(productListingTransactionService.getProductsByQuery).toHaveBeenCalled();

    });

    it('should showMoreButton', () => {


        let inputEntryData = {
            value: "testValue",
        }

        expect(component.showMoreButton(inputEntryData)).toBeTruthy();

        let inputEntryData2 = {
            value: "testValue",
            allValReturned: "testValue",
            categoryFacet: "catFacet",
            displayShowMoreCategoriesButton: 'true'
        }

        expect(component.showMoreButton(inputEntryData2)).toBeTruthy();

        let inputEntryData3 = {
            value: "testValue",
            allValReturned: "testValue",
            categoryFacet: "catFacet",
            displayShowMoreCategoriesButton: 'false'
        }
        expect(component.showMoreButton(inputEntryData3)).toBeFalsy();
    });

    it('should showLessButton', () => {


        let inputEntryData = {
            allValReturned: "testValue",
            maxVal: 0,
            entries: ["1", "2", "3"]
        }

        expect(component.showLessButton(inputEntryData)).toBeTruthy();

        let inputEntryData2 = {
            categoryFacet: "catFacet",
            displayShowMoreCategoriesButton: 'false'
        }

        expect(component.showLessButton(inputEntryData2)).toBeTruthy();

        let inputEntryData3 = {
            categoryFacet: "catFacet",
            displayShowMoreCategoriesButton: 'true'
        }
        expect(component.showLessButton(inputEntryData3)).toBeFalsy();
    });


    it('onCheckboxChange should select category facet and trigger facet change', () => {

        let spy: any;
        spy = spyOn(productListingTransactionService, 'onCategoryFacetSelect');

        // need to callFake createPageviewTag because cm functions from eluminate.js is not defined
        let daSpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});

        let spy2: any;
        spy2 = spyOn(productListingTransactionService, 'onFacetChange');


        let inputEntryData = {
            categoryFacet: "catFacet"
        }

        component.onCheckboxChange(inputEntryData, 'Category');
        expect(productListingTransactionService.onCategoryFacetSelect).toHaveBeenCalled();

        //if selected = true then facet.value should equal facet.name
        let inputEntryData2 = {
            selected: "true",
            name: "testName",
            value: "priceFacet"
        }
        component.onCheckboxChange(inputEntryData2, 'Price');
        expect(productListingTransactionService.onFacetChange).toHaveBeenCalled();
        expect(component.selectedFacets).toEqual({ "priceFacet": 'testName' });

        //if facet.selected is undefined and facet is not a categoryFacet then delete this facet from selectedFacets
        let inputEntryData3 = {
            //selected: "false",
            name: "testName",
            value: "priceFacet"
        }

        component.onCheckboxChange(inputEntryData3, 'Price');
        expect(component.selectedFacets).toEqual({});

    });

    it('toggling brand facet should modify selectedFacets and sendFacetAnalyticsData with correct action parameter', () => {
        
        let facet = {
            categoryFacet: false,
            count: "2",
            id: "-10028211710311532651091011141059997",
            imageURL: undefined, 
            name: "Rugs America",
            parentIds: undefined,
            selected: undefined,
            value: "mfName_ntk_cs%3A%22Rugs+America%22"
        };
        let daSpy: any;
        let getProductsByQuerySpy: any;
        let sendFacetAnalyticsDataSpy: any;
        let facetType = 'Brand';
        let facetAnalyticsEntry = facetType + ':' + facet.name;
        
        // getProductsByQuery is tested in productlisting, no need to test it
        getProductsByQuerySpy = spyOn(productListingTransactionService, 'getProductsByQuery').and.callFake(function(){});
        sendFacetAnalyticsDataSpy = spyOn(productListingTransactionService, 'sendFacetAnalyticsData');
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        
        // === select facet ===
        facet.selected = true;
        component.onCheckboxChange(facet, facetType);
        expect(component.selectedFacets[facet.value]).toEqual(facet.name);
        expect(productListingTransactionService.sendFacetAnalyticsData).toHaveBeenCalledWith(facetAnalyticsEntry, 'add');
        expect(productListingTransactionService.getProductsByQuery).toHaveBeenCalled();

        // === unselect facet ===
        facet.selected = false
        component.onCheckboxChange(facet, facetType);
        expect(component.selectedFacets).toEqual({});
        expect(productListingTransactionService.sendFacetAnalyticsData).toHaveBeenCalledWith(facetAnalyticsEntry, 'remove');
        expect(productListingTransactionService.getProductsByQuery).toHaveBeenCalled();
    })

    it('onPriceFacetSubmit should set price in active facets & update price facet display', () => {

        let facetObject = {
            name: 'Price',
            minPrice: '2',
            maxPrice: '300'
        };
        let spy: any;
        let daSpy: any;
        let sendFacetAnalyticsDataSpy: any;
        
        // need to callFake createPageviewTag because cm functions from eluminate.js is not defined
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        sendFacetAnalyticsDataSpy = spyOn(productListingTransactionService, 'sendPriceFacetAnalyticsData');
        spy = spyOn(productListingTransactionService, 'onPriceFacetChange');

        component.onPriceFacetSubmit(facetObject);
        expect(productListingTransactionService.onPriceFacetChange).toHaveBeenCalled();
        expect(productListingTransactionService.sendPriceFacetAnalyticsData).toHaveBeenCalledWith(facetObject, 'add');
    });

    it('should clearPriceFacet', () => {

        let facetObject = {};
        let spy: any;
        let daSpy: any;
        let sendFacetAnalyticsDataSpy: any;
        
        // need to callFake createPageviewTag because cm functions from eluminate.js is not defined
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        sendFacetAnalyticsDataSpy = spyOn(productListingTransactionService, 'sendPriceFacetAnalyticsData');
        spy = spyOn(productListingTransactionService, 'onPriceFacetChange');
        
        component.clearPriceFacet(facetObject);
        expect(productListingTransactionService.onPriceFacetChange).toHaveBeenCalled();
        expect(productListingTransactionService.sendPriceFacetAnalyticsData).toHaveBeenCalled();
        expect(productListingTransactionService.sendPriceFacetAnalyticsData).toHaveBeenCalledWith(facetObject, 'remove');

    });

    //TODO for whenever the feature facet is implemented
    xit('should initFeatureFacet', () => {



    })

    it('should initOtherFacet', () => {


        let inputEntryData = {
            extendedData: {
                fname: "testName"
            },
            entry:
            [{
                count: 10,
                value: 0,
                extendedData: {
                    uniqueId: 12345,
                    parentIds: 11111
                },
                image: "testImage"
            }]
            ,
            value: "mfName_ntk_cs",
            name: "testName2"
        }

        let outputFacetData: any = component.initOtherFacet(inputEntryData);
        expect(outputFacetData.categoryFacet).toBeFalsy();
        expect(outputFacetData.hasImage).toBeTruthy();
        expect(outputFacetData.name).toEqual("testName");
        expect(outputFacetData.value).toEqual("mfName_ntk_cs");
        expect(outputFacetData.entries[0].count).toBe(10);
        expect(outputFacetData.entries[0].id).toBe(12345);
        expect(outputFacetData.entries[0].imageURL).toEqual("testImage");
        expect(outputFacetData.entries[0].value).toEqual(0);
        expect(productListingTransactionService.facetValueNameMapping[inputEntryData.value]).toEqual(outputFacetData.name);

        component.selectedFacets = ["selectedFacets", "testFacet"];
        outputFacetData = component.initOtherFacet(inputEntryData);
        expect(outputFacetData.entries[0].selected).toBeTruthy();

    })

    it('should populateFacetEntries', () => {

        let spy: any;
        spy = spyOnProperty(component, 'categoryLimit').and.returnValue('1');
        let facetData: any = {
            entries: []
        }

        let entry: any = "testEntry";

        let facetItem: any = {
            entry: ["testEntry"],
            value: "parentCatgroup_id_search"
        }
        component.populateFacetEntries(facetData, entry, facetItem);
        expect(facetData.entries[0]).toEqual('testEntry');
    })

    it('populateFacetEntries should delete displayShowMoreCategoriesButton', () => {

        let spy: any;
        let facetData2: any = {
            entries: ["entry1", "entry2"],
            displayShowMoreCategoriesButton: "true"
        }

        let facetItem2: any = {
            value: "parentCatgroup_id_search",
            entry: ["testEntry"]
        }

        let entry2: any = "testEntry";

        spy = spyOnProperty(component, 'categoryLimit').and.returnValue(5);
        productListingTransactionService.showMoreCategoriesClicked = false;
        expect(facetData2.displayShowMoreCategoriesButton).toEqual("true");
        component.populateFacetEntries(facetData2, entry2, facetItem2);
        expect(facetData2.entries[2]).toEqual('testEntry');
        expect(facetData2.displayShowMoreCategoriesButton).toBeUndefined();
    })

    it('populateFacetEntries should set displayShowMoreCategoriesButton to true', () => {

        let spy: any;
        spy = spyOnProperty(component, 'categoryLimit').and.returnValue(1);
        productListingTransactionService.showMoreCategoriesClicked = false;
        let facetData: any = {
            entries: ["entry1", "entry2"],
            displayShowMoreCategoriesButton: "false"
        }

        let facetItem: any = {
            value: "parentCatgroup_id_search",
            entry: ["testEntry"]
        }

        let entry: any = "testEntry";


        component.populateFacetEntries(facetData, entry, facetItem);
        expect(facetData.displayShowMoreCategoriesButton).toEqual("true");
    })

    it('populateFacetEntries should set displayShowMoreCategoriesButton to false', () => {

        let spy: any;
        spy = spyOnProperty(component, 'categoryLimit').and.returnValue(1);
        productListingTransactionService.showMoreCategoriesClicked = true;
        let facetData: any = {
            entries: ["entry1", "entry2"],
            displayShowMoreCategoriesButton: "false"
        }

        let facetItem: any = {
            value: "parentCatgroup_id_search",
            entry: ["testEntry"]
        }

        let entry: any = "testEntry";


        component.populateFacetEntries(facetData, entry, facetItem);
        expect(facetData.displayShowMoreCategoriesButton).toEqual("false");
        expect(facetData.entries[2]).toEqual('testEntry');
    })

    it('should initFacets', () => {

        let spy: any;
        spy = spyOn(component, 'initPriceFacet');

        let spy2: any;
        spy2 = spyOn(component, 'initFeatureFacet');


        let spy3: any;
        spy3 = spyOn(component, 'initOtherFacet');


        //no need for priceFacet in this because initPriceFacet will get called as long as there is no extended Data
        let responseFacets = [
            {
                "entry1": "entry1"
            },
            { "entry2": "entry2" }
        ]
        component.initFacets(responseFacets);
        expect(component.initPriceFacet).toHaveBeenCalled();

        let responseFacets2 = [
            {
                "extendedData": {
                    groupId: 1
                }
            }
        ]

        component.initFacets(responseFacets2);
        expect(component.initFeatureFacet).toHaveBeenCalled();

        let responseFacets3 = [
            {
                "extendedData": {
                    groupId: 2 //use 2 to go to else statement in function
                }
            }
        ]


        component.initFacets(responseFacets3);
        expect(component.initOtherFacet).toHaveBeenCalled();
    })
});
