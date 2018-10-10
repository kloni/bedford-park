import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, fakeAsync, inject, tick, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DynamicAddressComponent } from './address.dynamic.component';
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

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('DynamicAddressComponent', () => {
    let component: DynamicAddressComponent;
    let fixture: ComponentFixture<DynamicAddressComponent>;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ DynamicAddressComponent ],
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
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(DynamicAddressComponent);
        let a = {};
        CommerceEnvironment.address.reqAttrs.forEach((e)=>{
            a[e]=(CommerceEnvironment.address.defaults[e]?JSON.parse(JSON.stringify(CommerceEnvironment.address.defaults[e])):"");
        });
        a["addressLine"][0]="line-0";
        a["addressLine"][1]="line-1";
        a["state"]="NY";

        component = fixture.componentInstance;
        component.id=10;
        component.address=a;
        fixture.detectChanges();
    }));

    it("should instantiate", () => {
        expect(component).toBeTruthy();
    });

    it("should be able to invoke reflect user-actions", (done) => {
        component.reflectActions.subscribe((a)=>{
            expect(a).toEqual({randomAttr:"randomAttrValue"});
            done();
        });
        component.setActions({randomAttr:"randomAttrValue"});
    });

    it("should be able to invoke reflect edit-action", (done) => {
        component.reflectActions.subscribe((a)=>{
            expect(a.editAddr).toEqual(component._addr);
            expect(a.editAddr.editIndicator).toEqual("present");
            done();
        });
        component._addr["editIndicator"]="present";
        component.edit();
    });

    it("should be able to invoke reflect delete-action", (done) => {
        component.reflectActions.subscribe((a)=>{
            expect(a.delAddr).toEqual(component._addr);
            expect(a.delAddr.delIndicator).toEqual("present");
            done();
        });
        component._addr["delIndicator"]="present";
        component.delete();
    });

    it("should be able to invoke reflect set-default-action", (done) => {
        component.reflectActions.subscribe((a)=>{
            expect(a.defAddr.lines).toBeUndefined();
            expect(a.defAddr.primary).toEqual("true");
            delete a.defAddr.primary;
            delete component._addr.lines;
            expect(a.defAddr).toEqual(component._addr);
            done();
        });
        component.setDefault();
    });
});
