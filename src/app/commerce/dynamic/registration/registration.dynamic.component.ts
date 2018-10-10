/*******************************************************************************
 * registrationLayout.ts
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

import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { TypeRegistrationComponent } from './../../components/registration/typeRegistrationComponent';


import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationTransactionService } from '../../../commerce/services/componentTransaction/authentication.transaction.service';
import { StorefrontUtils } from '../../common/storefrontUtils.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { Constants } from 'app/Constants';
import { StoreConfigurationsCache } from '../../common/util/storeConfigurations.cache';
import { PrivacyPolicyService } from '../../services/componentTransaction/privacypolicy.service';
import { CommerceEnvironment } from '../../commerce.environment';

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'app-dynamic-registration-layout-component',
    templateUrl: './registration.dynamic.html'
})
export class DynamicRegistrationLayoutComponent implements OnInit, AfterViewChecked{
    @Input()csr:any;
    user: any = {};
    returnUrl: string;
    registerLoading: boolean = false;
    registerErrorMsg: string = '';
    id: any;
    marketingTrackingEnabled: boolean;
    daConsentEnabled: boolean;
    disableForm:boolean=false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private authService: AuthenticationTransactionService,
                private utilService: StorefrontUtils,
                private da: DigitalAnalyticsService,
                private privacyService: PrivacyPolicyService,
                private storeConfig: StoreConfigurationsCache) {
    }

    ngOnInit() {
        this.returnUrl = '/home';
        this.id = uniqueId();
        Promise.all([
          this.storeConfig.isEnabled(Constants.FEATURE_MARKETING_CONSENT),
          this.storeConfig.isEnabled(Constants.FEATURE_DA_CONSENT),
          this.storeConfig.isEnabled(CommerceEnvironment.digitalAnalyticsFeatureName)
        ]).then (res => {
          this.marketingTrackingEnabled = !!res[0];
          this.daConsentEnabled = !!res[1] && !!res[2];
          this.updateAnalyticsConsent();
          this.updateMarketingTrackingConsent();
        });
    }

    ngAfterViewChecked() {
        setTimeout(() => {
            this.disableForm = !this.csr&&!StorefrontUtils.isRealGuest(); // show only if real-guest or shown in CSR-component
        });
    }

    register() {
        this.registerLoading = true;
        const options = {
          marketing: this.marketingTrackingEnabled ? this.user[Constants.MARKETING_TRACKING_CONSENT] : undefined,
          da: this.daConsentEnabled ? this.user[Constants.DIGITAL_ANALYTICS_CONSENT]: undefined
        };
        return this.authService.register(
            this.user.firstName,
            this.user.lastName,
            this.user.username,
            this.user.password,
            this.user.confirmPassword,
            this.user.phone1,
            this.user.receiveEmail,
            options.marketing,
            options.da).then(res => {
            // navigate home after a successful register
            let redirectUrl = this.authService.redirectUrl || this.returnUrl;
            this.authService.redirectUrl = null;

            return this.privacyService.updateConsentOptions(options).then(() => {
              let userParam: any = {
                pageName: this.utilService.getPageIdentifier(redirectUrl),
                user: {
                  userId: res.body.userId,
                  email1: this.user.username
                }
              };
              this.da.updateUser(userParam);
              this.router.navigateByUrl(redirectUrl);
            });
          }).catch((error: HttpErrorResponse) => {
          this.registerErrorMsg = this.utilService.handleErrorCase(error, 'Could not register new user');
          this.registerLoading = false;
        });
    }

    updateAnalyticsConsent() {
      if (! this.user.digitalAnalytics && this.daConsentEnabled) {
        this.user.digitalAnalyticsAnonymous = false;
        this.user[Constants.DIGITAL_ANALYTICS_CONSENT] = Constants.CONSENT_REJECT;
      } else if (!this.user.digitalAnalyticsAnonymous) {
        this.user[Constants.DIGITAL_ANALYTICS_CONSENT] = Constants.DA_CONSENT_ACCEPT;
      } else {
        this.user[Constants.DIGITAL_ANALYTICS_CONSENT] = Constants.DA_CONSENT_ACCEPT_ANONYMOUSLY;
      }
    }

    updateMarketingTrackingConsent() {
      if (this.marketingTrackingEnabled) {
        this.user[Constants.MARKETING_TRACKING_CONSENT] = !!this.user.marketingTrackingConsentBoolean ? Constants.CONSENT_ACCEPT : Constants.CONSENT_REJECT;
      }
    }
}


