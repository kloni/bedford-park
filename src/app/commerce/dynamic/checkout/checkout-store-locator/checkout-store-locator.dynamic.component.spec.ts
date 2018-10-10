import { HttpModule} from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Logger } from 'angular2-logger/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { CheckoutStoreLocatorDynamicComponent } from './checkout-store-locator.dynamic.component';
import { DynamicStoreLocatorLayoutComponent } from 'app/commerce/dynamic/store-locator/store-locator.dynamic.component';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { MenuService } from "app/responsiveHeader/services/MenuService";
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
declare var __karma__: any;

describe('CheckoutStoreLocatorDynamicComponent', () => {

    let component: CheckoutStoreLocatorDynamicComponent;
    let fixture: ComponentFixture<CheckoutStoreLocatorDynamicComponent>;
    let storeLocator: DynamicStoreLocatorLayoutComponent;
    let storeLocatorAfterViewSpy;
    let afterViewInitSpy;
    let inItSpay;
    const testStore = {
        storeAddress: "CA 1AC 2AC ON Toronto 1 test address",
        storeName: "test store",
        storePhoneNumber: "123456",
        storeId: "1"
    }

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [
                CheckoutStoreLocatorDynamicComponent
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
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                Logger,
                CartTransactionService,
                DynamicStoreLocatorLayoutComponent,
                ChangeDetectorRef,
                MenuService
            ]
        }).compileComponents();
        done();
    });

    beforeEach((done) => {
        __karma__.config.testGroup = '';
        fixture = TestBed.createComponent(CheckoutStoreLocatorDynamicComponent);
        component = fixture.componentInstance;
        afterViewInitSpy =  spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
        inItSpay =  spyOn(component, 'ngOnInit').and.callFake(function(){});
        component.ngOnDestroy = function(){};
        fixture.detectChanges();
        storeLocator = TestBed.get(DynamicStoreLocatorLayoutComponent);
        storeLocatorAfterViewSpy =  spyOn(storeLocator, 'ngAfterViewInit').and.callFake(function(){});
        storeLocator.ngOnDestroy = function(){};
        setTimeout(function() {
            done();
        }, 1000);

    });

    it('should instantiate', (done) => {
        expect(component).toBeDefined();
        spyOn(component,"getPreferredStore").and.returnValue(testStore)
        component.initPhysicalStore();
        done();
    });

    it('save and Continue', (done) => {
        const event = {target:{id:"pickup"}}
        component.onSelectionChange(event);
        expect(component.showPickUpStore).toBe(true);

        component.selectedPhysicalStore = testStore;

        spyOn(component.onSaveBOPIS, 'emit');
        component.saveAndContinue();
        setTimeout(()=>{
            expect(component.onSaveBOPIS.emit).toHaveBeenCalled();
            expect(component.bopisSelectionSaved).toBe(true);
            done();
        },500);
    });

    it('shoud show error when pickup and no selected store',()=> {
        const event = {target:{id:"pickup"}}
        component.onSelectionChange(event);
        expect(component.showPickUpStore).toBe(true);
        component.selectedPhysicalStore = undefined;
        spyOn(component.onErrorMessage, 'emit');
        component.saveAndContinue();
        expect(component.onErrorMessage.emit).toHaveBeenCalled();
        expect(component.bopisSelectionSaved).toBe(false);
    })
});

