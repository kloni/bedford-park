import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';
import { ConfigurationService } from 'app/commerce/services/rest/transaction/configuration.service';
import { FormsModule } from '@angular/forms';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { Logger } from 'angular2-logger/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { DynamicPersonalInformationLayoutComponent } from './personal-info.dynamic.component';

declare var __karma__: any;

xdescribe('DynamicPersonalInformationLayoutComponent', () => {
    let component: DynamicPersonalInformationLayoutComponent;
    let fixture: ComponentFixture<DynamicPersonalInformationLayoutComponent>;
    let da: DigitalAnalyticsService;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ DynamicPersonalInformationLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ],
            providers: [
                AccountTransactionService,
                ActivePageService,
                ConfigurationService,
                PersonService,
                ModalDialogService,
                Logger,
                { provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        da = TestBed.get(DigitalAnalyticsService);
        fixture = TestBed.createComponent(DynamicPersonalInformationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should instantiate and initialze all variables', (done) => {
        expect(component).toBeTruthy();
        expect(component.currentYear).toBe((new Date()).getFullYear());
        expect(component.birthYears.length).toBe(101);
        expect(component.birthMonths.length).toBe(12);
        expect(component.birthDates.length).toBe(31);
        expect(component.genderList.length).toBe(2);
        expect(component.currencies[0]).toBeDefined();
        expect(component.user).toBeDefined();
        expect(component.savedUser).toBeDefined();
        expect(component.user.disp).toBe('test user');
        expect(component.user.selectedPhone).toBe('1234567890');
        expect(component.user.selectedEmail).toBe('testuser@ca.ibm.com');
        expect(component.user.selectedCurrency).toBe('US Dollar');
        expect(component.user.gender).toBe('Unspecified');
        done();
    });

    it('should open personal information modal dialog to fetch saved user data', (done) => {
        component.user.firstName = "newFirstName";
		component.openPIDialog();
		fixture.detectChanges();
        expect(component.updateErrorMsg).toBe('');
        expect(component.user).toEqual(component.savedUser);
        done();
    });

    it('should open change password modal dialog to fetch saved user data', (done) => {
        component.user.curPass = "password1234";
		component.openCPDialog();
		fixture.detectChanges();
        expect(component.updateErrorMsg).toBe('');
        expect(component.user).toEqual(component.savedUser);
        done();
    });

    it('should clear success message', (done) => {
        component.updateSuccess = true;
		component.clearSuccessMsg();
		fixture.detectChanges();
        expect(component.updateSuccess).toBe(false);
        done();
    });

    it('should update personal information with new first name, last name, and email', (done) => {
        __karma__.config.testGroup = 'newName';

        component.user.firstName = 'newUser';
        component.user.lastName = 'newTest';
        component.user.email1 = 'newtestuser@ca.ibm.com';

        component.updatePersonalInfo().then(() => {
            fixture.detectChanges();
            expect(component.updateProcessing).toBe(false);
            expect(component.updateSuccess).toBe(true);
            done();
        });
    });

    it('should call Digital Analytics Service when updating personal info', (done) => {
        __karma__.config.testGroup = 'newName';

        component.user.firstName = 'newUser';
        component.user.lastName = 'newTest';
        component.user.email1 = 'newtestuser@ca.ibm.com';

        let daSpy = spyOn(da, 'updateUser');
        component.updatePersonalInfo().then(() => {
            expect(da.updateUser).toHaveBeenCalled();
            done();
        });
	});

	it('should update personal information with no selection on birth year, month, date', (done) => {
		component.user.birthMonth = '0';
		component.user.birthYear = '0';
		component.user.birthDate = '0';

		component.updatePersonalInfo().then(() => {
            fixture.detectChanges();
            expect(component.updateProcessing).toBe(false);
            expect(component.updateSuccess).toBe(true);
            done();
		});
	});

	it('should update personal information with only no selection on birth year and month', (done) => {
		component.user.birthDate = '0';

		component.updatePersonalInfo().then(() => {
            fixture.detectChanges();
            expect(component.updateProcessing).toBe(false);
            expect(component.updateSuccess).toBe(false);
            done();
		});
    });

    it('should change password with new valid password', (done) => {
        component.user.curPass = "password1234";
        component.user.newPass = "newpassword1234";
		component.user.cnfPass = "newpassword1234";

        component.changePassword().then(() => {
            fixture.detectChanges();
            expect(component.updateProcessing).toBe(false);
            expect(component.updateSuccess).toBe(true);
            done();
        });
    });

    it('should call Digital Analytics Service when changing password', (done) => {
        component.user.curPass = "password1234";
        component.user.newPass = "newpassword1234";
        component.user.cnfPass = "newpassword1234";

        let daSpy = spyOn(da, 'updateUser');
        component.changePassword().then(() => {
            expect(da.updateUser).toHaveBeenCalled();
            done();
        });
	});
});

xdescribe('DynamicPersonalInformationLayoutComponent - Error Case', () => {
    let component: DynamicPersonalInformationLayoutComponent;
	let fixture: ComponentFixture<DynamicPersonalInformationLayoutComponent>;
	let httpMock: HttpTestingController;
	let mockRouter: Router;

    beforeEach(async(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [ DynamicPersonalInformationLayoutComponent ],
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, FormsModule, RouterTestingModule.withRoutes([]),
             TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
               ],
            providers: [
                AccountTransactionService,
                ActivePageService,
                ConfigurationService,
                PersonService,
                ModalDialogService,
				Logger,
				{
	              provide: HTTP_INTERCEPTORS,
	              useClass: HttpErrorInterceptor,
	              multi: true,
				},
				{ provide: Router, useClass: MockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(async(inject([HttpTestingController], (_httpMock: HttpTestingController) => {
		__karma__.config.testGroup = '';
		httpMock = _httpMock;

        fixture = TestBed.createComponent(DynamicPersonalInformationLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })));

	it('should NOT initialize supported currency with invalid configuration ID parameter', (done) => {
		__karma__.config.testGroup = 'invalidCurrencyConf';

        // mock error with status code 400
        const mockErrorResponse = {
          status: 400,
          statusText: 'Bad Request'
        };
		const errorInitCurrencies = {"errors":[{"errorKey":"CWXFR0043E","errorParameters":"UniqueID,[supportedCurrencies],com.ibm.commerce.infrastructure.facade.server.commands.CreateConfigurationCmdImpl","errorMessage":"CWXFR0043E: The value [supportedCurrencies] passed in for configuration ID was invalid.","errorCode":"CWXFR0043E"}]};
		let req = httpMock.expectOne('mocks/commerce/transaction/store/1/configuration/com.ibm.commerce.foundation.supportedCurrencies.findByConfigurationId.mocks.json');
		let req2 = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.findPersonBySelf.mocks.json');
		req.flush(errorInitCurrencies, mockErrorResponse);
		req2.flush(errorInitCurrencies, mockErrorResponse);
		httpMock.verify();
		done();
	});

	it('should NOT update personal information with invalid email format', (done) => {
		__karma__.config.testGroup = 'invalidEmail';

        component.user.firstName = 'newUser';
        component.user.lastName = 'newTest';
        component.user.email1 = 'invalidemail';

        component.updatePersonalInfo().then(() => {
            fixture.detectChanges();
			expect(component.updateErrorMsg).toBe('This command does not support the value of "testuser" for parameter "email1".');
            done();
        });

        // mock error with status code 400
        const mockErrorResponse = {
          status: 400,
          statusText: 'Bad Request'
        };
		const errorInvalidEmail = {"errors":[{"errorKey":"_ERR_VALUE_FOR_PARM_NOT_SUPPORTED","errorParameters":"testuser,email1","errorMessage":"This command does not support the value of \"testuser\" for parameter \"email1\".","errorCode":"CMN1539E"}]};
		let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.invalidEmail.updatePerson.mocks.json');
		let req2 = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.findPersonBySelf.mocks.json');
		let req3 = httpMock.expectOne('mocks/commerce/transaction/store/1/configuration/com.ibm.commerce.foundation.supportedCurrencies.findByConfigurationId.mocks.json');
		req.flush(errorInvalidEmail, mockErrorResponse);
		httpMock.verify();
		done();
	});

	it('should NOT change password with incorrect current password', (done) => {
		__karma__.config.testGroup = 'incorrectPassword';

        component.user.curPass = "incorrectPassword";
        component.user.newPass = "newpassword1234";
		component.user.cnfPass = "newpassword1234";

        component.changePassword().then(() => {
            fixture.detectChanges();
            expect(component.updateErrorMsg).toBe('The password you entered is incorrect. Type your current password in the Current Password field and try again.');
            done();
        });

        // mock error with status code 400
        const mockErrorResponse = {
          status: 400,
          statusText: 'Bad Request'
        };
		const errorIncorrectPwd = {"errors":[{"errorKey":"_ERR_BAD_PARMS","errorParameters":"logonPasswordOld","errorMessage":"The password you entered is incorrect. Type your current password in the Current password field and try again.","errorCode":"2050"}]};
		let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.incorrectPassword.updatePersonOnUserRegistrationUpdate.mocks.json');
		let req2 = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.findPersonBySelf.mocks.json');
		let req3 = httpMock.expectOne('mocks/commerce/transaction/store/1/configuration/com.ibm.commerce.foundation.supportedCurrencies.findByConfigurationId.mocks.json');
		req.flush(errorIncorrectPwd, mockErrorResponse);
		httpMock.verify();
		done();
    });
});
