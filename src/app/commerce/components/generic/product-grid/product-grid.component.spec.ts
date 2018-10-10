import { setTimeout } from 'timers';
import { MockRouter } from 'mocks/angular-class/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { ProductListingTransactionService } from './../../../services/componentTransaction/productlist.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductGridComponent } from './product-grid.component';
import { ProductViewService } from '../../../services/rest/search/productView.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core';
import { Logger } from 'angular2-logger/core';
import { CategoryViewService } from '../../../services/rest/search/categoryView.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from 'app/Constants';
import { MockActivatedRoute } from 'mocks/angular-class/activated-route';
import { CommonTestModule } from "app/commerce/common/common.test.module";

export class ProductGridMockRouter extends MockRouter {
  public url = `/${Constants.searchResultsPageIdentifier}`;

}
declare var __karma__: any;

describe( 'ProductGridComponent', () => {
  let component: ProductGridComponent;
  let fixture: ComponentFixture<ProductGridComponent>;
  let productListingTransactionService: ProductListingTransactionService;
  let route: ActivatedRoute;
  let router: Router;
  let ngAfterViewInitSpy;
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

  const breadcrumbTrailEntryView = [{
    "label": "breadcrumbTrailEntryView"
  }];

  //predefined the order of hierarchy according to test data in
  //mocks/commerce/search/store/1/categoryview/byIds.findCategoryByUniqueIds.mocks.json
  //any data change will break the test of hierarcy
  const categoryHierarchy = "Women(Apparel/Boys/Women)";

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
      declarations: [
        ProductGridComponent,
      ],
      imports: [
        HttpClientModule,
        HttpModule,
        RouterTestingModule.withRoutes( [] ),
        TranslateModule.forRoot( {
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
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
        { provide: Router, useClass: ProductGridMockRouter }
      ]
    } )
      .compileComponents();
  } ) );

  beforeEach( () => {
    __karma__.config.testGroup = '';
    fixture = TestBed.createComponent( ProductGridComponent );
    productListingTransactionService = TestBed.get(ProductListingTransactionService);
    route = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    fixture.detectChanges();
  } );

  it( `should initProducts`, ( done ) => {
    setTimeout( () => {
      expect( component.totalProducts ).toBeGreaterThan( 0 );
      component.onSortDropdownSelect( "1" );
      done();
    }, 1000 );
  } );

  it( `should be able to navigate by invoking goToSearchPageByKeyword`, ( done ) => {
    setTimeout( () => {
      component.goToSearchPageByKeyword("test");
      expect(router.navigate).toHaveBeenCalled();
      done();
    }, 1000 );
  } );

  it( `should have keyword from activated route search term`, ( done ) => {
    route.snapshot.queryParams['searchTerm'] = 'cap';
    setTimeout( () => {
      expect( component.keyword).toBe("cap");
      done();
    }, 1000 );
  } );

  it( `should have keyword from productListingSharedService`, ( done ) => {
    const newKeyword = "new keyword";
    productListingTransactionService.suggestedKeywords = [newKeyword];
    setTimeout( () => {
      expect( component.keyword).toBe(newKeyword);
      done();
    }, 1000 );
  } );

  it( `should generateLists `, ( done ) => {
    setTimeout( () => {
      expect( component.lists ).toBeDefined();
      done();
    }, 1000 );
  } );

  it( `able goto page `, ( done ) => {
    setTimeout( () => {
      let originPagenumber = component.pageNumber;
      component.onNext();
      component.onPrev();
      expect( component.pageNumber ).toBe( originPagenumber );
      done();
    }, 1000 );
  } );

  it( `should get facet labels`, ( done ) => {
    setTimeout( () => {
      component.generateActiveFacetList( JSON.parse( JSON.stringify( activeFacets ) ) );
      setTimeout(()=>{
        //category hierarcy should be in correct order
        expect( component.facetLabels[2].text).toBe(categoryHierarchy);
        expect( component.facetLabels.length ).toBe( 3 );
        done();
      }, 500);
    }, 1000 );
  } );

  it( `should be able to remove facets`, ( done ) => {
    setTimeout( () => {
      let spy1 = spyOn(productListingTransactionService, 'sendCategoryFacetAnalyticsData').and.returnValue(Promise.resolve({}));
      component.isPriceFacetEnabled();
      productListingTransactionService.activeFacets = JSON.parse( JSON.stringify( activeFacets ) );
      component.activeFacets = JSON.parse( JSON.stringify( activeFacets ) );
      component.removeFacet( {
        "type": "price",
        "text": "20 - 200"
      } );
      component.removeFacet( {
        "type": "category",
        "id": "Women"
      } );
      component.removeFacet( {
        "type": "facet",
        "text": "test facet"
      } );
      setTimeout( () => {
        expect( component.activeFacets.price.minPrice ).toBeUndefined();
        expect(productListingTransactionService.sendCategoryFacetAnalyticsData).toHaveBeenCalled();
        done();
      }, 1000 );
    }, 500 );
  } );

  it( `should be able to clear all facets`, ( done ) => {
    setTimeout( () => {
      component.activeFacets = JSON.parse( JSON.stringify( activeFacets ) );
      component.clearAll()
      expect( component.activeFacets.category.length ).toBe( 0 );
      done();
    }, 500 );
  } );

} );
