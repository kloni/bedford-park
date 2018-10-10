/* jshint ignore:start */
/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/* beautify ignore:start */
import { URLSearchParams } from '@angular/http';
import { HttpResponse, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { TransactionService } from "./transaction.service";
import { CommerceEnvironment } from "../../../commerce.environment";
import { serviceUtils } from "../serviceUtil";

declare var __karma__ : any;
/* beautify ignore:end */

export class AssociatedPromotionCodeService extends TransactionService {

    /**
     * Get promotions list by product ID.
     * `@method`
     * `@name AssociatedPromotionCode#findPromotionsByProduct`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a query.
     ** `@property {string} qProductId (required)` The product ID.
     ** `@property {string} qCalculationUsageId ` The calculation usage ID.
     ** `@property {string} qCode ` The calculation code name.
     ** `@property {string} qEnableStorePath ` Whether the data bean searches for calculation code based on store path. Default value is <b>true</b>.
     ** `@property {string} qIncludeCategoryPromotions ` Whether to exclude category promotions. Default value is <b>false</b>.
     ** `@property {string} qIncludeChildItems ` Whether to include the child items. Default value is <b>false</b>.
     ** `@property {string} qIncludeNonManagementCenterPromotions ` Whether all the promotions in the store have been created in Management Center. Default value is <b>false</b>
     ** `@property {string} qIncludeParentCategories ` Whether to retrieve the calculation codes attached to the parent category of the specified catalog group. Default value is <b>false</b>.
     ** `@property {string} qIncludeParentProduct ` Whether to retrieve the calculation codes attached to the parent product of the specified catalog entry. Default value is <b>false</b>
     ** `@property {string} qIncludePromotionCode ` Whether to exclude the calculation codes that require a promotion code. Default value is <b>true</b>.
     ** `@property {string} qIncludeUnentitledPromotionsByMemberGroup ` Whether to include promotions that are targeted to a member group if the user does not belong to the member group. Default value is <b>false</b>.
     ** `@property {string} qShipModeId ` The ship mode ID.
     ** `@property {string} qUserId ` The user ID.

     ** `@property {integer} qCategoryId ` 
     ** `@property {integer} qDisplayLevel ` 
     ** `@property {integer} qStoreId ` 
     */
    findPromotionsByProduct(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/associated_promotion';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.findPromotionsByProduct.mocks.json';
        }
        let form = {};
        let body = {};
        let header: HttpHeaders;
        let queryParameters = new HttpParams();
        let formParams = new URLSearchParams();
        if (typeof headers === 'undefined' || headers === null) {
            header = new HttpHeaders();
        } else {
            header = new HttpHeaders(headers);
        }
        if (parameters === undefined) {
            parameters = {};
        }

        let headerValues = {};
        headerValues['Accept'] = ['application/json', 'application/xml', 'application/xhtml+xml', 'application/atom+xml'];
        for (let val of headerValues['Accept']) {
            header = header.append('Accept', val);
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
        }

        requestUrl = requestUrl.replace('{storeId}', parameters['storeId']);

        if (parameters['storeId'] === undefined) {
            throw new Error("Request '/store/{storeId}/associated_promotion' missing required parameter storeId");
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['profileName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'profileName', parameters['profileName']);
        }

        if (parameters['qProductId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qProductId', parameters['qProductId']);
        }

        if (parameters['qProductId'] === undefined) {
            throw new Error("Request '/store/{storeId}/associated_promotion' missing required parameter qProductId");
        }

        if (parameters['qCalculationUsageId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qCalculationUsageId', parameters['qCalculationUsageId']);
        }

        if (parameters['qCode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qCode', parameters['qCode']);
        }

        if (parameters['qEnableStorePath'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qEnableStorePath', parameters['qEnableStorePath']);
        }

        if (parameters['qIncludeCategoryPromotions'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeCategoryPromotions', parameters['qIncludeCategoryPromotions']);
        }

        if (parameters['qIncludeChildItems'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeChildItems', parameters['qIncludeChildItems']);
        }

        if (parameters['qIncludeNonManagementCenterPromotions'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeNonManagementCenterPromotions', parameters['qIncludeNonManagementCenterPromotions']);
        }

        if (parameters['qIncludeParentCategories'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeParentCategories', parameters['qIncludeParentCategories']);
        }

        if (parameters['qIncludeParentProduct'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeParentProduct', parameters['qIncludeParentProduct']);
        }

        if (parameters['qIncludePromotionCode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludePromotionCode', parameters['qIncludePromotionCode']);
        }

        if (parameters['qIncludeUnentitledPromotionsByMemberGroup'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qIncludeUnentitledPromotionsByMemberGroup', parameters['qIncludeUnentitledPromotionsByMemberGroup']);
        }

        if (parameters['qShipModeId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qShipModeId', parameters['qShipModeId']);
        }

        if (parameters['qUserId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qUserId', parameters['qUserId']);
        }

        queryParameters = queryParameters.set('q', 'byProduct');

        if (parameters['q'] === undefined) {
            throw new Error("Request '/store/{storeId}/associated_promotion' missing required parameter q");
        }

        if (parameters['qCategoryId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qCategoryId', parameters['qCategoryId']);
        }

        if (parameters['qDisplayLevel'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qDisplayLevel', parameters['qDisplayLevel']);
        }

        if (parameters['qStoreId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'qStoreId', parameters['qStoreId']);
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters = queryParameters.set(parameterName, parameter);
                });
        }

        if (!header.get('Content-Type')) {
            header = header.append('Content-Type', 'application/json; charset=utf-8');
        }

        if (header.getAll('Accept').indexOf('application/json') > -1) {
            header = header.set('Accept', 'application/json');
        }

        if (header.get('content-type') === 'multipart/form-data' && Object.keys(form).length > 0) {
            let formData = new FormData();
            for (let p in form) {
                if (form[p].name !== undefined) {
                    formData.append(p, form[p], form[p].name);
                } else {
                    formData.append(p, form[p]);
                }
            }
            body = formData;
        } else if (Object.keys(form).length > 0) {
            header = header.set('content-type', 'application/x-www-form-urlencoded');
            for (let p in form) {
                formParams.append(p, form[p]);
            }
            body = formParams;
        }
        let requestOptions = {
            'params': queryParameters,
            'method': method,
            'headers': header,
            'body': body,
            'url': requestUrl
        };

        return this.invokeService(requestOptions);
    };

}
/* jshint ignore:end */