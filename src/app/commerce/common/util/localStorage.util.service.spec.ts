import { async, TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from "@ngx-translate/core";
import { Logger } from "angular2-logger/core";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { LocalStorageUtilService } from "app/commerce/common/util/localStorage.util.service";

declare var __karma__: any;

describe('LocalStorageUtilService', () => {

    let localStorage: any;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [  CommonTestModule,
                        HttpClientModule, HttpModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
            ],
            providers: [
				LocalStorageUtilService,
                Logger
            ]
        });
	}));

	beforeEach(() => {
        localStorage = TestBed.get(LocalStorageUtilService);
    });

    it('should instantiate', () => {
        expect(localStorage).toEqual(jasmine.any(LocalStorageUtilService));
    });

    it('should get item from localStorage when it exists', () => {
        let spy = spyOn(localStorage, 'saveStorageKeys');
        localStorage.put("test-key", "test-value");
        expect(localStorage.get("test-key")).toBe("test-value");
        expect(localStorage.saveStorageKeys).toHaveBeenCalled(); 
    });

    it('should return null from localStorage when it does not exists', () => {
        expect(localStorage.get("test-key123456789")).toBe(null);
    });

    it('should return null if localStorage is disabled', () => {
        localStorage.isEnabled = false;
        expect(localStorage.get("test-key")).toBe(null); 
    });

    it('should not store anything if localStorage is disabled', () => {
        localStorage.isEnabled = false;
        let spy = spyOn(localStorage, 'saveStorageKeys');
        localStorage.put("test-key", "test-value");
        expect(localStorage.get("test-key")).toBe(null);
        expect(localStorage.saveStorageKeys).toHaveBeenCalledTimes(0); 
    });

    it('should not remove anything if localStorage is disabled', () => {
        localStorage.isEnabled = false;
        let spy = spyOn(localStorage, 'saveStorageKeys');
        localStorage.remove("test-key", "test-value");
        expect(localStorage.saveStorageKeys).toHaveBeenCalledTimes(0); 
    });

    it('should remove the specified key from localStorage', () => {
        let spy = spyOn(localStorage, 'saveStorageKeys');
        localStorage.put('test-key', 'test-value');
        localStorage.remove('test-key');
        expect(localStorage.get('test-key')).toBe(null);
        expect(localStorage.saveStorageKeys).toHaveBeenCalled();
    });

    it('should set item with expiration date', () => {
        let spy = spyOn(localStorage, 'getExpireValue');
        let expirationValue = 123;
        localStorage.put('test-key', 'test-value', expirationValue);
        expect(localStorage.getExpireValue).toHaveBeenCalledWith(expirationValue);
    });

    it('should invalidate item when it is expiring', () => {
        localStorage.put('test-key', 'test-value', -2);
        let spy = spyOn(localStorage, 'remove');
        expect(localStorage.invalidateIfExpired('test-key')).toBe(true);
        expect(localStorage.remove).toHaveBeenCalledWith('test-key');
    });

    it('should return false if window.storage does not exists', () => {
        localStorage.storage = undefined;
        expect(localStorage.isLocalStorageEnabled()).toBe(false);
    });

});

