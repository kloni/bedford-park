/*******************************************************************************
 * checkout-address.dynamic.component.spec.ts
 *
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import { HttpModule} from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';
import { Logger } from 'angular2-logger/core';
import { PaymentInstructionService } from 'app/commerce/services/rest/transaction/paymentInstruction.service';
import { AssignedPromotionCodeService } from 'app/commerce/services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from 'app/commerce/services/rest/transaction/shippingInfo.service';
import { ProductService } from 'app/commerce/services/product.service';
import { CartService } from 'app/commerce/services/rest/transaction/cart.service';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { setTimeout } from 'timers';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import {CheckoutAddressDynamicComponent} from './checkout-address.dynamic.component';

declare var __karma__: any;

describe('CheckoutAddressDynamicComponent', () => {

    let component: CheckoutAddressDynamicComponent;
    let fixture: ComponentFixture<CheckoutAddressDynamicComponent>;
    let translateService: TranslateService;
    let cartTransactionService: CartTransactionService;
    let authenticationTransactionService: AuthenticationTransactionService;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;

    beforeEach(done => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CheckoutAddressDynamicComponent],
            imports: [HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                }),
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
                ModalDialogService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';

        translateService = TestBed.get(TranslateService);
        translateService.use(CommerceEnvironment.defaultLang);
        da = TestBed.get(DigitalAnalyticsService);

        cartTransactionService = TestBed.get(CartTransactionService);
        cartTransactionService.getCart().then(() => {
            cartTransactionService.cartSubject.subscribe((cart) => {
                this.cart = cart;
            });
        });
        authenticationTransactionService = TestBed.get(AuthenticationTransactionService);

        fixture = TestBed.createComponent(CheckoutAddressDynamicComponent);
        component = fixture.componentInstance;
        component._addressNickNames.Shipping = null;
        component._addressNickNames.Billing = null;
        fixture.detectChanges();
        setTimeout(function() {
            done();
        }, 1000);
    });


    afterEach((done) => {
        __karma__.config.testGroup = '';
        authenticationTransactionService.logout().then(() => {
            expect(authenticationTransactionService.isLoggedIn()).toBe(false);
            done();
        });
    });

    it('should instantiate', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should initialize same shipping and billing addresses', (done) => {
        component.initAddressList().then(res => {
            expect(component.shippingAddresses).toBeDefined();
            expect(component.shippingAddresses[0].addressId).toBe('7634527688');
            expect(component.billingAddresses).toBeDefined();
            expect(component.billingAddresses[0].country).toBe('US');
            expect(component.shippingAndBillingAddresses).toBeDefined();
            expect(component.shippingAndBillingAddresses[0].city).toBe('newyork');
            expect(component.sameSB).toBe(true);
            expect(component.selectedAddress.Billing).toBe(component.selectedAddress.Shipping);
            expect(component.selectedAddress.Billing).toBe(component.selectedAddress.ShippingAndBilling);
            done();
        });
    });

    it('should call digital analytic service when initializing checkout address', (done) => {
        const daSpy = spyOn(da, 'viewPage');
        component.initAddressList().then(res => {
            expect(da.viewPage).toHaveBeenCalled();
            done();
        });
    });

    it('should update to different shipping and billing addresses (unselect check box "Billing address is the same as shipping address")', (done) => {
        component.sameSB = false;
        component.shippingAddresses = [
            {
                'addressId': '7641342609',
                'addressType': 'ShippingAndBilling',
                'city': 'toronto',
                'country': 'CA',
                'email1': 'shipping@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'shipping address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345',
                'addressLine': [
                    '123 Street'
                ]
            }
        ];
        component.billingAddresses = [
            {
                'addressId': '7641342610',
                'addressType': 'ShippingAndBilling',
                'city': 'markham',
                'country': 'CA',
                'email1': 'billing@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'billing address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345',
                'addressLine': [
                    '123 Street'
                ]
            }
        ];
        component.selectedAddress.Shipping = null;
        component.selectedAddress.Billing = null;

        component.updateSameSB();
        setTimeout(function() {
            expect(component.sameSB).toBe(false);
            expect(component.selectedAddress.Billing).not.toBe(component.selectedAddress.Shipping);
            done();
        }, 1000);
    });

    it('should update to same shipping and billing addresses (select check box "Billing address is the same as shipping address")', (done) => {
        component.selectedAddress = {};
        component.selectedAddress.Shipping = {};
        component.selectedAddress.Billing = {};
        component.shippingAndBillingAddresses = [
        {
            'addressId': '7641342609',
            'addressType': 'ShippingAndBilling',
            'city': 'toronto',
            'country': 'CA',
            'email1': 'shipping@ca.ibm.com',
            'firstName': 'f',
            'lastName': 'l',
            'nickName': 'shipping address',
            'primary': 'false',
            'state': 'ON',
            'zipCode': '12345',
            'addressLine': [
                '123 Street'
            ]
        }];

        component.updateSameSB();
        setTimeout(() => {
            expect(component.sameSB).toBe(true);
            expect(component.selectedAddress.Billing).toBe(component.selectedAddress.Shipping);
            done();
        }, 2500);
    });

    it('should update to selected address', () => {
        component.selectedAddress.ShippingAndBilling = {};
        component.onSelectChange('ShippingAndBilling');
        expect(component.selectedAddress.Billing).toBe(component.selectedAddress.Shipping);
        expect(component.selectedAddress.Billing).toBe(component.selectedAddress.ShippingAndBilling);
    });

    it('should not be logged in if guest shopper', () => {

        //make sure user is not logged in
        expect(component.isGuest).toBeTruthy();

    });

    it('should be logged in if registered shopper', (done) => {

        //make sure user logged in
        authenticationTransactionService.login('username', 'password').then(res => {
            component.ngOnInit();
            expect(component.isGuest).toBeFalsy();
            done();
        })
    });

    it('should save and continue when form(same shipping and billing address) is valid with new selected address', () => {
        //make sure user is not logged in

        component.sameSB = true;
        const f = {
            valid: true
        }

        component.selectedAddress.ShippingAndBilling = {
                'isNew': true,
                'country': 'CA',
                'addressType': 'ShippingAndBilling',
                'nickName': 'Guest shipping and billing address',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Shipping).toBe('Guest shipping and billing address');
            expect(component._addressNickNames.Billing).toBe('Guest shipping and billing address');
            expect(component.showBilling).toBeFalsy();
        });


    });

    it('should call digital analytic service when saving checkout address', (done) => {
        component.sameSB = true;
        const f = {
            valid: true
        }

        component.selectedAddress.ShippingAndBilling = {
            'isNew': true,
            'country': 'CA',
            'addressType': 'ShippingAndBilling',
            'nickName': 'Guest shipping and billing address',
            'addressId': '7641342609',
            'primary': 'false',
            'lastName': 'l',
            'zipCode': '12345',
            'firstName': 'f',
            'email1': 'shipping@ca.ibm.com',
            'city': 'toronto',
            'state': 'ON',
            'addressLine': [
                '123 Street'
            ]
        };

        const daSpy = spyOn(da, 'viewPage');
        component.saveAndContinue(f).then(res => {
            expect(da.viewPage).toHaveBeenCalled();
            done();
        });
    });

    it('should save and continue when form is valid(same shipping and billing address) with edited selected address', () => {
        //make sure user is not logged in

        component.sameSB = true;
        const f = {
            valid: true
        }

        component.selectedAddress.ShippingAndBilling = {
                'isEdit': true,
                'country': 'CA',
                'addressType': 'ShippingAndBilling',
                'nickName': 'GuestShippingBillingAddressEdited',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Shipping).toBe('GuestShippingBillingAddressEdited');
            expect(component._addressNickNames.Billing).toBe('GuestShippingBillingAddressEdited');
            expect(component.showBilling).toBeFalsy();
        });


    });

    it('should save and continue when form is valid(shipping address) with new selected address', (done) => {
        //make sure user is not logged in

        component.sameSB = false;
        const f = {
            valid: true
        }
        component.selectedAddress.Billing = {};
        component.selectedAddress.Shipping = {
                'isNew': true,
                'country': 'CA',
                'addressType': 'Shipping',
                'nickName': 'Guest shipping address',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Shipping).toBe('Guest shipping address');
            expect(component.showBilling).toBeFalsy();
            done();
        });


    });

    it('should save and continue when form is valid(shipping address) with edited selected address', (done) => {
        //make sure user is not logged in

        component.sameSB = false;
        const f = {
            valid: true
        }
        component.selectedAddress.Billing = {};
        component.selectedAddress.Shipping = {
                'isEdit': true,
                'country': 'CA',
                'addressType': 'Shipping',
                'nickName': 'GuestShippingAddressEdited',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Shipping).toBe('GuestShippingAddressEdited');
            expect(component.showBilling).toBeFalsy();
            done();
        });


    });

    it('should save and continue when form is valid(billing address) with new selected address', (done) => {
        //make sure user is not logged in

        component.sameSB = false;
        const f = {
            valid: true
        }
        component.selectedAddress.Shipping = {};
        component.selectedAddress.Billing = {
                'isNew': true,
                'country': 'CA',
                'addressType': 'Billing',
                'nickName': 'Guest billing address',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Billing).toBe('Guest billing address');
            expect(component.showBilling).toBeFalsy();
            done();
        });


    });

    it('should save and continue when form is valid(billing address) with edited selected address', (done) => {
        //make sure user is not logged in

        component.sameSB = false;
        const f = {
            valid: true
        }
        component.selectedAddress.Shipping = {};
        component.selectedAddress.Billing = {
                'isEdit': true,
                'country': 'CA',
                'addressType': 'Billing',
                'nickName': 'GuestBillingAddressEdited',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ]
            };

        component.saveAndContinue(f).then(res => {
            expect(component._addressNickNames.Billing).toBe('GuestBillingAddressEdited');
            expect(component.showBilling).toBeFalsy();
            done();
        });


    });

    it('should save and continue when form is invalid', () => {

        //make sure user is not logged in
        const f = {
            valid: false
        }

        component.saveAndContinue(f);
        expect(component.addressFormChecked).toBeTruthy();


    });

    it('should select country', () => {
        //make sure user is not logged in

        component.sameSB = false;
        const f = {
            valid: true
        }

        component.selectedAddress.Billing = {
                'isEdit': true,
                'country': 'CA',
                'addressType': 'Billing',
                'nickName': 'GuestBillingAddressEdited',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ],
            };
        component.onCountrySelect(component.selectedAddress.Billing);
        expect(component.selectedAddress.Billing.countryObject.displayName).toBe('Canada');
    });

    it('should show edit form instead of default', () => {
        //make sure user is not logged in

        const event  = {
            preventDefault: function() {}
        };


        component.selectedAddress.Billing = {

                'country': 'CA',
                'addressType': 'Billing',
                'nickName': 'GuestBillingAddressEdited',
                'addressId': '7641342609',
                'primary': 'false',
                'lastName': 'l',
                'zipCode': '12345',
                'firstName': 'f',
                'email1': 'shipping@ca.ibm.com',
                'city': 'toronto',
                'state': 'ON',
                'addressLine': [
                    '123 Street'
                ],
            };
        component.edit(event, component.selectedAddress.Billing, 'Billing');
        expect(component.selectedAddress.Billing.isEdit).toBeTruthy();
    });

});

describe('CheckoutAddressComponent - Error Case', () => {

    let component: CheckoutAddressDynamicComponent;
    let fixture: ComponentFixture<CheckoutAddressDynamicComponent>;
    let translateService: TranslateService;
    let cartTransactionService: CartTransactionService;
    let httpMock: HttpTestingController;
    let interceptor: HttpErrorInterceptor;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [CheckoutAddressDynamicComponent],
            imports: [HttpClientModule, HttpModule, FormsModule, HttpClientTestingModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                }),
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
                ModalDialogService,
                Logger,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true,
                },
                HttpErrorInterceptor,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(inject([TranslateService, CartTransactionService, HttpErrorInterceptor, HttpTestingController], (_translateService: TranslateService, _cartTransactionService: CartTransactionService, _interceptor: HttpErrorInterceptor, _httpMock: HttpTestingController) => {
        __karma__.config.testGroup = '';

        httpMock = _httpMock;
        interceptor = _interceptor;

        translateService = _translateService;
        translateService.use(CommerceEnvironment.defaultLang);

        cartTransactionService = _cartTransactionService;
        cartTransactionService.getCart().then(() => {
            cartTransactionService.cartSubject.subscribe((cart) => {
                this.cart = cart;
            });
        });

        fixture = TestBed.createComponent(CheckoutAddressDynamicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));

    it('should NOT initialize shipping and billing addresses', (done) => {
        __karma__.config.testGroup = 'invalidOrderId';

        component.initAddressList().then(res => {
            done();
        });

        const mockErrorResponse = {
            status: 400,
            statusText: 'Bad Request'
        };
        const errorData = {
            'errors': [
                {
                    'errorKey': '_ERR_ORDER_NOT_FOUND',
                    'errorParameters': '1,orderId',
                    'errorMessage': 'The field "orderId" contains "1" but an order with that reference number does not exist.',
                    'errorCode': 'CMN1024E'
                }
            ]
        }
        const req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.invalidOrderId.findPersonBySelf.mocks.json');
        req.flush(errorData, mockErrorResponse);
    });

    it('should initialize shipping and billing address when shipping address type does not exist', (done) => {
        component.sameSB = true;
        component.shippingAndBillingAddresses = [
            {
                'addressId': '7641342609',
                'addressType': 'ShippingAndBilling',
                'city': 'toronto',
                'country': 'CA',
                'email1': 'shipping@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'shipping address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345'
            }
        ];
        component.shippingAddresses = [
            {
                'addressId': '7641342609',
                'addressType': 'ShippingAndBilling',
                'city': 'toronto',
                'country': 'CA',
                'email1': 'shipping@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'shipping address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345'
            }
        ];
        component.selectedAddress.Shipping = null;
        component.updateSameSB();
        setTimeout(() => {
            expect(component.selectedAddress.ShippingAndBilling).toBe(component.selectedAddress.Shipping);
            done();
        }, 2000);

    });
});
