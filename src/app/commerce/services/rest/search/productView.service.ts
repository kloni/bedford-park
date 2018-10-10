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

export class ProductViewService extends SearchService {

    /**
     * Finds a product by its ID.
     * `@method`
     * `@name ProductView#findProductsByCategory`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} categoryId (required)` The child property of `Parameters`.The category identifier.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} attributeKeyword ` The attribute associated keywords to be returned.
     ** `@property {string} facet ` The selected facets.
     ** `@property {string} facetLimit ` The multiple name-value pairs of facet limit defining the maximum number of items to be returned under each facet. The sequence of limits honored alongside with the sequence of facet name-value pairs.
     ** `@property {string} advancedFacetList ` The advanced facet list.
     ** `@property {string} filterFacet ` The filter facet.
     ** `@property {string} filterTerm ` The filter term.
     ** `@property {string} manufacturer ` The manufacturer name.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} minPrice ` The minimum price. Based on the selected currency.
     ** `@property {string} maxPrice ` The maximum price. Based on the selected currency.mc
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} searchType ` The search type is a numeric string with controls the query operator: ANY, OR, AND and control what data to be returned. For a detailed list of valid values, see the online documentation on Match type (_wcf.search.type). Known valid values include : 0: ANY (exclude SKU)1: EXACT (exclude SKU), 2: ALL (exclude SKU), 3: NONE (exclude SKU), 10: ANY (include SKU), 11: EXACT (include SKU), 12: ALL (include SKU), 13: NONE (include SKU), 100: ANY (only SKU), 101: EXACT (only SKU), 102: ALL (only SKU), 103: NONE (only SKU), 1000: ANY (include products, kits, bundles, category level SKU) (exclude product level SKU), 1001: EXACT (include products, kits, bundles, category level SKU) (exclude product level SKU), 1002: ALL (include products, kits, bundles, category level SKU) (exclude product level SKU), 1003: NONE (include products, kits, bundles, category level SKU) (exclude product level SKU), 10000: ANY (include category level SKU) (exclude products, kits, bundles, product level SKU), 10001: EXACT (include category level SKU) (exclude products, kits, bundles, product level SKU), 10002: ALL (include category level SKU) (exclude products, kits, bundles, product level SKU), 10003: NONE (include category level SKU) (exclude products, kits, bundles, product level SKU)
     ** `@property {string} searchSource ` The search source. The default is "N" for shallow search navigation. All other values will result in expanded search in sub-categories.
     ** `@property {string} priceMode ` The price mode.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} pageSize ` Page size. Used to limit the amount of data returned by a query. Valid values include positive integers of 1 and above. The "pageNumber" must be specified for paging to work.
     ** `@property {string} pageNumber ` Page number, starting at 1. Valid values include positive integers of 1 and above. The "pageSize" must be specified for paging to work.
     */
    findProductsByCategory(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/byCategory/{categoryId}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductsByCategory.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/byCategory/{categoryId}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{categoryId}', parameters['categoryId']);

        if (parameters['categoryId'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/byCategory/{categoryId}' missing required parameter categoryId");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['attributeKeyword'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attributeKeyword', parameters['attributeKeyword']);
        }

        if (parameters['facet'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'facet', parameters['facet']);
        }

        if (parameters['facetLimit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'facetLimit', parameters['facetLimit']);
        }

        if (parameters['advancedFacetList'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'advancedFacetList', parameters['advancedFacetList']);
        }

        if (parameters['filterFacet'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'filterFacet', parameters['filterFacet']);
        }

        if (parameters['filterTerm'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'filterTerm', parameters['filterTerm']);
        }

        if (parameters['manufacturer'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'manufacturer', parameters['manufacturer']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['minPrice'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'minPrice', parameters['minPrice']);
        }

        if (parameters['maxPrice'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'maxPrice', parameters['maxPrice']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
        }

        if (parameters['searchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'searchType', parameters['searchType']);
        }

        if (parameters['searchSource'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'searchSource', parameters['searchSource']);
        }

        if (parameters['priceMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'priceMode', parameters['priceMode']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageSize', parameters['pageSize']);
        }

        if (parameters['pageNumber'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageNumber', parameters['pageNumber']);
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
     * Gets product details based on the product ID.
     * `@method`
     * `@name ProductView#findProductById`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} productId (required)` The child property of `Parameters`.The product identifier.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} attributeKeyword ` The attribute associated keywords to be returned.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {integer} invVisibilityMode ` The inventory visibility mode
     */
    findProductById(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/byId/{productId}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductById.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/byId/{productId}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{productId}', parameters['productId']);

        if (parameters['productId'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/byId/{productId}' missing required parameter productId");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['attributeKeyword'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attributeKeyword', parameters['attributeKeyword']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['invVisibilityMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'invVisibilityMode', parameters['invVisibilityMode']);
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
     * Gets product details based on the product ID.
     * `@method`
     * `@name ProductView#findProductsByIds`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {array} id (required)` The product identifiers.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} attributeKeyword ` The attribute associated keywords to be returned.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {integer} invVisibilityMode ` The inventory visibility mode
     */
    findProductsByIds(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/byIds';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductsByIds.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/byIds' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['id'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'id', parameters['id']);
        }

        if (parameters['id'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/byIds' missing required parameter id");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['attributeKeyword'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attributeKeyword', parameters['attributeKeyword']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['invVisibilityMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'invVisibilityMode', parameters['invVisibilityMode']);
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
     * Gets products by part numbers.
     * `@method`
     * `@name ProductView#findProductByPartNumbers`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {array} partNumber (required)` The product part numbers.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {integer} invVisibilityMode ` The inventory visibility mode
     */
    findProductByPartNumbers(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/byPartNumbers';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductByPartNumbers.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/byPartNumbers' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['partNumber'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'partNumber', parameters['partNumber']);
        }

        if (parameters['partNumber'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/byPartNumbers' missing required parameter partNumber");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['invVisibilityMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'invVisibilityMode', parameters['invVisibilityMode']);
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
     * Gets product details based on a search term.
     * `@method`
     * `@name ProductView#findProductsBySearchTerm`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} searchTerm (required)` The child property of `Parameters`.The term to search for.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} attributeKeyword ` The attribute associated keywords to be returned.
     ** `@property {string} facet ` The selected facets.
     ** `@property {string} facetLimit ` The multiple name-value pairs of facet limit defining the maximum number of items to be returned under each facet. The sequence of limits honored alongside with the sequence of facet name-value pairs.
     ** `@property {string} advancedFacetList ` The advanced facet list.
     ** `@property {string} filterFacet ` The filter facet.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} filterTerm ` The filter term.
     ** `@property {string} manufacturer ` The manufacturer name.
     ** `@property {string} minPrice ` The minimum price. Based on the selected currency.
     ** `@property {string} maxPrice ` The maximum price. Based on the selected currency.mc
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} searchType ` The search type is a numeric string with controls the query operator: ANY, OR, AND and control what data to be returned. For a detailed list of valid values, see the online documentation on Match type (_wcf.search.type). Known valid values include : 0: ANY (exclude SKU)1: EXACT (exclude SKU), 2: ALL (exclude SKU), 3: NONE (exclude SKU), 10: ANY (include SKU), 11: EXACT (include SKU), 12: ALL (include SKU), 13: NONE (include SKU), 100: ANY (only SKU), 101: EXACT (only SKU), 102: ALL (only SKU), 103: NONE (only SKU), 1000: ANY (include products, kits, bundles, category level SKU) (exclude product level SKU), 1001: EXACT (include products, kits, bundles, category level SKU) (exclude product level SKU), 1002: ALL (include products, kits, bundles, category level SKU) (exclude product level SKU), 1003: NONE (include products, kits, bundles, category level SKU) (exclude product level SKU), 10000: ANY (include category level SKU) (exclude products, kits, bundles, product level SKU), 10001: EXACT (include category level SKU) (exclude products, kits, bundles, product level SKU), 10002: ALL (include category level SKU) (exclude products, kits, bundles, product level SKU), 10003: NONE (include category level SKU) (exclude products, kits, bundles, product level SKU)
     ** `@property {string} searchSource ` The search source. The default is "N" for shallow search navigation. All other values will result in expanded search in sub-categories.
     ** `@property {string} priceMode ` The price mode.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} categoryId ` The category identifier.
     ** `@property {string} searchTerm ` The optional searchTerm parameter that will replace the {searchTerm} value in the context path parameter. It is used to avoid potential limitation of the special characters as being part of the context path.
     ** `@property {string} intentSearchTerm ` The value of the parameter is the term that the user intends to search. Characters are not escaped for the search engine.
     ** `@property {string} originalSearchTerm ` The value of the parameter is the term that the user intends to search. Characters are escaped for the search engine.
     ** `@property {string} filterType ` Used for advanced search option. 0 - search for any match, 1 - search for exact match, 2 - search for all matches
     ** `@property {string} physicalStoreIds ` The list of physical store identifiers.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} pageSize ` Page size. Used to limit the amount of data returned by a query. Valid values include positive integers of 1 and above. The "pageNumber" must be specified for paging to work.
     ** `@property {string} pageNumber ` Page number, starting at 1. Valid values include positive integers of 1 and above. The "pageSize" must be specified for paging to work.
     ** `@property {string} _query ` Query fields. Query fields determine the fields to be searched.
     */
    findProductsBySearchTerm(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/bySearchTerm/{searchTerm}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductsBySearchTerm.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/bySearchTerm/{searchTerm}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{searchTerm}', parameters['searchTerm']);

        if (parameters['searchTerm'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/bySearchTerm/{searchTerm}' missing required parameter searchTerm");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['attributeKeyword'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attributeKeyword', parameters['attributeKeyword']);
        }

        if (parameters['facet'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'facet', parameters['facet']);
        }

        if (parameters['facetLimit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'facetLimit', parameters['facetLimit']);
        }

        if (parameters['advancedFacetList'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'advancedFacetList', parameters['advancedFacetList']);
        }

        if (parameters['filterFacet'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'filterFacet', parameters['filterFacet']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['filterTerm'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'filterTerm', parameters['filterTerm']);
        }

        if (parameters['manufacturer'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'manufacturer', parameters['manufacturer']);
        }

        if (parameters['minPrice'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'minPrice', parameters['minPrice']);
        }

        if (parameters['maxPrice'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'maxPrice', parameters['maxPrice']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
        }

        if (parameters['searchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'searchType', parameters['searchType']);
        }

        if (parameters['searchSource'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'searchSource', parameters['searchSource']);
        }

        if (parameters['priceMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'priceMode', parameters['priceMode']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['categoryId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'categoryId', parameters['categoryId']);
        }

        if (parameters['searchTerm'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'searchTerm', parameters['searchTerm']);
        }

        if (parameters['intentSearchTerm'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'intentSearchTerm', parameters['intentSearchTerm']);
        }

        if (parameters['originalSearchTerm'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'originalSearchTerm', parameters['originalSearchTerm']);
        }

        if (parameters['filterType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'filterType', parameters['filterType']);
        }

        if (parameters['physicalStoreIds'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'physicalStoreIds', parameters['physicalStoreIds']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageSize', parameters['pageSize']);
        }

        if (parameters['pageNumber'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageNumber', parameters['pageNumber']);
        }

        if (parameters['_query'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_query', parameters['_query']);
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
     * Gets products by part number.
     * `@method`
     * `@name ProductView#findProductByPartNumber`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} partNumber (required)` The child property of `Parameters`.The product part number.
     ** `@property {string} associationType ` The type of the merchandising association to be returned.
     ** `@property {string} attributeKeyword ` The attribute associated keywords to be returned.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} attachementFilter ` The attachment filter.
     ** `@property {integer} invVisibilityMode ` The inventory visibility mode
     */
    findProductByPartNumber(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/productview/{partNumber}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findProductByPartNumber.mocks.json';
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
            throw new Error("Request '/store/{storeId}/productview/{partNumber}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{partNumber}', parameters['partNumber']);

        if (parameters['partNumber'] === undefined) {
            throw new Error("Request '/store/{storeId}/productview/{partNumber}' missing required parameter partNumber");
        }

        if (parameters['associationType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'associationType', parameters['associationType']);
        }

        if (parameters['attributeKeyword'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attributeKeyword', parameters['attributeKeyword']);
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
        }

        if (parameters['currency'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'currency', parameters['currency']);
        }

        if (parameters['langId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'langId', parameters['langId']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
        }

        if (parameters['attachementFilter'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'attachementFilter', parameters['attachementFilter']);
        }

        if (parameters['invVisibilityMode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'invVisibilityMode', parameters['invVisibilityMode']);
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