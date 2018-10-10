import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { Logger } from "angular2-logger/core";
import { AuthenticationTransactionService } from './authentication.transaction.service';
import { LoginIdentityService } from "../rest/transaction/loginIdentity.service";
import { PersonService } from "../rest/transaction/person.service";
import { GuestIdentityService } from "../rest/transaction/guestIdentity.service";
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__:any;

describe('AuthenticationTransactionService', () => {

  let authenticationService : any;

  beforeEach(async(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
        imports: [CommonTestModule, HttpClientModule, HttpModule, TranslateModule.forRoot({
           loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
          ],
        providers: [
            AuthenticationTransactionService,
            LoginIdentityService,
            ActivePageService,
            PersonService,
            GuestIdentityService,
            Logger,
            { provide: Router, useClass: MockRouter }
        ]
    });
  }));

  beforeEach(async(inject([AuthenticationTransactionService], (_authenticationTransactionService : AuthenticationTransactionService) => {
      authenticationService = _authenticationTransactionService;
      __karma__.config.testGroup = "";
  })));

  it('should instantiate', () => {
      expect(authenticationService).toEqual(jasmine.any(AuthenticationTransactionService));
  });

  it('logs in', (done) => {
    authenticationService.login('username', 'password').then( res => {
        // currentUser is encoded to binary
        expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
        expect(authenticationService.isLoggedIn()).toBe(true);
        done();
    })
  });

 it('logs out', (done) => {
    authenticationService.login('username', 'password').then( res => {
        // currentUser is encoded to binary
        expect(sessionStorage.getItem('currentUser')).not.toBeUndefined();
        expect(authenticationService.isLoggedIn()).toBe(true);

        authenticationService.logout().then( res => {
            expect(sessionStorage.getItem('currentUser')).toBeNull();
            expect(authenticationService.isLoggedIn()).toBe(false);
            done();
        })
    })
 });
});

