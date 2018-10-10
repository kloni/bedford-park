import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { ContactInfoLayoutComponent } from 'app/commerce/layouts/contact-info/contactInfoLayout';
import { ContactUsLayoutComponent } from 'app/commerce/layouts/contact-us/contactUsLayout';
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
import { ActivePageService, RenderingContext } from 'ibm-wch-sdk-ng';
import { FormattedTextPipe } from '../../../common/formattedtext/formatted-text.pipe';



declare var __karma__: any;

describe('ContactUsLayoutComponent', () => {
    let component: ContactUsLayoutComponent;
    let de:      DebugElement;
    let el:      HTMLElement;
    let fixture: ComponentFixture<ContactUsLayoutComponent>;
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
    }

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ ContactUsLayoutComponent, ContactInfoLayoutComponent, FormattedTextPipe ],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
               ],
            providers: [
                Logger,
                // use ConfigTestService for mocking ConfigService
				{ provide: ConfigService, useClass: ConfigTestService }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(ContactUsLayoutComponent);
        component = fixture.componentInstance;
        component.rContext = rContextMock;
        fixture.detectChanges();
    }));

    it('should instantiate and initialze all variables', (done) => {
        expect(component).toBeTruthy();

        done();
    });

    it('should be able to init and encodeAddress', (done) => {

        component.ngOnInit();

        expect(component.encodeAddress("123 Stockholm way")).toBe("123%20Stockholm%20way");

        done();
    });

});
