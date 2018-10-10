/*******************************************************************************
 * personalInformationLayout.ts
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

import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';
import { ConfigurationService } from 'app/commerce/services/rest/transaction/configuration.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { HttpResponse } from '@angular/common/http';
import * as $ from 'jquery';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { Router } from '@angular/router';
import { Constants } from 'app/Constants';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { PrivacyPolicyService } from 'app/commerce/services/componentTransaction/privacypolicy.service';
import { CurrentUser } from '../../common/util/currentUser';
import { PersonService } from '../../services/rest/transaction/person.service';
import { Subscription } from 'rxjs/Subscription';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-dynamic-personal-information-layout-component',
  templateUrl: './personal-info.dynamic.html',
  styleUrls: ['./personal-info.dynamic.scss']
})
export class DynamicPersonalInformationLayoutComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() title: any;
  readonly STATUS:any={ enabled: "Enabled", disabled: "Disabled" };
	user: any;
	savedUser: any;
	genderList: any[];
	currencies: any[];
	currentYear: number;
	birthYears: number[];
	birthMonths: number[];
	birthDates: number[];
	updateProcessing: boolean;
	updateSuccess: boolean;
	updateErrorMsg: string;
	id: any;
	personalInfoFormId: string;
	changePasswordFormId: string;
	marketingTrackingEnabled: boolean;
	daConsentEnabled: boolean;
	csrSub:Subscription;
	csr:any={isCSR:false,actingAs:null};
	private readonly homeLink:string;
	private readonly csrLink:string;

  constructor(private accountService: AccountTransactionService,
              private configurationSvc: ConfigurationService,
              private storeUtils: StorefrontUtils,
              private authSvc: AuthenticationTransactionService,
              private router: Router,
              private cartTransactionService: CartTransactionService,
              private da: DigitalAnalyticsService,
              private storeConfig: StoreConfigurationsCache,
              private privacyService: PrivacyPolicyService,
              private personSvc: PersonService) {
    /* istanbul ignore next */
      this.user = [];
      this.savedUser = [];
      this.genderList = [];
      this.currencies = [];
      this.currentYear = 0;
      this.birthYears = [];
      this.birthMonths = [];
      this.birthDates = [];
      this.updateProcessing = false;
      this.updateSuccess = false;
      this.updateErrorMsg = "";
      this.homeLink = this.storeUtils.getPageLink(Constants.homePageIdentifier);
      this.csrLink = this.storeUtils.getPageLink(Constants.customerServiceIdentifier);
    }

    ngOnInit() {
      this.id = uniqueId();
      this.personalInfoFormId = "personalinfo_div_23_" + this.id;
      this.changePasswordFormId = "personalinfo_div_74_" + this.id;

      this.initBirthDates();
      this.initGenderList();
      this.initCurrencies().then(r => {
        return this.initPersonalInfo().then(r => {
          return r;
        });
      });

      let pageParam = {
        pageName: Constants.myAccountPageIdentifier
      };
      this.da.viewPage(pageParam);
    }

	ngAfterViewInit() {
		(<any>$(`#${this.personalInfoFormId}`)).foundation();
		(<any>$(`#${this.changePasswordFormId}`)).foundation();
	}

	ngOnDestroy() {
		if ((<any>$(`#${this.personalInfoFormId}`)).length) {
            (<any>$(`#${this.personalInfoFormId}`)).foundation("_destroy");
			(<any>$(`#${this.personalInfoFormId}`)).remove();
		}
		if ((<any>$(`#${this.changePasswordFormId}`)).length) {
            (<any>$(`#${this.changePasswordFormId}`)).foundation("_destroy");
			(<any>$(`#${this.changePasswordFormId}`)).remove();
		}
	}

	openPIDialog(): void {
		this.clearErrorMsg();
		(<any>$(`#${this.personalInfoFormId}`)).foundation("open");
		this.fetchUserFields(this.savedUser);
	}

	openCPDialog(): void {
		this.clearErrorMsg();
		(<any>$(`#${this.changePasswordFormId}`)).foundation("open");
		this.fetchUserFields(this.savedUser);
	}

	clearErrorMsg(): void {
		this.updateErrorMsg = "";
	}

	clearSuccessMsg(): void {
		this.updateSuccess = false;
	}

  updatePersonalInfo(): Promise<HttpResponse<any>> {
    this.updateProcessing = true;

    if (!this.buildDateOfBirth()) {
      this.updateErrorMsg = "PersonalInformation.DateOfBirthEmpty";
      this.updateProcessing = false;
      this.updateSuccess = false;
      return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
    }
    const options = {
      marketing: this.marketingTrackingEnabled ? this.user[Constants.MARKETING_TRACKING_CONSENT] : undefined,
      da: this.daConsentEnabled ? this.user[Constants.DIGITAL_ANALYTICS_CONSENT] : undefined
    };

    return this.accountService.updateCurrentUserPersonalInfo(this.user).then(res => {
        this.updateProcessing = false;
        this.updateSuccess = true;

        this.accountService.getCurrentUserPersonalInfo().then((r) => {
          if (r.body.preferredCurrency) {
            let currentUserCurrency = sessionStorage.setItem('currentUserCurrency', r.body.preferredCurrency);
          }
        });
        return this.privacyService.updateConsentOptions(options).then(() => {
          let userParam: any = {
            pageName: Constants.myAccountPageIdentifier, user: this.user
          };
          this.da.updateUser(userParam);

          (<any>$(`#${this.personalInfoFormId}`)).foundation("close");
          return this.initPersonalInfo();
        })
    }).catch((error: any) => {
      (<any>$(`#${this.personalInfoFormId}`)).foundation("close");
      return this.handleError(error, "Unable to update personal info");
    });
  }

  changePassword(): Promise<HttpResponse<any>> {
    this.updateProcessing = true;

    return this.getChangePassPromise().then(r => {
      this.updateProcessing = false;
      this.updateSuccess = true;

      let userParam: any = {
        pageName: Constants.myAccountPageIdentifier,
        user: this.user
      };
      this.da.updateUser(userParam);

      (<any>$(`#${this.changePasswordFormId}`)).foundation("close");
      return this.initPersonalInfo();
    }).catch((error: any) => {
      (<any>$(`#${this.changePasswordFormId}`)).foundation("close");
      return this.handleError(error, "Unable to update password");
    });
  }

  getChangePassPromise():Promise<HttpResponse<any>> {
    if (this.csr.isCSR && !!this.csr.actingAs) {
      const p = { storeId: this.storeUtils.commerceStoreId, body: { logonId: this.csr.actingAs.userName, storeId: this.storeUtils.commerceStoreId } };
      StorefrontUtils.wipeForUser(null);
      return this.personSvc.resetPasswordByAdmin(p).toPromise()
      .then((r)=>{
        StorefrontUtils.setForUser(null, this.csr.actingAs);
        return r;
      })
      .catch(e=>{
        StorefrontUtils.setForUser(null, this.csr.actingAs);
        this.storeUtils.handleErrorCase(e,"Unable to reset user password as CSR");
        throw e;
      });
    } else {
      return this.accountService.updateCurrentUserPassword(this.user);
    }
  }

  logout() {
    this.authSvc.logout()
    .then(r => {
      this.router.navigate([this.homeLink]);
      this.cartTransactionService.cartSubject.next(null);
    })
    .catch(e => this.handleError(e, 'Unable to logout successfully'));
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
      this.user[Constants.MARKETING_TRACKING_CONSENT] =
        !!this.user.marketingTrackingConsentBoolean ? Constants.CONSENT_ACCEPT : Constants.CONSENT_REJECT;
    }
  }

	private initGenderList(): void {
		this.genderList = CommerceEnvironment.personalInfo.genderList;
	}

	private initBirthDates(): void {
		this.currentYear = new Date().getFullYear();
		for (let i = 100; i >= 0; i--)
			this.birthYears.push(this.currentYear - i);

		for (let i = 1; i <= 12; i++)
			this.birthMonths.push(i);

		for (let i = 1; i <= 31; i++)
			this.birthDates.push(i);
	}

	private initCurrencies(): Promise<HttpResponse<any>> {
        return this.configurationSvc.findByConfigurationId({
			"storeId": this.storeUtils.commerceStoreId,
			"configurationId": CommerceEnvironment.confSupportedCurrencies
		}).toPromise().then(r => {
			return this.currencies = r.body.resultList[0].configurationAttribute;
		}).catch((error: any) => {
			return this.handleError(error, "Unable to get currency list");
		});
	}

	private initPersonalInfo(): Promise<HttpResponse<any>> {
		return this.accountService.getCurrentUserPersonalInfo().then(r => {
			this.user = r.body;
			this.savedUser = r.body;
			this.user.disp = this.user.firstName && this.user.lastName ? this.user.firstName + " " + this.user.lastName : this.user.logonId;
			this.user.selectedPhone = this.user.phone1;
			this.user.selectedEmail = this.user.email1;
			const cu:CurrentUser=StorefrontUtils.getCurrentUser();
			this.csr.isCSR=cu.isCSR;
			this.csr.actingAs=cu.forUser;
			this.populateMarketingConsents();
			this.populateGender();
			this.populateBirthDates();
			this.populateCurrencies(this.user.preferredCurrency);

			return r;
		}).catch((error: any) => {
			return this.handleError(error, "Unable to get current user personal info");
		});
	}

	private populateMarketingConsents() {
    Promise.all([
      this.storeConfig.isEnabled(Constants.FEATURE_MARKETING_CONSENT),
      this.storeConfig.isEnabled(Constants.FEATURE_DA_CONSENT),
      this.storeConfig.isEnabled(CommerceEnvironment.digitalAnalyticsFeatureName)
    ]).then (res => {
      this.marketingTrackingEnabled = !!res[0];
      this.daConsentEnabled = !!res[1] && !!res[2];
      const GDPRFromResponse: any = this.storeUtils.getGDPRConsentsFromUserContext(this.user.contextAttribute || []);
      if (this.daConsentEnabled && GDPRFromResponse[Constants.DIGITAL_ANALYTICS_CONSENT]) {
        const consent = GDPRFromResponse[Constants.DIGITAL_ANALYTICS_CONSENT];
        this.user[Constants.DIGITAL_ANALYTICS_CONSENT] = consent;
        switch (consent) {
          case Constants.DA_CONSENT_ACCEPT:
            this.user.digitalAnalytics = true;
            this.user.digitalAnalyticsAnonymous = false;
            break;
          case Constants.DA_CONSENT_ACCEPT_ANONYMOUSLY:
            this.user.digitalAnalytics = true;
            this.user.digitalAnalyticsAnonymous = true;
            break;
          default:
            this.user.digitalAnalytics = false;
            this.user.digitalAnalyticsAnonymous = false;
        }
      }
      if (this.marketingTrackingEnabled && GDPRFromResponse[Constants.MARKETING_TRACKING_CONSENT]) {
        this.user[Constants.MARKETING_TRACKING_CONSENT] = GDPRFromResponse[Constants.MARKETING_TRACKING_CONSENT];
        this.user.marketingTrackingConsentBoolean =
          GDPRFromResponse[Constants.MARKETING_TRACKING_CONSENT] === Constants.CONSENT_ACCEPT ? true : false;
      }
    });
  }

	private fetchUserFields(fields: any): void {
		this.user = this.deepCopy(fields);
	}

	private deepCopy(i: any): any {
		return JSON.parse(JSON.stringify(i));
	}

	private populateCurrencies(selectedCurrency: string): void {
		for (let currency of this.currencies) {
			if (currency.additionalValue[0].value === selectedCurrency) {
				this.user.selectedCurrency = currency.primaryValue.value;
				break;
			}
		}
	}

	private populateBirthDates(): void {
		let dateOfBirth = new Date(this.user.dateOfBirth);
		this.user.birthYear = dateOfBirth.getUTCFullYear() || 0;
		this.user.birthMonth = dateOfBirth.getUTCMonth() + 1 || 0;
		this.user.birthDate = dateOfBirth.getUTCDate() || 0;
	}

	private populateGender(): void {
		if (!this.user.gender || this.user.gender.length == 0) {
			this.user.gender = 'Unspecified';
		}
	}

	private handleError(error: any, fallback: string): Promise<HttpResponse<any>> {
		this.updateErrorMsg = this.storeUtils.handleErrorCase(error, fallback);
		this.updateProcessing = false;
		this.updateSuccess = false;
		return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
	}

	private buildDateOfBirth(): boolean {
		if (this.user.birthMonth != 0 && this.user.birthDate != 0 && this.user.birthYear != 0) {
			this.user.dateOfBirth = this.user.birthYear + '-' + this.user.birthMonth + '-' + this.user.birthDate;
		}
		else if (this.user.birthMonth == 0 && this.user.birthDate == 0 && this.user.birthYear == 0) {
			this.user.dateOfBirth = '';
		}
		else if (this.user.birthMonth == 0 || this.user.birthDate == 0 || this.user.birthYear == 0) {
			return false;
		}
		else {
			this.user.dateOfBirth = '';
		}

		return true;
	}

	private stopActing():Promise<any> {
		StorefrontUtils.wipeForUser(null);
		this.storeUtils.informCSRChange("personal-info-csr-stop-acting");
		this.cartTransactionService.cartSubject.next(null);
		return this.initPersonalInfo();
	}

	private registerGuest() {
		this.router.navigate([this.csrLink]);
  }

  private adjustUser() {
    const newStatus=this.user.accountStatus==this.STATUS.enabled?"0":"1";
    const p:any={ storeId: this.storeUtils.commerceStoreId, userId: this.user.userId, body: { userStatus: newStatus } };

    StorefrontUtils.wipeForUser(null);
    this.personSvc.updatePersonByAdmin(p).toPromise()
    .then(r=>{
      StorefrontUtils.setForUser(null, this.csr.actingAs);
      this.initPersonalInfo()
    })
    .catch(e=>{
      StorefrontUtils.setForUser(null, this.csr.actingAs);
      this.storeUtils.handleErrorCase(e,"Unable to perform status update on user as CSR");
      throw e;
    });
  }

}
