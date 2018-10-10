import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { FooterLayoutComponent } from 'app/commerce/layouts/footer/footerLayout';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ConfigurationService } from 'app/commerce/services/rest/transaction/configuration.service';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'app/commerce/common/config.service';
import { ConfigTestService } from 'app/commerce/common/configTest.service';
import { Logger } from 'angular2-logger/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivePageService, RenderingContext, WchLoggerService, WchNgModule } from 'ibm-wch-sdk-ng';
import { FormattedTextPipe } from '../../../common/formattedtext/formatted-text.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { EventService } from 'app/commerce/services/rest/transaction/event.service';
import { CategoryService } from "app/commerce/services/category.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { ProductService } from "app/commerce/services/product.service";
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import {WchNgEditModule, WchInlineEditServiceToken} from 'ibm-wch-sdk-ng-edit';
import { Component } from '@angular/core';

declare var __karma__: any;

describe('FooterLayoutComponent', () => {
    let component: FooterLayoutComponent;
    let fixture: ComponentFixture<FooterLayoutComponent>;
    let rContextMock: any = {
      id: 15,
      context: {
        hub: {
          deliveryUrl: [{ 'origin': 'https://stockholm.digitalexperience.ibm.com/' }]
        }
      },
      elements:
      {
        heading: {
          value: 'Contact Us'
        },
        contactDetails: {
          values: "email: customer-service@example.com"
        }
      }
    };
    const environment = {
      production: false
      , apiUrl: 'https://stockholm-ut.digitalexperience.ibm.com/api/bd24d106-f6a1-46e4-b50f-1f80b15bc0b2'
      , deliveryUrl: 'https://stockholm-ut.digitalexperience.ibm.com/bd24d106-f6a1-46e4-b50f-1f80b15bc0b2'
      , httpOptions: { useJsonP: false }
    };

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ FooterLayoutComponent, FormattedTextPipe, RouterMockTestComponent ],
            imports: [ HttpClientModule, HttpModule, AngularSvgIconModule, WchNgEditModule.forRoot(), WchNgModule.forRoot(environment), FormsModule, RouterTestingModule.withRoutes([
              { path: '**', component: RouterMockTestComponent }
            ]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
               ],
            providers: [
              WchLoggerService,
              Logger,
              RecommendationService,
              StorefrontUtils,
              EventService,
              CategoryService,
              CategoryViewService,
              ProductService,
              ProductViewService,
              // use ConfigTestService for mocking ConfigService
              { provide: ConfigService, useClass: ConfigTestService }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(FooterLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate', (done) => {

        expect(component).toBeTruthy();

        done();
    });


});

@Component({
  template: `
    <a routerLink="/test/page/{{pageName}}">link</a>
    <router-outlet></router-outlet>
  `
})

@Component({
  template: ''
})

/**
 * Mocks routerLink
 */
class RouterMockTestComponent {
}
