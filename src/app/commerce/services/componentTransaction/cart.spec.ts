import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Logger } from "angular2-logger/core";

import { CartTransactionService } from './cart.transaction.service';
import { ProductService } from "../product.service";
import { GuestIdentityService } from "../rest/transaction/guestIdentity.service";
import { ProductViewService } from "../rest/search/productView.service";
import { AssignedPromotionCodeService } from "../rest/transaction/assignedPromotionCode.service";
import { AuthenticationTransactionService } from '../../../commerce/services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from "../rest/transaction/loginIdentity.service";
import { PersonService } from "../rest/transaction/person.service";
import { CartService } from "../rest/transaction/cart.service";
import { ShippingInfoService } from './../rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from './../rest/transaction/paymentInstruction.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { CommerceEnvironment } from './../../../commerce/commerce.environment';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__:any;

describe('CartTransactionService', () => {

    let cartService : any;
    let authenticationService : any;

    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CartTransactionService,
                ActivePageService,
                ProductService,
                ProductViewService,
                AssignedPromotionCodeService,
                CartService,
                AuthenticationTransactionService,
                LoginIdentityService,
                PersonService,
                GuestIdentityService,
                Logger,
                ShippingInfoService,
                PaymentInstructionService,
                TranslateService,
                { provide: Router, useClass: MockRouter }
            ]
        });
    });

    beforeEach(inject([CartTransactionService, AuthenticationTransactionService], (_cartTransactionService : CartTransactionService, _authTransactionService: AuthenticationTransactionService) => {
        cartService = _cartTransactionService;
        authenticationService = _authTransactionService;

        // TODO: need to fix to properly  test this._observer.next
        authenticationService._observer = new Observable<boolean>(observer => this._observer = observer).share();
        authenticationService._observer.next = function(){ return ; }

        __karma__.config.testGroup = "";
    }));

    afterEach(() => {
        if (authenticationService.isLoggedIn() || sessionStorage.getItem('currentUser')) {
            authenticationService.logout().then( res => {
                expect(sessionStorage.getItem('currentUser')).toBeNull();
                expect(authenticationService.isLoggedIn()).toBe(false);
            })
        }
    });

    it('should instantiate', () => {
        expect(cartService).toEqual(jasmine.any(CartTransactionService));
        expect(authenticationService).toEqual(jasmine.any(AuthenticationTransactionService));
    });

    it('adds product to cart as a generic user', ((done) => {
        authenticationService.logout().then( res => {
            expect(sessionStorage.getItem('currentUser')).toBeNull();
            expect(authenticationService.isLoggedIn()).toBe(false);

            cartService.addToCart(1, 'AuroraWMDRS-001').then( res => {
                // If generic user, then addToCart will invoke guestLogin and set a session storage
                expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
                expect(res.body.orderItem.length).toBe(1);
                done();
            })
        })
    }));

    it('adds product to cart as a registered user', ((done) => {
        authenticationService.login('username', 'password').then( res => {

            // currentUser is encoded to binary
            expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
            expect(authenticationService.isLoggedIn()).toBe(true);

            cartService.addToCart(1, 'AuroraWMDRS-001').then( res => {
                expect(res.body.orderItem.length).toBe(1);
                done();
            });
        });
    }));

    it('adds product to cart with too many quantities', ((done) => {
        __karma__.config.testGroup = "largeQuantities";
        cartService.addToCart(100000, 'AuroraWMDRS-001').then( res => {
            expect(res.body.errors.length).toBe(1);
            done();
        })
    }));

    it('adds product to cart when the product is out of stock', ((done) => {
        __karma__.config.testGroup = "outOfStock";
        cartService.addToCart(1000, 'AuroraWMDRS-001').then( res => {
            expect(res.body.errors.length).toBe(1);
            done();
        })
    }));
});
