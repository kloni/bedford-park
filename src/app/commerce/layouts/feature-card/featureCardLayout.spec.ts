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
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { FeatureCardLayoutComponent } from './featureCardLayout';

import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('FeatureCardLayoutComponent', () => {
	let component:FeatureCardLayoutComponent;
	let fixture:ComponentFixture<FeatureCardLayoutComponent>;
	let httpMock:HttpTestingController;

	beforeEach(async(() => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [ FeatureCardLayoutComponent ],
			imports: [  TranslateModule.forRoot({
							loader: {
								provide: TranslateLoader,
								useFactory: HttpLoaderFactory,
								deps: [ HttpClient ]
							}
						}),
						CommercePipesModule,
						CommerceModule,
						RouterTestingModule.withRoutes([]),
						HttpClientModule, HttpModule, FormsModule,
						CommonTestModule
					 ],
			providers: [
				HttpTestingController,
				ProductViewService,
				AuthenticationTransactionService,
				Logger
			]
		}).compileComponents();
	}));

	beforeEach((done)=>{
		__karma__.config.testGroup = '';
		fixture = TestBed.createComponent(FeatureCardLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		done();
	});

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});
});
