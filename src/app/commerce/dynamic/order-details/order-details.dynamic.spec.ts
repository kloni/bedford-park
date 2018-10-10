import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DynamicOrderDetailsLayoutComponent } from './order-details.dynamic.component';
import { OrderTransactionService } from '../../services/componentTransaction/order.transaction.service';
import { OrderService } from '../../services/rest/transaction/order.service';
import { Logger } from 'angular2-logger/core';
import { CartService } from '../../services/rest/transaction/cart.service';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from '../../services/rest/transaction/loginIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { ProductService } from '../../services/product.service';
import { ProductViewService } from '../../services/rest/search/productView.service';
import { CartTransactionService } from '../../services/componentTransaction/cart.transaction.service';
import { AssignedPromotionCodeService } from '../../services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from '../../services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from '../../services/rest/transaction/paymentInstruction.service';
import { CountryService } from '../../services/rest/transaction/country.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommercePipesModule } from '../../pipes/commerce-pipes.module';
import { CommonTestModule } from "../../common/common.test.module";
import { OrderCommentComponentModule } from '../../components/generic/order-comment/order-comment.component.module';
import { StorefrontUtilsTest } from '../../common/storefrontUtilsTest.service';
import { StorefrontUtils } from '../../common/storefrontUtils.service';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('DynamicOrderDetailsLayoutComponent', () => {

    let component: DynamicOrderDetailsLayoutComponent;
    let fixture: ComponentFixture<DynamicOrderDetailsLayoutComponent>;

    const MockActivatedRoute = {
        storeId: '1',
        orderId: '7548302032'
    }
    let mockRouter: Router;  
    let su:StorefrontUtils
  
   
    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicOrderDetailsLayoutComponent],
            imports: [HttpClientModule, HttpModule, RouterModule, RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient]
                    }
                }),
                CommercePipesModule,
                CommonTestModule, OrderCommentComponentModule
            ],
            providers: [
                OrderTransactionService, OrderService, Logger,
                CartService, AuthenticationTransactionService, LoginIdentityService, PersonService,
                ProductService, ProductViewService, CartTransactionService, AssignedPromotionCodeService,
                ShippingInfoService, PaymentInstructionService, CountryService, 
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: Observable.from([MockActivatedRoute]) },
                },
                { provide: Router, useClass: MockRouter }
            ]
        });


    });

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(DynamicOrderDetailsLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockRouter.initialNavigation();
        su = TestBed.get(StorefrontUtils);
        let currentUser = 'eyJwZXJzb25hbGl6YXRpb25JRCI6IjE1MzExNjEzNDg2ODctMiIsIldDVG9rZW4iOiI5OTg2MTUlMkNJWEttRTlieFRueGt6UTJsTnlEckU3Vlh4a2dycDlnTVhreDlweTl2UUs3WjBYYzhLM0g2VGdDaHJkZk5lUVduaENqZ2FkNGxSVlZxakZiSFdMaEd3RmJ2dEFwQnV3OFI0WHh3SDZDc1k5Q0xYbnYyQTc3YW56UnVtVTJHYkN6VjdxeUxWN3BVSXpDZE1KRm1IYmlKbGxDc1dNSW96dURmViUyQjZuWHdhYnl6Q3huZXpNUWpuQWVrMExJVnNsdHdFenlxenkwMjlrMkFENCUyRnNRZVRDZlNCVWl2aEUyZVF0Wnd5VmlPOXolMkIyTm9DVGx4YnglMkY3aDBpZyUyQnhQeFhvZEVacyIsInVzZXJJZCI6Ijk5ODYxNSIsIldDVHJ1c3RlZFRva2VuIjoiOTk4NjE1JTJDTkdNRzlDdmZjNTNzJTJGQzMyUkthcFN4SGhLM0VFbkU2JTJGS1dHd2NFVzBNZDAlM0QiLCJ1c2VybmFtZSI6ImdyYWNlY3NyQGdtYWlsLmNvbSIsImlzR29pbmdUb0NoZWNrb3V0IjpmYWxzZSwiaXNDU1IiOnRydWV9';
        sessionStorage.setItem('currentUser' ,currentUser);
    }));


    it('should instantiate', () => {
        // instatiation test case
        expect(component).toBeTruthy();

    });

    it('should reOrder() and navigate to shopping cart page ', (done) => {
        component.reOrder(7548302032)
            .then((r) => {
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/cart']);
                done();
            });
    });

    it('should getOrderStatusDescription()', () => {

        let orderStatusDescription: string;
        orderStatusDescription = component.getOrderStatusDescription("M");
        expect(orderStatusDescription).toEqual("Order received and ready for processing");
        orderStatusDescription = component.getOrderStatusDescription("W");
        expect(orderStatusDescription).toEqual("Pending approval");
        orderStatusDescription = component.getOrderStatusDescription("B");
        expect(orderStatusDescription).toEqual("Back ordered");

    });

    it('should get shipping and billing country information', () => {

        expect(component.countryShippingDescription).toBe("Canada");
        expect(component.countryBillingDescription).toBe("Canada");

    });

    it('should set VATEnabled flag to be true', () => {

        expect(component.VATEnabled).toBe(true);  
        expect(component.VAT).toBeDefined();
        
    });
    
});
