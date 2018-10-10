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

import {
  LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TypePrivacyPolicyComponent } from '../../components/privacy-policy/typePrivacyPolicyComponent';
import { ModalComponent } from '../../components/generic/modal/modal.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PrivacyPolicyService } from '../../services/componentTransaction/privacypolicy.service';
import { StoreConfigurationsCache } from '../../common/util/storeConfigurations.cache';
import { Constants } from '../../../Constants';
import { Logger } from 'angular2-logger/core';
import { CommerceEnvironment } from '../../commerce.environment';

const uniqueId = require('lodash/uniqueId');

/*
 * @name privacyPolicyModal
 * @id privacy-policy-modal
 */
@LayoutComponent({
  selector: 'privacy-policy-modal'
})
@Component({
  selector: 'app-privacy-policy-modal-layout-component',
  templateUrl: './privacyPolicyModalLayout.html',
  styleUrls: ['./privacyPolicyModalLayout.scss'],
  preserveWhitespaces: false
})
export class PrivacyPolicyModalLayoutComponent
  extends TypePrivacyPolicyComponent
  implements ModalComponent, OnDestroy, OnInit {
  private revealOptionsSubject: BehaviorSubject<FoundationSites.IRevealOptions>;
  private readonly showCloseButtonSubject: BehaviorSubject<boolean>;
  private readonly onCancelSubject: BehaviorSubject<boolean>;
  private readonly onConfirmSubject: BehaviorSubject<boolean>;

  errorMessage: string;
  closeFunc: Function;

  id: any;
  iMarketing: string;

  _iDa: string;
  iDaConsent: string;
  iDaAnonymous: string;
  marketingConsentCheckboxId: string;
  digitalConsentCheckboxId: string;
  digitalConsentCheckboxAnonymousId: string;
  marketingTrackingConsentEnabled: boolean;
  DAConsentEnabled: boolean;

  set iDa(value: string) {
    this._iDa = value;
    this.iDaConsent = value === undefined ? value : value.charAt(0);
    this.iDaAnonymous = value === undefined ? value : value.charAt(1);
  }

  get iDa(): string {
    return this._iDa;
  }

  constructor(
    private storeConfig: StoreConfigurationsCache,
    private privacyService: PrivacyPolicyService,
    private logger: Logger) {
    super();
    const options = {
      'closeOnClick': false,
      'closeOnEsc': false
    };
    this.revealOptionsSubject = new BehaviorSubject<FoundationSites.IRevealOptions>(options);
    this.showCloseButtonSubject = new BehaviorSubject<boolean>(false);
    this.onConfirmSubject = new BehaviorSubject<boolean>(false);
    this.onCancelSubject = new BehaviorSubject<boolean>(false);
    this.id = uniqueId();
    this.marketingConsentCheckboxId = 'privacy_modal_marketingConsent';
    this.digitalConsentCheckboxId = 'privacy_modal_digitalAnalyticsConsent';
    this.digitalConsentCheckboxAnonymousId = 'privacy_modal_digitalAnalyticsAnonymousConsent';
  }

  ngOnInit() {
    super.ngOnInit();
    this.closeFunc = this.closeErrrorMessage.bind( this );
    Promise.all([
      this.storeConfig.isEnabled(Constants.FEATURE_MARKETING_CONSENT),
      this.storeConfig.isEnabled(Constants.FEATURE_DA_CONSENT),
      this.storeConfig.isEnabled(CommerceEnvironment.digitalAnalyticsFeatureName)
    ]).then (res => {
      this.marketingTrackingConsentEnabled = !!res[0];
      this.DAConsentEnabled = !!res[1] && !!res[2];
      if (this.marketingTrackingConsentEnabled && this.iMarketing === undefined) {
        this.iMarketing = Constants.CONSENT_REJECT;
      }
      /* istabul ignore else */
      if (!this.marketingTrackingConsentEnabled) {
        this.iMarketing = undefined;
      }
      if (this.DAConsentEnabled && this.iDa === undefined) {
        this.iDa = '0';
      }
      if (!this.DAConsentEnabled) {
        this.iDa = undefined;
      }
    });
    this.privacyService.getConsentOptions().then(
      (ops: any) => {
        if (ops.marketing) {
          this.iMarketing = ops.marketing;
        }
        if (ops.da) {
          this.iDa = ops.da;
        }
      }
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.revealOptionsSubject.complete();
    this.revealOptionsSubject.unsubscribe();
    this.showCloseButtonSubject.complete();
    this.showCloseButtonSubject.unsubscribe();
    this.onConfirmSubject.complete();
    this.onConfirmSubject.unsubscribe();
    this.onCancelSubject.complete();
    this.onCancelSubject.unsubscribe();
  }
  getRevealOptions(): FoundationSites.IRevealOptions {
    return this.revealOptionsSubject.getValue();
  }

  onCancel(): Observable<boolean> {
    return this.onCancelSubject;
  }

  onConfirm(): Observable<boolean> {
    return this.onConfirmSubject;
  }

  onShowCloseButton(): Observable<boolean> {
    return this.showCloseButtonSubject;
  }

  updateMarketingConsent() {
    this.iMarketing = this.iMarketing === Constants.CONSENT_ACCEPT ? Constants.CONSENT_REJECT : Constants.CONSENT_ACCEPT;
  }

  updateDAConsent() {
    this.iDaConsent = this.iDaConsent === Constants.CONSENT_ACCEPT ? Constants.CONSENT_REJECT : Constants.CONSENT_ACCEPT;
    if (this.iDaConsent === Constants.CONSENT_ACCEPT) {
      this.iDa = this.iDaConsent.concat(this.iDaAnonymous ? this.iDaAnonymous : Constants.CONSENT_REJECT );
    } else {
      this.iDa = this.iDaConsent;
    }
  }

  updateDAAnonymousConsent() {
    if (this.iDaConsent === Constants.CONSENT_ACCEPT) {
      this.iDaAnonymous = this.iDaAnonymous === Constants.CONSENT_ACCEPT ? Constants.CONSENT_REJECT : Constants.CONSENT_ACCEPT;
      this.iDa = this.iDaConsent.concat(this.iDaAnonymous);
    } else {
      this.iDaAnonymous = Constants.CONSENT_REJECT ;
    }
  }

  submit(event?: any) {
    if (event && $(event.target).attr("contentEditable") === "true"){
      event.preventDefault();
      return;
    }
    this.privacyService.updateConsentOptions({
      'marketing': this.iMarketing,
      'da': this.iDa
    }).then(
      () => {
        this.onConfirmSubject.next(true)
      },
      e => {
        this.logger.debug(this.constructor.name + ' update user privacy preference failed ' + e);
        this.errorMessage = 'PrivacyPolicyModal.errorMessage';
      }
    )
  }

  closeErrrorMessage() {
    this.errorMessage = null;
  }

}
