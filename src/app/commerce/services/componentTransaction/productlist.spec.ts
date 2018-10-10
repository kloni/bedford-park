import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ProductListingTransactionService } from './productlist.service';
import { LoginIdentityService } from "../rest/transaction/loginIdentity.service";
import { PersonService } from "../rest/transaction/person.service";
import { GuestIdentityService } from "../rest/transaction/guestIdentity.service";
import { Logger } from "angular2-logger/core";
import { ProductViewService } from "../rest/search/productView.service";
import { CategoryViewService } from "../rest/search/categoryView.service";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler } from '@ngx-translate/core';
import { MockRouter } from 'mocks/angular-class/router';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from '../../common/util/http.error.interceptor';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from '../digitalAnalytics.service';
import { BreadcrumbService} from 'app/commerce/common/util/breadcrumb.service';
import { CommerceEnvironment } from '../../commerce.environment';

declare var __karma__: any;

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
}

describe('ProductListingTransactionService', () => {

    let productListService: any;
    let productViewService: any;
    let da: DigitalAnalyticsService;
    let breadcrumbService : BreadcrumbService;

    beforeEach(async(() => {

        // use mock service for dependency
        TestBed.configureTestingModule({

            imports: [HttpClientModule, HttpModule, TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }}),
                CommonTestModule
            ],
            providers: [
                ProductListingTransactionService,
                LoginIdentityService,
                PersonService,
                GuestIdentityService,
                Logger,
                BreadcrumbService,
                ProductViewService,
                CategoryViewService,
                TranslateService,
                { provide: Router, useClass: MockRouter }
            ]
        });
    }));

    beforeEach(async(inject([ProductListingTransactionService, ProductViewService], (_productListService: ProductListingTransactionService, _productViewService: ProductViewService) => {
        productListService = _productListService;
        productViewService = _productViewService;
        breadcrumbService = TestBed.get(BreadcrumbService);
        da = TestBed.get(DigitalAnalyticsService);
        __karma__.config.testGroup = "";
    })));


    it('should instantiate', () => {
        // instatiation test case
        expect(productListService).toEqual(jasmine.any(ProductListingTransactionService));
    });

    it ('should initialize parentCategoryIdentifier with value from breadcrumbService', (done) => {
        let daSpy;
        let category = { identifier: 'Furniture' };

        daSpy = spyOn(productListService, 'createPageViewDATag').and.callFake(function(){});
        breadcrumbService.directParentCategorySource.next(category);

        setTimeout(function(){
            productListService.categoryIdentifier = category.identifier;
            done();
        }, 1000);
    })

    it('should getRestParameters', () => {
        let testFacetParams =
            {
                "price": {
                    minPrice: 10.00,
                    maxPrice: 15.00
                },
                "facet": "test",
                "category": [

                    {
                        "catName": "Apparel"
                    },
                    {
                        "catName": "Women"
                    },
                    {
                        "catName": "Dresses",
                        "id": 12345
                    }
                ]
            };

        let testRestParams = productListService.getRestParameters(testFacetParams);
        expect(testRestParams.storeId).toBe('1');
        expect(testRestParams.pageSize).toBe(12);
        expect(testRestParams.minPrice).toBe(10);
        expect(testRestParams.maxPrice).toBe(15);
        expect(testRestParams.facet).toEqual(['0', '1', '2', '3']);
        expect(testRestParams.categoryId).toBe(12345);
        expect(testRestParams.categoryHierarchyPath).toBe(12345);

        //creating new params and calling getRestParameters to test the default case in switch statement
        let testFacetParams2 = {
            "test1": "default"
        }
        let testDefault = productListService.getRestParameters(testFacetParams2);
        expect(testDefault.test1).toBe('default');

    });

    it('should resetPageNumber', () => {
        productListService.activeFacets = { "pageNumber": 10 };
        expect(productListService.activeFacets.pageNumber).toBe(10);
        productListService.resetPageNumber();
        expect(productListService.activeFacets.pageNumber).toBeUndefined();
    })

    it('should sortDropdownSelect', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');
        productListService.activeFacets = { "pageNumber": 10 };
        expect(productListService.activeFacets.pageNumber).toBe(10);
        productListService.onSortDropdownSelect("testValue");
        expect(productListService.activeFacets.orderBy).toBe('testValue');
        expect(productListService.activeFacets.pageNumber).toBeUndefined();
        expect(productListService.getProductsByQuery).toHaveBeenCalled();
    })

    it('should fetchPage', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');
        productListService.fetchPage(10);
        expect(productListService.activeFacets.pageNumber).toBe(10);
        expect(productListService.getProductsByQuery).toHaveBeenCalled();
    })

    it('should clearAllFacets', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');
        productListService.activeFacets = {
            "pageNumber": 10,
            "facet": "testFacet",
            "price": 100.00,
            "category": ["Apparel", "women", "dresses"]
        }

        // need to callFake createPageviewTag because cm functions from eluminate.js is not defined
        let daSpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});

        productListService.priceFacets = {
            minPrice: 10.00,
            maxPrice: 15.00
        }

        expect(productListService.activeFacets.pageNumber).toBe(10);
        expect(productListService.activeFacets.facet).toBe('testFacet');
        expect(productListService.activeFacets.price).toBe(100.00);
        expect(productListService.activeFacets.category).toEqual(["Apparel", "women", "dresses"]);
        expect(productListService.priceFacets.minPrice).toBe(10.00);
        expect(productListService.priceFacets.maxPrice).toBe(15.00);

        productListService.onClearAllFacets();

        expect(productListService.activeFacets.pageNumber).toBeUndefined();
        expect(productListService.activeFacets.facet).toEqual({});
        expect(productListService.activeFacets.price).toEqual({});
        expect(productListService.activeFacets.category).toEqual([]);
        expect(productListService.priceFacets).toEqual({});
        expect(productListService.getProductsByQuery).toHaveBeenCalled();
    })

    it('should unselect category facet', (done) => {

        let spy: any;
        let categoryFacetAnalyticsSpy: any;
        let daSpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        spy = spyOn(productListService, 'getProductsByQuery');
        categoryFacetAnalyticsSpy = spyOn(productListService, 'sendCategoryFacetAnalyticsData').and.returnValue(Promise.resolve({}));

        productListService.activeFacets = {
            "category": ["Apparel", "Women", "Dresses"]
        }
        expect(productListService.activeFacets.category).toEqual(["Apparel", "Women", "Dresses"]);
        productListService.onCategoryFacetUnselect(2);
        setTimeout(function(){
            expect(productListService.sendCategoryFacetAnalyticsData).toHaveBeenCalled();
            expect(productListService.activeFacets.category).toEqual(["Apparel", "Women"]);
            expect(productListService.getProductsByQuery).toHaveBeenCalled();
            done();
        }, 1000);

    })

    it('should select category facet', (done) => {


        let spy: any;
        let categoryFacetAnalyticsSpy: any;
        let daSpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        spy = spyOn(productListService, 'getProductsByQuery');
        categoryFacetAnalyticsSpy = spyOn(productListService, 'sendCategoryFacetAnalyticsData').and.returnValue(Promise.resolve({}));

        productListService.activeFacets = {
            "pageNumber": 10,
            "category": ["Apparel", "Women", "Dresses"]
        };
        expect(productListService.activeFacets.pageNumber).toBe(10);
        expect(productListService.activeFacets.category).toEqual(["Apparel", "Women", "Dresses"]);
        productListService.onCategoryFacetSelect("testCat");

        setTimeout(function(){
            expect(productListService.sendCategoryFacetAnalyticsData).toHaveBeenCalled();
            expect(productListService.activeFacets.pageNumber).toBeUndefined();
            expect(productListService.activeFacets.category).toEqual(["Apparel", "Women", "Dresses", "testCat"]);
            expect(productListService.getProductsByQuery).toHaveBeenCalled();
            done();
        }, 1000);
    });

    it('should able to select category facet if there is no category selected in the beginning', (done) => {

        let categoryFacetAnalyticsSpy: any;
        let daSpy: any;
        let getProductsByQuerySpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        categoryFacetAnalyticsSpy = spyOn(productListService, 'sendCategoryFacetAnalyticsData').and.returnValue(Promise.resolve({}));
        getProductsByQuerySpy = spyOn(productListService, 'getProductsByQuery').and.callFake(function(){});

        //check for case when category is undefined in activeFacets Object
        productListService.activeFacets = {
            "pageNumber": 10
        };
        productListService.onCategoryFacetSelect("testCat2");
        setTimeout(function(){
            expect(productListService.activeFacets.category).toEqual(["testCat2"]);
            done();
        }, 1000);
    })

    it('should change price facet', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');

        productListService.onPriceFacetChange(100.00);
        expect(productListService.activeFacets.price).toBe(100.00);
        expect(productListService.priceFacets).toBe(100.00);
        expect(productListService.getProductsByQuery).toHaveBeenCalled();

    })

    it('should change facet', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');
        expect(productListService.activeFacets).toEqual({});
        expect(productListService.activeFacets.facet).toBeUndefined();
        productListService.onFacetChange({ testFacet: "testFacet" });
        expect(productListService.activeFacets.facet).toEqual({ testFacet: "testFacet" });
        expect(productListService.getProductsByQuery).toHaveBeenCalled();
    })

    it('should showMoreLessFacetEntries', () => {

        let spy: any;
        spy = spyOn(productListService, 'getProductsByQuery');
        expect(productListService.activeFacets.facetLimit).toBeUndefined();
        productListService.onShowMoreLessFacetEntries(["Apparel", "Women", "Dresses"]);
        expect(productListService.activeFacets.facetLimit).toEqual(["Apparel", "Women", "Dresses"]);
        expect(productListService.getProductsByQuery).toHaveBeenCalled();
    })

    it('should getPageNumber', () => {

        let testPageNum = productListService.getPageNumber(12);
        expect(testPageNum).toEqual(2);
    })

    it('should getProductIds', () => {

        let testProducts = [
            {
                "pName": "Dress1",
                "uniqueID": 12345
            },
            {
                "pName": "Dress2",
                "uniqueID": 123456
            }
        ]

        let idArray = productListService.getProductIds(testProducts);
        expect(idArray).toEqual(['12345', '123456']);
        expect(idArray[0]).toEqual(jasmine.any(String));
        expect(idArray[1]).toEqual(jasmine.any(String));
    })

    it('should addUserCurrency', () => {
        let testParams = {};
        sessionStorage.setItem("currentUserCurrency", "EUR");
        productListService.addUserCurrency(testParams);
        expect(testParams).toEqual({ currency: 'EUR' });
    })

    it('should getProductsByQuery using searchTerm', (done) => {

        let testUrlParams = {
            "searchTerm": "cap"
        }

        let daSpy: any;
        daSpy = spyOn(da, 'viewPage');
        daSpy.and.callFake(function(){});

        productListService.getProductsByQuery(testUrlParams);

        //check part numbers from mock file.
        productListService.productSource.subscribe(product => {

            expect(product.globalResults[0].partNumber).toBe("HVT038_3803");
            expect(product.globalResults[1].partNumber).toBe("HME037_3706");
            expect(product.globalResults[2].partNumber).toBe("MCL011_1115");
            expect(product.globalResults[3].partNumber).toBe("WSH005_0503");
            expect(product.globalResults[4].partNumber).toBe("WCL001_0107");
            expect(product.globalResults[5].partNumber).toBe("MSH012_1204");
            expect(product.globalResults[6].partNumber).toBe("GCL017_1708");
            done();
        });
    })


    it('getProductsByQuery should modify activeFacetSource', (done) => {

        let testUrlParams = {
            "searchTerm": "cap"
        }

        let daSpy: any;
        daSpy = spyOn(da, 'viewPage');
        daSpy.and.callFake(function(){});

        productListService.activeFacets = { "pageNumber": 10 };

        productListService.getProductsByQuery(testUrlParams);

        //check that activeFacetSource is modified by getProductsQuery()
        productListService.activeFacetSource.subscribe(activeFacetSource => {

            expect(activeFacetSource).toEqual({ pageNumber: 10 });
            done();
        });
    })

    it('should getProductsByQuery using suggestedKeywords', (done) => {

        let testUrlParams = {
            "searchTerm": "a_"
        };

        let daSpy: any;
        daSpy = spyOn(da, 'viewPage');
        daSpy.and.callFake(function(){});

        //suggested keyword will override searchTerm above in testUrlParams
        productListService.suggestedKeywords = ['cap'];

        productListService.getProductsByQuery(testUrlParams);

        //check part numbers from mock file.
        productListService.productSource.subscribe(product => {

            expect(product.globalResults[0].partNumber).toBe("HVT038_3803");
            expect(product.globalResults[1].partNumber).toBe("HME037_3706");
            expect(product.globalResults[2].partNumber).toBe("MCL011_1115");
            expect(product.globalResults[3].partNumber).toBe("WSH005_0503");
            expect(product.globalResults[4].partNumber).toBe("WCL001_0107");
            expect(product.globalResults[5].partNumber).toBe("MSH012_1204");
            expect(product.globalResults[6].partNumber).toBe("GCL017_1708");
            done();

        });

    })

    it('should getProductsByQuery using manufacturer', () => {

        let spy: any;
        let spy2: any;
        let testUrlParams = {
            "manufacturer": "test"
        }

        //use spy to check whether findProductsBySearchTerm is called by productListService when using manufacturer as param
        spy = spyOn(productListService.productViewService, 'findProductsBySearchTerm').and.returnValue(Observable.of({}));
        spy2 = spyOn(productListService.productViewService, 'findProductsByCategory');
        productListService.getProductsByQuery(testUrlParams);

        expect(productViewService.findProductsBySearchTerm).toHaveBeenCalledTimes(1);
        expect(productViewService.findProductsByCategory).toHaveBeenCalledTimes(0);
    })

    it('should getCategoryInfoByIds', (done) => {

        productListService.getCategoryInfoByIds([10001]).then(res => {

            //check values from mock up file
            expect(res.body.catalogGroupView[0].identifier).toBe("Apparel");
            expect(res.body.catalogGroupView[1].identifier).toBe("Boys");
            done();
        })

    })

    it('should loadProductsAndFacets when no products are returned but we have suggestedKeywords', (done) => {

        let testProducts = {

            "catalogEntryView": [

            ],
            "metaData": {
                "price": 100,
                "spellcheck": ["cap", "test2"],
                "keyword": "test2"

            }
        }


        productListService.loadProductsAndFacets(testProducts);
        expect(productListService.suggestedKeywords).toEqual(["cap", "test2"]);

        //check if products are returned for 'cap'
        productListService.productSource.subscribe(product => {

            expect(product.globalResults[0].partNumber).toBe("HVT038_3803");
            expect(product.globalResults[1].partNumber).toBe("HME037_3706");
            expect(product.globalResults[2].partNumber).toBe("MCL011_1115");
            expect(product.globalResults[3].partNumber).toBe("WSH005_0503");
            expect(product.globalResults[4].partNumber).toBe("WCL001_0107");
            expect(product.globalResults[5].partNumber).toBe("MSH012_1204");
            expect(product.globalResults[6].partNumber).toBe("GCL017_1708");
            done();

        });

    })


    it('should clear price filter selection when filter selection returns no products', (done) => {

        let spy: any;
        let spy2: any;
        let testProducts = {

            "catalogEntryView": [

            ],
            "breadCrumbTrailEntryView": "breadCrumbTest",
            "metaData": {
                "price": 100,
                "spellcheck": []
            }
        };

        let daSpy: any;
        daSpy = spyOn(da, 'viewPage');
        daSpy.and.callFake(function(){});

        productListService.activeFacets = {
            "price": {
                "minPrice": 10.00,
                "maxPrice": 20.00
            }
        };

        //use spies to check if unselectPriceFacet and showNoProductsModal are called by loadProductsAndFacets
        spy = spyOn(productListService, 'unselectPriceFacet');
        spy2 = spyOn(productListService, 'showNoProductsModal');
        productListService.loadProductsAndFacets(testProducts);

        setTimeout(() => {
            expect(productListService.unselectPriceFacet).toHaveBeenCalledTimes(1);
            expect(productListService.showNoProductsModal).toHaveBeenCalledTimes(1);
            done();
        }, 1000);

    })


    it('should clear price filter selection when filter selection returns no products', (done) => {

        let spy: any;
        let spy2: any;
        let spy3: any;
        let testProducts = {

            "catalogEntryView": [

            ],
            "breadCrumbTrailEntryView": "breadCrumbTest",
            "metaData": {
                "price": 100,
                "spellcheck": []
            }
        }

        //use spies to see if these functions are called
        spy = spyOn(productListService.productSource, 'next');
        spy2 = spyOn(productListService.facetSource, 'next');
        spy3 = spyOn(productListService.activeFacetSource, 'next');
        productListService.loadProductsAndFacets(testProducts);

        setTimeout(() => {
            expect(productListService.productSource.next).toHaveBeenCalledTimes(1);
            expect(productListService.facetSource.next).toHaveBeenCalledTimes(1);
            expect(productListService.activeFacetSource.next).toHaveBeenCalledTimes(1);
            done();
        }, 1000)

    })

    it('should unselectPriceFacet', () => {

        // need to callFake createPageviewTag because cm functions from eluminate.js is not defined
        let daSpy: any;
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});

        let spy: any;
        productListService.activeFacets = {
            "price": {
                "minPrice": 10.00,
                "maxPrice": 20.00
            }
        }
        spy = spyOn(productListService, 'updatePriceFacetDisplay');

        //calling unselectPriceFacet should clear minPrice and maxPrice
        productListService.unselectPriceFacet();
        expect(productListService.activeFacets.price.minPrice).toBeUndefined();
        expect(productListService.activeFacets.price.maxPrice).toBeUndefined();
        expect(productListService.activeFacets.price).toEqual({});
        expect(productListService.updatePriceFacetDisplay).toHaveBeenCalledTimes(1);
    })

    it('noProductsDueToInvalidParam() should return true if no products due to invalid params', () => {

        //leave this empty for this test case
        let productIds = [];


        productListService.urlParams = {
            "categoryId": "testCat"
        }

        //if productId.length equals 0 and urlParams contains valid category ID; boolean should evaluate to true
        expect(productListService.noProductsDueToInvalidParam(productIds)).toBeTruthy();

        productListService.urlParams = {
            "categoryIdentifier": "testCatIdentifier"
        }

        //if productId.length equals 0 and urlParams contains category Identifier; boolean should evaluate to true
        expect(productListService.noProductsDueToInvalidParam(productIds)).toBeTruthy();

    })

    it('noProductsDueToInvalidParam() should return false if there are productIds', () => {

        //populate array
        let productIds = [100, 101, 102];


        productListService.urlParams = {
            "categoryId": "testCat"
        }

        //if productId.length does not equal 0 and urlParams contains category ID; boolean should evaluate to false
        expect(productListService.noProductsDueToInvalidParam(productIds)).toBeFalsy();

    })

    it('noProductsButSuggestionExists() should return true if there are no productIds and suggestions exist', () => {

        //leave this empty for this test case
        let productIds = [];


        let products = {
            "suggestions": ["suggest1", "suggest2"]
        }

        //if productId.length does equal 0 and suggestions are valid; boolean should evaluate to true
        expect(productListService.noProductsButSuggestionExists(productIds, products)).toBeTruthy();

    })

    it('noProductsButSuggestionExists() should return false if there are productIds', () => {

        //populate array
        let productIds = [1, 2, 3];


        let products = {
            "suggestions": ["suggest1", "suggest2"]
        }

        //if productId.length does not equal 0 and suggestions exist; boolean should evaluate to false
        expect(productListService.noProductsButSuggestionExists(productIds, products)).toBeFalsy();

    })

    it('noProductsDueToInvalidPriceFilter() should return true if there are no productIds and price filter exists', () => {

        //populate array
        let productIds = [];


        productListService.activeFacets = {

            price: {
                minPrice: 100,
                maxPrice: 200
            }
        }
        //if productId.length does equal 0 and price facet exists; boolean should evaluate to true
        expect(productListService.noProductsDueToInvalidPriceFilter(productIds)).toBeTruthy();

    })

    it('noProductsDueToInvalidPriceFilter() should return false if there are productIds', () => {

        //populate array
        let productIds = [1, 2, 3];


        productListService.activeFacets = {

            price: {
                minPrice: 100,
                maxPrice: 200
            }
        }
        //if productId.length does not equal 0; boolean should evaluate to true
        expect(productListService.noProductsDueToInvalidPriceFilter(productIds)).toBeFalsy();

    })

    it('searchResultHasOneProductOnly() should return true if only one result was returned', () => {

        let params = {
            id: ["1001"] //need this value for function to return true
        }
        productListService.urlParams = {

            searchTerm: "testTerm"
        }

        expect(productListService.searchResultHasOneProductOnly(params)).toBeTruthy();

    })

    it('searchResultHasOneProductOnly() should return false when more than one result is returned', () => {

        let params = {
            id: ["1001","1002"] //need this value for function to return true
        }
        productListService.urlParams = {

            searchTerm: "testTerm"
        }

        expect(productListService.searchResultHasOneProductOnly(params)).toBeFalsy();
    })

    it('updates facetAnalyticsEntry accordingly', () =>{
        let facetAnalyticsEntry = "Price:1-200";
        let action;
        let daSpy;

        // add facet
        action = 'add';
        daSpy = spyOn(da, 'addFacetAnalyticsEntry').and.callFake(function(){});
        productListService.sendFacetAnalyticsData(facetAnalyticsEntry, action);
        expect(da.addFacetAnalyticsEntry).toHaveBeenCalledWith(facetAnalyticsEntry);

        // remove facet
        action = 'remove';
        daSpy = spyOn(da, 'removeFacetAnalyticsEntry').and.callFake(function(){});
        productListService.sendFacetAnalyticsData(facetAnalyticsEntry, action);
        expect(da.removeFacetAnalyticsEntry).toHaveBeenCalledWith(facetAnalyticsEntry);
    });

    it('gets category identifier before sendCategoryFacetAnalyticsData', (done) => {
        let facet = { id : 10001 };
        let action = 'add';
        let daSpy;

        daSpy = spyOn(productListService, 'sendFacetAnalyticsData').and.callFake(function(){});
        productListService.sendCategoryFacetAnalyticsData({id: 1000}, 'add').then( r =>{
            expect(productListService.sendFacetAnalyticsData).toHaveBeenCalled();
            done();
        })
    })

    it('creates pageviewDATag for PLP page with right parameters', () => {
        let daSpy;
        let pageParam;
        productListService.categoryIdentifier = 'Chair';
        productListService.da.analyticsFacet = '';
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        pageParam = {
            pageName: 'Chair',
            searchTerm: '',
            searchResults: '',
            facet: ''
        }
        productListService.createPageViewDATag();
        expect(da.viewPage).toHaveBeenCalledWith(pageParam);
    });

    it('creats pageviewDATag for successful search results page with right parameters', () => {
        let daSpy;
        let pageParam;
        let productResults = {
            'recordSetTotal': '5',
            'recordSetStartNumber': 0
        };
        productListService.urlParams['searchTerm'] = 'Chair';
        productListService.da.analyticsFacet = 'Price:1-200';
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        pageParam = {
            pageName: CommerceEnvironment.analytics.productSearchSuccessfulPageName + '1',
            searchTerm: 'Chair',
            searchResults: '5',
            facet: '1-_-Price:1-200'
        }
        productListService.createPageViewDATag(productResults);
        expect(da.viewPage).toHaveBeenCalledWith(pageParam);
    });

    it('creates pageviewDATag for unsuccessful search results page with right parameters', () => {
        let daSpy;
        let pageParam;
        let productResults = { 'recordSetTotal': '0' };
        productListService.urlParams['searchTerm'] = 'Chair';
        productListService.da.analyticsFacet = '';
        daSpy = spyOn(da, 'viewPage').and.callFake(function(){});
        pageParam = {
            pageName: CommerceEnvironment.analytics.productSearchUnsuccessfulPageName,
            searchTerm: 'Chair',
            searchResults: '0',
            facet: '1' // storeId
        }
        productListService.createPageViewDATag(productResults);
        expect(da.viewPage).toHaveBeenCalledWith(pageParam);
    });

});
