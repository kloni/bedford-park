import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { DesignPageRightLayoutComponent } from 'app/commerce/layouts/design-page-right/designPageRightLayout';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';
import { ConfigurationService } from 'app/commerce/services/rest/transaction/configuration.service';
import { FormsModule } from '@angular/forms';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ConfigService } from 'app/commerce/common/config.service';
import { ConfigTestService } from 'app/commerce/common/configTest.service';
import { Logger } from 'angular2-logger/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivePageService, RenderingContext, WchNgModule, HubInfoService, ContentrefComponent} from 'ibm-wch-sdk-ng';
import { ShareSocialComponent } from '../../../components/share-social/share-social.component';
import { ArticleBodyImageComponent } from '../article-body-image/article-body-image.component';
import { FormattedTextPipe } from '../../../common/formattedtext/formatted-text.pipe';
import {UtilsService} from "../../../common/utils/utils.service";
import {WchNgEditModule, WchInlineEditServiceToken} from 'ibm-wch-sdk-ng-edit';



declare var __karma__: any;

describe('DesignPageRightLayoutComponent', () => {
    let component: DesignPageRightLayoutComponent;
    let de:      DebugElement;
    let el:      HTMLElement;
    let fixture: ComponentFixture<DesignPageRightLayoutComponent>;
    let rContextMock: any = {
      id: 15,
      context: {
        hub: {
          deliveryUrl: [{ 'origin': 'https://stockholm.digitalexperience.ibm.com/' }]
        }
      },
      elements:
      {
        heading: {"elementType":"text","value":"Sustainability page Right"},
        author:{"elementType":"text","value":"Maxine Brown"},
        contactDetails: {
          values: "email: customer-service@example.com"
        }
      }
    };
    const environment = {
    production: false
  , apiUrl: 'https://stockholm-ut.digitalexperience.ibm.com/api/bd24d106-f6a1-46e4-b50f-1f80b15bc0b2'
  , deliveryUrl: 'https://stockholm-ut.digitalexperience.ibm.com/bd24d106-f6a1-46e4-b50f-1f80b15bc0b2'
  , httpOptions: { useJsonP: false }};

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ DesignPageRightLayoutComponent, ShareSocialComponent, ArticleBodyImageComponent, FormattedTextPipe ],
            imports: [ HttpClientModule, HttpModule, RouterTestingModule, WchNgEditModule.forRoot(), WchNgModule.forRoot(environment), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
               ],
            providers: [
                Logger,
                UtilsService,
                // use ConfigTestService for mocking ConfigService
				{ provide: ConfigService, useClass: ConfigTestService }
      ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(DesignPageRightLayoutComponent);
        component = fixture.componentInstance;
        component.rContext = rContextMock;
        fixture.detectChanges();
    }));

    it('should instantiate and initialze all variables', (done) => {
        expect(component).toBeTruthy();

        // de = fixture.debugElement.query(By.css('iframe'));
        // el = de.nativeElement;
        //
        // expect(el.innerHTML).toContain('Contact Us');
        done();
    });

});
