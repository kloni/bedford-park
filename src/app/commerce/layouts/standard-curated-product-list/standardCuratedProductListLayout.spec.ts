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
import { StandardCuratedProductListLayoutComponent } from './standardCuratedProductListLayout';
import { RenderingContext, ExtendedContext, OptionSelection, WchNgModule } from 'ibm-wch-sdk-ng';

import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { WchSlickModule } from '../../../components/generic/carousel/wch-slick/wch-slick.module';
import { CarouselComponent } from '../../../components/generic/carousel/carousel.component';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('StandardCuratedProductListLayoutComponent', () => {
	let component:StandardCuratedProductListLayoutComponent;
	let fixture:ComponentFixture<StandardCuratedProductListLayoutComponent>;
	let httpMock:HttpTestingController;

	beforeEach(async(() => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [
							StandardCuratedProductListLayoutComponent,
							CarouselComponent
						  ],
			imports: [  TranslateModule.forRoot({
							loader: {
								provide: TranslateLoader,
								useFactory: HttpLoaderFactory,
								deps: [ HttpClient ]
							}
						}),
						WchNgModule.forRoot({
							apiUrl: "localhost",
							deliveryUrl: "localhost",
							httpOptions: {
								pollTime: 999999,
								retries: 5
							}
						}),
						CommerceModule,
						RouterTestingModule.withRoutes([]),
						HttpClientModule,
						HttpModule,
						FormsModule,
						WchSlickModule,
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
		fixture = TestBed.createComponent(StandardCuratedProductListLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		done();
	});

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});

	it("should be able to generate slides", (done) => {
		component.generateSlides(["AuroraWMDRS-1","AuroraWMDRS-22","AuroraWMDRS-25","BCL014_1417"]);
		setTimeout(() => {
			expect(component.slides.length).toBe(4);
			done()
		}, 2000);
	});
});
