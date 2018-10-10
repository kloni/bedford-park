import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { OrderTotalComponent } from './order-total.component';
import { Logger } from 'angular2-logger/core';
import { ProductService } from '../../../services/product.service';
import { ProductViewService } from '../../../services/rest/search/productView.service';
import { CartService } from '../../../services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from '../../../services/rest/transaction/assignedPromotionCode.service';
import { AuthenticationTransactionService } from '../../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../../services/rest/transaction/person.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { CartTransactionService } from '../../../services/componentTransaction/cart.transaction.service';
import { ShippingInfoService } from '../../../services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../../services/rest/transaction/paymentInstruction.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from '../../../common/common.test.module';

declare var __karma__: any;

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

describe('OrderTotalComponent', () => {
  let component: OrderTotalComponent;
  let fixture: ComponentFixture<OrderTotalComponent>;
  let cartTransactionService: CartTransactionService;
  let ngAfterViewInitSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTotalComponent],
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
        LoginIdentityService, PersonService, ShippingInfoService, PaymentInstructionService,
        ActivePageService,
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
    cartTransactionService.getCart().then(res => {
      fixture = TestBed.createComponent(OrderTotalComponent);
      component = fixture.componentInstance;
      ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
      fixture.detectChanges();
      component.ngOnDestroy = function(){};
      done();
    });
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it("should instantiate", async(() => {

    expect(component).toBeTruthy();

  }));

  it('should be able to set and get isCheckout flag', () => {

    expect(component.isCheckout).toBeFalsy();
    component.isCheckout = true;
    expect(component.isCheckout).toBeTruthy();

  });


});
