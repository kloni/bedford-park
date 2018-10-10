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

export class PersonService extends TransactionService {

    /**
     * Gets the account data for a registered user.
     * `@method`
     * `@name Person#findPersonBySelf`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     */
    findPersonBySelf(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/@self';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.findPersonBySelf.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/@self' missing required parameter storeId");
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
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
     * This allows an administrator to find user information by user identifier.
     * `@method`
     * `@name Person#findByUserId`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} userId (required)` The child property of `Parameters`.The user identifier.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a query.  Default profile name = IBM_User_Display_Details
     */
    findByUserId(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/{userId}';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.findByUserId.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/{userId}' missing required parameter storeId");
        }

        requestUrl = requestUrl.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            throw new Error("Request '/store/{storeId}/person/{userId}' missing required parameter userId");
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
     * This allows CSR/CSS to find approved registered users in store organizations that he/she can manage.
     * `@method`
     * `@name Person#registeredUsersICanManage`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} profileName ` Profile name. Profiles determine the subset of data to be returned by a query.  Default profile name = IBM_User_List_Summary

     ** `@property {string} orderByTableName ` The order by table name.
     ** `@property {string} orderByFieldName ` The order by field name.
     ** `@property {string} startIndex ` The starting index of the result.
     ** `@property {string} maxResults ` The maximum number of results to be returned.
     ** `@property {string} logonId ` Logon Id of the customer to search for.
     ** `@property {string} logonIdSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} parentOrgName ` Parent organization name to search buyers. Only used in B2B store.
     ** `@property {string} parentOrgNameSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} firstName ` First name of the customer to search for.
     ** `@property {string} firstNameSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} firstName ` First name of the customer to search for.
     ** `@property {string} firstNameSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} lastName ` Last name of the customer to search for.
     ** `@property {string} lastNameSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} middleName ` Middle name of the customer to search for.
     ** `@property {string} middleNameSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} address1 ` Address line 1 of the customer to search for.
     ** `@property {string} address1SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} city ` The city name of the customer to search for.
     ** `@property {string} citySearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} country ` The country or region name of the customer to search for.
     ** `@property {string} countrySearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} email1 ` The primary e-mail address of the customer to search for.
     ** `@property {string} email1SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} email2 ` The secondary e-mail address of the customer to search for.
     ** `@property {string} email2SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} fax1 ` The primary fax number of the customer to search for.
     ** `@property {string} fax1SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} fax2 ` The secondary fax number of the customer to search for.
     ** `@property {string} fax2SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} field1 ` Customizable field1 to search for.
     ** `@property {string} field1SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} field2 ` Customizable field1 to search for.
     ** `@property {string} field2SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} phone1 ` The primary phone number of the customer to search for.
     ** `@property {string} phone1SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} phone2 ` The secondary phone number of the customer to search for.
     ** `@property {string} phone2SearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} state ` The state or province name of the customer to search for.
     ** `@property {string} stateSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     ** `@property {string} zipcode `  ZIP or postal code of the customer to search for.
     ** `@property {string} zipcodeSearchType ` The search type. The valid values are 1 (case sensitive and starts with), 2(case sensitive and contains), 3(case insensitive and starts with),4(case insensitive and contains), 5(case sensitive and exact match), 6(case insensitive and exact match),8(not equals)
     */
    registeredUsersICanManage(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person';
        let requestUrl = domain + path;
        let method = 'GET';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.registeredUsersICanManage.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person' missing required parameter storeId");
        }

        if (parameters['profileName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'profileName', parameters['profileName']);
        }

        queryParameters = queryParameters.set('q', 'registeredUsersICanManage');

        if (parameters['q'] === undefined) {
            throw new Error("Request '/store/{storeId}/person' missing required parameter q");
        }

        if (parameters['orderByTableName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderByTableName', parameters['orderByTableName']);
        }

        if (parameters['orderByFieldName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'orderByFieldName', parameters['orderByFieldName']);
        }

        if (parameters['startIndex'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'startIndex', parameters['startIndex']);
        }

        if (parameters['maxResults'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'maxResults', parameters['maxResults']);
        }

        if (parameters['logonId'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'logonId', parameters['logonId']);
        }

        if (parameters['logonIdSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'logonIdSearchType', parameters['logonIdSearchType']);
        }

        if (parameters['parentOrgName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'parentOrgName', parameters['parentOrgName']);
        }

        if (parameters['parentOrgNameSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'parentOrgNameSearchType', parameters['parentOrgNameSearchType']);
        }

        if (parameters['firstName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'firstName', parameters['firstName']);
        }

        if (parameters['firstNameSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'firstNameSearchType', parameters['firstNameSearchType']);
        }

        if (parameters['firstName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'firstName', parameters['firstName']);
        }

        if (parameters['firstNameSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'firstNameSearchType', parameters['firstNameSearchType']);
        }

        if (parameters['lastName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'lastName', parameters['lastName']);
        }

        if (parameters['lastNameSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'lastNameSearchType', parameters['lastNameSearchType']);
        }

        if (parameters['middleName'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'middleName', parameters['middleName']);
        }

        if (parameters['middleNameSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'middleNameSearchType', parameters['middleNameSearchType']);
        }

        if (parameters['address1'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'address1', parameters['address1']);
        }

        if (parameters['address1SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'address1SearchType', parameters['address1SearchType']);
        }

        if (parameters['city'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'city', parameters['city']);
        }

        if (parameters['citySearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'citySearchType', parameters['citySearchType']);
        }

        if (parameters['country'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'country', parameters['country']);
        }

        if (parameters['countrySearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'countrySearchType', parameters['countrySearchType']);
        }

        if (parameters['email1'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'email1', parameters['email1']);
        }

        if (parameters['email1SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'email1SearchType', parameters['email1SearchType']);
        }

        if (parameters['email2'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'email2', parameters['email2']);
        }

        if (parameters['email2SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'email2SearchType', parameters['email2SearchType']);
        }

        if (parameters['fax1'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'fax1', parameters['fax1']);
        }

        if (parameters['fax1SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'fax1SearchType', parameters['fax1SearchType']);
        }

        if (parameters['fax2'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'fax2', parameters['fax2']);
        }

        if (parameters['fax2SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'fax2SearchType', parameters['fax2SearchType']);
        }

        if (parameters['field1'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'field1', parameters['field1']);
        }

        if (parameters['field1SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'field1SearchType', parameters['field1SearchType']);
        }

        if (parameters['field2'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'field2', parameters['field2']);
        }

        if (parameters['field2SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'field2SearchType', parameters['field2SearchType']);
        }

        if (parameters['phone1'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'phone1', parameters['phone1']);
        }

        if (parameters['phone1SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'phone1SearchType', parameters['phone1SearchType']);
        }

        if (parameters['phone2'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'phone2', parameters['phone2']);
        }

        if (parameters['phone2SearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'phone2SearchType', parameters['phone2SearchType']);
        }

        if (parameters['state'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'state', parameters['state']);
        }

        if (parameters['stateSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'stateSearchType', parameters['stateSearchType']);
        }

        if (parameters['zipcode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'zipcode', parameters['zipcode']);
        }

        if (parameters['zipcodeSearchType'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'zipcodeSearchType', parameters['zipcodeSearchType']);
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
     * Registers a new user.  When mode is set to admin, the register is done by an administrator.
     * `@method`
     * `@name Person#registerPerson`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     ** `@property {any} body ` Request body.
     ** `@property {string} mode ` The mode of the rest service. Default value is 'self'.
     */
    registerPerson(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person';
        let requestUrl = domain + path;
        let method = 'POST';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.registerPerson.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person' missing required parameter storeId");
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['mode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'mode', parameters['mode']);
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
     * Updates account data for a registered user.  This also supports resetting password for unauthenticated and authenticated users. When action is set to 'updateUserRegistration', user account data is updated using UserRegistrationUpdateCmd
     * `@method`
     * `@name Person#updatePerson`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     ** `@property {any} body ` Request body.

     */
    updatePerson(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/@self';
        let requestUrl = domain + path;
        let method = 'PUT';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.updatePerson.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/@self' missing required parameter storeId");
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['action'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'action', parameters['action']);
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
     * Updates account data for a registered user.  This also supports resetting password for unauthenticated and authenticated users. When action is set to 'updateUserRegistration', user account data is updated using UserRegistrationUpdateCmd
     * `@method`
     * `@name Person#updatePersonOnUserRegistrationUpdate`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} responseFormat ` The response format. If the request has an input body, that body must also use the format specified in "responseFormat". Valid values include "json" and "xml" without the quotes. If the responseFormat isn't specified, the "accept" HTTP header shall be used to determine the format of the response. If the "accept" HTTP header isn't specified as well, the default response format shall be in json.
     ** `@property {any} body ` Request body.

     */
    updatePersonOnUserRegistrationUpdate(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/@self';
        let requestUrl = domain + path;
        let method = 'PUT';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.updatePersonOnUserRegistrationUpdate.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/@self' missing required parameter storeId");
        }

        if (parameters['responseFormat'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'responseFormat', parameters['responseFormat']);
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['action'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'action', parameters['action']);
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
     * This allows an administrator to update account data for a registered user.
     * `@method`
     * `@name Person#updatePersonByAdmin`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {string} userId (required)` The child property of `Parameters`.The user identifier.
     ** `@property {any} body ` Request body.
     */
    updatePersonByAdmin(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/{userId}';
        let requestUrl = domain + path;
        let method = 'PUT';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.updatePersonByAdmin.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/{userId}' missing required parameter storeId");
        }

        requestUrl = requestUrl.replace('{userId}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            throw new Error("Request '/store/{storeId}/person/{userId}' missing required parameter userId");
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
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
     * This allows CSR / CSS to reset password for a registered user. It also allows resetting password when the CSR / CSS has established a session to act on behalf of a user.
     * `@method`
     * `@name Person#resetPasswordByAdmin`
     *
     * `@param {any} headers (optional)` will add headers to rest request
     *
     * `@param {string} url (optional)` will override the default domain used by the service. Url can be relative or absolute
     *
     * `@param {any} parameters` have following properties:
     ** `@property {string} storeId (required)` The child property of `Parameters`.The store identifier.
     ** `@property {any} body ` Request body.
     ** `@property {string} mode ` The mode in which resetPassword will be executed. ResetPassword can be executed in administrator session or in on-behalf session for a user Default value is 'resetPasswordAdmin'.
     */
    resetPasswordByAdmin(parameters: any, headers ? : any, url ? : string): Observable < HttpResponse < any >> {
        let useMocks = false;
        //Set domain based on profile.
        if (url && url === 'mocks') {
            url = undefined;
            useMocks = true;
        }
        let domain = url || this.getRequestUrl();
        let path = '/store/{storeId}/person/updateMemberPassword';
        let requestUrl = domain + path;
        let method = 'POST';
        if (this.getStorefrontUtils().useMocks || useMocks) {
            method = 'GET';
            let testGroup = '';
            if (typeof(__karma__) !== 'undefined') {
                testGroup = __karma__.config.testGroup;
            }
            let fileNameSeparator = testGroup === "" ? "" : ".";
            requestUrl = 'mocks/commerce/transaction' + path + fileNameSeparator + testGroup + '.resetPasswordByAdmin.mocks.json';
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
            throw new Error("Request '/store/{storeId}/person/updateMemberPassword' missing required parameter storeId");
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['mode'] !== undefined) {
            queryParameters = serviceUtils.setQueryParam(queryParameters, 'mode', parameters['mode']);
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