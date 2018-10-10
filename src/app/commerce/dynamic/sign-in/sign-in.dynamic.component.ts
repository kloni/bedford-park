import { CurrentUser } from '../../common/util/currentUser';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TypeSignInComponent } from './../../components/sign-in/typeSignInComponent';

import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationTransactionService } from '../../services/componentTransaction/authentication.transaction.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { StorefrontUtils } from '../../../commerce/common/storefrontUtils.service';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';

import { UtilsService } from '../../../common/utils/utils.service';
import { CommerceEnvironment } from '../../commerce.environment';
import * as $ from 'jquery';

import { CartTransactionService } from "../../../commerce/services/componentTransaction/cart.transaction.service";
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { Constants } from 'app/Constants';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-dynamic-sign-in-layout-component',
  templateUrl: './sign-in.dynamic.html',
  styleUrls: ['./sign-in.dynamic.scss']
})
export class DynamicSignInLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    readonly RESET_SKELETON:any={direct:false, logonId:"", vCode:"", newPass:"", cnfPass:""};
    user: any = {};
    reset:any=JSON.parse(JSON.stringify(this.RESET_SKELETON));
    returnUrl: string;
    loginErrorMsg: string = '';
    accountLockErrorMsg: string ='';
    resetPasswordErrorMsg: string = '';
    forgotPasswordModalId: string;
    vCodeModalId:string;
    vCodeErrMsg:string;
    showContinueAsGuest: boolean;
    id: any;
    disableForm:boolean=false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationTransactionService,
        private storeUtils: StorefrontUtils,
        private personService: PersonService,
        private accountService: AccountTransactionService,
        private cartTransactionService: CartTransactionService,
        private da: DigitalAnalyticsService
    ) {}

    ngOnInit() {
        this.returnUrl = '/home';
        this.id = uniqueId();
        this.forgotPasswordModalId = "signin_div_32_" + this.id;
        this.vCodeModalId= "vCode_"+this.id;
        let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        if ( currentUser &&
             currentUser.WCTrustedToken &&
             currentUser.WCToken &&
             StorefrontUtils.isGuestOrActingAs(currentUser) &&
             currentUser.isGoingToCheckout )
        {
            this.showContinueAsGuest = true;
            this.disableForm = !StorefrontUtils.isRealGuest();
        }
        else {
            this.showContinueAsGuest = false;
        }

        let pageParam = {
            pageName: Constants.signInPageIdentifier
        };
        this.da.viewPage(pageParam);
    }

    login() {
        return this.authService.login(this.user.username, this.user.password).then( res => {
            // navigate to the given return URL (or home) after successful login
            let redirectUrl = this.authService.redirectUrl || this.returnUrl;
            this.authService.redirectUrl = null;
            this.cartTransactionService.getCart();
            this.router.navigateByUrl(redirectUrl);

            return this.accountService.getCurrentUserPersonalInfo().then(r => {
                let userInfo = r.body;
                if (userInfo.preferredCurrency) {
                    let currentUserCurrency = sessionStorage.setItem('currentUserCurrency', userInfo.preferredCurrency);
                }

                let userParam: any = {
                    pageName: this.storeUtils.getPageIdentifier(redirectUrl),
                    user: userInfo
                }
                this.da.updateUser(userParam);

            })
        }).catch((error: HttpErrorResponse) => {

            const code:any[]=[];
            const msg = this.storeUtils.handleErrorCase(error, "Could not log in", code);
            if (code.length>0 && code[0]===CommerceEnvironment.errors.accountLockoutError) {
                this.accountLockErrorMsg=msg;
                this.openForgotPassword();
            } else {
                this.loginErrorMsg=msg;
            }
        })
    }

    ngAfterViewInit() {
        (<any>$(`#${this.forgotPasswordModalId}`)).foundation();
        (<any>$(`#${this.vCodeModalId}`)).foundation();
    }

    openForgotPassword(){
        (<any>$(`#${this.forgotPasswordModalId}`)).foundation("open");
    }

    ngOnDestroy() {
        if (<any>($(`#${this.forgotPasswordModalId}`)).length) {
            (<any>$(`#${this.forgotPasswordModalId}`)).foundation("_destroy");
            (<any>$(`#${this.forgotPasswordModalId}`)).remove();
        }
        if (<any>($(`#${this.vCodeModalId}`)).length) {
            (<any>$(`#${this.vCodeModalId}`)).foundation("_destroy");
            (<any>$(`#${this.vCodeModalId}`)).remove();
        }
        delete this.reset;
    }

    resetPassword() {
        const params = {
            'storeId': this.storeUtils.commerceStoreId,
            'body': {
                'storeId': this.storeUtils.commerceStoreId,
                'logonId': this.user.resetLogonId,
                'resetPassword': 'true',
                'challengeAnswer': '-'
            }
        };
        return this.personService.updatePerson(params).toPromise().then(res => {
            (<any>$(`#${this.forgotPasswordModalId}`)).foundation("close");
            this.vCodeErrMsg = "";
            this.reset=JSON.parse(JSON.stringify(this.RESET_SKELETON));
            this.reset.logonId = this.user.resetLogonId;
            this.user.resetLogonId = "";
            (<any>$(`#${this.vCodeModalId}`)).foundation("open");
        }).catch(error => {
            this.resetPasswordErrorMsg = this.storeUtils.handleErrorCase(error, 'Could not process password-reset request');
        });
    }

    enterValidationCodeDirectly() {
      (<any>$(`#${this.forgotPasswordModalId}`)).foundation("close");
      this.reset=JSON.parse(JSON.stringify(this.RESET_SKELETON));
      this.reset.direct=true;
      this.user.resetLogonId="";
      (<any>$(`#${this.vCodeModalId}`)).foundation("open");
    }

    validatePasswordChange() {
        const params = {
            storeId: this.storeUtils.commerceStoreId,
            body: {
                storeId: this.storeUtils.commerceStoreId,
                resetPassword: "true",
                challengeAnswer: "-",
                logonId: this.reset.logonId,
                logonPassword: this.reset.newPass,
                xcred_validationCode: this.reset.vCode,
                xcred_logonPasswordVerify: this.reset.cnfPass
            }
        };
        return this.personService.updatePerson(params).toPromise().then(res => {
            (<any>$(`#${this.vCodeModalId}`)).foundation("close");
            delete this.reset;
        }).catch(error => {
            this.vCodeErrMsg = this.storeUtils.handleErrorCase(error, 'Could not process password-reset-validation request');
        });
    }

    continueAsGuest(){
        //checkout as guest
        let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        if ( currentUser &&
             currentUser.WCTrustedToken &&
             currentUser.WCToken &&
             StorefrontUtils.isGuestOrActingAs(currentUser))
        {
            currentUser.isCheckoutAsGuest = true;
            currentUser.isGoingToCheckout = false;
            StorefrontUtils.saveCurrentUser(currentUser);
            let redirectUrl = this.authService.redirectUrl || this.returnUrl;
            this.authService.redirectUrl = null;
            this.router.navigateByUrl(redirectUrl);
        }
    }

}
