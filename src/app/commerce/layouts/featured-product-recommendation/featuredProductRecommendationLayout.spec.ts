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

import { DebugElement, NgModule, CUSTOM_ELEMENTS_SCHEMA}  from '@angular/core';

import { Logger } from 'angular2-logger/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { WchNgModule } from "ibm-wch-sdk-ng";
import { CommerceModule } from 'app/commerce/commerce.module';
import { ESpotService } from "app/commerce/services/rest/transaction/eSpot.service";
import { FeaturedProductRecommendationLayoutComponent } from './featuredProductRecommendationLayout';
import { PageNotFoundComponent } from "app/page-not-found/page-not-found.component";
import { FormattedTextPipe } from "app/common/formattedtext/formatted-text.pipe";

import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('FeaturedProductRecommendationLayoutComponent', () => {
	let component:FeaturedProductRecommendationLayoutComponent;
	let fixture:ComponentFixture<FeaturedProductRecommendationLayoutComponent>;
	let httpMock:HttpTestingController;

	beforeEach(async(() => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [ FeaturedProductRecommendationLayoutComponent,
							PageNotFoundComponent,
							FormattedTextPipe
						],
			imports: [	TranslateModule.forRoot({
							loader: {
								provide: TranslateLoader,
								useFactory: HttpLoaderFactory,
								deps: [ HttpClient ]
							}
						}),
						CommerceModule,
						RouterTestingModule.withRoutes([]),
						HttpClientModule,
						HttpModule,
						FormsModule,
						CommonTestModule
					 ],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],//need this for template parsing errors
			providers: [
				HttpTestingController,
				ESpotService,
				Logger,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute }
			]
		})
		.overrideModule(BrowserDynamicTestingModule, {
			set: {
			  entryComponents: [ PageNotFoundComponent ]
			}
		})
		.compileComponents();
	}));

	beforeEach((done)=>{
		__karma__.config.testGroup = '';
		fixture = TestBed
		.overrideComponent(FeaturedProductRecommendationLayoutComponent, {
			set: { template: 'FeaturedProductRecommendationLayoutComponent Template' }
		})
		.createComponent(FeaturedProductRecommendationLayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		done();
	});

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});

	it("should be able to generate slides", (done) => {
		component.generateCtx("AuroraWMDRS-25")
		setTimeout(function(){
			expect(component.ctx.id).toBe("AuroraWMDRS-25");
			done()
		}, 2000);
	});

	it("should be able to generate slides for opposite layout", (done) => {
		component.generateCtx("AuroraWMDRS-25");
		setTimeout(function(){
			expect(component.ctx.id).toBe("AuroraWMDRS-25");
			done()
		}, 2000);
	});

	it("should be able to generate slides from espot", (done) => {
		component.generateCtxFromEspot("prod-recommendation");
		setTimeout(function(){
			expect(component.ctx.id).toBe("AuroraWMDRS-36");
			done()
		}, 2000);
	});
});
