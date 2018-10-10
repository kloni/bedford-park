import { HttpModule, Http, Response, ResponseOptions } from '@angular/http';
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

import { DynamicRegistrationLayoutComponent } from './registration.dynamic.component';
import { HttpErrorInterceptor } from '../../../commerce/common/util/http.error.interceptor';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { MockActivatedRoute } from '../../../../mocks/angular-class/activated-route';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { PrivacyPolicyService } from '../../services/componentTransaction/privacypolicy.service';

declare var __karma__: any;
describe('DynamicRegistrationLayoutComponent', () => {

    let component: any;
    let fixture: ComponentFixture<DynamicRegistrationLayoutComponent>;
    let authService: AuthenticationTransactionService;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;
    let privacyService: PrivacyPolicyService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicRegistrationLayoutComponent],
            imports: [
                HttpClientModule, HttpModule, FormsModule, RouterTestingModule.withRoutes([]),
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
                PrivacyPolicyService,
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
        privacyService = TestBed.get(PrivacyPolicyService);
        fixture = TestBed.createComponent(DynamicRegistrationLayoutComponent);
        component = fixture.componentInstance;
        mockRouter.initialNavigation();

        fixture.detectChanges();

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


    it('should register and navigate to homepage', (done) => {
        let daSpy = spyOn(da, 'updateUser');
        daSpy.and.callFake(function(){});

        let privacySpy = spyOn(privacyService, 'updateConsentOptions');
        privacySpy.and.callFake(function(){ return Promise.resolve({})});

        // register user sucessfully and navigate to the home page
        component.register().then(res => {
            expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
            expect(component.authService.isLoggedIn()).toBe(true);
            expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
            done();
        });
    });

    it('should call Digital Analytics Service when registering', (done) => {
        let daSpy = spyOn(da, 'updateUser');
        let privacySpy = spyOn(privacyService, 'updateConsentOptions');
        privacySpy.and.callFake(function(){ return Promise.resolve({})});

        component.register().then(res => {
            expect(da.updateUser).toHaveBeenCalled();
            done();
        });
	});

});




describe('DynamicRegistrationLayoutComponent - Error Case', () => {

    let component: any;
    let fixture: ComponentFixture<DynamicRegistrationLayoutComponent>;
    let httpMock: any;
    let interceptor: HttpErrorInterceptor;
    let authService: AuthenticationTransactionService;
    let mockRouter: Router;

    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicRegistrationLayoutComponent],
            imports: [HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ], providers: [
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
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }
            ]
        }).compileComponents();
        __karma__.config.testGroup = '';
    });

    beforeEach(inject([HttpErrorInterceptor, AuthenticationTransactionService, HttpTestingController], (_interceptor: HttpErrorInterceptor, _accountService: AuthenticationTransactionService, _httpMock: HttpTestingController) => {
        interceptor = _interceptor;
        authService = _accountService;
        httpMock = _httpMock;

        __karma__.config.testGroup = "";

        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(DynamicRegistrationLayoutComponent);
        component = fixture.componentInstance;
        mockRouter.initialNavigation();

        fixture.detectChanges();

    }));



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

    it('should instantiate', () => {
        // instatiation test case
        expect(component).toBeTruthy();
    });


    it('should throw error for passowordNotMatch', (done) => {
        // throw error if verify password does not match with the password
       __karma__.config.testGroup = 'passowordNotMatch';

        component.register().then(res => {
            expect(component.registerErrorMsg).toBeDefined();
            expect(component.registerErrorMsg).toBe("The verify password you entered does not match your password. Type your password in the Verify password field and try again.")

            expect(component.authService.isLoggedIn()).toBe(false);
            expect(sessionStorage.getItem('currentUser')).toBeNull();
            done();

        });
        const mockErrorResponse = {
            status: 400,
            statusText: 'Bad Request'
        };
        const errorData = { "errors": [{ "errorKey": "_ERR_PASSWORDS_NOT_SAME", "errorParameters": "logonPassword", "errorMessage": "The verify password you entered does not match your password. Type your password in the Verify password field and try again.", "errorCode": "2080" }] };
        let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person.passowordNotMatch.registerPerson.mocks.json');
        req.flush(errorData, mockErrorResponse);
    });

});





