/*******************************************************************************
 * Copyright IBM Corp. 2017, 2018
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

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';

import { Logger } from 'angular2-logger/core';
import { LoginIdentityService } from '../rest/transaction/loginIdentity.service';
import { PersonService } from '../rest/transaction/person.service';
import { StorefrontUtils } from '../../../commerce/common/storefrontUtils.service';
import { Constants } from '../../../Constants';
import { PrivacyPolicyService } from './privacypolicy.service';
import { ContractService } from '../rest/transaction/contract.service'
import { CurrentUser } from '../../common/util/currentUser';
import { WishListService } from "../rest/transaction/wishList.service";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AuthenticationTransactionService {

    // Observable authentication status
    set redirectUrl(url:string){
        StorefrontUtils.setRedirectUrl(url);
    }
    get redirectUrl(): string{
        return StorefrontUtils.getRedirectUrl();
    }
	private _isLoggedIn = false;
	authUpdate: Observable<boolean>;
	private _observer: Observer<boolean>;

	constructor(private loginIdentityService: LoginIdentityService,
		private personService: PersonService,
		private storefrontUtils: StorefrontUtils,
		private logger: Logger,
		private privacyService: PrivacyPolicyService,
        private contractService: ContractService,
        private wishlistService: WishListService,
        private translate: TranslateService
	) {
		// share() allows multiple subscribers to the Observable change
		this.authUpdate = new Observable<boolean>(observer => this._observer = observer).share();
		const currentUser = StorefrontUtils.getCurrentUser();
		if (currentUser && currentUser.WCTrustedToken && currentUser.WCToken && !currentUser.isGuest) {
			this._isLoggedIn = true;
		}
		this.getAndSetContractId();
	}

	login(username: string, password: string): Promise<HttpResponse<any>> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'body': {
				'logonId': username,
				'logonPassword': password
			}
		};
		return this.loginIdentityService.login(params, undefined).toPromise().then(res => {
			this.logger.info( this.constructor.name + ' login: %o', res );
			const response = res.body;
			if (response.WCTrustedToken && response.WCToken) {
				this._isLoggedIn = true;
				response.username = username;
				StorefrontUtils.saveCurrentUser(response);

				let params = {
					'storeId': this.storefrontUtils.commerceStoreId,
					'userId': response.userId,
					'profileName': 'IBM_Assigned_Roles_Details'
				}
				this.personService.findByUserId(params).toPromise().then(r => {
					for (const k in r.body.rolesWithDetails) {
                        const role = r.body.rolesWithDetails[k].roleId;
                        if (role.indexOf('-3') > -1 || role.indexOf('-14') > -1) {
                            const currentUser = StorefrontUtils.getCurrentUser();
                            currentUser.isCSR = true;
                            StorefrontUtils.saveCurrentUser(currentUser);
                        }
                    }
				});

				this.getAndSetContractId();
				const GDPR: any = this.storefrontUtils.getGDPRConsentOption();
				const CONTEXT_ATTR: any[] = response['contextAttribute'];
				if (GDPR != null) {
					if (CONTEXT_ATTR === undefined) {
						this.privacyService.updateConsentOptions({
							'da': GDPR[Constants.DIGITAL_ANALYTICS_CONSENT],
							'marketing': GDPR[Constants.MARKETING_TRACKING_CONSENT]
						});
					} else {
						const gdPRFromResponse: any = this.storefrontUtils.getGDPRConsentsFromUserContext(CONTEXT_ATTR);
						for (const k in GDPR) {
							if (GDPR[k] !== gdPRFromResponse[k]) {
								// preference value does not match,
								// clear the pVersion, launch popup
								this.privacyService.pVersion = null;
								break;
							}
						}
					}
				}
			}
			if (this._observer) {
				this._observer.next(true); // update the subscribers to the user's auth status
			}
			return res;
		});
	}

	logout(): Promise<HttpResponse<any>> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId
		};
		StorefrontUtils.removeCurrentUser();
		return this.loginIdentityService.logout(params, undefined).toPromise().then(res => {
			this.logger.info( this.constructor.name + ' logout: %o', res );
			this._isLoggedIn = false;
			this.getAndSetContractId();
			if (this._observer) {
				this._observer.next(false); // update the subscribers to the user's auth status
			}
			return res;
		});
	}

	isLoggedIn(): boolean {
		return this._isLoggedIn;
	}

	register( firstName: string,
						lastName: string,
						username: string,
						password: string,
						confirmPassword: string,
						phone1: string,
						receiveEmail: boolean,
						marketingConsent: string,
						digitalAnalyticsConsent: string): Promise<HttpResponse<any>> {
		const today = new Date();
		const cu:CurrentUser=StorefrontUtils.getCurrentUser();
		const actingAs:any=cu?cu.forUser:null;
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'body': {
				'storeId': this.storefrontUtils.commerceStoreId,
				'catalogId': this.storefrontUtils.commerceCatalogId,
				'registerType': 'G',	// G - Guest User (a user who does not provide any profile information), R - Registered User (a user who provides profile information), A - Administrator (registered and an administrator), S - Site Administrator (super user)
				'logonId': username,
				'logonPassword': password,
				'logonPasswordVerify': confirmPassword,
				'firstName': firstName,
				'lastName': lastName,
				//'receiveEmailPreference': [{
				//	'storeID': this.storefrontUtils.commerceStoreId,
				//	'value': ''
				//}],
				'preferredLanguage': this.storefrontUtils.commerceLanguage,
				'receiveEmail': receiveEmail,
				'profileType': 'C',	// C - customer profile, B - business profile
				'challengeAnswer': '-',
				'email1': username,
				'phone1': phone1,
				'curr_year': today.getFullYear(),
				'curr_month': today.getMonth(),
				'curr_date': today.getDate()
			}
		};

		if (cu&&cu.isCSR) {
			const rando = Math.random();
			const hash = rando.toString(36).slice(-7);
			const pass = hash+Math.floor((rando*9)+1);
			params["mode"]="admin";
			params.body["logonPassword"]=params.body["logonPasswordVerify"]=pass;

			// registering a guest-user
			if (actingAs) {
				StorefrontUtils.wipeForUser(null);
				if (!actingAs.userName) {
					params["$queryParameters"]={userId:actingAs.userId};
				}
			}
		}

		if (marketingConsent) {
			params.body[Constants.MARKETING_TRACKING_CONSENT] = marketingConsent;
		}
		if (digitalAnalyticsConsent) {
			params.body[Constants.DIGITAL_ANALYTICS_CONSENT] = digitalAnalyticsConsent;
		}

		return this.personService.registerPerson(params, undefined).toPromise().then(res => {
			this.logger.info( this.constructor.name + ' register: %o', res );
			const response = res.body;

			// guest user registered -- update the logonId in the descriptor
			if (actingAs) {
				actingAs.userName=response.logonId;
				StorefrontUtils.setForUser(null,actingAs);
			}

			if (response.WCTrustedToken && response.WCToken) {
				this._isLoggedIn = true;
				StorefrontUtils.saveCurrentUser(response);
				this.getAndSetContractId();
            }

			if (this._observer) {
				this._observer.next(true); // update the subscribers to the user's auth status
            }

			return res;
		});
	}

	private getAndSetContractId() {
		const contractParams = { 'storeId': this.storefrontUtils.commerceStoreId, 'q': 'eligible' };
		this.contractService.findEligible(contractParams).toPromise().then(
			(resp)=> {
				let contracts = resp.body.contracts;
				if (Object.keys(contracts).length > 0) {
					this.storefrontUtils.setContractId(Object.keys(contracts)[0]);
				} else {
					this.logger.info( this.constructor.name + ' getAndSetContractId: %o', resp );
				}
			}
		);
	}
}
