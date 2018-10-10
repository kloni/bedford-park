import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';

import { Observable } from 'rxjs/Rx';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Logger } from 'angular2-logger/core';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommerceModule } from 'app/commerce/commerce.module';
import { ProductService } from 'app/commerce/services/product.service';
import { MerchandisingAssociationLayoutComponent } from './merchandisingAssociationLayout';

import { RenderingContext, ExtendedContext, OptionSelection, WchNgModule } from 'ibm-wch-sdk-ng';
import { CarouselComponent } from 'app/components/generic/carousel/carousel.component';
import { WchSlickModule } from 'app/components/generic/carousel/wch-slick/wch-slick.module';
import { MockActivatedRoute } from 'app/../mocks/angular-class/activated-route';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { Constants } from '../../../Constants';

declare var __karma__: any;

export function HttpLoaderFactory (http: HttpClient) {
	return new TranslateHttpLoader(http, 'locales/');
}

describe('MerchandisingAssociationLayoutComponent', () => {
	let component:MerchandisingAssociationLayoutComponent;
	let fixture:ComponentFixture<MerchandisingAssociationLayoutComponent>;
	let httpMock:HttpTestingController;
	let ctx:ExtendedContext = { site: { id: "", pages: {} }, sibling: [], breadcrumb: [], children: [] } as ExtendedContext;
	let rc:RenderingContext = { layouts: { default: { template: "merchandising-association-layout", templateType: "angular" } }, context: ctx, markups: {}, id: "af1de595-fd75-4403-b3ac-aba3a8bddb87", typeId: "com.ibm.commerce.store.angular-types.merchandising-association", elements: { heading: { elementType: "text", value: "Recommended Products" }, associationType: { elementType: "optionselection", values: [ { selection: "ACCESSORY" }, { selection: "X-SELL" }, { selection: "REPLACEMENT" }, { selection: "UPSELL" } ] } }, classification: "content"};
	let pSvc:ProductService;
    let end = new NavigationEnd(1, '/home', '/careers');
    let events = new Observable(observer => {
        observer.next(end);
        observer.complete();
    });

    const mockInterceptRouter = {
        snapshot: {},
        navigate: jasmine.createSpy('navigate'),
		url: '/' + Constants.productDetailPageIdentifier,
		events: events
    }
    const MockActivatedRoute = {}

	beforeEach(async(() => {
		// use mock service for dependency
		TestBed.configureTestingModule({
			declarations: [
							MerchandisingAssociationLayoutComponent,
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
						WchSlickModule,
						CommonTestModule
					 ],
			providers: [
				{ provide: Router, useValue: mockInterceptRouter },
				{ provide: ActivatedRoute, useValue: {queryParams: Observable.from([MockActivatedRoute])} },
				HttpTestingController,
				Logger
			]
		}).compileComponents();
	}));

	beforeEach(async(inject([ProductService], (_pSvc: ProductService) => {
		pSvc=_pSvc;
		__karma__.config.testGroup = '';
		fixture = TestBed.createComponent(MerchandisingAssociationLayoutComponent);
		component = fixture.componentInstance;
		component.rc = rc;
		fixture.detectChanges();
	})));

	it("should instantiate", () => {
		expect(component).toBeTruthy();
	});

	it("should be able to generate rest parameters", () => {
		let opts:OptionSelection[]=[{selection: "ACCESSORY"},{selection: "REPLACEMENT"},{selection: "UPSELL"}];
		let pn = "AuroraWMDRS-22";
		component.fillRestBody(opts, pn);
		expect(component.restp.partNumber).toEqual("AuroraWMDRS-22");
		expect(component.restp.associationType.length).toEqual(3);
	});

	xit("should be able to generate slides from attached merchandising associations", (done) => {
		component.restp.partNumber="AuroraWMDRS-22";
		expect(component.restp.partNumber).toEqual("AuroraWMDRS-22");
		expect(component.restp.associationType.length).toEqual(4);

		pSvc.findByPartNumber(component.restp)
		.then((p:any)=>{
			component.init(p);
			done();
		});
	});
});
