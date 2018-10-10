/*
 * Copyright IBM Corp. 2018
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from "@angular/common/http";

import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { EventService } from "app/commerce/services/rest/transaction/event.service";

@Injectable()
export class RecommendationService {
	constructor(private storeUtils:StorefrontUtils, private eventSvc:EventService)
	{}

	performClickEvent(eSpotRoot:any,eSpotDesc:any):Observable<HttpResponse<any>> {
		let params = {
			storeId: this.storeUtils.commerceStoreId,
			responseFormat: "json",
			body: {
				personalizationID: StorefrontUtils.getCurrentPId(),
				productId: eSpotDesc.productId || '',
				categoryId: eSpotDesc.categoryId || '',
				DM_ReqCmd: '', 
				activityId: eSpotDesc.activityIdentifierID,
				baseMarketingSpotDataType: eSpotDesc.baseMarketingSpotDataType,
				eMarketingSpotId: eSpotRoot.marketingSpotIdentifier,
				baseMarketingSpotActivityID: eSpotDesc.baseMarketingSpotActivityID
			}
		};

		return this.eventSvc.handleClickInfo(params).map(r=>{return r?r:new HttpResponse({});});
	}

	performTriggerMarketing(pageName: string, searchTermParam: string, categoryIdParam: string, productIdParam: string):
		Observable<HttpResponse<any>> {
		let ReqCmdParam: string = pageName;
		if (categoryIdParam)
			ReqCmdParam	= "CategoryDisplay";
		else if (productIdParam)
			ReqCmdParam	= "ProductDisplay";
		else if (searchTermParam)
			ReqCmdParam	= "SearchDisplay";

		let params = {
			storeId: this.storeUtils.commerceStoreId,
			body: {
				personalizationID: StorefrontUtils.getCurrentPId(),
				searchTerm: searchTermParam,
				productId: productIdParam,
				categoryId: categoryIdParam,
				DM_ReqCmd: ReqCmdParam
			}
		};

		return this.eventSvc.triggerMarketing(params).map(r=>{return r?r:new HttpResponse({});});
	}
}