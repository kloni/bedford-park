import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Logger } from "angular2-logger/core";

import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { HttpErrorInterceptor } from './http.error.interceptor';
import { AccountTransactionService } from '../../services/componentTransaction/account.transaction.service';
import { PersonService } from "../../services/rest/transaction/person.service";
import { Router } from '@angular/router';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__:any;

describe('HttpErrorInterceptor', () => {

    let mockRouter: Router;
    let interceptor : any;
    let accountService : any;
    let httpMock : any;
    let modalDialog : any;

    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [ HttpClientModule, HttpModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]),
                        TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
                        }),
                        CommonTestModule
                 ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true,
                },
                HttpErrorInterceptor,
                AccountTransactionService,
                PersonService,
                Logger,
                ActivePageService,
                ModalDialogService, 
                {
                    provide: Router,
                    useClass: MockRouter
                }
            ]
        });
    });

    beforeEach(inject([HttpErrorInterceptor, AccountTransactionService, HttpTestingController, ModalDialogService], (_interceptor : HttpErrorInterceptor, _accountService : AccountTransactionService, _httpMock: HttpTestingController, _modalDialog: ModalDialogService) => {
        interceptor = _interceptor;
        accountService = _accountService;
        httpMock = _httpMock;
        modalDialog = _modalDialog;

        __karma__.config.testGroup = "";
    }));

    it('should instantiate', () => {
        expect(interceptor).toEqual(jasmine.any(HttpErrorInterceptor));
        expect(accountService).toEqual(jasmine.any(AccountTransactionService));
    });

    it('should intercept session expired response', async(() => {
        accountService.getCurrentUserPersonalInfo().then(res => {
            fail('getCurrentUserPersonalInfo fails due to session time out');
        }).catch((error: any) => {
            expect(error).toBeDefined();
        });

        const mockErrorResponse = {
            status: 400,
            statusText: 'Bad Request'
        };
        const errorData = {"errors":[{"errorKey":"CWXBB1011E","errorParameters":"176505","errorMessage":"Activity token \"176505\" has expired.","errorCode":"1011"}]};
        let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.findPersonBySelf.mocks.json');
        req.flush(errorData, mockErrorResponse);

        expect(modalDialog.addTargetComponent).toBeTruthy();

        httpMock.verify();
    }));

    it('should not intercept response', async(() => {
        accountService.getCurrentUserPersonalInfo().then(res => {
            fail('getCurrentUserPersonalInfo fails due to generic error');
        }).catch((error: any) => {
            expect(error).toBeDefined();
        });

        const mockErrorResponse = {
            status: 400,
            statusText: 'Bad Request'
        };
        const errorData = {"errors": [{"errorKey": "_ERR_GENERIC","errorParameters": ["java.lang.NullPointerException"],"errorMessage": "The following error occurred during processing: \"java.lang.NullPointerException\".","errorCode": "CMN0409E"}]};
        let req = httpMock.expectOne('mocks/commerce/transaction/store/1/person/@self.findPersonBySelf.mocks.json');
        req.flush(errorData, mockErrorResponse);

        expect(modalDialog.addTargetComponent).toBeTruthy();

        httpMock.verify();
    }));
});