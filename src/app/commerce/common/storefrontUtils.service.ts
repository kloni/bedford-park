/*******************************************************************************
 * storefrontUtils.service.ts
 *
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

import {Injectable, Injector} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Http} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';
import {CurrentUser} from './util/currentUser';
import {Constants} from 'app/Constants';
import {Link, WchInfoService} from 'ibm-wch-sdk-ng';
import {Router, NavigationEnd} from '@angular/router';
import {CommerceEnvironment} from 'app/commerce/commerce.environment';
import {LocalStorageUtilService} from './util/localStorage.util.service';
import * as SSCache from 'session-storage-cache';
import {environment} from 'app/environment/environment';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {ConfigServiceService} from '../../common/configService/config-service.service'

@Injectable()
export class StorefrontUtils {
    private commerceTransactionHostPort: string;
    private commerceTransactionContextPath: string;
    private commerceSearchHostPort: string;
    private commerceSearchContextPath: string;
    public digitalAnalyticsConfig: any;
    private _jsonStoreName: string;
    private _jsonUseMocks: string;
    private _jsonSecureCheckoutDisabled: boolean;
    private _restRequiringUser: string[];
    private _actionableRestService: string[];
    private _cacheConfig: any[];
    private authGuardUrls: string[];
    private commerceConfig: any;
    private siteConfig: any;
    private jsonStoreId: string;
    private jsonCatlgId: string;
    private jsonDefLang: string;
    private jsonDefCurr: string;
    private wchStoreId: string;
    private wchCatlgId: string;
    private wchDefLang: string = CommerceEnvironment.defaultLang;
    private wchDefCurr: string;
    private wchUseMocks: string;
    private wchStoreName: string;
    private router;
    private configService: ConfigService;
    private translate: TranslateService;
    private localStorageUtil: LocalStorageUtilService;
    private pageNameMap: Map<String, any>;
    private pageUrlMap: Map<String, any>;
    private http: Http;
    private wchInfoSvc: WchInfoService;
    private keywordRedirectmap: Map<string, string>;
    private configServiceService: ConfigServiceService;
    private keywordSubject: Subject<Map<string, string>> = new ReplaySubject<Map<string, string>>();
    private keywordObservable: Observable<Map<string, string>> = this.keywordSubject.asObservable();
    private wchSecureCheckoutDisabled: boolean;
    private _locationReplaceUrl: string;

    public readonly sessionId: number;
    errorMessage: string;
    currentUrl: string;
    previousUrl: string;
    csrSubject: Subject<any> = new BehaviorSubject(null);
    csrObservable: Observable<any> = this.csrSubject.asObservable();
    public static counter: number = 0;

    set commerceStoreId(v: string) {}

    get commerceStoreId(): string {
        return this.jsonStoreId || this.wchStoreId;
    }

    set commerceCatalogId(v: string) {}

    get commerceCatalogId(): string {
        return this.jsonCatlgId || this.wchCatlgId;
    }

    get commerceLanguage(): string {
        return this.jsonDefLang || this.wchDefLang;
    };

    set commerceLanguage(v: string) {}

    get commerceCurrency(): string {
        return this.jsonDefCurr || this.wchDefCurr;
    }

    set commerceCurrency(v: string) {}

    set useMocks(v: string) {}

    get useMocks(): string { return this._jsonUseMocks || this.wchUseMocks; }

    set restRequiringUser(v: string[]) {}

    get restRequiringUser(): string[] { return this._restRequiringUser; }

    set actionableRestService(v: string[]) {}

    get actionableRestService(): string[] { return this._actionableRestService; }

    set cacheConfig(v: any[]) {}

    get cacheConfig(): any[] { return this._cacheConfig; }

    set secureCheckoutDisabled(v: boolean) {}

    get secureCheckoutDisabled(): boolean {
        return !Constants.PROD_PROXY_ENABLED || this._jsonSecureCheckoutDisabled ||
            this.wchSecureCheckoutDisabled;
    }

    /**
     * locationReplaced used by secure checkout page reload.
     */
    set locationReplace(v: string){
        this._locationReplaceUrl = v;
    }

    get locationReplace(): string {
        return this._locationReplaceUrl;
    }

    constructor(
        private inj: Injector
    ) {
        this.configService = this.inj.get(ConfigService);
        this.configServiceService = this.inj.get(ConfigServiceService);
        this.translate = this.inj.get(TranslateService);
        this.sessionId = this.configService.getSessionId();
        this.localStorageUtil = this.inj.get(LocalStorageUtilService);
        this.http = this.inj.get(Http);
    }

    init(): Promise<any> {
        this.router = this.inj.get(Router);
        this.wchInfoSvc = this.inj.get(WchInfoService);
        const ps: Promise<any>[] = [];

        ps.push(
            new Promise((resolve, reject) => {
                this.configService.getServicesConfig().subscribe((services) => {
                    this._restRequiringUser = services.restRequiringUser;
                    this._actionableRestService =
                        services.actionableRestService;
                    this._cacheConfig = services.cacheConfig;
                    resolve(true);
                })
            })
        );

        ps.push(
            new Promise((resolve, reject) => {
                this.configService.getCommerceConfig().subscribe(
                    (commerceCfg) => {
                        this.commerceConfig = commerceCfg.ibmCommerce;
                        if (!!this.commerceConfig) {
                            this.wchUseMocks = this.commerceConfig.useMockTransaction || false;
                            this.wchSecureCheckoutDisabled = this.commerceConfig.secureCheckoutDisabled === true;

                            this.configService.getSiteConfig().subscribe(
                                siteCfg => {
                                    this.siteConfig = siteCfg;
                                    this.wchStoreName = this.siteConfig.storeIdentifier;
                                    this.pageNameMap = new Map<String, any>();
                                    this.pageUrlMap = new Map<String, any>();
                                    this.siteConfig.pages.forEach((p: any) => {
                                        this.pageNameMap.set(p.name, p);
                                        this.pageUrlMap.set(p.route, p);
                                    });

                                    this.configService.getStoreData({
                                        mocks: this.wchUseMocks,
                                        hostCtx: this.getTransactionUrl(),
                                        storeName: this.wchStoreName
                                    })
                                    .then((storeCfg: any) => {
                                        this.wchStoreId = storeCfg.storeId;
                                        this.wchCatlgId = storeCfg.defaultCatalogId;
                                        this.wchDefLang = storeCfg.defaultLanguageId;
                                        this.wchDefCurr = storeCfg.defaultCurrency;
                                        resolve(true);
                                    });
                                });
                        } else {
                            reject(
                                'currenttenant.ibmCommerce attribute not found')
                        }
                    })
            })
        );

        ps.push(
            new Promise((resolve, reject) => {
                this.configService.getConfigJSON().subscribe((jsonCfg) => {
                    if (!!jsonCfg) {
                        this.commerceTransactionHostPort = jsonCfg.commerceTransactionHostPort;
                        this.commerceTransactionContextPath = jsonCfg.commerceTransactionContextPath;
                        this.commerceSearchHostPort = jsonCfg.commerceSearchHostPort;
                        this.commerceSearchContextPath = jsonCfg.commerceSearchContextPath;
                        this._jsonUseMocks = jsonCfg.useMockTransaction;
                        this._jsonStoreName = jsonCfg.commerceStoreName;
                        this._jsonSecureCheckoutDisabled = jsonCfg.secureCheckoutDisabled === true;
                        this.digitalAnalyticsConfig = jsonCfg.digitalAnalyticsConfig;

                        this.configService.getStoreData({
                            mocks: this._jsonUseMocks,
                            hostCtx: this.getTransactionUrl(),
                            storeName: this._jsonStoreName
                        })
                        .then((storeCfg: any) => {
                            this.jsonStoreId = storeCfg.storeId;
                            this.jsonCatlgId = storeCfg.defaultCatalogId;
                            this.jsonDefLang = storeCfg.defaultLanguageId;
                            this.jsonDefCurr = storeCfg.defaultCurrency;
                            resolve(true);
                        });
                    } else {
                        resolve(true);
                    }
                })
            })
        );

        this.currentUrl = this.router.url;
        this.router.events
        .filter(evt => evt instanceof NavigationEnd)
        .subscribe((event: NavigationEnd) => {
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;
        });

        return Promise.all(ps).catch((e) => {
            console.error('StorefrontUtils initialization failed: ', e);
        });
    }

    public getPreviousUrl() {
        return this.previousUrl;
    }

    public getPreviousPageLink() {
        // for example: url is "/product?partNumber=123", pageLink is "/product"
        return this.previousUrl.substring(0, this.previousUrl.indexOf('?'));
    }

    public static getUTCDate(dateString): Date {
        const dArray = dateString.replace(/[TZ:\.+]/g, '-').split('-');
        return new Date(Date.UTC(
            Number(dArray[0]),
            Number(dArray[1]) - 1,
            Number(dArray[2]),
            Number(dArray[3]),
            Number(dArray[4]),
            Number(dArray[5]),
            Number(dArray[6])
        ));
    }

    /**
     *
     */
    public static getCurrentUser(): CurrentUser {
        const currentUserCache = sessionStorage.getItem('currentUser');
        let currentUser: CurrentUser = null;
        if (!!currentUserCache) {
            currentUser = JSON.parse(atob(currentUserCache));
        }
        return currentUser;
    }

    /**
     *
     * @param user
     */
    public static saveCurrentUser(user: CurrentUser) {
        if (!!user) {
            const cUser = StorefrontUtils.getCurrentUser();
            if ((user.isGoingToCheckout == null || user.isGoingToCheckout ===
                undefined) && cUser && cUser.isGoingToCheckout) {
                user.isGoingToCheckout = cUser.isGoingToCheckout;
            }
            this.saveCurrentPId(user.personalizationID);
            sessionStorage.setItem('currentUser', btoa(JSON.stringify(user)));
        }
    }

    public static setForUser(user: CurrentUser, forUserObj: any) {
        const u: CurrentUser = !!user ? user : this.getCurrentUser();
        u.forUser = JSON.parse(JSON.stringify(forUserObj));
        this.saveCurrentUser(u);
    }

    public static wipeForUser(user: CurrentUser) {
        const u: CurrentUser = !!user ? user : this.getCurrentUser();
        u.forUser = null;
        this.saveCurrentUser(u);
    }

    public static getForUser(user: CurrentUser): any {
        const u: CurrentUser = !!user ? user : this.getCurrentUser();
        return !!u ? u.forUser : null;
    }

    public informCSRChange(trigger: string) {
        this.csrSubject.next(trigger);
    }

    public getCSRObservable() {
        return this.csrObservable;
    }

    /**
     * @param user cached object to use for check
     * @return true if guest-user or acting-as a guest user (CSR)
     */
    public static isGuestOrActingAs(user?:CurrentUser):boolean {
      const u:CurrentUser=user||StorefrontUtils.getCurrentUser();
      return StorefrontUtils.isRealGuest(u)||(u.isCSR&&!!u.forUser&&!u.forUser.userName);
    }

    /**
     * @param user cached object to use for check
     * @return true only if real guest-user (not a CSR acting-as one)
     */
    public static isRealGuest(user?:CurrentUser):boolean {
      const u:CurrentUser=user||StorefrontUtils.getCurrentUser();
      return null==u||u.isGuest;
    }

    /**
     *
     */
    public static removeCurrentUser() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserCurrency');
    }

    public static getCurrentPId(): string {
        const u: CurrentUser = this.getCurrentUser();
        if (!!u && u.isCSR && !!u.forUser) {
            return u.forUser.personalizationId;
        } else {
            let currentPIdCache = localStorage.getItem('personalizationID');
            let currentPId: string = null;
            if (!!currentPIdCache) {
                currentPId = currentPIdCache;
            }
            return currentPId;
        }
    }

    public static saveCurrentPId(personalizationID: string): void {
        if (!!personalizationID) {
            localStorage.setItem('personalizationID', personalizationID);
        }
    }

    /**
     * Return converted number with currency symbol
     * Plus operator convert string into number
     */
    public static getNumberWithCurrencySymbol(number: string,
        currencyCode: string, locale?: string) {
        return (+number).toLocaleString(locale,
            {style: 'currency', currency: currencyCode});
    }

    /**
     * Gets user GDPR consent from user's context attributes.
     * @param {any[]} contextAttributes
     * @returns {any} an object contains GDPR consent info
     */
    public getGDPRConsentsFromUserContext(contextAttributes: any[]): any {
        const GDPRFromResponse = {};
        contextAttributes.forEach((v: any) => {
            if (Constants.GDPR_CONTEXT_ATTRIBUTES.indexOf(v.attributeName) >
                -1) {
                GDPRFromResponse[v.attributeName] =
                    (<any[]>v.attributeValue).filter((a) => {
                        return a.storeId === this.commerceStoreId;
                    })[0].value[0];
            }
        });
        return GDPRFromResponse;
    }

    /**
     * Replaces {i} param in a string with string specified in substituteMap
     * @param origString the original string that contains {i} to be substitute
     * @param substituteMap a map containing strings to substitute into original string
     *
     * Example usage: substituteStringWithMap("hi {0}, this is {1}!", "jack", "Jill") will return
     * "hi Jack, this is Jill!"
     */

    substituteString(origString: string, substituteMap: any) {
        return origString.replace(/\{([0-9])\}/g, function (match, key) {
            return substituteMap[key];
        });
    }

    /**
     * Takes HttpErrorResponse return from server and return error mesaage string
     * First check whether error key is present in error JSON file if found then return message from the file
     * else return error message from HttpErrorResponse object
     * @param error the HttpErrorResponse from server
     * @param fallback a fallback string
     */

    handleErrorCase(r: HttpErrorResponse, fallback: string,
        output?: any[]): string {
        const lang = this.translate.getBrowserLang();
        const errorJSON = require('../../common/locales/error.' + lang +
            '.json')
        const errorObj = errorJSON['error-message'];
        let errorKey;
        let errorCode;
        let errorParameters;

        if (r.error && r.error.errors) {
            const a = r.error.errors;
            errorKey = a[0].errorKey;
            errorCode = a[0].errorCode;
            errorParameters = a[0].errorParameters;
            if (typeof errorParameters == 'string') {
                errorParameters = errorParameters.split(',');
            }
        }

        if (errorCode) {
            if (!!output) {
                output.push(errorCode)
            }
            errorKey = errorKey + '.' + errorCode;
        }

        if (!!errorKey && errorObj.hasOwnProperty(errorKey)) {
            this.displayStoreErrorMessage(errorKey, errorObj, errorParameters);
        } else {
            this.displayServerErrorMessage(r, fallback);
        }
        return this.errorMessage;
    }

    displayStoreErrorMessage(errorKey, errorObj, errorParameters) {
        if (errorParameters) {
            this.errorMessage =
                this.substituteString(errorObj[errorKey], errorParameters);
        } else {
            this.errorMessage = errorObj[errorKey];
        }
    }

    displayServerErrorMessage(error: any, fallback) {
        const eBody = error.error;
        this.errorMessage = eBody && eBody.errors && eBody.errors.length &&
        eBody.errors[0].errorMessage ? eBody.errors[0].errorMessage : fallback;
    }

    getPageLink(pageIdentifier: string): string {
        const page = this.pageNameMap.get(pageIdentifier);
        return !!page ? page.route : '/' + pageIdentifier;
    }

    getPageIdentifier(url: string): string {
        const page = this.pageUrlMap.get(url);
        return !!page ? page.name : null;
    }

    getPageSeoUrl(items: any[], prefix: string, escapeItem: boolean,
        itemPrefix?: string): Promise<any> {
        let url: string;
        if (this.useMocks) {
            url = 'mocks/commerce/search/store/' + this.commerceStoreId +
                '/sitecontent/pageSeoUrl.mocks.json';
        } else {
            const modItems: any[] = items.map(
                item => (!!itemPrefix ? itemPrefix : '') +
                    (escapeItem ? this.escape(item) : item));
            const queryText = modItems.join(' OR ');
            const q: any = {
                q: prefix + '(' + queryText + ')',
                fl: ['id', 'path'],
                rows: 200
            }
            url = environment.apiUrl + '/delivery/v1/search?' + this.q2s(q);
        }
        return this.http.get(url).toPromise()
        .then(url => {
            const urlBody = JSON.parse(url['_body']).documents;
            if (urlBody) {
                return urlBody.reduce(function (map, obj) {
                    map[obj.id] = decodeURI(obj.path);
                    return map;
                }, {});
            } else {
                return {};
            }
        });
    }

    getPageSeoUrlByPageKinds(kinds: any[],
        hideFromNavigation: boolean): Promise<any> {
        return this.getPageSeoUrl(kinds, 'hideFromNavigation:(false) AND kind:',
            true);
    }

    getPageSeoUrlByIds(ids: any[], type: string): Promise<any> {
        return this.getPageSeoUrl(ids, 'id:', true, 'idc-' + type + '-');
    }

    getPageSeoUrlByIdsWithFixedTypes(ids: any[]): Promise<any> {
        return this.getPageSeoUrl(ids, 'id:', false);
    }

    getSeoUrlMapForProducts(products: any[], idKey ?: string): Promise<any> {
        const ids = this.generateSeoUrlIdsForProducts(products, idKey);
        if (ids.length === 0) {
            return Promise.resolve({});
        } else {
            return this.getPageSeoUrlByIdsWithFixedTypes(ids);
        }
    }

    generateSeoUrlIdsForProducts(products: any[], idKey?: string): string[] {
        if (!idKey) {
            idKey = 'partNumber';
        }
        return products.map(product => {
            // also handle the sku case, using 'parentCatalogEntryTypeCode' from shopping cart.
            if (product.catalogEntryTypeCode === 'ProductBean' ||
                product['parentCatalogEntryTypeCode'] === 'ProductBean') {
                return this.generateSeoUrlId(product[idKey], 'product');
            } else if (product.catalogEntryTypeCode === 'BundleBean' ||
                product['parentCatalogEntryTypeCode'] === 'BundleBean') {
                return this.generateSeoUrlId(product[idKey], 'bundle');
            } else if (product.catalogEntryTypeCode === 'PackageBean' ||
                product['parentCatalogEntryTypeCode'] === 'PackageBean') {
                return this.generateSeoUrlId(product[idKey], 'kit');
            } else {
                return '';
            }
        }).filter(id => {
            return id !== '';
        });
    }

    generateSeoUrlId(id: any, type: string): string {
        return 'idc-' + type + '-' + this.escape(id);
    }

    /**
     * Get the auth guard urls according page name
     */
    getAuthGuardUrls(): string[] {
        if (!this.authGuardUrls) {
            const urls: string[] = [];
            let p: any;
            Constants.authGuardPages.forEach((g: string) => {
                p = this.pageNameMap.get(g);
                if (!!p) {
                    urls.push(p.route);
                }
            })
            this.authGuardUrls = urls;
        }
        return this.authGuardUrls;
    }

    private isLocahostOrPreview(): boolean {
        return (this.configService.isLocalSPA() ||
            this.isPreview());
    }

    isPreview(): boolean {
        return this.wchInfoSvc.isPreviewMode;
    }

    private getJsonUrl(hostPort: string, ctxPath: string): string {
        return (!!hostPort && !!ctxPath)
            ? `https://${hostPort}${ctxPath}`
            // to support localhost dev proxy
            : !!ctxPath ? ctxPath
            : null;
    }

    private getWchProvidedUrl(domainAttr: string, ctxPath: string): string {
        if (Constants.PROD_PROXY_ENABLED) {
            return ctxPath;
        }
        const dc: any = this.commerceConfig;
        let rc: string;
        if (dc) {
            rc = dc[domainAttr];
            if (rc) {
                if (rc.endsWith('/')) {
                    rc += ctxPath.substr(1);
                } else {
                    rc += ctxPath;
                }
            }
        }
        return rc;
    }

    private getTransactionLiveUrl(): string {
        return this.getWchProvidedUrl('liveTransactionHost',
            CommerceEnvironment.defaultContextPaths.transaction);
    }

    private getTransactionPreviewUrl(): string {
        return this.getWchProvidedUrl('previewTransactionHost',
            CommerceEnvironment.previewContextPaths.transaction);
    }

    private getSearchLiveUrl(): string {
        return this.getWchProvidedUrl('liveSearchHost',
            CommerceEnvironment.defaultContextPaths.search);
    }

    private getSearchPreviewUrl(): string {
        return this.getWchProvidedUrl('previewSearchHost',
            CommerceEnvironment.previewContextPaths.search);
    }

    /**
     * Fetches IDC URL
     * * fetches preview URL if in-preview
     * * secondary is production URL if preview URL comes back empty
     * * fallback is URL from JSON
     *
     * Eventually (once all services are functional):
     * * preview will not have fallback
     * * production will not have fallback
     * * in non-production environments, URL from JSON will be used as override if available
     */
    getTransactionUrl(): string {
        let rc: string;
        if (this.isLocahostOrPreview()) {
            rc = this.getTransactionPreviewUrl();
        }
        return this.getJsonUrl(this.commerceTransactionHostPort, this.commerceTransactionContextPath) ||
            rc ||
            this.getTransactionLiveUrl();
    }

    /**
     * Fetches SOLR URL:
     * * fetches preview URL if in-preview
     * * secondary is production URL if preview URL comes back empty
     * * fallback is URL from JSON
     *
     * Eventually (once all services are functional):
     * * preview will not have fallback
     * * production will not have fallback
     * * in non-production environments, URL from JSON will be used as override if available
     */
    getSearchUrl(): string {
        let rc: string;
        if (this.isLocahostOrPreview()) {
            rc = this.getSearchPreviewUrl();
        }
        return this.getJsonUrl(this.commerceSearchHostPort, this.commerceSearchContextPath) ||
            rc ||
            this.getSearchLiveUrl();
    }

    /**
     * Routes the page to the URL:
     * * if a url is not a full url (not an external url), will navigate to a page within the app
     * *  example of external URLs: http://somedomain.com, https://somedomain.com , somedomain.com
     */
    navigateToLink(callToActionLink: Link, router: Router) {
        if (callToActionLink != undefined) {
            if (callToActionLink.linkURL != undefined) {
                let actionLink = callToActionLink.linkURL;
                if (actionLink.search(/\./gi) != -1) {
                    if (actionLink.search(/http/gi) == -1) {
                        actionLink = 'http://' + actionLink;
                    }
                    //navigate to external url
                    return window.location.href = actionLink;
                } else {
                    return router.navigate([callToActionLink.linkURL]);
                }
            }
        }
    }

    /**
     * Route to a pre-defined 404 page
     */
    gotoNotFound() {
        this.router.navigate([Constants.PAGE_NOT_FOUND_PATH],
            {skipLocationChange: true});
    }

    /**
     * Route to a pre-defined 404 page and wipe trace of original
     */
    gotoNotFoundReplace() {
        this.router.navigate([Constants.PAGE_NOT_FOUND_PATH],
            {replaceUrl: true});
    }

    /**
     * Determine if current url is same as path identified by input pathIdentifier
     * @param pageLink url
     */
    onSamePage(pageLink: string): boolean {
        const re = new RegExp(`^${pageLink}\\b`);
        return this.router.url.search(re) !== -1;
    }

    public static getCounter(): number {
        return this.counter++;
    }

    generatePersonalizationId(): string {
        const dateInMillis: number = Date.now();
        const personalizationId: string = dateInMillis + '-' + StorefrontUtils.getCounter();
        return personalizationId;
    }

    /**
     * Get key for saving GDPR preference into storage.
     * @returns {string}
     */
    getGDPRConsentOptionStorageKey(): string {
        return 'GDPR-' + this.commerceStoreId;
    }

    /**
     * Get GDPR preference from storage
     * @returns {any}
     */
    getGDPRConsentOption(): any {
        let GDPRString = SSCache.get(this.getGDPRConsentOptionStorageKey());
        if (GDPRString == null) {
            this.localStorageUtil.invalidateIfExpired(this.getGDPRConsentOptionStorageKey());
            GDPRString = this.localStorageUtil.get(this.getGDPRConsentOptionStorageKey());
        }
        if (GDPRString !== null) {return JSON.parse(GDPRString)}
        ;
        return null;
    }

    /**
     * Extract property from breadcrumb object in IDC context
     * @param breadcrumbObject
     * @return {string}
     */
    getPropertyFromIdcContext(breadcrumbObject: any, property: string): string {
        return breadcrumbObject.externalContext ? breadcrumbObject.externalContext[property] : '';
    }

    public getContractId(): string {
        const contractIdCache = SSCache.get('contractId');
        let contractId = '';
        if (!!contractIdCache) {
            contractId = contractIdCache;
        }
        return contractId;
    }

    public setContractId(contractId: string) {
        SSCache.set('contractId', contractId);
    }

    escape(s: string): string {
        return s.replace(/[-[\]{}()+\-*"&!~?:\\^|]/g, '\\$&');
    }

    q2s(q: any): string {
        return `q=${encodeURIComponent(q.q)}&rows=${q.rows}&fl=id&fl=path`;
    }

    public getKeywordRedirectMap(): Observable<Map<string, string>> {
        if (!this.keywordRedirectmap) {
            this.keywordRedirectmap = new Map<string, string>();
            const observable: any = this.configServiceService.getConfig('KeywordRedirectContent');
            let subscription = observable.subscribe((context) => {
                const redirectElements = context.elements;
                for (let i in redirectElements.keyword.values) {
                    this.keywordRedirectmap.set(redirectElements.keyword.values[i].toLowerCase(), redirectElements.redirecturl.values[i].linkURL)
                }
                this.keywordSubject.next(this.keywordRedirectmap);
            });

            if (typeof observable.connect === 'function') {
                subscription = observable.connect();
            }
        }
        return this.keywordObservable;
    }

    static hideWishlistDropDownMenu(id: number,index?: number) {
        /** Hide dropdown menu */
        let Dropdownid = 'wishList_dropDown_'+id;
        let DownIconid = 'dropdown_down_'+id;
        let UpIconid = 'dropdown_up_'+id;

        if (index !== undefined) {
            Dropdownid = Dropdownid+'_'+index;
            DownIconid = DownIconid+'_'+index;
            UpIconid = UpIconid+'_'+index
        }

        $('#'+Dropdownid).css('display','none');
        $('#'+DownIconid).css('display','inline-block');
        $('#'+UpIconid).css('display','none');
    }

    static showWishlistDropDownMenu(id: number, index?: number) {
        /** Show dropdown menu */
        let Dropdownid = 'wishList_dropDown_'+id;
        let DownIconid = 'dropdown_down_'+id;
        let UpIconid = 'dropdown_up_'+id;

        if (index !== undefined) {
            Dropdownid = Dropdownid+'_'+index;
            DownIconid = DownIconid+'_'+index;
            UpIconid = UpIconid+'_'+index
        }

        if ($('#'+Dropdownid).css('display') === 'none') {
            $('#'+Dropdownid).css('display','block');
            $('#'+DownIconid).css('display','none');
            $('#'+UpIconid).css('display','inline-block');
        }
    }

    /**
     * Sets the redirect url for redirecting after login
     * @param url the redirect url to save
     */
    static setRedirectUrl(url: string){
        if (url === null || url === undefined){
            SSCache.remove(Constants.AUTH_REDIRECT_URL);
        }
        else {
            SSCache.set(Constants.AUTH_REDIRECT_URL, url);
        }
    }

    /**
     * Get the redirect url from SessionStorage.
     */
    static getRedirectUrl():string {
        return SSCache.get(Constants.AUTH_REDIRECT_URL)
    }
}
