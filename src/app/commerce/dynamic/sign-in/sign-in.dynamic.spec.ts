import { MockRouter } from './../../../../mocks/angular-class/router';
import { HttpModule, Http, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Logger } from 'angular2-logger/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { CartTransactionService } from "../../../commerce/services/componentTransaction/cart.transaction.service";
import { CartService } from '../../../commerce/services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from '../../../commerce/services/rest/transaction/assignedPromotionCode.service';
import { ProductService } from "../../../commerce/services/product.service";
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import { ShippingInfoService } from '../../../commerce/services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../../commerce/services/rest/transaction/paymentInstruction.service';

import { HttpErrorInterceptor } from '../../../commerce/common/util/http.error.interceptor';
import { DynamicSignInLayoutComponent } from './sign-in.dynamic.component';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { CurrentUser } from '../../common/util/currentUser';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { UtilsService } from '../../../common/utils/utils.service';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

declare var __karma__: any;

describe('DynamicSignInLayoutComponent', () => {

  let component: any;
  let fixture: ComponentFixture<DynamicSignInLayoutComponent>;
  let authService: AuthenticationTransactionService;
  let de: DebugElement;
  let el: HTMLElement;
  let mockRouter: Router;
  let da: DigitalAnalyticsService;
  let ngAfterViewInitSpy;

  beforeEach(async(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      declarations: [DynamicSignInLayoutComponent],
      imports: [HttpClientModule, HttpModule, FormsModule, RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        CommonTestModule
      ],
      providers: [
        AuthenticationTransactionService,
        LoginIdentityService,
        Logger,
        PersonService,
        ActivePageService,
        ModalDialogService,
        UtilsService,
        AccountTransactionService,
        CartTransactionService,
        ProductService,
        ProductViewService,
        CartService, ShippingInfoService, PaymentInstructionService,
        AssignedPromotionCodeService, 
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    __karma__.config.testGroup = '';
  }));

  beforeEach(async(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {
    authService = _accountService;
    mockRouter = TestBed.get(Router);
    da = TestBed.get(DigitalAnalyticsService);
    fixture = TestBed.createComponent(DynamicSignInLayoutComponent);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    fixture.detectChanges();
    component.ngOnDestroy = function(){};
    mockRouter.initialNavigation();
    __karma__.config.testGroup = "";
  })));

  afterEach((done) => {
    __karma__.config.testGroup = "";
    authService.logout().then(() => {

      expect(authService.isLoggedIn()).toBe(false);
      expect(sessionStorage.getItem('currentUser')).toBe(null);
      done();

    });
  });

  it('should instantiate', () => {
    // instatiation test case
    expect(component).toBeTruthy();
  });

  it('logs in successfully, sets currentUser in sessionStorage, navigates to home and logs out', (done) => {
    component.user = {
      username: 'goodusername',
      password: 'goodpassword'
    };
    component.login().then(res => {
      expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
      expect(component.authService.isLoggedIn()).toBe(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
      done();
    });
  });

  it('should call Digital Analytics Service when logging in', (done) => {
    component.user = {
      username: 'goodusername',
      password: 'goodpassword'
    };
    let daSpy = spyOn(da, 'updateUser');
    component.login().then(res => {
      expect(da.updateUser).toHaveBeenCalled();
      done();
    });
	});

  it('should continueAsGuest when current user is guest', () => {

    component.authService.redirectUrl = '/checkout';
    let testUser: CurrentUser = StorefrontUtils.getCurrentUser();
    testUser = {
      "WCTrustedToken": "FakeTrustedToken",
      "WCToken": "FakeToken",
      "isGuest": true,
      "isGoingToCheckout": true,
      "isCheckoutAsGuest": false,
      "isCSR": false
    }
    StorefrontUtils.saveCurrentUser(testUser);
    component.continueAsGuest();
    let testUserAfter: CurrentUser = StorefrontUtils.getCurrentUser();
    expect(testUserAfter.isCheckoutAsGuest).toBeTruthy();

    //selecting continue as guest should navigate to checkout page
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');

  });

  it('should set showContinueAsGuest = true when current user is guest', () => {

    let testUser: CurrentUser = StorefrontUtils.getCurrentUser();
    testUser = {
      "WCTrustedToken": "FakeTrustedToken",
      "WCToken": "FakeToken",
      "isGuest": true,
      "isGoingToCheckout": true,
      "isCheckoutAsGuest": false,
      "isCSR": false
    }
    StorefrontUtils.saveCurrentUser(testUser);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.showContinueAsGuest).toBeTruthy();
  });

  it('should not continueAsGuest when current user is not guest', () => {

    let testUser: CurrentUser = StorefrontUtils.getCurrentUser();
    testUser = {
      "WCTrustedToken": "FakeTrustedToken",
      "WCToken": "FakeToken",
      "isGuest": false,
      "isGoingToCheckout": true,
      "isCheckoutAsGuest": false,
      "isCSR": false
    }
    StorefrontUtils.saveCurrentUser(testUser);
    component.continueAsGuest();
    let testUserAfter: CurrentUser = StorefrontUtils.getCurrentUser();
    expect(testUserAfter.isCheckoutAsGuest).toBeFalsy();
  });

  it('should set showContinueAsGuest = false when current user is not guest', () => {

    let testUser: CurrentUser = StorefrontUtils.getCurrentUser();
    testUser = {
      "WCTrustedToken": "FakeTrustedToken",
      "WCToken": "FakeToken",
      "isGuest": false,
      "isGoingToCheckout": true,
      "isCheckoutAsGuest": false,
      "isCSR": false
    }
    StorefrontUtils.saveCurrentUser(testUser);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.showContinueAsGuest).toBeFalsy();
  });


});

describe('SignInLayoutComponent - Error Case', () => {
  let component: any;
  let fixture: ComponentFixture<DynamicSignInLayoutComponent>;
  let httpMock: any;
  let authService: AuthenticationTransactionService;
  let de: DebugElement;
  let el: HTMLElement;
  let mockRouter: Router;
  let ngAfterViewInitSpy;

  beforeEach(async(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      declarations: [DynamicSignInLayoutComponent],
      imports: [HttpClientModule, HttpModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        CommonTestModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
        HttpErrorInterceptor,
        AuthenticationTransactionService,
        LoginIdentityService,
        Logger,
        PersonService,
        ActivePageService,
        ModalDialogService,
        UtilsService,
        AccountTransactionService,
        ModalDialogService,
        CartTransactionService,
        ProductService,
        ProductViewService,
        CartService, ShippingInfoService, PaymentInstructionService,
        AssignedPromotionCodeService, 
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    __karma__.config.testGroup = '';
  }));

  beforeEach(async(inject([AuthenticationTransactionService, HttpTestingController], (_accountService: AuthenticationTransactionService, _httpMock: HttpTestingController) => {
    authService = _accountService;
    httpMock = _httpMock;

    mockRouter = TestBed.get(Router);
    fixture = TestBed.createComponent(DynamicSignInLayoutComponent);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    fixture.detectChanges();
    component.ngOnDestroy = function(){};
    mockRouter.initialNavigation();

    __karma__.config.testGroup = "";
  })));

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

  it('sets bad password, get error response and parses error code', async(() => {
    __karma__.config.testGroup = 'badPassword';
    component.login().then(res => {
      // verify user is not logged
      expect(component.loginErrorMsg).toBeDefined();
      expect(component.loginErrorMsg).toBe("Either the logon ID or password entered is incorrect. Enter the information again.")
      expect(component.authService.isLoggedIn()).toBe(false);
      expect(sessionStorage.getItem('currentUser')).toBeNull();
    });

    // mock error with status code 400
    const mockErrorResponse = {
      status: 400,
      statusText: 'Bad Request'
    };
    const errorData = { "errors": [{ "errorKey": "_ERR_AUTHENTICATION_ERROR", "errorParameters": "", "errorMessage": "The specified logon ID or password are not correct. Verify the information provided and log in again.", "errorCode": "2030" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/loginidentity.badPassword.login.mocks.json');
    req.flush(errorData, mockErrorResponse);
  }));

  it('get error response and parses error code when a shopper account is locked out due to excessive failed login attempts', async(() => {
    
   __karma__.config.testGroup = 'accountLocked';
    //use spy here to check if openForgotPassword is called when shopper account is locked out
    spyOn(component,'openForgotPassword')
    component.login().then(res => {
      // verify user is not logged in
      expect(component.accountLockErrorMsg).toBe("Your account has been locked due to excessive failed login attempts.  Please reset your password to continue.")
      expect(component.openForgotPassword).toHaveBeenCalled();
      expect(component.accountLockErrorMsg).toBeDefined();
      expect(component.authService.isLoggedIn()).toBe(false);
      expect(sessionStorage.getItem('currentUser')).toBeNull();
    });

    // mock error with status code 400
    const mockErrorResponse = {
      status: 400,
      statusText: 'Bad Request'
    };
    const errorData = { "errors": [{ "errorKey": "_ERR_AUTHENTICATION_ERROR", "errorParameters": "", "errorMessage": "Your account has been locked due to excessive failed login attempts.  Please reset your password to continue.", "errorCode": "2490" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/loginidentity.accountLocked.login.mocks.json');
    req.flush(errorData, mockErrorResponse);
  }));

  it('resets password with bad params and parse given error message', async(() => {
    __karma__.config.testGroup = 'badPasswordReset';

    component.resetPassword().then(res => {
      // verify error message is shown
      expect(component.resetPasswordErrorMsg).toBe('The logon ID that you entered is not valid. Check your entry and try again.');
    });

    // mock error with status code 400
    let mockErrorStatus = {
      status: 400,
      statusText: 'Bad Request'
    };
    let mockResponse = { "errors": [{ "errorKey": "_ERR_BAD_PARMS", "errorParameters": "logonId", "errorMessage": "The logon ID that you entered is not valid. Check your entry and try again.", "errorCode": "2010" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.badPasswordReset.updatePerson.mocks.json');
    req.flush(mockResponse, mockErrorStatus);
  }));

  it('resets password with bad params, get error with no errorMessage, so displays fallback message', async(() => {
    __karma__.config.testGroup = 'badPasswordResetWithNoError';

    component.resetPassword().then(res => {
      // verify that default error message should be shown
      expect(component.resetPasswordErrorMsg).toBe('The logon ID that you entered is not valid. Check your entry and try again.');
    });

    // mock error with status code 400
    let mockErrorStatus = {
      status: 400,
      statusText: 'Bad Request'
    };
    let mockResponse = { "errors": [{ "errorKey": "_ERR_BAD_PARMS", "errorParameters": "logonId", "errorCode": "2010" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.badPasswordResetWithNoError.updatePerson.mocks.json');
    req.flush(mockResponse, mockErrorStatus);
  }));

});
