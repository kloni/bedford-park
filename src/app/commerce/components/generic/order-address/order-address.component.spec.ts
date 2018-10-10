import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { OrderAddressComponent } from 'app/commerce/components/generic/order-address/order-address.component';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';
import { Logger } from 'angular2-logger/core';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ProductService } from 'app/commerce/services/product.service';
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';
import { CartService } from 'app/commerce/services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from 'app/commerce/services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from 'app/commerce/services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from 'app/commerce/services/rest/transaction/paymentInstruction.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

describe('OrderAddressComponent', () => {

    let component: OrderAddressComponent;
    let fixture: ComponentFixture<OrderAddressComponent>;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [OrderAddressComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                AuthenticationTransactionService,
                CartTransactionService,
                PersonContactService,
                CountryService,
                LoginIdentityService,
                PersonService,
                ProductService,
                ProductViewService,
                CartService,
                AssignedPromotionCodeService,
                ShippingInfoService,
                PaymentInstructionService,
                ActivePageService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(OrderAddressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should check shipping estimate address on nickname', () => {
        expect(component.isShippingEstimateAddress("new address")).toBe(false);
        expect(component.isShippingEstimateAddress("ApplePhoneContact_0")).toBe(true);
    });
});
