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
 *******************************************************************************/
import {
    Component,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {RenderingContext} from 'ibm-wch-sdk-ng';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import {Observable} from 'rxjs/Observable';
import {
    NavigationEnd, NavigationStart,
    Router
} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Location, PlatformLocation} from '@angular/common';
import {CommerceEnvironment} from './commerce/commerce.environment';
import {environment} from '../environments/environment';
import {Subscription} from 'rxjs/Subscription';
import {StorefrontUtils} from './commerce/common/storefrontUtils.service';
import {Constants} from './Constants';
import {AuthenticationTransactionService} from './commerce/services/componentTransaction/authentication.transaction.service';

const isNil = require('lodash/isNil');

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app',
    styleUrls: ['app.scss'],
    templateUrl: './app.component.html'

})
export class AppComponent {
    @Output() onRenderingContext: Observable<RenderingContext>;
    rcontextSub: Subscription;
    soloMode = false;
    readonly LANDING_PAGE_KIND = 'landing-page';


    constructor(private router: Router,
        private translate: TranslateService,
        private storeUtils: StorefrontUtils,
        private authService: AuthenticationTransactionService,
        private aLocation: Location,
        private platformLocation: PlatformLocation) {
        console.info(`Build date: ${environment.version}`);
        console.info(`SDK version: ${environment.sdkVersion}`);
        if (!this.storeUtils.secureCheckoutDisabled ) {
            this.router.events
            .filter((evt) => {
                if (evt instanceof NavigationStart){
                    // verify base href against url. Secure base href shall match secure url
                    const baseHref: string =  platformLocation.getBaseHrefFromDOM();
                    const isSecureBaseHref = baseHref.endsWith(Constants.SECURE_BASE_HREF_PART + '/');
                    return isSecureBaseHref !== this.isSecureUrl(evt.url);
                }
                else {
                    return false;
                }
            })
            .subscribe(
                (event: NavigationStart) => {
                    if (this.isSecureUrl(event.url) ){
                        this.storeUtils.locationReplace =
                            window.location.protocol +
                            '//' + window.location.host + this.aLocation.prepareExternalUrl(Constants.SECURE_BASE_HREF_PART + event.url);
                    }
                    else {
                        let locationReplace =
                            window.location.protocol +
                            '//' + window.location.host + this.aLocation.prepareExternalUrl(event.url);
                        if (Constants.SECURE_BASE_HREF_PART !== ''){
                            this.storeUtils.locationReplace =
                                locationReplace.replace(
                                    Constants.SECURE_BASE_HREF_PART,
                                    '');
                        }
                        else {
                            this.storeUtils.locationReplace = locationReplace;
                        }
                    }
                }
            );
        }
    }

    onActivate(aEvent: any) {
        this.initDefaultLang();
        const onRenderingContext = aEvent.onRenderingContext;
        if (!isNil(onRenderingContext)) {
            this.onRenderingContext = onRenderingContext;
        }

        // Used to exclude header and footer in landing page
        if (!(onRenderingContext == null)) {
            this.onRenderingContext = onRenderingContext;
            this.soloMode = false;
            this.rcontextSub = this.onRenderingContext
            .filter((rContext: any) => {
                return (rContext && rContext.kind) ? rContext.kind.indexOf(
                    this.LANDING_PAGE_KIND) > -1 : false;
            })
            .subscribe((isLandingPage) => {
                this.soloMode = isLandingPage;
            });
        }

        this.router.events
        .filter((evt) => evt instanceof NavigationEnd)
        .subscribe((evt: NavigationEnd) => {
                window.scrollTo(0, 0);
            }
        );
    }

    private initDefaultLang() {
        this.translate.setDefaultLang(CommerceEnvironment.defaultLang);
        this.translate.use(CommerceEnvironment.defaultLang);

        // once IDC REST API has been propagated, use code-block below
        /*
        this.cfg.getStoreData().subscribe((r)=>{
            let lang = CommerceEnvironment.languageMap[r.defaultLanguageId];
            this.translate.setDefaultLang(lang);
            this.translate.use(lang);
        });
        */
    }

    private isSecureUrl(url: string): boolean {
        return Constants.SECURE_PATHS.some(p => {
            return url.startsWith(p);
        });
    }
}
