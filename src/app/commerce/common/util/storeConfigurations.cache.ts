/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs/Observable'
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from "angular2-logger/core";
import { StoreService } from '../../services/rest/transaction/store.service';
import { StorefrontUtils } from '../storefrontUtils.service';
import 'rxjs/add/operator/share';

@Injectable()
export class StoreConfigurationsCache {
    private cachedConf: Map<string, boolean>;
    private featureSharedSub;
    private isLoad: Boolean = false;
	constructor(
        private storeUtils: StorefrontUtils,
        private storeSvc: StoreService,
		private logger: Logger ) {
        this.cachedConf = new Map<string, boolean>();
        this.featureSharedSub = this.getFeatures();
	}

	public isEnabled(featureName: string): Promise<boolean> {
        if (this.isLoad) {
            return new Promise<boolean>((resolve) => {resolve(this.cachedConf.has(featureName));});
        } else {
            return new Promise<boolean>((resolve) => {
                this.featureSharedSub.subscribe((res) => {
                    resolve(this.cachedConf.has(featureName));
                });
            });
        }
	}

    private getFeatures(): Observable<HttpResponse<any>> {
		const params = {
			'storeId': this.storeUtils.commerceStoreId,
        };

        let sharedSource = this.storeSvc.getStoreEnabledFeaturesList(params).share();
        sharedSource.subscribe(res => {
            let resultList = res.body.resultList;
            resultList.forEach(featureName => {
                this.cachedConf.set(featureName, true);
            });
            this.isLoad = true;
        }, (error: any) => {
            this.parseErrorMsg(error,"Unable to retrieve store configuration feature")
        })

        return sharedSource;
    }

  	private parseErrorMsg(error: HttpErrorResponse, fallback: string): string {
		const eBody = error.error;
		this.logger.info( this.constructor.name + " parseErrorMsg: " + error.message );
		this.logger.debug( this.constructor.name + " parseErrorMsg: " + JSON.stringify( error ));
		return eBody && eBody.errors && eBody.errors.length && eBody.errors[0].errorMessage?eBody.errors[0].errorMessage:fallback;
	}
}
