import { CommercePipesModule } from './../../../pipes/commerce-pipes.module';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Logger } from 'angular2-logger/core';
import { CartTransactionService } from '../../../services/componentTransaction/cart.transaction.service';
import { CartService } from '../../../services/rest/transaction/cart.service';
import { AuthenticationTransactionService } from '../../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../../services/rest/transaction/loginIdentity.service';
import { OrderItemsComponent } from './order-items.component';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { OrderTransactionService } from '../../../services/componentTransaction/order.transaction.service';
import { MockRouter } from 'mocks/angular-class/router';
import { PrivacyPolicyService } from '../../../services/componentTransaction/privacypolicy.service';
import { StoreConfigurationsCache } from '../../../common/util/storeConfigurations.cache';
import { StorefrontUtils } from '../../../common/storefrontUtils.service';
import { CurrentUser } from '../../../common/util/currentUser';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('OrderItemsComponent', () => {
  let component: OrderItemsComponent;
  let fixture: ComponentFixture<OrderItemsComponent>;
  let cartTransactionService: CartTransactionService;
  let cartService: CartService;
  let ngAfterViewInitSpy;
  let openMdl;
  let closMdl;

  let orderTranService: OrderTransactionService;
  let mockRouter: Router;
  let authService: AuthenticationTransactionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderItemsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
        }),
        CommercePipesModule,
        CommonTestModule,
        HttpClientModule,
        HttpModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        Logger,
        { provide: PrivacyPolicyService, useClass: class {} },
        { provide: StoreConfigurationsCache, useClass: class {} },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([AuthenticationTransactionService], (_accountService: AuthenticationTransactionService) => {
    __karma__.config.testGroup = '';
    cartTransactionService = TestBed.get(CartTransactionService);
    cartService = TestBed.get(CartService);
    authService = _accountService;
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrderItemsComponent);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    closMdl = spyOn(component, 'closeModal').and.callFake(function(){});
    openMdl = spyOn(component, 'openModal').and.callFake(function(){});
    fixture.detectChanges();
    mockRouter = TestBed.get(Router);
    mockRouter.initialNavigation();
  }));

  it("should instantiate", () => {
    expect(component).toBeTruthy();
    component.ngAfterViewInit
  });


  it("should be able to change quantity", (done) => {
    let spy = spyOn(cartService, 'updateOrderItem').and.returnValue(Observable.of({ "orderId": "6395343035", "orderItem": [{ "orderItemId": "40823" }] }));

    const quantityUpdate: any =
      {
        target: {
          style: { width: 100 },
          value: 3
        }
      };

    cartTransactionService.getCart().then(res => {
      component.quantityKeyup(quantityUpdate, ({ 'orderItem': 'AuroraWMDRS-001', 'quantity': '3' })).then(res => {
        expect(cartService.updateOrderItem).toHaveBeenCalled();
        done();
      });

    });

  });

  it("should be able to delete order item", (done) => {
    let spy = spyOn(cartService, 'deleteOrderItem').and.returnValue(Observable.of({ "orderId": ["6324290148"] }));
    const quantityUpdate: any =
      {
        target: {
          value: 3
        }
      };

    cartTransactionService.getCart().then(res => {
      component.deleteOrderItem({ 'orderItem': 'AuroraWMDRS-001', 'quantity': '3' }).then(res => {
        expect(cartService.deleteOrderItem).toHaveBeenCalled();
        done();
      });
    });

  });

  it('should be able to set and get isCheckout flag', () => {

    expect(component.isCheckout).toBeFalsy();
    component.isCheckout = true;
    expect(component.isCheckout).toBeTruthy();

  });

  it("should be able to get wishlist ", (done) => {
    component.getWishLists().then(res => {
      expect(component.wishLists.length).toBeGreaterThanOrEqual(1);
      done();
    });
  });

  it("should be able to move to wishlist ", (done) => {
    const old = StorefrontUtils.getCurrentUser();
    StorefrontUtils.saveCurrentUser({ isGuest: false, isCSR: false, WCTrustedToken: "x", WCToken: "x" } as CurrentUser);
    spyOn(component, 'deleteOrderItem');
    component.moveToWishList('10007').then(res => {
        expect(component.deleteOrderItem).toHaveBeenCalled();
        StorefrontUtils.saveCurrentUser(old);
        done();
    });
  });

  it("should be able to go to registration page ", (done) => {
    component.goToRegistrationPage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sign-in']);
    done();
  });

  it("should log in successfully", (done) => {
    component.login().then(res => {
        expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
        expect(authService.isLoggedIn()).toBe(true);
        done();
    });
 });

});



