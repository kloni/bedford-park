
/*******************************************************************************
 * Copyright IBM Corp. 2017, 2018
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Logger } from 'angular2-logger/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { StorefrontUtils } from '../../../../commerce/common/storefrontUtils.service';
import { CurrentUser } from '../../../common/util/currentUser';
import { Constants } from '../../../../Constants';
import { query } from '@angular/animations';
import { HttpParamsSpecialEncoder } from '../../../common/util/http-params-special.encoder';

declare var __karma__: any;

@Injectable()
export class TransactionService {
    private static serviceCounter = 0;

    constructor( private http: HttpClient, private storefrontUtils: StorefrontUtils, private logger: Logger ) { }

    protected handleError( error: HttpErrorResponse, requestOptions: any ): Observable<HttpResponse<any>> {
        if ( this.logger.level < 4 ) {
            this.logger.info( this.constructor.name + ' handleError: ' + error.message );
        }
        this.logger.debug( this.constructor.name + ' handleError: ' + JSON.stringify( error ) + ' request options: ' + JSON.stringify( requestOptions ) );
        return Observable.throw( error );
    }

  protected invokeService(options: any ): Observable<HttpResponse<any>> {
        // handle generic user in listed services that require valid user (guest or registered)
        const storePath = `/store/${this.storefrontUtils.commerceStoreId}`;
        const serviceName: string = options.url.split(this.getRequestUrl() + storePath).pop().split('/').slice(1, 2).pop();
        const reqServiceList: string[] = this.storefrontUtils.restRequiringUser;
        const GDPR = this.storefrontUtils.getGDPRConsentOption();
        if ( reqServiceList.indexOf(serviceName) > -1 ) {
            if ( StorefrontUtils.getCurrentUser() === null ) {
                //url for guest user identity
                let url = this.getRequestUrl() + storePath + '/guestidentity';
                let method = 'POST';
                if (this.getStorefrontUtils().useMocks) {
                    method = 'GET';
                    let testGroup = '';
                    if (typeof(__karma__) !== 'undefined') {
                        testGroup = __karma__.config.testGroup;
                    }
                    const fileNameSeparator = testGroup === '' ? '' : '.';
                    url = 'base/dist/assets/mocks/commerce/transaction' + storePath + fileNameSeparator + testGroup + '.login.mocks.json';
                }
                const opts: any = {
                  withCredentials: true,
                  observe: 'response'
                };

                if (GDPR != null) {
                  opts.body = GDPR;
                }
                // Guest user login
                return this.http.request<any>( method, url, opts ).flatMap(
                    (res: any) => {
                        if (res.body) {
                            this.logger.info( this.constructor.name + ' guestLogin: %o', res );
                            const user: CurrentUser = res.body;
                            user.isGuest = true;
                            StorefrontUtils.saveCurrentUser(user);
                            return this.invokeService( options );
                        }
                    }
                );
            }
        }

        // Preview token
        if (window.location.search.includes('?x-ibm-x-preview=true&WCPreviewToken=')) {
            let Urlparams = window.location.search;
            let token = Urlparams.replace("?x-ibm-x-preview=true&WCPreviewToken=", "");
            sessionStorage.setItem('WCPreviewToken', token);
        }

        if (sessionStorage.getItem('WCPreviewToken')) {
            options.headers = options.headers.set('WCPreviewToken', sessionStorage.getItem('WCPreviewToken'));
        }

        let personalizationId: string = StorefrontUtils.getCurrentPId();
        const currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
        const forUser:any=StorefrontUtils.getForUser(currentUser);
        const queryParams:HttpParams = options.params;

        // Registered && Guest user
        if ( currentUser && currentUser.WCTrustedToken && currentUser.WCToken ) {
            options.headers = options.headers.set( 'WCTrustedToken', currentUser.WCTrustedToken );
            options.headers = options.headers.set( 'WCToken', currentUser.WCToken );
        } else if (!personalizationId) {
            personalizationId = this.storefrontUtils.generatePersonalizationId();
            StorefrontUtils.saveCurrentPId(personalizationId);
        }
        options.headers = options.headers.set( 'WCPersonalization', personalizationId );
        options.headers = options.headers.set( 'X-Request-ID', this.getRequestId() );
        // Preview token
        if (window.location.search.includes('?x-ibm-x-preview=true&WCPreviewToken=')) {
            let Urlparams = window.location.search;
            let token = Urlparams.replace("?x-ibm-x-preview=true&WCPreviewToken=", "");
            sessionStorage.setItem('WCPreviewToken', token);
        }
        if (sessionStorage.getItem('WCPreviewToken')) {
            options.headers = options.headers.set('WCPreviewToken', sessionStorage.getItem('WCPreviewToken'));
        }

        if (GDPR != null && GDPR[Constants.MARKETING_TRACKING_CONSENT] !== undefined) {
          options.headers = options.headers.set(Constants.HEADER_WC_MARKETINGTRACKINGCONSENTS, GDPR[Constants.MARKETING_TRACKING_CONSENT] );
        }
        this.logger.debug( this.constructor.name + ' invokeService: ' + JSON.stringify( options ) );

        // set for-user query-parameter if CSR is in impersonation-mode
        if (!!forUser && !queryParams.has('forUser') && !queryParams.has('forUserId')) {
            // assert(currentUser.isCSR);
            let properParams:HttpParams = new HttpParams({encoder: new HttpParamsSpecialEncoder()});
            properParams = properParams.set("forUserId",forUser.userId);
            queryParams.keys().forEach((k)=>{
              properParams = properParams.set(k,queryParams.get(k));
            });
            options.params = properParams;
        }

        const httpJSONResponsePromise = this.http.request<any>( options.method, options.url, {
            body: options.body,
            headers: options.headers,
            params: options.params,
            observe: 'response',
            withCredentials: true
        });

        // Use this when REST returns status code 200 with empty body
        // If returned as JSON, Angular HTTP will throw error
        const httpTextResponsePromise = this.http.request<any>( options.method, options.url, {
            body: options.body,
            headers: options.headers,
            params: options.params,
            observe: 'response',
            responseType: 'text' as 'json',
            withCredentials: true
        });

        const promise = options.responseType === 'text' ? httpTextResponsePromise : httpJSONResponsePromise;
        return promise.catch(( res: HttpErrorResponse ) => this.handleError( res, options ) );
    }

    protected getRequestUrl() {
        return this.storefrontUtils.getTransactionUrl();
    }

    private getRequestId(): string {
        return this.constructor.name + '_' + this.storefrontUtils.sessionId + '_' + ( TransactionService.serviceCounter++ );
    }

    protected getStorefrontUtils(): StorefrontUtils {
        return this.storefrontUtils;
    }
}
