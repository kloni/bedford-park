import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShoppingcartLayoutComponent } from './shoppingcartLayout';
import { CartTransactionService } from '../../services/componentTransaction/cart.transaction.service';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from '../../services/rest/transaction/personContact.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { CountryService } from '../../services/rest/transaction/country.service';
import { ProductService } from '../../services/product.service';
import { ProductViewService } from '../../services/rest/search/productView.service';
import { Logger } from 'angular2-logger/core';
import { CartService } from '../../services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from '../../services/rest/transaction/assignedPromotionCode.service';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, } from '@ngx-translate/core';
import { ShippingInfoService } from '../../services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../services/rest/transaction/paymentInstruction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { CurrentUser } from './../../common/util/currentUser';
import { MockRouter } from 'mocks/angular-class/router';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('shoppingcartLayoutComponent', () => {

  let component: ShoppingcartLayoutComponent;
  let fixture: ComponentFixture<ShoppingcartLayoutComponent>;
  let authenticationTransactionService: AuthenticationTransactionService;
  let cartTransactionService: CartTransactionService;
  let mockRouter: Router;
  let da: DigitalAnalyticsService;
  let cartService: CartService;

  beforeEach((done) => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      declarations: [ShoppingcartLayoutComponent],
      imports: [
        HttpClientModule, HttpModule, FormsModule, RouterModule, CommercePipesModule,
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AuthenticationTransactionService,
        LoginIdentityService,
        Logger, PersonService, CartTransactionService, ProductService,
        ProductViewService, CartService, AssignedPromotionCodeService,
        PersonContactService, CountryService, ShippingInfoService, PaymentInstructionService,
        ActivePageService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    done();

  });

  beforeEach(done => {
    __karma__.config.testGroup = '';
    authenticationTransactionService = TestBed.get(AuthenticationTransactionService);
    cartTransactionService =TestBed.get(CartTransactionService);
    done();
  });

  beforeEach(() => {
    __karma__.config.testGroup = '';
    da = TestBed.get(DigitalAnalyticsService);
    mockRouter = TestBed.get(Router);
    fixture = TestBed.createComponent(ShoppingcartLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockRouter.initialNavigation();
    cartService = TestBed.get(CartService);

  });

  afterEach((done) => {
    __karma__.config.testGroup = "";
    authenticationTransactionService.logout().then(() => {
      expect(authenticationTransactionService.isLoggedIn()).toBe(false);
      done();
    });
  });

  it('should instantiate', () => {
    expect(component).toBeTruthy();
  });

  it('should beginCheckout() as guest and navigate to checkout page', (done) => {
    let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
    component.beginCheckout();
      expect(currentUser).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
      done();
  });

  it('should beginCheckout() as registered shopper and navigate to checkout page', (done) => {
    authenticationTransactionService.login("username", "password").then(res => {
      let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
      component.beginCheckout();
        expect(currentUser).toBeTruthy();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
        done();
    })
  });

  it('should call digital analytic service when viewing cart', (done) => {
    let daSpy = spyOn(da, 'viewCart');
    setTimeout(function(){
      expect(da.viewCart).toHaveBeenCalled();
      done();
    }, 2000);
  });

  it('should set the user name for error message when CSR is logged in on bahalf of a shopper', (done) => {
    authenticationTransactionService.login("username", "password").then(res => {
        let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        currentUser.isCSR=true;
        currentUser.forUser={"userName":"forUser@ibm.com"};
        StorefrontUtils.saveCurrentUser(currentUser);

        component.setUserName();
        expect(component.errorUserName).toEqual("forUser@ibm.com");
        done();
    });
  });

  it('cart lock not onbahelf of a shopper', (done) => {

    spyOn(cartService, 'lockCart').and.returnValue(Observable.of({"orderVersion":0}));

    authenticationTransactionService.login("username", "password").then(res => {
        let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        currentUser.isCSR=true;
        currentUser.forUser={"userName":"forUser@ibm.com"};
        StorefrontUtils.saveCurrentUser(currentUser);

        component.onBehalf= false;
        component.isCSR = true;
        component.cartId='1';

        component.lock().then(r=>{
            expect(component.isLocked).toBe(true);
            done();
        });
    });
  });


  it('cart lock onbehalf of a shopper', (done) => {
    spyOn(cartService, 'lockCartOnBehalf').and.returnValue(Observable.of({"orderVersion":0}));
    spyOn(component, 'initializeCart').and.callFake(function(){
        return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>())
    });

    authenticationTransactionService.login("username", "password").then(res => {
        let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        currentUser.isCSR=true;
        currentUser.forUser={"userName":"forUser@ibm.com"};
        StorefrontUtils.saveCurrentUser(currentUser);

        component.onBehalf= true;
        component.isCSR = true;
        component.cartId='1';

        component.lock().then(r =>{
            setTimeout(function(){
                expect(component.initializeCart).toHaveBeenCalled();
                expect(component.isLocked).toBe(true);
                done();
            }, 2000);
        });
    });
  });

  it('cart lock onbehalf of a shopper, but encounters another CSR locked the cart', (done) => {
    __karma__.config.testGroup='lockerror';

    let spy = spyOn(cartService, 'lockCartOnBehalf').and.returnValue(Observable.throw({
        status: 404,
        error: {
            errors: [{
                errorMessage: "_CART_LOCKED"
            }]
        }
    }));
    component.onBehalf= true;
    component.isCSR = true;
    component.cartId='error';
    component.isLocked=false;
    component.lockOwner="";

    component.lock().then(e=> {
        expect(component.errorMsg).toEqual("_CART_LOCKED");
        expect(component.isLocked).toBe(false);
        done();
    });
  });

  it('clear error message', (done) => {
    component.errorMsg= "error!";
    component.clearError();
    expect(component.errorMsg).toBeUndefined();
    done();
  });
})
