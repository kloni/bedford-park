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

export class InventoryavailabilityService extends TransactionService {

    /**
     * Gets inventory details for the specified product by it's identifier (Catalog Entry Id). Multiple product IDs can be passed to the URI separated by a comma (,).
     * `@method`
     * `@name Inventoryavailability#getInventoryAvailabilityByProductId`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} productIds (required)` The child property of `Parameters`.The product identifiers. Multiple values are separated by commas. Example: /inventoryavailability/10001,10002
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     ** `@property {string} onlineStoreId ` The online store identifier.
     ** `@property {string} physicalStoreId ` The physical store identifiers. Multiple values are separated by commas. Example: physicalStoreId=10001,10002
     */
    getInventoryAvailabilityByProductId(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/inventoryavailability/{productIds}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.getInventoryAvailabilityByProductId.mocks.json';
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

        requestUrl = requestUrl.replace('{storeId}', parameters['storeId']);

        if (parameters['storeId'] === undefined) {
            throw new Error("Request '/store/{storeId}/inventoryavailability/{productIds}' missing required parameter storeId");
        }

        requestUrl = requestUrl.replace('{productIds}', parameters['productIds']);

        if (parameters['productIds'] === undefined) {
            throw new Error("Request '/store/{storeId}/inventoryavailability/{productIds}' missing required parameter productIds");
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
        }

        if (parameters['onlineStoreId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'onlineStoreId', parameters['onlineStoreId']);
        }

        if (parameters['physicalStoreId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'physicalStoreId', parameters['physicalStoreId']);
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