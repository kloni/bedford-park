import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Logger } from 'angular2-logger/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { DynamicOrderHistoryLayoutComponent } from './order-history.dynamic.component';
import { PaginationLayoutComponent } from "../../components/generic/pagination/paginationLayout";
import { HttpErrorInterceptor } from '../../../commerce/common/util/http.error.interceptor';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { OrderTransactionService } from '../../services/componentTransaction/order.transaction.service';
import { OrderService } from "../../services/rest/transaction/order.service";
import { CartService } from "../../services/rest/transaction/cart.service";
import { ProductService } from "../../services/product.service";
import { ProductViewService } from '../../services/rest/search/productView.service';
import { AccountTransactionService } from "../../services/componentTransaction/account.transaction.service";
import { MockRouter } from 'mocks/angular-class/router';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

describe('DynamicOrderHistoryLayoutComponent', () => {

    let component: any;
    let fixture: ComponentFixture<DynamicOrderHistoryLayoutComponent>;
    let authService: AuthenticationTransactionService;
    let Odsrc: OrderTransactionService;
    let acctSvc: AccountTransactionService;


    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicOrderHistoryLayoutComponent, PaginationLayoutComponent],
            imports: [HttpClientModule, HttpModule, FormsModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                }),
                CommercePipesModule,
                CommonTestModule
            ],
            providers: [
                AuthenticationTransactionService,
                LoginIdentityService,
                Logger,
                PersonService,
                ActivePageService, AccountTransactionService,
                OrderTransactionService, CartService, ProductViewService,
                OrderService, ProductService, 
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }
            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
    }));

    beforeEach(async(inject([AuthenticationTransactionService, OrderTransactionService, AccountTransactionService], (_authService: AuthenticationTransactionService, _orderService: OrderTransactionService, _acctSvc: AccountTransactionService) => {
        authService = _authService;
        Odsrc = _orderService;
        acctSvc = _acctSvc;

    })));
    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(DynamicOrderHistoryLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate', (done) => {
        // instatiation test case
        expect(component).toBeTruthy();
        done();

    });

    it('should get order history', (done) => {
        // get order history
        component.getOrderHistory().then(res => {
            component.initializeOrderDetails(component.orders[0]).then(re => {
                expect(component.orders[0].orderId).toBe('7566410414');
                expect(component.orders[0].placedDate).toBe('2017-12-11T19:51:23.235Z');
                expect(component.orders[0].grandTotal).toBe('27.00000');
                expect(component.orders[0].orderDetails.orderItem[0].productId).toBe('10001');
                expect(component.orders[0].orderDetails.Qty).toBe(3);
                expect(component.errorMsg).toBe('');
                done();
            })
        })
    });
    it('should throw error order history for the user', (done) => {
        // throw error if cannot get order history
        __karma__.config.testGroup = "error";
        component.getOrderHistory().then(res => {
            expect(component.errorMsg).toBe("Unable to get order history");
            done();
        })
    });

    it('should go to page as ', (done) => {
        // go to page
        __karma__.config.testGroup = '';
        component.goToPage(2);
        expect(component.pageNumber).toBe(2);
        component.goToPage(1);
        expect(component.pageNumber).toBe(1);
        done();
    });

    it('should go to next page', (done) => {
        // next page
        component.goToPage(1);
        component.onNext();
        expect(component.pageNumber).toBe(2);
        done();
    });

    it('should go to prev page', (done) => {
        // prev gage
        component.goToPage(2);
        component.onPrev();
        expect(component.pageNumber).toBe(1);
        done();
    });
    it('should throw error if cannot get order details', (done) => {
        __karma__.config.testGroup = 'invalidOrderDetails';
        component.getOrderHistory().then(res => {
            component.initializeOrderDetails(component.orders[0]).then(res => {
                expect(component.initializeOrderDetails).toThrowError();
                expect(component.errorMsg).toBe("Error getting order details: %o");
                done();
            })
        });
    });
    it('should show correct order status', (done) => {
        __karma__.config.testGroup = '';
        component.getOrderHistory().then(res => {
            component.getOrderStatusDescription(component.orders[0].orderStatus);
            expect(component.orderStatus).toEqual("Order received and ready for processing");
            component.getOrderStatusDescription(component.orders[1].orderStatus);
            expect(component.orderStatus).toEqual("Payment approved");
            component.getOrderStatusDescription(component.orders[2].orderStatus);
            expect(component.orderStatus).toEqual("Order shipped");
            component.getOrderStatusDescription(component.orders[3].orderStatus);
            expect(component.orderStatus).toEqual("Pending approval");
            component.getOrderStatusDescription(component.orders[4].orderStatus);
            expect(component.orderStatus).toEqual("Order completed");
            done();
        })
    });

});