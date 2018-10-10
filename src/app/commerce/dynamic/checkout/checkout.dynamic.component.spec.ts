import { HttpModule} from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { OrderItemsComponent } from 'app/commerce/components/generic/order-items/order-items.component';
import { OrderTotalComponent } from 'app/commerce/components/generic/order-total/order-total.component';
import { FormsModule } from '@angular/forms';
import { OrderPromotionComponent } from 'app/commerce/components/generic/order-promotion/order-promotion.component';
import { Logger } from 'angular2-logger/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommerceMessageComponent } from 'app/commerce/components/generic/commerce-message/commerce-message.component';
import { MockRouter } from 'mocks/angular-class/router';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { OrderTransactionService } from 'app/commerce/services/componentTransaction/order.transaction.service';
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import {CheckoutDynamicComponent} from './checkout.dynamic.component';
import {CheckoutAddressDynamicComponent} from './checkout-address/checkout-address.dynamic.component';
import {ShipPaymentDynamicComponent} from './ship-payment/ship-payment.dynamic.component';
import { CheckoutStoreLocatorDynamicComponent } from './checkout-store-locator/checkout-store-locator.dynamic.component';
import { DynamicStoreLocatorLayoutComponent } from '../store-locator/store-locator.dynamic.component';

declare var __karma__: any;

describe('CheckoutDynamicComponent', () => {

    let component: CheckoutDynamicComponent;
    let fixture: ComponentFixture<CheckoutDynamicComponent>;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [
                CheckoutDynamicComponent,
                CheckoutAddressDynamicComponent,
                ShipPaymentDynamicComponent,
                OrderItemsComponent,
                OrderTotalComponent,
                OrderPromotionComponent,
                CommerceMessageComponent,
                CheckoutStoreLocatorDynamicComponent,
                DynamicStoreLocatorLayoutComponent
            ],
            imports: [
                HttpClientModule,
                HttpModule,
                FormsModule,
                CommercePipesModule,
                RouterModule,
                RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                }),
                CommonTestModule
            ],
            providers: [
                OrderTransactionService,
                OrderService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        da = TestBed.get(DigitalAnalyticsService);
        mockRouter = TestBed.get(Router);
        fixture = TestBed
        .createComponent(CheckoutDynamicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockRouter.initialNavigation();
        setTimeout(function() {
            done();
        }, 1000);

    });

    it('should instantiate', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('should initialize cart', () => {
        expect(component.cart).toBeDefined();
        expect(component.cart.orderId).toBe('7446378569');
        expect(component.cartReady).toBe(true);
    });

    it('should be able to submit order and navigate to Order Confirmation page', (done) => {
        component.selectedAddress = { ShippingAndBilling: { email1: 'heebie@jeebies.com' } };
        component.submitOrder().then((r) => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/order-confirmation'],
                { queryParams: { orderId: '7446378569', storeId: '1' } }
            );
            done();
        });
    });

    xit('should call Digital Analytics Service when completing order', (done) => {
        const daSpy = spyOn(da, 'orderComplete');

        component.selectedAddress = { ShippingAndBilling: { email1: 'heebie@jeebies.com' } };
        component.submitOrder().then(() => {
            expect(da.orderComplete).toHaveBeenCalled();
            done();
        });
    });

    it('should save shipping payment', () => {
        expect(component.shipPaymentUpdateEnabled).toBe(false);
        component.onSaveShipPayment(true);
        expect(component.shipPaymentUpdateEnabled).toBeNull();
    });

    it('should select address', () => {
        const newAddress = '123 street';
        component.selectedBopisOption = {};
        component.onSelectAddress(newAddress);
        expect(component.selectedAddress).toBe(newAddress);
        expect(component.shipPaymentUpdateEnabled).toBe(true);
    });

    it('should not save address', () => {
        const newAddress = false;
        component.onSelectAddress(newAddress);
        expect(component.addressSaved).toBe(false);
        expect(component.shipPaymentUpdateEnabled).toBe(false);
    });

    it('should assign error message', () => {
        const error = 'Cannot found usable shipping mode';
        component.onErrorMessage(error);
        expect(component.errorMessage).toBe('Cannot found usable shipping mode');
    });

    it('should clear error message', () => {
        component.closeErrrorMessage();
        expect(component.errorMessage).toBeNull();
    });
});

describe('CheckoutDynamicComponent - Error Case', () => {

    let component: CheckoutDynamicComponent;
    let fixture: ComponentFixture<CheckoutDynamicComponent>;
    let mockRouter: Router;
    let da: DigitalAnalyticsService;

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [
                CheckoutDynamicComponent,
                CheckoutAddressDynamicComponent,
                ShipPaymentDynamicComponent,
                OrderItemsComponent,
                OrderTotalComponent,
                OrderPromotionComponent,
                CommerceMessageComponent,
                CheckoutStoreLocatorDynamicComponent,
                DynamicStoreLocatorLayoutComponent
            ],
            imports: [
                HttpClientModule,
                HttpModule,
                FormsModule,
                RouterModule,
                CommercePipesModule,
                RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                }),
                CommonTestModule
            ],
            providers: [
                OrderTransactionService,
                OrderService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        da = TestBed.get(DigitalAnalyticsService);
        mockRouter = TestBed.get(Router);
        fixture = TestBed.createComponent(CheckoutDynamicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockRouter.initialNavigation();
        done();
    });

    it('should NOT be able to submit order and navigate to Order Confirmation page because order ID is missing', (done) => {
        __karma__.config.testGroup = 'invalidOrderId';

        const daSpy = spyOn(da, 'orderComplete').and.callFake(function(){});
        component.submitOrder().then((r) => {
            setTimeout(function(){
                expect(mockRouter.navigate).not.toHaveBeenCalledWith('/order-confirmation',
                    { queryParams: { orderId: '7446378569', storeId: '1' } }
                );
                expect(component.errorMessage).toBe('checkoutLayout.checkoutFallback');
                done();
            }, 1000);
        })
        .catch( r => {
            setTimeout(function(){
                expect(mockRouter.navigate).not.toHaveBeenCalledWith('/order-confirmation',
                    { queryParams: { orderId: '7446378569', storeId: '1' } }
                );
                expect(component.errorMessage).toBe('checkoutLayout.checkoutFallback');
                done();
            }, 1000);
        })
    });
});
