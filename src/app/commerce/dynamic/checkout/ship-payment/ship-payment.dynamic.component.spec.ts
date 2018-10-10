/*******************************************************************************
 * ship-payment.dynamic.component.spec.ts
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
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { TranslateLoader, TranslateModule, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from '@angular/router';
import { OrderPromotionComponent } from 'app/commerce/components/generic/order-promotion/order-promotion.component';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'app/commerce/services/product.service';
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';
import { Logger } from 'angular2-logger/core';
import { CartService } from 'app/commerce/services/rest/transaction/cart.service';
import { AssignedPromotionCodeService } from 'app/commerce/services/rest/transaction/assignedPromotionCode.service';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ShippingInfoService } from 'app/commerce/services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from 'app/commerce/services/rest/transaction/paymentInstruction.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { OrderTransactionService } from 'app/commerce/services/componentTransaction/order.transaction.service';
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import {CheckoutDynamicComponent} from '../checkout.dynamic.component';
import {ShipPaymentDynamicComponent} from './ship-payment.dynamic.component';

declare var __karma__: any;

xdescribe('ShipPaymentComponent', () => {

    let component: ShipPaymentDynamicComponent;
    let translateService: TranslateService;
    let fixture: ComponentFixture<ShipPaymentDynamicComponent>;
    let cartTransactionService: CartTransactionService;
    let checkoutLayoutComponent: CheckoutDynamicComponent;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ShipPaymentDynamicComponent, OrderPromotionComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CartTransactionService,
                AuthenticationTransactionService,
                CheckoutDynamicComponent,
                ProductService,
                ProductViewService,
                CartService,
                AssignedPromotionCodeService,
                LoginIdentityService,
                OrderTransactionService,
                OrderService,
                PersonService,
                ShippingInfoService,
                PaymentInstructionService,
                ActivePageService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(inject([CartTransactionService, CheckoutDynamicComponent, TranslateService], (_cartTransactionService: CartTransactionService, _checkoutLayoutComponent: CheckoutDynamicComponent, _translateService: TranslateService) => {
        translateService = _translateService;
        translateService.use(CommerceEnvironment.defaultLang);

        cartTransactionService = _cartTransactionService;
        checkoutLayoutComponent = _checkoutLayoutComponent;
        da = TestBed.get(DigitalAnalyticsService);
    })));

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        cartTransactionService.getCart().then(() => {
            fixture = TestBed.createComponent(ShipPaymentDynamicComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            done();
        });
    });

    it('should instantiate', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should assign selected address', (done) => {
        const address = {
            'ShippingAndBilling': {
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
                'zipCode': '12345'
            },
            'Shipping': {
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
                'zipCode': '12345'
            },
            'Billing': {
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
                'zipCode': '12345'
            }
        };
        component.selectedAddress = address;
        expect(component.selectedAddress).toBe(address);
        done();
    });

    it('should save shipping payment method', (done) => {
        // need to wait for the promises in ngOnInit to complete and reset state
        setTimeout(function() {
            component.getUsableShipMode().then((r) => {
                component.onShippingPaymentSave().then((r) => {
                    expect(component.selectedShipMethod.shipModeId).toBeDefined();
                    expect(component.selectedShipMethod.shipModeId).toBe('11001');
                    done();
                });
            });
        }, 2500);
    });

    it('should call digital analytic service when initializing checkout shipping payment', (done) => {
        const daSpy = spyOn(da, 'viewPage');
        // need to wait for the promises in ngOnInit to complete and reset state
        // setTimeout(function() {
            component.getUsableShipMode().then((r) => {
                component.onShippingPaymentSave().then((r) => {
                    expect(da.viewPage).toHaveBeenCalled();
                    done();
                });
            });
        // }, 2500);
    });

    it('should save shipping payment method', () => {
        const s = spyOn(component.onSaveShipPayment, 'emit');
        component.onShippingPaymentChange();
        expect(component.onSaveShipPayment.emit).toHaveBeenCalled();
    });

    it('should update payment instruction', (done) => {
        component.selectedPaymentMethod = {
            'description': 'Cash on delivery',
            'language': '-1',
            'paymentMethodName': 'COD',
            'paymentTermConditionId': '',
            'usableBillingAddress': {
                'addressId': '7663186436',
                'nickName': 'testuser@ca.ibm.com'
            },
            'xumet_attrPageName': 'StandardCOD',
            'xumet_policyId': '11003'
        };
        component.selectedAddress = {
            'Billing': {
                'addressId': '7641342610',
                'addressType': 'ShippingAndBilling',
                'city': 'markham', 'country': 'CA',
                'email1': 'billing@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'billing address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345'
            }
        };
        component.updatePaymentInstruction();
        done();
    });
});

xdescribe('ShipPaymentComponent - Error Case', () => {

    let component: ShipPaymentDynamicComponent;
    let translateService: TranslateService;
    let fixture: ComponentFixture<ShipPaymentDynamicComponent>;
    let cartTransactionService: CartTransactionService;
    let checkoutLayoutComponent: CheckoutDynamicComponent;
    let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ShipPaymentDynamicComponent, OrderPromotionComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                CartTransactionService,
                AuthenticationTransactionService,
                CheckoutDynamicComponent,
                ProductService,
                ProductViewService,
                CartService,
                AssignedPromotionCodeService,
                LoginIdentityService,
                PersonService,
                ShippingInfoService,
                PaymentInstructionService,
                ActivePageService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(inject([CartTransactionService, CheckoutDynamicComponent, TranslateService], (_cartTransactionService: CartTransactionService, _checkoutLayoutComponent: CheckoutDynamicComponent, _translateService: TranslateService) => {
        translateService = _translateService;
        translateService.use(CommerceEnvironment.defaultLang);

        cartTransactionService = _cartTransactionService;
        checkoutLayoutComponent = _checkoutLayoutComponent;
    })));

    beforeEach((done) => {
        __karma__.config.testGroup = '';

        cartTransactionService.getCart().then(() => {
            cartTransactionService.cartSubject.subscribe( ( cart ) => {
                this.cart = cart;
            } );
            done();
        });

        fixture = TestBed.createComponent(ShipPaymentDynamicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should NOT save invalid shipping info', (done) => {
        __karma__.config.testGroup = 'invalidShippingInfo';

        const address = {
            'ShippingAndBilling': {
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
                'zipCode': '12345'
            },
            'Shipping': {
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
                'zipCode': '12345'
            },
            'Billing': {
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
                'zipCode': '12345'
            }
        };
        component.selectedAddress = address;
        component.getUsableShipMode().then(() => {
            component.onShippingPaymentSave().then(() => {
                done();
            })
            .catch( (e) => {
                component.onErrorMessage.emit('onShippingPaymentSave error');
                done();
            });
        })
        .catch( (e) => {
            component.onErrorMessage.emit('getUsableShipMode error');
            done();
        });
    });

    it('should NOT save invalid payment method', (done) => {
        __karma__.config.testGroup = 'invalidPaymentMethod';

        const address = {
            'ShippingAndBilling': {
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
                'zipCode': '12345'
            },
            'Shipping': {
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
                'zipCode': '12345'
            },
            'Billing': {
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
                'zipCode': '12345'
            }
        };
        component.selectedAddress = address;
        component.getUsableShipMode().then(() => {
            component.onShippingPaymentSave().then(() => {
                done();
            })
            .catch( (e) => {
                component.onErrorMessage.emit('onShippingPaymentSave error');
                done();
            });
        })
        .catch( (e) => {
            component.onErrorMessage.emit('getUsableShipMode error');
            done();
        });
    });

    it('should NOT save invalid payment instruction', (done) => {
        __karma__.config.testGroup = 'invalidPaymentInst';
        component.selectedPaymentMethod = {
            'description': 'Cash on delivery',
            'language': '-1',
            'paymentMethodName': 'COD',
            'paymentTermConditionId': '',
            'usableBillingAddress': {
                'addressId': '7663186436',
                'nickName': 'testuser@ca.ibm.com'
            },
            'xumet_attrPageName': 'StandardCOD',
            'xumet_policyId': '11003'
        };
        component.selectedAddress = {
            'Billing': {
                'addressId': '7641342610',
                'addressType': 'ShippingAndBilling',
                'city': 'markham', 'country': 'CA',
                'email1': 'billing@ca.ibm.com',
                'firstName': 'f',
                'lastName': 'l',
                'nickName': 'billing address',
                'primary': 'false',
                'state': 'ON',
                'zipCode': '12345'
            }
        };
        component.updatePaymentInstruction();
        done();
    });
});
