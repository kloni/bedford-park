import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA }  from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { ActivePageService, RenderingContext } from "ibm-wch-sdk-ng";
import { Logger } from "angular2-logger/core";
import { Constants } from "app/Constants";
import { Observable } from "rxjs/Observable";
import { MockRouter } from "mocks/angular-class/router";
import { MockActivatedRoute } from "mocks/angular-class/activated-route";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { PrivacyPolicyModalLayoutComponent } from "../../layouts.exports";
import { PrivacyPolicyService } from "../../services/componentTransaction/privacypolicy.service";
import { Subscription } from "rxjs";
import { StoreConfigurationsCache } from "../../common/util/storeConfigurations.cache";

declare var __karma__: any;

describe('PrivacyPolicyModalLayout', () => {

    let component: PrivacyPolicyModalLayoutComponent;
    let fixture: ComponentFixture<PrivacyPolicyModalLayoutComponent>;
    let privacyService: PrivacyPolicyService;
    let subscription: Subscription;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [PrivacyPolicyModalLayoutComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA], // need this for template parsing error
            providers: [
                PrivacyPolicyService,
                StoreConfigurationsCache,
                Logger
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(PrivacyPolicyModalLayoutComponent);
        component = fixture.componentInstance;
        privacyService = TestBed.get(PrivacyPolicyService);
        fixture.detectChanges();
        setTimeout(function(){
            done();
        }, 500);
    });

    afterEach(() => {
        if (subscription && !subscription.closed) {
            subscription.unsubscribe();
        };
    });

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should return options upon getRevealOptions call', () => {
        // from ngOnInit
        let options = {
            'closeOnClick': false,
            'closeOnEsc': false
        };
        expect(component.getRevealOptions()).toEqual(options);
    });

    it('should return onCancelSubject upon onCancel call', (done) => {
        subscription = component.onCancel().subscribe(r => {
            expect(r).toBe(false); // value from ngOnInit is false
            done();
        });
    })

    it('should return onConfirmSubject upon onConfirm call', (done) => {
        subscription = component.onConfirm().subscribe(r => {
            expect(r).toBe(false); // value from ngOnInit is false
            done();
        });
    });

    it('should return showCloseButtonSubject upon onShowCloseButton call', (done) => {
        subscription = component.onShowCloseButton().subscribe(r => {
            expect(r).toBe(false); // value from ngOnInit is false
            done();
        });
    });

    it('should toggle iMarketing on updateMarketingConsent', () => {
        // undefined will be toggled to accept
        component.iMarketing = undefined;
        component.updateMarketingConsent();
        expect(component.iMarketing).toBe(Constants.CONSENT_ACCEPT);

        // toggle accept to reject
        component.updateMarketingConsent();
        expect(component.iMarketing).toBe(Constants.CONSENT_REJECT);

        // toggle reject to accept
        component.updateMarketingConsent();
        expect(component.iMarketing).toBe(Constants.CONSENT_ACCEPT);
    })

    it('should update iDa with iDaConsent and iDaAnonymous on updateDAConsent ACCEPT case', () =>{
        // test when iDaAnon is undefined
        component.iDaConsent = Constants.CONSENT_REJECT; // this will toggle to accept
        component.iDaAnonymous = undefined; 
        component.updateDAConsent();
        expect(component.iDa).toBe(component.iDaConsent.concat(Constants.CONSENT_REJECT));

        // test when iDaAnon is ACCEPT value
        component.iDaConsent = Constants.CONSENT_REJECT
        component.iDaAnonymous = Constants.CONSENT_ACCEPT;
        component.updateDAConsent();
        expect(component.iDa).toBe(component.iDaConsent.concat(component.iDaAnonymous));

        // test when iDaAnon is REJECT value
        component.iDaConsent = Constants.CONSENT_REJECT; 
        component.iDaAnonymous = Constants.CONSENT_REJECT;
        component.updateDAConsent();
        expect(component.iDa).toBe(component.iDaConsent.concat(component.iDaAnonymous));
    });

    it('should update iDa with iDaConsent on updateDAConsent REJECT case', () => {
        component.iDaConsent = Constants.CONSENT_ACCEPT; // this will toggle to REJECT
        component.updateDAConsent();
        expect(component.iDa).toBe(component.iDaConsent);
    });

    it('should update both iDa and iDaAnonymous for updateDAAnonymousConsent ACCEPT case', () => {
        component.iDaConsent = Constants.CONSENT_ACCEPT;
        
        // iDaAnonymous is undefined 
        component.updateDAAnonymousConsent();
        expect(component.iDaAnonymous).toBe(Constants.CONSENT_ACCEPT);
        expect(component.iDa).toBe(component.iDaConsent.concat(component.iDaAnonymous));

        // iDaAnonymous is CONSENT_ACCEPT 
        component.updateDAAnonymousConsent();
        expect(component.iDaAnonymous).toBe(Constants.CONSENT_REJECT);
        expect(component.iDa).toBe(component.iDaConsent.concat(component.iDaAnonymous));

        // iDaAnonymous is CONSENT_REJECT
        component.updateDAAnonymousConsent();
        expect(component.iDaAnonymous).toBe(Constants.CONSENT_ACCEPT);
        expect(component.iDa).toBe(component.iDaConsent.concat(component.iDaAnonymous));
    });

    it('should update iDaAnonymous with reject value for updateDAAnonymousConsent REJECT case', () => {
        component.iDaConsent = Constants.CONSENT_REJECT;
        component.updateDAAnonymousConsent();
        expect(component.iDaAnonymous).toBe(Constants.CONSENT_REJECT);
    });

    it('should update onConfirmSubject with true value in successful updateConsentOptions', (done) => {
        let spy = spyOn(privacyService, 'updateConsentOptions').and.returnValue(Promise.resolve({}));
        component.submit();
        setTimeout(function(){
            expect(privacyService.updateConsentOptions).toHaveBeenCalled();
            subscription = component.onConfirm().subscribe( onConfirmSubjectValue => {
                expect(onConfirmSubjectValue).toBe(true);
            });
            done();
        }, 1000);
    });

    it('should update errorMessage property in unsuccessful updateConsentOptions ', (done) => {
        let spy = spyOn(privacyService, 'updateConsentOptions').and.returnValue(Promise.reject({}));
        expect(component.errorMessage).toBe(undefined);
        component.submit();
        setTimeout(function(){
            expect(privacyService.updateConsentOptions).toHaveBeenCalled();
            expect(component.errorMessage).toBe('PrivacyPolicyModal.errorMessage');
            done();
        }, 1000);
    });

    it('should reset errorMessage upon closeErrorMessage', () => {
        component.errorMessage = 'some error message';
        component.closeErrrorMessage();
        expect(component.errorMessage).toBe(null);
    });

});

describe('PrivacyPolicyModalLayout - All Consents Disabled', () => {
    let component: PrivacyPolicyModalLayoutComponent;
    let fixture: ComponentFixture<PrivacyPolicyModalLayoutComponent>;
    let privacyService: PrivacyPolicyService;
    let storeConfig: StoreConfigurationsCache;
    let subscription: Subscription;
    let consentOptionsSpy, isEnabledSpy;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [PrivacyPolicyModalLayoutComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA], // need this for template parsing error
            providers: [
                PrivacyPolicyService,
                StoreConfigurationsCache,
                Logger
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(PrivacyPolicyModalLayoutComponent);
        component = fixture.componentInstance;
        privacyService = TestBed.get(PrivacyPolicyService);
        storeConfig = TestBed.get(StoreConfigurationsCache);
        isEnabledSpy = spyOn(storeConfig, 'isEnabled').and.returnValue(Promise.resolve(false));
        consentOptionsSpy = spyOn(privacyService, 'getConsentOptions').and.returnValue(Promise.resolve({
            marketing: Constants.CONSENT_ACCEPT,
            da: Constants.CONSENT_ACCEPT
        }));
        fixture.detectChanges();
        done();
    });

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });
})