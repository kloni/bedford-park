import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { CartAddressComponent } from './cart-address.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';

import { AuthenticationTransactionService } from '../../../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../../../services/rest/transaction/loginIdentity.service';
import { Logger } from 'angular2-logger/core';
import { PersonService } from '../../../../services/rest/transaction/person.service';
import { CartTransactionService } from '../../../../services/componentTransaction/cart.transaction.service';
import { ProductService } from '../../../../services/product.service';
import { ProductViewService } from '../../../../services/rest/search/productView.service';
import { CartService } from '../../../../services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from '../../../../services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from '../../../../services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../../../services/rest/transaction/paymentInstruction.service';
import { PersonContactService } from '../../../../services/rest/transaction/personContact.service';
import { CountryService } from '../../../../services/rest/transaction/country.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

xdescribe('CartAddressComponent', () => {
  let component: any;
  let fixture: ComponentFixture<CartAddressComponent>;
  let authenticationTransactionService: AuthenticationTransactionService;
  let personService: PersonService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartAddressComponent],
      imports: [TranslateModule.forRoot({
                loader: {
                  provide: TranslateLoader,
                  useFactory: HttpLoaderFactory,
                  deps: [HttpClient]
                },
              }),
        CommonTestModule,
        HttpClientModule, HttpModule, FormsModule
      ],
      providers: [AuthenticationTransactionService,
        LoginIdentityService,
        Logger, PersonService, CartTransactionService, ProductService,
        ProductViewService, CartService, AssignedPromotionCodeService,
        PersonContactService, CountryService, ShippingInfoService, PaymentInstructionService,
        ActivePageService,
        { provide: Router, useClass: MockRouter },
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(inject([AuthenticationTransactionService, PersonContactService], (_authenticationTransactionService: AuthenticationTransactionService
    , _personService: PersonService) => {
    __karma__.config.testGroup = '';
    authenticationTransactionService = _authenticationTransactionService;
    personService = _personService;
  }))
  );

  beforeEach((done) => {
    __karma__.config.testGroup = '';
    authenticationTransactionService.login("username", "password").then(res => {
      fixture = TestBed.createComponent(CartAddressComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    })
  });

  afterEach((done) => {
    component = null;
    authenticationTransactionService.logout().then(res => {
      done();
    })
  });

  it("should instantiate", () => {

    expect(component).toBeTruthy();

  });



  it("should be able to get null if there are no addresses", (done) => {

    //using spy to return null for addresses. This is because the component is initialized with addresses
    authenticationTransactionService.logout().then(res => {
      let spy = spyOn(component, 'addresses').and.returnValue(null);
      expect(component.addresses).toBeNull();
      done();
    })
  });


  it("should be able to retrieve address when logged in", (done) => {

    component.initAddressList().then(res => {
      expect(component.addresses.length).toBeGreaterThan(0);
      done();
    })

  });

  it("should be able to retrieve address when logged out", (done) => {

    authenticationTransactionService.logout().then(res => {
      component.initAddressList().then(res => {
        expect(component.addresses.length).toBe(239);
        done();
      })

    })
  });

  it("should be able to set address when logged out", (done) => {

    authenticationTransactionService.logout().then(res => {
      component.addresses = ['Canada', 'Ontario', 'Toronto']
      expect(component.addresses.length).toBe(3);
      done();

    })
  });

  it("should be able to get shipping estimate using dummyAddress", (done) => {

    component.country = { 'code': 'CA' };
    component.zip = 'eerrt';
    let spy = spyOn(component.cartTransactionService, 'getCart');
    component.getQuote().then(res => {
      expect(component.cartTransactionService.getCart).toHaveBeenCalled();
      done();
    });


  });

  it("should be able to get shipping estimate using addressId", (done) => {

    component.country = { 'addressId': '6723733215' };
    let spy = spyOn(component.cartTransactionService, 'getCart');

    component.getQuote().then(res => {
      expect(component.cartTransactionService.getCart).toHaveBeenCalled();
      done();

    });
  });
});
