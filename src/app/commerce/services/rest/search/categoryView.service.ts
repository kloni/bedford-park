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

export class CategoryViewService extends SearchService {

    /**
     * Gets all top level categories.
     * `@method`
     * `@name CategoryView#findTopCategories`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} depthAndLimit ` The comma separated list of numbers is to control the depth of sub-categories and limit the number of items returned under each child category level. The first number in this list determines the maximum of categories (first level sub-categories) to be returned under the immediate child category. The second number in the list determines the maximum number of categories to be returned under the first level sub-categories. A value of "-1" implies no limit. In that case, only the first level categories will be returned. For example, "pageSize=4&limitSubCategories=-1,3,0,1" implies that there will be unlimited first level sub-categories under the immediate child categories.  Under these categories (up to 4), all sub-categories will be returned and a maximum of 3 second level sub-categories will be returned. There will be no third level or fourth level since the third level limit is 0. Any level after a limit of 0 will be ignored. By default, no sub-category will be returned if this parameter is not specified. When the asterisk "*" is specified, it is considered the same as "-1" but, any subsequent levels will also be treated "-1".
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} pageSize ` Page size. Used to limit the amount of data returned by a query. Valid values include positive integers of 1 and above. The "pageNumber" must be specified for paging to work.
     ** `@property {string} pageNumber ` Page number, starting at 1. Valid values include positive integers of 1 and above. The "pageSize" must be specified for paging to work.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a search query.
     */
    findTopCategories(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/@top';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findTopCategories.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/@top' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['depthAndLimit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'depthAndLimit', parameters['depthAndLimit']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
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

        if (parameters['pageSize'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageSize', parameters['pageSize']);
        }

        if (parameters['pageNumber'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageNumber', parameters['pageNumber']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
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
     * Gets category details based on its unique ID assigned by the database.
     * `@method`
     * `@name CategoryView#findCategoryByUniqueId`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} categoryId (required)` The child property of `Parameters`.The category identifier that was assigned by the database.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a search query.
     */
    findCategoryByUniqueId(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/byId/{categoryId}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findCategoryByUniqueId.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/byId/{categoryId}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{categoryId}', parameters['categoryId']);

        if (parameters['categoryId'] === undefined) {
            throw new Error("Request '/store/{storeId}/categoryview/byId/{categoryId}' missing required parameter categoryId");
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
     * Gets category details based on category identifiers specified (not the id assigned by the database).
     * `@method`
     * `@name CategoryView#findCategoryByIdentifiers`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {array} identifier (required)` The list of category identifiers, not the ones assigned by the database.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     */
    findCategoryByIdentifiers(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/byIdentifiers';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findCategoryByIdentifiers.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/byIdentifiers' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['identifier'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'identifier', parameters['identifier']);
        }

        if (parameters['identifier'] === undefined) {
            throw new Error("Request '/store/{storeId}/categoryview/byIdentifiers' missing required parameter identifier");
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
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
     * Gets category details based on its unique ID.
     * `@method`
     * `@name CategoryView#findCategoryByUniqueIds`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {array} id (required)` The list of category identifiers.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a search query.
     */
    findCategoryByUniqueIds(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/byIds';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findCategoryByUniqueIds.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/byIds' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        if (parameters['id'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'id', parameters['id']);
        }

        if (parameters['id'] === undefined) {
            throw new Error("Request '/store/{storeId}/categoryview/byIds' missing required parameter id");
        }

        if (parameters['catalogId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'catalogId', parameters['catalogId']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
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
     * Gets child categories based on the parent category unique ID.
     * `@method`
     * `@name CategoryView#findSubCategories`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} parentCategoryId (required)` The child property of `Parameters`.The parent category id.
     ** `@property {string} depthAndLimit ` The comma separated list of numbers is to control the depth of sub-categories and limit the number of items returned under each child category level. The first number in this list determines the maximum of categories (first level sub-categories) to be returned under the immediate child category. The second number in the list determines the maximum number of categories to be returned under the first level sub-categories. A value of "-1" implies no limit. In that case, only the first level categories will be returned. For example, "pageSize=4&limitSubCategories=-1,3,0,1" implies that there will be unlimited first level sub-categories under the immediate child categories.  Under these categories (up to 4), all sub-categories will be returned and a maximum of 3 second level sub-categories will be returned. There will be no third level or fourth level since the third level limit is 0. Any level after a limit of 0 will be ignored. By default, no sub-category will be returned if this parameter is not specified. When the asterisk "*" is specified, it is considered the same as "-1" but, any subsequent levels will also be treated "-1".
     ** `@property {string} orderBy ` The field name to use when ordering the results.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {string} pageSize ` Page size. Used to limit the amount of data returned by a query. Valid values include positive integers of 1 and above. The "pageNumber" must be specified for paging to work.
     ** `@property {string} pageNumber ` Page number, starting at 1. Valid values include positive integers of 1 and above. The "pageSize" must be specified for paging to work.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a search query.
     */
    findSubCategories(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/byParentCategory/{parentCategoryId}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findSubCategories.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/byParentCategory/{parentCategoryId}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{parentCategoryId}', parameters['parentCategoryId']);

        if (parameters['parentCategoryId'] === undefined) {
            throw new Error("Request '/store/{storeId}/categoryview/byParentCategory/{parentCategoryId}' missing required parameter parentCategoryId");
        }

        if (parameters['depthAndLimit'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'depthAndLimit', parameters['depthAndLimit']);
        }

        if (parameters['orderBy'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderBy', parameters['orderBy']);
        }

        if (parameters['contractId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'contractId', parameters['contractId']);
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

        if (parameters['pageSize'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageSize', parameters['pageSize']);
        }

        if (parameters['pageNumber'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'pageNumber', parameters['pageNumber']);
        }

        if (parameters['checkEntitlement'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'checkEntitlement', parameters['checkEntitlement']);
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
     * Gets category details based on its identifier (not the id assigned by the database).
     * `@method`
     * `@name CategoryView#findCategoryByIdentifier`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store ID.
     ** `@property {string} _fields ` The fields to be returned.
     ** `@property {string} categoryIdentifier (required)` The child property of `Parameters`.The category identifier that was configured, not the one assigned by the database.
     ** `@property {string} catalogId ` The catalog identifier. If none is specified, the store default catalog shall be used.
     ** `@property {string} contractId ` The contractId
     ** `@property {string} currency ` The currency code to use. Example usage : currency=USD. If no currency code is specified, the store default currency shall be used.
     ** `@property {string} langId ` Language identifier. If not specified, the "locale" parameter will be used. If "locale" isn't specified, then the store default language shall be used.
     ** `@property {boolean} checkEntitlement ` Option to force an entitlement check.
     */
    findCategoryByIdentifier(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/categoryview/{categoryIdentifier}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/search' + path + fileNameSeparator + testGroup + '.findCategoryByIdentifier.mocks.json';
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
            throw new Error("Request '/store/{storeId}/categoryview/{categoryIdentifier}' missing required parameter storeId");
        }

        if (parameters['_fields'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, '_fields', parameters['_fields']);
        }

        requestUrl = requestUrl.replace('{categoryIdentifier}', parameters['categoryIdentifier']);

        if (parameters['categoryIdentifier'] === undefined) {
            throw new Error("Request '/store/{storeId}/categoryview/{categoryIdentifier}' missing required parameter categoryIdentifier");
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