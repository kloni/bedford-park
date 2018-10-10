import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { TestBed, ComponentFixture, async, inject  } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService, TranslateLoader, TranslateFakeLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler } from '@ngx-translate/core';
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import { Logger } from 'angular2-logger/core';
import { ActivatedRoute, ParamMap, Router, RouterModule  } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Params } from '@angular/router';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { DynamicSimplifiedRegistrationLayoutComponent } from './registration-simple.dynamic.component';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { OrderConfirmationMessageLayoutComponent } from 'app/commerce/layouts/order-confirmation-message/orderConfirmationMessageLayout';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

declare var __karma__: any;

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
  }


describe('DynamicSimplifiedRegistrationLayoutComponent- Registered User', () => {

    let component: DynamicSimplifiedRegistrationLayoutComponent;
    let fixture: ComponentFixture<DynamicSimplifiedRegistrationLayoutComponent>;
    let orderService: OrderService;
    let authService: AuthenticationTransactionService;
    let mockRouter: Router;

    const MockActivateRouteSnapShot = {
        snapshot: {
            queryParams: {
                storeId : '1',
                orderId: 'orderId.registered',
                returnUrl: '/'
            }
        }
    }

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [DynamicSimplifiedRegistrationLayoutComponent],
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
            AuthenticationTransactionService,
            OrderService,
            LoginIdentityService,
            PersonService,
            Logger,
            ActivePageService,
            ModalDialogService,
            { provide: Router, useClass: MockRouter },
            { provide: ActivatedRoute,
                useValue: {
                    snapshot : Observable.from([MockActivateRouteSnapShot]),
                    queryParams: Observable.from([MockActivateRouteSnapShot.snapshot.queryParams])
                },
            }
        ]
    }).compileComponents();
    __karma__.config.testGroup = '';
  });

  beforeEach(async(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {
        __karma__.config.testGroup = '';
        authService = _accountService;
        fixture = TestBed.createComponent(DynamicSimplifiedRegistrationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        })
    ));

  it('should instantiate and set all the variables correctly with a registered user placing an order', (done) => {
      // instatiation test case
      expect(component).toBeTruthy();
      expect(component.storeId).toBe('1');
      expect(component.orderId).toBe('orderId.registered');
      expect(component.returnUrl).toBe('/home');
      expect(component.user.firstName).toBe('pikaFirstName');
      expect(component.user.lastName).toBe('pikaLastName');
      expect(component.user.phone).toBe('123-456-2222');
      expect(component.registered).toBe('uid=pikapika@gmail.com,o=default organization,o=root organization');
      done();

  });
});

describe('DynamicSimplifiedRegistrationLayoutComponent- Unregistered', () => {

        let component: DynamicSimplifiedRegistrationLayoutComponent;
        let fixture: ComponentFixture<DynamicSimplifiedRegistrationLayoutComponent>;
        let orderService: OrderService;
        let authService: AuthenticationTransactionService;
        let mockRouter: Router;
        let da: DigitalAnalyticsService;

        const MockActivateRouteSnapShot = {
            snapshot: {
                queryParams: {
                    storeId : '1',
                    orderId: 'orderId.unregistered',
                    returnUrl: '/'
                }
            }
        }

      beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicSimplifiedRegistrationLayoutComponent],
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
                AuthenticationTransactionService,
                OrderService,
                LoginIdentityService,
                PersonService,
                Logger,
                ActivePageService,
                ModalDialogService,
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute,
                    useValue: {
                        snapshot : Observable.from([MockActivateRouteSnapShot]),
                        queryParams: Observable.from([MockActivateRouteSnapShot.snapshot.queryParams])
                    },
                }
            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
      });

      beforeEach(async(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {

            __karma__.config.testGroup = '';
            authService = _accountService;

            da = TestBed.get(DigitalAnalyticsService);
            mockRouter = TestBed.get(Router);
            fixture = TestBed.createComponent(DynamicSimplifiedRegistrationLayoutComponent);

            component = fixture.componentInstance;
            fixture.detectChanges();
            mockRouter.initialNavigation();
            })
        ));

      it('should instantiate and set all the variables correctly with an unregistered user placing an order', (done) => {
          // instatiation test case
          expect(component).toBeTruthy();
          expect(component.storeId).toBe('1');
          expect(component.orderId).toBe('orderId.unregistered');
          expect(component.returnUrl).toBe('/home');
          expect(component.user.firstName).toBe('unregisteredFirstName');
          expect(component.user.lastName).toBe('unregisteredLastName');
          expect(component.user.registered).toBeUndefined();;
          done();
      });

    it('should register and navigate to homepage', (done) => {
        // register user sucessfully and navigate to the home page
        let daSpy: any;
        daSpy = spyOn(da, 'updateUser');
        daSpy.and.callFake(function(){});
        component.register().then(res => {
            expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
            done();
        });
    });

    it('should call Digital Analytics Service when registering', (done) => {
        let daSpy = spyOn(da, 'updateUser');
        component.register().then(res => {
            expect(da.updateUser).toHaveBeenCalled();
            done();
        });
    });
});

describe('DynamicSimplifiedRegistrationLayoutComponent- Registration error case', () => {

    let component: DynamicSimplifiedRegistrationLayoutComponent;
    let fixture: ComponentFixture<DynamicSimplifiedRegistrationLayoutComponent>;
    let orderService: OrderService;
    let authService: AuthenticationTransactionService;
    let mockRouter: Router;

    const MockActivateRouteSnapShot = {
        snapshot: {
            queryParams: {
                storeId : '1',
                orderId: 'orderId',
                returnUrl: '/'
            }
        }
    }

    beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [DynamicSimplifiedRegistrationLayoutComponent],
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
            AuthenticationTransactionService,
            OrderService,
            LoginIdentityService,
            PersonService,
            Logger,
            ActivePageService,
            ModalDialogService,
            { provide: Router, useClass: MockRouter },
            { provide: ActivatedRoute,
                useValue: {
                    snapshot : Observable.from([MockActivateRouteSnapShot]),
                    queryParams: Observable.from([MockActivateRouteSnapShot.snapshot.queryParams ])
                },
            }
        ]
    }).compileComponents();
    __karma__.config.testGroup = '';
    });

    beforeEach(async(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {

        __karma__.config.testGroup = '';
        authService = _accountService;
        fixture = TestBed.createComponent(DynamicSimplifiedRegistrationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        })
    ));

    it('should instantiate and set all the variables correctly with a registered user placing an order', (done) => {
        // instatiation test case
        expect(component).toBeTruthy();
        expect(component.storeId).toBe('1');
        expect(component.orderId).toBe('orderId');
        done();

    });
});

describe('DynamicSimplifiedRegistrationLayoutComponent- invalid order Id, store Id', () => {

        let component: DynamicSimplifiedRegistrationLayoutComponent;
        let fixture: ComponentFixture<DynamicSimplifiedRegistrationLayoutComponent>;
        let orderService: OrderService;
        let authService: AuthenticationTransactionService;
        let mockRouter: Router;

        const MockActivateRouteSnapShot = {
            snapshot: {
                queryParams: {
                    storeId : '1',
                    orderId: 'invalidOrderId',
                    returnUrl: '/'
                }
            }
        }

      beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DynamicSimplifiedRegistrationLayoutComponent],
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
                AuthenticationTransactionService,
                OrderService,
                LoginIdentityService,
                PersonService,
                Logger,
                ActivePageService,
                ModalDialogService,
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute,
                    useValue: {
                        snapshot : Observable.from([MockActivateRouteSnapShot]),
                        queryParams: Observable.from([MockActivateRouteSnapShot.snapshot.queryParams])
                    },
                }

            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
      });

      beforeEach(async(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {

            __karma__.config.testGroup = '';
            authService = _accountService;

            fixture = TestBed.createComponent(DynamicSimplifiedRegistrationLayoutComponent);

            component = fixture.componentInstance;
            fixture.detectChanges();
            })
        ));

      it('should instantiate and set all the variables correctly with a registered user placing an order', (done) => {
          // instatiation test case
          expect(component).toBeTruthy();
          expect(component.storeId).toBe('1');
          expect(component.orderId).toBe('invalidOrderId');
          done();

      });
});


describe('DynamicSimplifiedRegistrationLayoutComponent - Password mismatch', () => {

        let component: any;
        let fixture: ComponentFixture<DynamicSimplifiedRegistrationLayoutComponent>;
        let httpMock: any;
        let interceptor: HttpErrorInterceptor;
        let authService: AuthenticationTransactionService;
        let orderService: OrderService;
        let mockRouter: Router;

        const MockActivateRouteSnapShot = {
            snapshot: {
                queryParams: {
                    storeId : '1',
                    orderId: 'orderId',
                    returnUrl: '/'
                }
            }
        }

        beforeEach(() => {
            // use mock service for dependency
            TestBed.configureTestingModule({
                declarations: [DynamicSimplifiedRegistrationLayoutComponent],
                imports: [HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
                    TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                    CommonTestModule
                   ], providers: [
                    {
                        provide: HTTP_INTERCEPTORS,
                        useClass: HttpErrorInterceptor,
                        multi: true,
                    },
                    HttpErrorInterceptor,
                    OrderService,
                    AuthenticationTransactionService,
                    LoginIdentityService,
                    Logger,
                    PersonService,
                    ActivePageService,
                    ModalDialogService, 
                    { provide: Router, useClass: MockRouter },
                    { provide: ActivatedRoute,
                        useValue: {
                            snapshot : Observable.from([MockActivateRouteSnapShot]),
                            queryParams: Observable.from([MockActivateRouteSnapShot.snapshot.queryParams])
                        },
                    }
                ]
            }).compileComponents();
            __karma__.config.testGroup = '';
        });

        beforeEach(inject([HttpErrorInterceptor, AuthenticationTransactionService, HttpTestingController], (_interceptor: HttpErrorInterceptor, _accountService: AuthenticationTransactionService, _httpMock: HttpTestingController) => {
            interceptor = _interceptor;
            authService = _accountService;
            httpMock = _httpMock;

            __karma__.config.testGroup = "";

            fixture = TestBed.createComponent(DynamicSimplifiedRegistrationLayoutComponent);
            component = fixture.componentInstance;

            fixture.detectChanges();

        }));

        afterEach((done) => {
            __karma__.config.testGroup = "";

            authService.logout().then(() => {
                expect(authService.isLoggedIn()).toBe(false);
                expect(sessionStorage.getItem('currentUser')).toBe(null);
                done();
            });
            let mockStatusResponse = {
                status: 200,
                statusText: 'OK'
            };
            let statusData = {};
            let req = httpMock.expectOne('mocks/commerce/transaction/store/1/loginidentity/@self.logout.mocks.json');
            req.flush(statusData, mockStatusResponse);
        });

        it('should instantiate', () => {
            // instatiation test case
            expect(component).toBeTruthy();
        });

        it('should throw error for passowordNotMatch', (done) => {
            // throw error if verify password does not match with the password
           __karma__.config.testGroup = 'passowordNotMatch';

            component.register().then(res => {
                expect(component.registerErrorMsg).toBeDefined();
                expect(component.registerErrorMsg).toBe("The verify password you entered does not match your password. Type your password in the Verify password field and try again.")

                expect(component.authService.isLoggedIn()).toBe(false);
                expect(sessionStorage.getItem('currentUser')).toBeNull();
                expect(component.registerLoading).toBe(false);
                done();

            });
            const mockErrorResponse = {
                status: 400,
                statusText: 'Bad Request'
            };
            const errorData = { "errors": [{ "errorKey": "_ERR_PASSWORDS_NOT_SAME", "errorParameters": "logonPassword", "errorMessage": "The verify password you entered does not match your password. Type your password in the Verify password field and try again.", "errorCode": "2080" }] };
            let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person.passowordNotMatch.registerPerson.mocks.json');
            req.flush(errorData, mockErrorResponse);
        });

    });