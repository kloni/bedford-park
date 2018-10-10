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

import { CommerceModule } from 'app/commerce/commerce.module';
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import { ProductService } from 'app/commerce/services/product.service';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { ProductComponent } from './product.component';

import { Constants } from 'app/Constants';

import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { InventoryavailabilityService } from 'app/commerce/services/rest/transaction/inventoryavailability.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('ProductComponent', () => {
	let component:ProductComponent;
	let fixture:ComponentFixture<ProductComponent>;
	let httpMock:HttpTestingController;
	let pSvc:ProductService;
	let inv:InventoryavailabilityService
	let su:StorefrontUtils
	let mockRouter: Router;
	let da: DigitalAnalyticsService;

	beforeEach(done => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [ ProductComponent ],
			imports: [  TranslateModule.forRoot({
							loader: {
								provide: TranslateLoader,
								useFactory: HttpLoaderFactory,
								deps: [ HttpClient ]
							}
						}),
						CommerceModule,
						RouterTestingModule.withRoutes([]),
						HttpClientModule, HttpModule, FormsModule,
						CommonTestModule
					 ],
			providers: [
				HttpTestingController,
				Logger, 
				{ provide: Router, useClass: MockRouter }
			]
		}).compileComponents();
		done();
	});

	beforeEach( done => {
		pSvc = TestBed.get(ProductService);
		inv = TestBed.get(InventoryavailabilityService);
		su = TestBed.get(StorefrontUtils);
		fixture = TestBed.createComponent(ProductComponent);
		component = fixture.componentInstance;
		da = TestBed.get(DigitalAnalyticsService);
		mockRouter = TestBed.get(Router);
		fixture.detectChanges();
		__karma__.config.testGroup = "";
		done();
	  });

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});

	it("should skip an undef", () => {
		component.initializeProduct(null, null, null);
	});

	it("should be able to initialize a sku", (done) => {
		pSvc.getProduct("AuroraWMDRS-001").then((r)=>{
			component.initializeProduct(r,inv,su);
			done();
		});
	});

	it("should be able to skip undef attributes", (done) => {
		pSvc.getProduct("AuroraWMDRS-001").then((r)=>{
			delete r.attributes;
			component.initializeProduct(r,inv,su);
			done();
		});
	});

	it("should be able to resolve skus", (done) => {
		pSvc.getProduct("AuroraWMDRS-1").then((r)=>{
			component.currentSelection.sku = r.sKUs[0];
            component.currentSelection.selectedAttributes = {};
            for (let att of component.currentSelection.sku.attributes) {
                component.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
            }
            component.resolveSKU(r.sKUs, component.currentSelection.selectedAttributes);
            done();
		});
	});

	xit("should be able to add to cart", (done) => {
		component.addToCart().then(() => {
			done();
		});
	});

	xit("should call digital analytic service when add to cart", (done) => {
		let daSpy = spyOn(da, 'addToCart');
		component.addToCart().then((r) => {
			expect(da.addToCart).toHaveBeenCalled();
			done();
		});
	});

	it("should be able to initialize a product", (done) => {
		pSvc.getProduct("AuroraWMDRS-1").then((r)=>{
			component.initializeProduct(r,inv,su);
			done();
		});
	});

	it("should be able to handle attribute change", (done) => {
		pSvc.getProduct("AuroraWMDRS-1").then((r)=>{
			component.product = r;
			component.currentSelection.sku = r.sKUs[0];
			component.currentSelection.selectedAttributes = {};
			for (let att of component.currentSelection.sku.attributes) {
				component.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
			}
			component.onAttributeChange(component.currentSelection.sku.attributes[0],component.currentSelection.sku.attributes[0].values[0].identifier);
			done();
		});
	});

});
