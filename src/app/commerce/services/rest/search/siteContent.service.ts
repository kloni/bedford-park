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
import { SearchService } from "./search.service";
import { CommerceEnvironment } from "../../../commerce.environment";
import { serviceUtils } from "../serviceUtil";

declare var __karma__ : any;
/* beautify ignore:end */

export class SiteContentService extends SearchService {

    /**
     * Provides keyword suggestions with type-ahead for search result page based on a term.
     * `@method`
     * `@name SiteContent#findKeywordSuggestionsByTerm`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} term (required)` The child property of `Parameters`.The search term.
     ** `@property {string} term ` The search term.
     ** `@property {string} limit ` Limit.
     ** `@property {string} count ` The number of suggested keywords to be returned. The default value is 4.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} termsSort ` The sorting to be used in the returned result, "count" or "index". By default, it is "count".
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a search query.
     */
    findKeywordSuggestionsByTerm(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/sitecontent/keywordSuggestionsByTerm/{term}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findKeywordSuggestionsByTerm.mocks.json';
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
        headerValues['Accept'] = ['application/json'];
        for (let val of headerValues['Accept']) {
            header = header.append('Accept', val);
        }

        requestUrl = requestUrl.replace('{storeId}', parameters['storeId']);

        if (parameters['storeId'] === undefined) {
            throw new Error("Request '/store/{storeId}/sitecontent/keywordSuggestionsByTerm/{term}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{term}', parameters['term']);

        if (parameters['term'] === undefined) {
            throw new Error("Request '/store/{storeId}/sitecontent/keywordSuggestionsByTerm/{term}' missing required parameter term");
        }

        if (parameters['term'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'term', parameters['term']);
        }

        if (parameters['limit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'limit', parameters['limit']);
        }

        if (parameters['count'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'count', parameters['count']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['termsSort'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'termsSort', parameters['termsSort']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['profileName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'profileName', parameters['profileName']);
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

    /**
     * Provides suggestions with type-ahead for search result page.
     * `@method`
     * `@name SiteContent#findSuggestions`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} suggestType ` The suggestion type. Accepted values are 'Category', 'Brand', 'Articles', 'Keyword', and 'Product'.
     ** `@property {string} term ` The search term.
     ** `@property {string} limit ` Limit.
     ** `@property {string} count ` The number of suggested keywords to be returned. The default value is 4.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} termsSort ` The sorting to be used in the returned result, "count" or "index". By default, it is "count".
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     */
    findSuggestions(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/sitecontent/suggestions';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findSuggestions.mocks.json';
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
        headerValues['Accept'] = ['application/json'];
        for (let val of headerValues['Accept']) {
            header = header.append('Accept', val);
        }

        requestUrl = requestUrl.replace('{storeId}', parameters['storeId']);

        if (parameters['storeId'] === undefined) {
            throw new Error("Request '/store/{storeId}/sitecontent/suggestions' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['suggestType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'suggestType', parameters['suggestType']);
        }

        if (parameters['term'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'term', parameters['term']);
        }

        if (parameters['limit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'limit', parameters['limit']);
        }

        if (parameters['count'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'count', parameters['count']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['termsSort'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'termsSort', parameters['termsSort']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
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