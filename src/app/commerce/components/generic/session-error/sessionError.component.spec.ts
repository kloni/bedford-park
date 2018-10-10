import { SessionErrorComponent } from "app/commerce/components/generic/session-error/sessionError.component";
import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from "@ngx-translate/core";
import { Injector, ReflectiveInjector, InjectionToken, Type, Injectable } from "@angular/core";
import { ModalDialogService } from "app/commerce/common/util/modalDialog.service";
import { AuthenticationTransactionService } from "app/commerce/services/componentTransaction/authentication.transaction.service";
import { ActivePageService } from "ibm-wch-sdk-ng";
import { Logger } from "angular2-logger/core";
import { MockRouter } from "mocks/angular-class/router";
import { LoginIdentityService } from "app/commerce/services/rest/transaction/loginIdentity.service";
import { PersonService } from "app/commerce/services/rest/transaction/person.service";
import { CurrentUser } from "app/commerce/common/util/currentUser";
import { CartTransactionService } from "app/commerce/services/componentTransaction/cart.transaction.service";
import { ProductService } from "app/commerce/services/product.service";
import { CartService } from "app/commerce/services/rest/transaction/cart.service";
import { AssignedPromotionCodeService } from "app/commerce/services/rest/transaction/assignedPromotionCode.service";
import { ShippingInfoService } from "app/commerce/services/rest/transaction/shippingInfo.service";
import { PaymentInstructionService } from "app/commerce/services/rest/transaction/paymentInstruction.service";
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

xdescribe('SessionErrorComponent', () => {

    let component: SessionErrorComponent;
    let fixture: ComponentFixture<SessionErrorComponent>;
    let modalDialog: ModalDialogService;
    let authService: any;
    let cartService: any;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [SessionErrorComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                ModalDialogService,
                LoginIdentityService,
                PersonService,
                ProductViewService,
                AuthenticationTransactionService,
                CartTransactionService,
                ProductService,
                CartService,
                AssignedPromotionCodeService,
                ShippingInfoService,
                TranslateService,
                PaymentInstructionService,
                ActivePageService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(SessionErrorComponent);
        component = fixture.componentInstance;
        mockRouter.initialNavigation();
        fixture.detectChanges();
    }));

    beforeEach(async(inject([ModalDialogService, AuthenticationTransactionService, CartTransactionService],
        (_modalDialog: ModalDialogService, _authService: AuthenticationTransactionService, _cartService: CartTransactionService) => {
        modalDialog = _modalDialog;
        authService = _authService;
        cartService = _cartService;

        authService.login('testuser@ca.ibm.com', 'userpassword');
        mockRouter.navigateByUrl('/my-account');

        let inputs = {
            title: "Session Timed Out",
            msg: "Your session has timed out and you have been successfully logged off. Sign in again to access your store."
        }
        modalDialog.errorInputSource.next(inputs);
    })));

    it('should instantiate', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should open session timeout popup when user tries to go to Category page', (done) => {
        let req = {
            headers: {},
            method:"GET",
            params: {},
            responseType:"json",
            url: "https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/event"
        };
        modalDialog.failedReqSource.next(req);

        expect(component.username).toBe('testuser@ca.ibm.com');
        expect(component.user).toEqual({username: 'testuser@ca.ibm.com'});
        expect(component.sessionErrorMsg).toBe('Your session has timed out and you have been successfully logged off. Sign in again to access your store.');
        expect(component.sessionErrorTitle).toBe('Session Timed Out');
        expect(component.isActionable).toBe(false);
        expect(component.loginErrorMsg).toBe('');
        expect(component.failedReqUrlList).toEqual(['https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/event']);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', Object({ skipLocationChange: true }));
        done();
    });

    it('should open session timeout popup when user tries to go to My Account page', (done) => {
        let req = {
            headers: {},
            method:"GET",
            params: {},
            responseType: "json",
            body: {},
            url: "https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/person/@self"
        };
        modalDialog.failedReqSource.next(req);

        expect(component.username).toBe('testuser@ca.ibm.com');
        expect(component.user).toEqual({username: 'testuser@ca.ibm.com'});
        expect(component.sessionErrorTitle).toBe('Session Timed Out');
        expect(component.loginErrorMsg).toBe('');
        expect(component.failedReqUrlList).toEqual(['https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/person/@self']);
        done();
    });

    it('should login successfully on popup dialog and redirect to the next page', (done) => {
        component.user.password = "userpassword";
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', Object({ skipLocationChange: true }));
        component.login().then(res => {
            expect(authService.isLoggedIn()).toBe(true);
            expect(sessionStorage.getItem('currentUser')).toBeDefined();
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', Object({ skipLocationChange: true }));

            setTimeout(()=>{
                expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/my-account');
            }, 0);
            done();
        });
    });

    it('should open session timeout popup when user tries to add a product to cart', (done) => {
        let req = {
            headers: {},
            method:"GET",
            params: {},
            responseType: "json",
            body: {},
            url: "https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/cart"
        };
        modalDialog.failedReqSource.next(req);

        expect(component.username).toBe('testuser@ca.ibm.com');
        expect(component.user).toEqual({username: 'testuser@ca.ibm.com'});
        expect(component.sessionErrorTitle).toBe('Session Timed Out');
        expect(component.loginErrorMsg).toBe('');
        expect(component.failedReqUrlList).toEqual(['https://aas129.watsoncommerce.ibm.com/wcs/resources/store/1/cart']);
        done();
    });

    it('should store user ID and successfully log out the user and clear the shopping cart', (done) => {
        expect(authService.isLoggedIn()).toBe(false);
        expect(component.username).toBe('testuser@ca.ibm.com');
        expect(cartService.cartSubject.value).toBe(null);
        done();
    });
});

xdescribe('SessionErrorComponent - Error Case', () => {

    let component: SessionErrorComponent;
    let fixture: ComponentFixture<SessionErrorComponent>;
    let modalDialog: ModalDialogService;
    let authService: any;
    let cartService: any;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [SessionErrorComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                ModalDialogService,
                LoginIdentityService,
                PersonService,
                ProductViewService,
                AuthenticationTransactionService,
                CartTransactionService,
                ProductService,
                CartService,
                AssignedPromotionCodeService,
                ShippingInfoService,
                TranslateService,
                PaymentInstructionService,
                ActivePageService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(SessionErrorComponent);
        component = fixture.componentInstance;
        mockRouter.initialNavigation();
        fixture.detectChanges();
    }));

    beforeEach(async(inject([ModalDialogService, AuthenticationTransactionService, CartTransactionService],
        (_modalDialog: ModalDialogService, _authService: AuthenticationTransactionService, _cartService: CartTransactionService) => {
        modalDialog = _modalDialog;
        authService = _authService;
        cartService = _cartService;

        authService.login('testuser@ca.ibm.com', 'userpassword');
        mockRouter.navigateByUrl('/checkout');

        let inputs = {
            title: "Session Timed Out",
            msg: "Your session has timed out and you have been successfully logged off. Sign in again to access your store."
        }
        modalDialog.errorInputSource.next(inputs);
    })));

    it('should login successfully on popup dialog and redirect to Checkout page', (done) => {
        component.user.password = "userpassword";
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', Object({ skipLocationChange: true }));
        component.login().then(res => {
            expect(authService.isLoggedIn()).toBe(true);
            expect(sessionStorage.getItem('currentUser')).toBeDefined();
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/', Object({ skipLocationChange: true }));

            setTimeout(()=>{
                expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
            }, 0);
            done();
        });
    });

    it('should NOT login on popup dialog due to incorrect password', (done) => {
        __karma__.config.testGroup = 'incorrectPassword';

        component.user.password = "incorrectUserpassword";
        component.login()
            .then(res => {
                expect(component.loginErrorMsg).toBe('');
                done();
            })
            .catch(res => {
                expect(component.loginErrorMsg).toBe('Could not log in');
                done();
            });
    });

    it('should NOT login on popup dialog due to errors in REST service', (done) => {
        __karma__.config.testGroup = 'invalid';

        component.user.password = "userpassword";
        component.login()
            .then(res => {
                expect(component.loginErrorMsg).toBe('Could not log in');
                done();
            })
            .catch(res => {
                expect(component.loginErrorMsg).toBe('Could not log in');
                done();
            });
    });

    it('should go back to redirect URL if the user clicks cancel on popup dialog', (done) => {
        component.exitSessionLogin();

        setTimeout(()=>{
			expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
		}, 0);

        modalDialog.errorInput$
			.subscribe(input => {
				expect(input).toBeNull();
            });

        modalDialog.sessionError$
			.subscribe(error => {
				expect(error).toBeNull();
            });
        done();
    });
});
