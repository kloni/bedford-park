import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, fakeAsync, inject, tick, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DynamicAddressEditableComponent } from './address-editable.dynamic.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { Logger } from 'angular2-logger/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { CurrentUser } from 'app/commerce/common/util/currentUser';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('DynamicAddressEditableComponent', () => {
    let component: DynamicAddressEditableComponent;
    let fixture: ComponentFixture<DynamicAddressEditableComponent>;
    let da: DigitalAnalyticsService;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ DynamicAddressEditableComponent ],
            imports: [  TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useFactory: HttpLoaderFactory,
                                deps: [ HttpClient ]
                            }
                        }),
                        HttpClientModule, HttpModule, FormsModule,
                        CommonTestModule
                     ],
            providers: [
                PersonContactService,
                CountryService,
                Logger,
                ActivePageService,
                HttpTestingController,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
        done();
    });

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        da = TestBed.get(DigitalAnalyticsService);
        fixture = TestBed.createComponent(DynamicAddressEditableComponent);
        let a = {};
        CommerceEnvironment.address.reqAttrs.forEach((e)=>{
            a[e]=(CommerceEnvironment.address.defaults[e]?JSON.parse(JSON.stringify(CommerceEnvironment.address.defaults[e])):"");
        });
        a["addressLine"][0]="line-0";
        a["addressLine"][1]="line-1";
        a["state"]="NY";

        let currentUser: CurrentUser = {
            WCTrustedToken: "fakeTrustedToken",
            WCToken: "fakeToken",
            username: "testuser@ca.ibm./com",
            userId: "1000",
            isCSR: false
        };
        StorefrontUtils.saveCurrentUser(currentUser);

        component = fixture.componentInstance;
        component.id=10;
        component.address=a;
        fixture.detectChanges();
    }));

    it("should instantiate", () => {
        expect(component).toBeTruthy();
    });

    it("be able to exercise null-address branch", () => {
        delete component._addr;
        component.address=null;
        expect(component._addr).toBeUndefined();
    });

    it("should have inputs and invariants initialized", ()=>{
        expect(component.id).toEqual(10);
        expect(component._addr).toBeTruthy();
        expect(component.countries.length).toBeGreaterThan(0);
        expect(Object.keys(component.cDescs).length).toEqual(component.countries.length);
    });

    it("should not refetch countries when already initialized", ()=>{
        component.getCountries()
        .then((r)=>{expect(r.body).toBeNull()})
        .catch((e)=>{expect(1).toEqual(0)});
    });

    it("should have countries and descriptors initialized", (done)=>{
        let origLen=component.countries.length;
        delete component.countries;
        component.getCountries().then((r)=>{
            expect(component.countries).toBeUndefined();
            component.initCountries(r);
            expect(component.countries).toBeDefined();
            expect(component.countries.length).toEqual(origLen);
            expect(Object.keys(component.cDescs).length).toEqual(origLen);
            done();
        })
        .catch((e)=>{expect(1).toEqual(0)});
    });

    it("should be able to adjust states for countries that do not have them and vice versa", ()=>{
        expect(component._addr["state"]).toEqual("NY");
        component._addr["country"]="CA";
        component.adjustStateProv();
        expect(component._addr["state"]).toEqual("");
    });

    it("should be able to do a deep-copy", ()=>{
        let a={a:"1"};
        let b=component.deepCopy(a);
        expect(b.a).toEqual(a.a);
        b.a="2";
        expect(b.a).not.toEqual(a.a);
    });

    it("should be able to copy only valid address attributes", ()=>{
        let a=component._addr;
        a["randomAttr"]="added";
        let b=component.copyValidAttrs();
        expect(b.randomAttr).toBeUndefined();
    });

    it("should be able to perform a successful save on an update", (done)=>{
        component._addr["nickName"]="updateNickname";

        // need to callFake because readDDX Object is not defined;
        let daSpy: any;
        daSpy = spyOn(da, 'updateUser');
        daSpy.and.callFake(function(){});

        component.performSave().then(()=>{
            expect(component.saveErrorMsg).toEqual("");
            expect(component.saveProcessing).toEqual(false);
            done();
        });
    });

    it("should be able to perform a successful save on an add", (done)=>{
        component._addr["newAddr"]=true;

        // need to callFake because readDDX Object is not defined;
        let daSpy: any;
        daSpy = spyOn(da, 'updateUser');
        daSpy.and.callFake(function(){});

        component.performSave().then((r)=>{
            expect(component.saveErrorMsg).toBe("");
            expect(component.saveProcessing).toEqual(false);
            done();
        });
    });

    it("should be able to handle a save failure", (done)=>{
        component._addr["nickName"]="nonUpdatableNickname";
        component.performSave()
        .then((r)=>{
            expect(component.saveProcessing).toEqual(false);
            expect(component.saveErrorMsg).not.toBe("");
            expect(component.saveErrorMsg).toBe("Unable to modify address");
            done();
        });
    });

    it("should be able to perform after-save succesfully", ()=>{
        component.saveProcessing=true;

        let daSpy: any;
        daSpy = spyOn(da, 'updateUser');
        daSpy.and.callFake(function(){});

        component.performAfterSave();
        expect(component.saveProcessing).toEqual(false);
        expect(da.updateUser).toHaveBeenCalled();
    });

    it("should be able to clear errors", ()=>{
        component.saveErrorMsg="filled";
        component.clearError();
        expect(component.saveErrorMsg).toBeFalsy();
    });

    it("should be able to handle request failures", (done)=>{
        __karma__.config.testGroup = "unexpected";
        delete component.countries;
        expect(component.countries).toBeUndefined();
        component.getCountries()
        .then((r)=>{expect(1).toEqual(0)})
        .catch((e)=>{
            component.handleError(e,"Unable to retrieve country and state list");
            expect(component.countries).toBeUndefined();
            done();
        })
    });

    it("should call Digital Analytics Service for registration tag when performing save", (done)=>{
        component._addr["newAddr"]=true;
        let daSpy = spyOn(da, 'updateUser');
        component.performSave().then((r)=>{
            expect(da.updateUser).toHaveBeenCalled();
            done();
        });
    });
});
