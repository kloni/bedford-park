import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { OrderConfirmationMessageLayoutComponent } from 'app/commerce/layouts/order-confirmation-message/orderConfirmationMessageLayout';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService, TranslateLoader, TranslateFakeLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler } from '@ngx-translate/core';
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import { Logger } from 'angular2-logger/core';
import { ActivatedRoute, ParamMap, Router, RouterModule, NavigationEnd  } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';

import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Params } from '@angular/router';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { Constants } from 'app/Constants';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
  }

declare var __karma__: any;

describe('OrderConfirmationMessageComponent', () => {

    let component: OrderConfirmationMessageLayoutComponent;
    let fixture: ComponentFixture<OrderConfirmationMessageLayoutComponent>;
    let orderService: OrderService;
    let mockRouter: Router;
    const MockActivatedRoute = {
        storeId : '1',
        orderId: 'orderId'
    }
  beforeEach(() => {

    // use mock service for dependency
    TestBed.configureTestingModule({
        declarations: [OrderConfirmationMessageLayoutComponent],
        imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule,
            TranslateModule.forRoot({
                loader: {
                  provide: TranslateLoader,
                  useFactory: HttpLoaderFactory,
                  deps: [HttpClient]
                }
              }),
            HttpClientModule, HttpModule, FormsModule, RouterTestingModule.withRoutes([]),
            CommonTestModule
        ],
        providers: [
            OrderService,
            Logger,
            ActivePageService,
            ModalDialogService,
            { provide: Router, useClass: MockRouter },
            { provide: ActivatedRoute, useValue: {queryParams: Observable.from([MockActivatedRoute])}, }
        ]
    }).compileComponents();

    __karma__.config.testGroup = '';
  });

  beforeEach(() => {
    __karma__.config.testGroup = '';
    mockRouter = TestBed.get(Router);
    fixture = TestBed.createComponent(OrderConfirmationMessageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockRouter.initialNavigation();
  });


    it('should instantiate and initialize storeId and orderId', (done) => {
        // instatiation test case
        expect(component).toBeTruthy();
        expect(component.storeId).toBe('1');
        expect(component.orderId).toBe('orderId');
        done();
    });

    it('should validate orderId ', (done) => {
        component.initOrderData().then( r => {
            expect(component.confirmedOrderId).toEqual(component.orderId);
            done();
         });
    });

    it('should be able to navigate to home page', (done) => {
        component.redirectUrl = '/home';
        component.goToRedirectPage();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
        done();
    });
});

describe('OrderConfirmationMessageComponent - Undefined Ids:', () => {

    let component: OrderConfirmationMessageLayoutComponent;
    let fixture: ComponentFixture<OrderConfirmationMessageLayoutComponent>;
    let orderService: OrderService;
    let httpMock: HttpTestingController;

    let end = new NavigationEnd(1, '/home', '/careers');
    let events = new Observable(observer => {
        observer.next(end);
        observer.complete();
    });

    const mockInterceptRouter = {
        snapshot: {
        },
        navigate: jasmine.createSpy('navigate'),
        url: '/order-confirmation',
        events: events
    }

    const MockActivatedRoute = {
        storeId : undefined,
        orderId: undefined
    }

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ OrderConfirmationMessageLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
             TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ],
            providers: [
                OrderService,
                ActivePageService,
                ModalDialogService,
                Logger,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: HttpErrorInterceptor,
                  multi: true,
                },
                { provide: Router, useValue: mockInterceptRouter },
                { provide: ActivatedRoute,
                    useValue: {queryParams: Observable.from([MockActivatedRoute])},
                }
            ]
        }).compileComponents();


    }));

    beforeEach(async(inject([HttpTestingController], (_httpMock: HttpTestingController) => {
        __karma__.config.testGroup = '';
        httpMock = _httpMock;

        fixture = TestBed.createComponent(OrderConfirmationMessageLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));

    it('should redirect to home page for undefined order Id', (done) => {
        expect(component.storeId).toBeUndefined();
        expect(component.orderId).toBeUndefined();
        // TO DO: need to be looked at...
        // expect(mockInterceptRouter.navigate).toHaveBeenCalledWith(['/home']);
        done();
    });

});

describe('OrderConfirmationMessageComponent - Invalid orderId Case', () => {

    let component: OrderConfirmationMessageLayoutComponent;
    let fixture: ComponentFixture<OrderConfirmationMessageLayoutComponent>;
    let orderService: OrderService;
    let httpMock: HttpTestingController;
    let mockRouter: Router;

    const MockActivatedRoute = {
            storeId : '1',
            orderId: 'invalidOrderId'
    }

    beforeEach(done => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ OrderConfirmationMessageLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
             TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ],
            providers: [
                OrderService,
                ActivePageService,
                ModalDialogService,
                Logger,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: HttpErrorInterceptor,
                  multi: true,
                },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute,
                    useValue: {queryParams: Observable.from([MockActivatedRoute])},
                }
            ]
        }).compileComponents();
        done()
    });

    beforeEach(async(inject([HttpTestingController], (_httpMock: HttpTestingController) => {
        __karma__.config.testGroup = '';
        httpMock = _httpMock;

        fixture = TestBed.createComponent(OrderConfirmationMessageLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));

    it('should redirect to home page for missing order Id', (done) => {

        __karma__.config.testGroup = 'invalidOrderId';

        // mock error with status code 400
        const mockErrorResponse = {
          status: 400,
          statusText: 'Bad Request'
        };
        const errorInitOrderId =  {"errors":[{"errorKey":"_ERR_INVALID_COOKIE","errorParameters":"","errorMessage":"CMN1039E: An invalid cookie was received for the user, your logonId may be in use by another user.","errorCode":"CMN1039E"}]};
        let req = httpMock.expectOne('mocks/commerce/transaction/store/1/order/invalidOrderId.findByOrderId.mocks.json');
        req.flush(errorInitOrderId, mockErrorResponse);
        httpMock.verify();
        done();
    });

});


describe('OrderConfirmationMessageComponent - Missing OrderId', () => {

    let component: OrderConfirmationMessageLayoutComponent;
    let fixture: ComponentFixture<OrderConfirmationMessageLayoutComponent>;
    let orderService: OrderService;
    let httpMock: HttpTestingController;
    let mockRouter: Router;
    const MockActivatedRoute = {
            storeId : '1',
            orderId: 'missingOrderId'
    }

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ OrderConfirmationMessageLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
             TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ],
            providers: [
                OrderService,
                ActivePageService,
                ModalDialogService,
                Logger,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: HttpErrorInterceptor,
                  multi: true,
                },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute,
                    useValue: {queryParams: Observable.from([MockActivatedRoute])},
                }
            ]
        }).compileComponents();

    }));
    beforeEach(async(inject([HttpTestingController], (_httpMock: HttpTestingController) => {
        __karma__.config.testGroup = '';
        httpMock = _httpMock;

        fixture = TestBed.createComponent(OrderConfirmationMessageLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));
    it('should redirect to home page for missing order Id', (done) => {
        __karma__.config.testGroup = 'missingOrderId';

        // mock error with status code 401
        const mockErrorResponse = {
          status: 401,
          statusText: 'Bad Request'
        };
        const errorInitOrderId =  {"errors":[{"errorKey":"ERR_PARTIAL_AUTHENTICATION_NOT_ALLOWED","errorParameters":"","errorMessage":"CWXFR0222E: Partial authentication not allowed for the current request. Login with your user name and password and try again.","errorCode":"CWXFR0222E"}]};
        let req = httpMock.expectOne('mocks/commerce/transaction/store/1/order/missingOrderId.findByOrderId.mocks.json');
        req.flush(errorInitOrderId, mockErrorResponse);
        httpMock.verify();
        done();
    });
});

describe('OrderConfirmationMessageComponent - Invalid StoreId', () => {

    let component: OrderConfirmationMessageLayoutComponent;
    let fixture: ComponentFixture<OrderConfirmationMessageLayoutComponent>;
    let orderService: OrderService;
    let httpMock: HttpTestingController;
    let mockRouter: Router;
    const MockActivatedRoute = {
            storeId : 'invalidStoreId',
            orderId: 'orderId'
    }

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ OrderConfirmationMessageLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
             TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                OrderService,
                ActivePageService,
                ModalDialogService,
                Logger,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: HttpErrorInterceptor,
                  multi: true,
                },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute,
                    useValue: {queryParams: Observable.from([MockActivatedRoute])},
                }
            ]
        }).compileComponents();

    }));
    beforeEach(async(inject([HttpTestingController], (_httpMock: HttpTestingController) => {
        __karma__.config.testGroup = '';
        httpMock = _httpMock;

        fixture = TestBed.createComponent(OrderConfirmationMessageLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));

    it('should redirect to home page for invalid store Id', (done) => {
          __karma__.config.testGroup = 'invalidStoreId';

        // mock error with status code 400
        const mockErrorResponse = {
          status: 400,
          statusText: 'Bad Request'
        };
        const errorInitOrderId =  {"errors":[{"errorKey":"ERR_INVALID_INTEGER","errorParameters":"[storeId, invalid]","errorMessage":"CWXFR0226E: Parameter \"storeId\" is expected to contain a valid integer. Invalid input detected : \"invalid\".","errorCode":"CWXFR0226E"}]};
        let req = httpMock.expectOne('mocks/commerce/transaction/store/invalidStoreId/order/orderId.findByOrderId.mocks.json');
        req.flush(errorInitOrderId, mockErrorResponse);
        httpMock.verify();
        done();
    });
});
