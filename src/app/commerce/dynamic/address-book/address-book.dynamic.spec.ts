import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DebugElement }  from '@angular/core';
import { Logger } from 'angular2-logger/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DynamicAddressBookLayoutComponent } from './address-book.dynamic.component';
import { DynamicAddressComponent } from 'app/commerce/dynamic/address/address.dynamic.component';
import { DynamicAddressEditableComponent } from 'app/commerce/dynamic/address-editable/address-editable.dynamic.component';
import { AccountTransactionService } from "app/commerce/services/componentTransaction/account.transaction.service";
import { AuthenticationTransactionService } from "app/commerce/services/componentTransaction/authentication.transaction.service";
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { PersonContactService } from "app/commerce/services/rest/transaction/personContact.service";
import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { CommonTestModule } from "app/commerce/common/common.test.module";
declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

xdescribe('DynamicAddressBookLayoutComponent', () => {
	let component:DynamicAddressBookLayoutComponent;
	let fixture:ComponentFixture<DynamicAddressBookLayoutComponent>;
	let httpMock:HttpTestingController;
	let authSvc:AuthenticationTransactionService;
	let elm:HTMLElement;

	beforeEach(async(() => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [ DynamicAddressBookLayoutComponent ],
			imports: [  TranslateModule.forRoot({
							loader: {
								provide: TranslateLoader,
								useFactory: HttpLoaderFactory,
								deps: [ HttpClient ]
							}
						}),
						RouterTestingModule.withRoutes([]),
						HttpClientModule, HttpModule, FormsModule,
						CommonTestModule
					 ],
			providers: [
				AccountTransactionService,
				CountryService,
				PersonContactService,
				Logger,
				HttpTestingController,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			]
		}).compileComponents();
	}));

	beforeEach(inject([AuthenticationTransactionService, HttpTestingController], (_auth:AuthenticationTransactionService, _httpm:HttpTestingController) => {
		__karma__.config.testGroup = "";
		authSvc = _auth;

		authSvc.login("random","strings").then((r)=>{
			expect(authSvc.isLoggedIn()).toBe(true);
		});
	}));

	beforeEach((done)=>{
		fixture = TestBed.createComponent(DynamicAddressBookLayoutComponent);
		component = fixture.componentInstance;
		component.id=10;
		fixture.detectChanges();
		done();
	});

	afterEach((done) => {
		__karma__.config.testGroup = "";
		authSvc.logout().then(() => {
			expect(authSvc.isLoggedIn()).toBe(false);
			done();
		});
	});

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});

	it("should be able to initialize an address and populate the address list", ()=> {
		let a={nickName:"test"};
		expect(Object.keys(a).length).toBe(1);
		component.populate(a);
		expect(Object.keys(a).length).toBeGreaterThan(1);
	});

	it("should be able to reset fields when necessary", ()=> {
		component.ctxAddr={};
		expect(component.ctxAddr).toBeDefined();
		component.reset();
		expect(component.ctxAddr).toBeUndefined();
		component.modAddrNickName="present";
		expect(component.modAddrNickName).not.toEqual("");
		component.reset();
		expect(component.modAddrNickName).toEqual("");
	});

	it("should be able to reset fields when necessary", ()=> {
		component.ctxAddr={};
		expect(component.ctxAddr).toBeDefined();
		component.reset();
		expect(component.ctxAddr).toBeUndefined();
		component.modAddrNickName="present";
		expect(component.modAddrNickName).not.toEqual("");
		component.reset();
		expect(component.modAddrNickName).toEqual("");
	});

	it("should be able to handle errors and display them as necessary", ()=> {
		let error = {error:{errors:[{errorMessage:"error message mock"}]}};
		let e:HttpErrorResponse = new HttpErrorResponse(error);
		let fb:string = "fallback message";
		component.processing=true;
		component.handleError(e,fb);
		expect(component.processing).toBe(false);
		expect(component.errorMsg).toBe(error.error.errors[0].errorMessage);

		component.processing=true;
		component.handleError({},fb);
		expect(component.processing).toBe(false);
		expect(component.errorMsg).toBe(fb);
	});

	it("should be able to fail gracefully if person-details cannot be fetched", (done)=>{
		__karma__.config.testGroup = "failRegAddr";
		component.initializeAddressBook()
		.then((r)=>{
			expect(component.errorMsg).toBe("Unable to retrieve registered address");
			done();
		})
	});

	it("should be able to fail gracefully if person-addresses cannot be fetched", (done)=>{
		__karma__.config.testGroup = "failOtherAddrs";
		component.initializeAddressBook()
		.then((r)=>{
			expect(component.errorMsg).toBe("Unable to retrieve addresses");
			done();
		})
	});

	it("should be able to open edit-modal",() => {
		let a = component.initAddr({});
		component.setAddrActions({editAddr:a});
		fixture.detectChanges();
		elm = fixture.debugElement.query(By.css(`#${component.editId}`)).nativeElement;
		expect(elm.getAttribute("aria-hidden")).toBe("false");
		component.setChanges({});
		expect(elm.getAttribute("aria-hidden")).toBe("true");
	});

	it("should be able to open edit-modal for new addresses",() => {
		component.modalEdit();
		fixture.detectChanges();
		elm = fixture.debugElement.query(By.css(`#${component.editId}`)).nativeElement;
		expect(elm.getAttribute("aria-hidden")).toBe("false");
		component.setChanges({});
		expect(elm.getAttribute("aria-hidden")).toBe("true");
	});

	it("should be able to open delete-modal",() => {
		let a = component.initAddr({});
		component.setAddrActions({delAddr:a});
		fixture.detectChanges();
		elm = fixture.debugElement.query(By.css(`#${component.remvId}`)).nativeElement;
		expect(elm.getAttribute("aria-hidden")).toBe("false");
		component.setChanges({deleteAddr:true});
		expect(elm.getAttribute("aria-hidden")).toBe("true");
	});

	it("should be able to mimic a successful delete",() => {
		let a = component.initAddr({});
		component.setAddrActions({delAddr:a});
		fixture.detectChanges();
		elm = fixture.debugElement.query(By.css(`#${component.remvId}`)).nativeElement;
		expect(elm.getAttribute("aria-hidden")).toBe("false");
		component.setChanges({deleteAddr:true,success:true});
		expect(elm.getAttribute("aria-hidden")).toBe("true");
	});

	it("should be able to do set an address as default",(done) => {
		let a = component.initAddr({nickName:"defaultTarget"});
		component.doSetDefault(a).then(()=>{
			expect(component.processing).toBe(false);
			expect(component.modAddrNickName).toBe("defaultTarget");
			expect(component.success).toBe(true);
			done();
		});
		fixture.detectChanges();
	});

	it("should be able to handle a failure to set an address as default gracefully",(done) => {
		let a = component.initAddr({nickName:"missingTarget"});
		component.doSetDefault(a).then(()=>{
			expect(component.processing).toBe(false);
			expect(component.modAddrNickName).toBe("");
			expect(component.success).toBe(false);
			expect(component.errorMsg).toBe("Unable to modify address with nickName: missingTarget to default");
			done();
		});
		fixture.detectChanges();
	});

	it("should be able to delete an address",(done) => {
		let a = component.initAddr({nickName:"deleteTarget"});
		component.ctxAddr = a;
		fixture.detectChanges();
		component.doDelete().then(()=>{
			expect(component.processing).toBe(false);
			expect(component.modAddrNickName).toBe("deleteTarget");
			expect(component.success).toBe(true);
			done();
		});
	});

	it("should be able to handle a failure to delete an address gracefully",(done) => {
		let a = component.initAddr({nickName:"deleteFailTarget"});
		component.ctxAddr = a;
		fixture.detectChanges();
		component.doDelete().then(()=>{
			expect(component.processing).toBe(false);
			expect(component.modAddrNickName).toBe("");
			expect(component.success).toBe(false);
			expect(component.errorMsg).toBe("Unable to delete address with nickName: deleteFailTarget");
			done();
		});
		fixture.detectChanges();
	});

	it("should be able to ignore unexpected address-actions",() => {
		component.modAddrNickName = "unchanged"
		component.setAddrActions({});
		fixture.detectChanges();
		expect(component.modAddrNickName).toBe("unchanged");
	});
});
