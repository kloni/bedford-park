import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorInterceptor } from '../../../../commerce/common/util/http.error.interceptor';
import { AuthenticationTransactionService } from '../../../services/componentTransaction/authentication.transaction.service';
import { CartTransactionService } from '../../../services/componentTransaction/cart.transaction.service';
import { ProductService } from '../../../services/product.service';
import { ProductViewService } from '../../../services/rest/search/productView.service';
import { MockActivatedRoute } from '../../../../../mocks/angular-class/activated-route';
import { Logger } from 'angular2-logger/core';
import { CartService } from '../../../services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from '../../../services/rest/transaction/assignedPromotionCode.service';
import { LoginIdentityService } from '../../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../../services/rest/transaction/person.service';
import { OrderPromotionComponent } from './order-promotion.component';
import { ShippingInfoService } from '../../../services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../../services/rest/transaction/paymentInstruction.service';
import { PersonContactService } from '../../../services/rest/transaction/personContact.service';
import { CountryService } from '../../../services/rest/transaction/country.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('OrderPromotionComponent', () => {
  let component: OrderPromotionComponent;
  let fixture: ComponentFixture<OrderPromotionComponent>;
  let httpMock: any;
  let interceptor: HttpErrorInterceptor;
  let cartTransactionService: CartTransactionService;
  let ngAfterViewInitSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPromotionComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        CommonTestModule,
        HttpClientModule, HttpModule, FormsModule
      ],
      providers: [CartTransactionService, ProductService, ProductViewService,
        Logger, CartService, AssignedPromotionCodeService, AuthenticationTransactionService,
        LoginIdentityService, PersonService,ShippingInfoService,PaymentInstructionService,PersonContactService,
        CountryService,
        ActivePageService,
        ModalDialogService,
        { provide: Router, useClass: MockRouter }
      ]
    })
      .compileComponents();
  }));


  beforeEach(async(inject([CartTransactionService], (_cartTransactionService: CartTransactionService) => {
    __karma__.config.testGroup = '';
    cartTransactionService = _cartTransactionService;
  })));

  beforeEach((done) => {
    __karma__.config.testGroup = '';
    cartTransactionService.getCart().then(res => {
      fixture = TestBed.createComponent(OrderPromotionComponent);
      component = fixture.componentInstance;
      ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
      fixture.detectChanges();
      component.ngOnDestroy = function(){};
      done();
    })
  });

  it("should instantiate", () => {

    expect(component).toBeTruthy();

  });

  it('verify that promo code is added and applied successfully', (done) => {

    let spy = spyOn(component, "updateCartPromotion");

    let testPromoCode: string = "UTPromoCode";
    component.promoCode = testPromoCode;
    expect((component.promoCode).includes(testPromoCode)).toBe(true);
    component.applyPromotionCode().then(res => {
      console.info("PROMO CODES: ", component.promoCode);
      let appliedPromoCodesTest: Set<string> = component.appliedPromoCodes;
      console.info("APPLIED PROMO CODES: ", appliedPromoCodesTest);
      expect(component.updateCartPromotion).toHaveBeenCalled();
      done();

    });


  });

  it('verify that promo code is removed successfully', (done) => {
    let spy = spyOn(component, 'updateCartPromotion');
    let testPromoCode: string = "REGISTER7";
    component.promoCode = testPromoCode;
    expect((component.promoCode).includes(testPromoCode)).toBe(true);
    component.removePromotionCode(testPromoCode).then(res => {
      expect(component.updateCartPromotion).toHaveBeenCalled();
      done();
    });

  });

  it('should be able to set and get isCheckout flag', () => {

       expect(component.isCheckout).toBeFalsy();
       component.isCheckout = true;
       expect(component.isCheckout).toBeTruthy();

      });

});

describe('OrderPromotionComponent - Error Case', () => {

  let component: any;
  let fixture: ComponentFixture<OrderPromotionComponent>;
  let httpMock: any;
  let interceptor: HttpErrorInterceptor;
  let mockRouter: Router;
  let ngAfterViewInitSpy;

  beforeEach(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      declarations: [OrderPromotionComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        CommonTestModule,
        HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
        CartTransactionService, ProductService, ProductViewService,
        Logger, CartService, AssignedPromotionCodeService, AuthenticationTransactionService,
        LoginIdentityService,
        HttpErrorInterceptor,
        LoginIdentityService,
        Logger,
        PersonService,
        ShippingInfoService,PaymentInstructionService,PersonContactService,
        CountryService,
        ActivePageService,
        ModalDialogService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    __karma__.config.testGroup = '';
  });

  beforeEach(inject([HttpErrorInterceptor, HttpTestingController], (_interceptor: HttpErrorInterceptor, _httpMock: HttpTestingController) => {
    httpMock = _httpMock;
    interceptor = _interceptor;
    fixture = TestBed.createComponent(OrderPromotionComponent);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    fixture.detectChanges();
    component.ngOnDestroy = function(){};
  }))

  it('verify that error handling is displaying store error msg', (done) => {

    __karma__.config.testGroup = "notCorrectPromoCode";
    let testPromoCode: string = "UTPromoCode"
    component.promoCode = testPromoCode;
    component.applyPromotionCode().then(res => {
      expect(component.promoCodeError).toBeDefined();
      expect(component.promoCodeError).toBe("The promotion code you have entered is not valid. Verify the code and try again.");
      console.info("PROMO CODE ERROR: ", component.promoCodeError);
      done();
    })

    const mockErrorResponse = {
      status: 400,
      statusText: 'Bad Request'
    };
    let errorData: any = { "errors": [{ "errorKey": "ERR_PROMOTION_CODE_INVALID", "errorParameters": "invalidPromoCode", "errorMessage": "The promotion code you have entered is not valid. Verify the code and try again.", "errorCode": "-1200" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/cart/@self/assigned_promotion_code.notCorrectPromoCode.applyPromotioncode.mocks.json');
    req.flush(errorData, mockErrorResponse);

  });

  it('verify that error handling is displaying server error msg', (done) => {

    __karma__.config.testGroup = "notCorrectPromoCode";
    let testPromoCode: string = "UTPromoCode"
    component.promoCode = testPromoCode;
    component.applyPromotionCode().then(res => {
      expect(component.promoCodeError).toBeDefined();
      expect(component.promoCodeError).toBe("The promotion code you have entered is not valid. Verify the code and try again.");
      done();
    })

    const mockErrorResponse = {
      status: 400,
      statusText: 'Bad Request'
    };
    let errorData: any = { "errors": [{ "errorKey": "", "errorParameters": "invalidPromoCode", "errorMessage": "The promotion code you have entered is not valid. Verify the code and try again.", "errorCode": "" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/cart/@self/assigned_promotion_code.notCorrectPromoCode.applyPromotioncode.mocks.json');
    req.flush(errorData, mockErrorResponse);



  })

  it('verify that onPromoCodeChange clears promo code error', (done) => {

    __karma__.config.testGroup = "notCorrectPromoCode";
    let testPromoCode: string = "UTPromoCode"
    component.promoCode = testPromoCode;
    component.applyPromotionCode().then(res => {
      expect(component.promoCodeError).toBeDefined();
      expect(component.promoCodeError).toBe("The promotion code you have entered is not valid. Verify the code and try again.");
      component.onPromoCodeChange();
      expect(component.promoCodeError).toBeNull();
      done();
    })

    const mockErrorResponse = {
      status: 400,
      statusText: 'Bad Request'
    };
    let errorData: any = { "errors": [{ "errorKey": "ERR_PROMOTION_CODE_INVALID", "errorParameters": "invalidPromoCode", "errorMessage": "The promotion code you have entered is not valid. Verify the code and try again.", "errorCode": "-1200" }] };
    let req = httpMock.expectOne('mocks/commerce/transaction/store/1/cart/@self/assigned_promotion_code.notCorrectPromoCode.applyPromotioncode.mocks.json');
    req.flush(errorData, mockErrorResponse);

  });

});