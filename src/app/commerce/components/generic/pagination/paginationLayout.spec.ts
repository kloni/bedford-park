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
import { Component, Input, EventEmitter, Output } from '@angular/core';

import { PaginationLayoutComponent } from './paginationLayout';
import { HttpErrorInterceptor } from '../../../../commerce/common/util/http.error.interceptor';
import { AuthenticationTransactionService } from '../../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../../services/rest/transaction/person.service';
import { MockActivatedRoute } from '../../../../../mocks/angular-class/activated-route';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { OrderTransactionService } from '../../../services/componentTransaction/order.transaction.service';
import { OrderService } from "../../../services/rest/transaction/order.service";
import { CartService } from "../../../services/rest/transaction/cart.service";
import { ProductService } from "../../../services/product.service";
import { ProductViewService } from '../../../services/rest/search/productView.service';
import { AccountTransactionService } from "../../../services/componentTransaction/account.transaction.service";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from 'app/commerce/common/common.test.module';

declare var __karma__: any;

describe('PaginationLayoutComponent', () => {


    let component: any;
    let fixture: ComponentFixture<PaginationLayoutComponent>;
    let authService: AuthenticationTransactionService;
    let Ordsrv: OrderTransactionService;
    let acctSvc: AccountTransactionService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [PaginationLayoutComponent, PaginationLayoutComponent],
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
                ActivePageService, AccountTransactionService,
                OrderTransactionService,
                CartService, ProductViewService,
                OrderService, 
                ProductService,
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }
            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
    }));

    beforeEach(async(inject([AuthenticationTransactionService, OrderTransactionService, AccountTransactionService], (_authService: AuthenticationTransactionService, _orderService: OrderTransactionService, _acctSvc: AccountTransactionService) => {
        authService = _authService;
        Ordsrv = _orderService;
        acctSvc = _acctSvc;
    })));
    beforeEach((done) => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(PaginationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        done();
    });
    it('should instantiate', (done) => {
        // instatiation test case
        expect(component).toBeTruthy();
        done();
    });
    it('should go to page', (done) => {
        // go to specified page
        component.goPage.subscribe(res => {
            expect(res).toEqual(3);
            done();
        })
        component.onPage(3);
    });
    it('should go to next page', (done) => {
        // go to next page
        component.goNext.subscribe(res => {
            expect(res).toEqual(true);
            done();
        })
        component.onNext(true);
    });
    it('should go to prev page', (done) => {
        // go to previous page
        component.goPrev.subscribe(res => {
            expect(res).toEqual(true);
            done();
        })
        component.onPrev();
    });
    it('should get the page list', (done) => {
        // get the page list
        component.getPages();
        expect(component).toBeDefined();
        done();
    });
    it('should check if current page is last page', (done) => {
        // check if current page is last page
        component.pageSize = 5;
        component.total =  19;
        component.pageNumber = 4
        component.lastPage();
        expect(component.lastPage()).toBe(true);
        component.pageNumber = 3
        component.lastPage();
        expect(component.lastPage()).toBe(false);
        done();
    });
    it('should get the total pages', (done) => {
        // get the total number of pages
        component.pageSize = 5;
        component.total =  19;
        component.totalPages();
        expect(component.totalPages()).toBe(4);
        done();
    });
    it('should get min item on page', (done) => {
        // gets the minimum item on current page
        component.getMin();
        expect(component.getMin).toBeDefined();
        done();
    });
    it('should get max item on page', (done) => {
        // gets the maximum item on current page
        component.getMax();
        expect(component.getMax).toBeDefined();
        done();
    });
});
