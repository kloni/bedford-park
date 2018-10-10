/*******************************************************************************
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

import { Injectable, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ESpotService } from '../rest/transaction/eSpot.service';
import { ModalDialogService } from '../../common/util/modalDialog.service';
import { StorefrontUtils } from '../../common/storefrontUtils.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { StoreConfigurationsCache } from '../../common/util/storeConfigurations.cache';
import { PersonService } from '../rest/transaction/person.service';
import { LocalStorageUtilService } from '../../common/util/localStorage.util.service';
import { Constants } from '../../../Constants';
import * as SSCache from 'session-storage-cache';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class PrivacyPolicyService implements OnDestroy {

  /**
   * Instance variables for storefeature
   */
  isSession: boolean;
  isDAConsentEnabled: boolean;
  isMarketingConsentEnabled: boolean;

  /**
   * Instance variable for eSpot and content
   */
  contentId: string;
  contentName: string;
  policyNoticeVersion: string;

  /**
   * Instance variable Personal preferences
   */
  pVersion: string;
  da: string; // value of '0' or '1'
  marketing: string; // value of '0' or '1'

  /**
   * Key to store the Privacy consent
   */
  private readonly storageKey: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private eSpot: ESpotService,
    private storefrontUtils: StorefrontUtils,
    private modalService: ModalDialogService,
    private router: Router,
    private storeConfig: StoreConfigurationsCache,
    private personService: PersonService,
    private localStorageUtil: LocalStorageUtilService,
    private logger: Logger) {

    this.storageKey = this.storefrontUtils.getGDPRConsentOptionStorageKey();

    this.subscriptions.push(router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.triggerGDPRPopUp();
      }
    }));

    const GDPR = this.storefrontUtils.getGDPRConsentOption();
    if (GDPR !== null) {
      const { privacyNoticeVersion: pVersion,
        marketingTrackingConsent: marketing,
        digitalAnalyticsConsent: da} = GDPR;
      if (da !== undefined) {
        this.da = da;
      }
      if (marketing !== undefined) {
        this.marketing = marketing;
      }
      if (pVersion !== undefined) {
        this.pVersion = pVersion;
      }
    }
    Promise.all([
      this.storeConfig.isEnabled(Constants.FEATURE_SESSION),
      this.storeConfig.isEnabled(Constants.FEATURE_DA_CONSENT),
      this.storeConfig.isEnabled(Constants.FEATURE_MARKETING_CONSENT)
    ]).then (
      (res) => {
        const [isSession, isDaEnabled, isMarketingEnabled] = res;
        this.isSession = isSession;
        this.isDAConsentEnabled = isDaEnabled;
        this.isMarketingConsentEnabled = isMarketingEnabled;
        this.verifyConsentOptions();
      }
    );

  }

  triggerGDPRPopUp() {
    this.storeConfig.isEnabled(Constants.FEATURE_CONSENT_OPTIONS).then(
      (v: boolean) => {
        if (v) {
          if (this.pVersion !== null && this.pVersion !== undefined
            && this.pVersion === this.policyNoticeVersion) {
            return;
          }
          if (!!this.contentId) {
            this.modalService.launchCustomModal(this.contentId);
          } else {
            this.eSpot.findByName({
              storeId: this.storefrontUtils.commerceStoreId,
              name: Constants.PRIVACY_ESPOTNAME
            }).subscribe((res: HttpResponse<any>) => {
              this.processPrivacyContent(res.body.MarketingSpotData[0].baseMarketingSpotActivityData[0]);
              if (this.pVersion === null || this.pVersion === undefined || this.policyNoticeVersion !== this.pVersion ) {
                this.modalService.launchCustomModal(this.contentId);
              }
            });
          }
        } else {
          this.localStorageUtil.remove(this.storageKey);
          SSCache.remove(this.storageKey);
        }
      }
    );
  }

  updateConsentOptions(options: any): Promise<any> {
    const { marketing, da } = options;
    this.pVersion = this.policyNoticeVersion;
    if (marketing !== undefined) {
      this.marketing = marketing;
    }
    if (da !== undefined) {
      this.da = da;
    }
    const pbody = {};
    if (this.pVersion !== null && this.pVersion !== undefined) {
      pbody[Constants.PRIVACY_NOTICE_VERSION] = this.pVersion;
    }
    if (this.marketing !== undefined && this.marketing !== null) {
      pbody[Constants.MARKETING_TRACKING_CONSENT] = this.marketing;
    }
    if (this.da !== undefined && this.da !== null) {
      pbody[Constants.DIGITAL_ANALYTICS_CONSENT] = this.da;
    }
    const params = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'body': pbody
    };
    const pArray: Promise< HttpResponse < any >>[] = [];
    if (!StorefrontUtils.isGuestOrActingAs()) {
      pArray.push(this.personService.updatePerson(params, undefined).toPromise());
    }
    // call da service
    return Promise.all(pArray).then(() => {
    // save to storage
      if (this.da) {
        this.setDAOptout();
      }
      if (!this.isSession) {
        // is permanent
        this.localStorageUtil.put(this.storageKey, JSON.stringify(pbody), Constants.PERMANENT_STORE_DAYS);
      } else {
        SSCache.set(this.storageKey, JSON.stringify(pbody));
      }
    });
  }

  getConsentOptions(): Promise<any> {
    return Promise.resolve({
      'marketing': this.marketing,
      'da': this.da
    });
  }

  private processPrivacyContent(data: any) {
    this.contentId = data.marketingContentDescription[0].marketingText.split(':').slice(1, 2);
    this.contentName = data.contentName;
    this.policyNoticeVersion = '0';
    const versionPattern = /[\w\d]+Version(\d+\.\d+)/g;
    const matches = versionPattern.exec(this.contentName);
    if (matches) {
      this.policyNoticeVersion = matches[1];
    }
  }

  private verifyConsentOptions() {
    if (this.isSession) {
      // if is store in session, remove the local storage.
      const o = this.localStorageUtil.get(this.storageKey);
      if (o !== null){
        this.pVersion = null;
      }
      this.localStorageUtil.remove(this.storageKey);
    } else {
      const o =  SSCache.get(this.storageKey);
      if (o != null) {
        this.pVersion = null;
      }
      SSCache.remove(this.storageKey);
    }
    if (this.isMarketingConsentEnabled === false ) {
      if (this.marketing !== null && this.marketing !== undefined) {
        this.pVersion = null;
      }
      this.marketing = undefined;
    } else {
      if (this.marketing === null || this.marketing === undefined) {
        this.pVersion = null;
      }// clear pVersion to launch popup
    }
    if ( this.isDAConsentEnabled === false) {
      if (this.da !== null && this.da !== undefined) {
        this.pVersion = null;
      }// clear pVersion to launch popup
      this.da = undefined;
    } else {
      if (this.da === null || this.da === undefined) {
        this.pVersion = null;
      }// clear pVersion to launch popup
    }
    if (!(this.da && this.pVersion)) {
      return;
    }
    this.setDAOptout();
  }

  private setDAOptout() {
    switch (this.da) {
      case Constants.CONSENT_REJECT:
        cmSetOptOut('Y');
        break;
      case Constants.DA_CONSENT_ACCEPT:
        cmSetOptOut('N');
        break;
      case Constants.DA_CONSENT_ACCEPT_ANONYMOUSLY:
        cmSetOptOut('A');
        break;
      default:
        this.logger.warn(this.constructor.name
          + ' invalid DA consent value ' + this.da
          + '. The valid values are '
          + [Constants.CONSENT_REJECT, Constants.DA_CONSENT_ACCEPT_ANONYMOUSLY, Constants.DA_CONSENT_ACCEPT].join(' '));
    }
  }

  ngOnDestroy(): void {
    let s: Subscription;
    while (!!(s = this.subscriptions.pop())) {
      s.unsubscribe();
    }
  }
}

export class PrivacyPolicyTestService {
  pVersion = "1.0";
  da = '11';
  marketing = '1';

  updateConsentOptions(options: any): Promise<any> {
    return Promise.resolve();
  }
}
