/*******************************************************************************
 * Copyright IBM Corp. 2017
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
import { LAYOUTS } from './layouts';
import { LAYOUTS as COMMERCE_LAYOUTS } from './commerce/layouts';
import { SAMPLE_MODULE } from './sample.module';
import { Injector, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient, HttpXhrBackend } from '@angular/common/http';
import { Logger, Options as LoggerOptions } from 'angular2-logger/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ErrorHandler } from '@angular/core';

import 'jquery';
import 'foundation-sites';

import { WchNgModule, PageComponent, WchLoggerFactory } from 'ibm-wch-sdk-ng';
import { WchNgEditModule } from 'ibm-wch-sdk-ng-edit';

import { ResponsiveHeaderModule } from './responsiveHeader/responsiveMenu.module';
import { AppComponent } from './app.component';
import { environment } from './environment/environment';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SiteCommonModule } from './common/site.common.module';
import { HighlightService } from './common/highlightService/highlight.service';
import { GenericLayoutModule } from './components/generic/generic.layout.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { GenericCommerceLayoutModule } from './commerce/components/generic/generic-commerce.layout.module';
import { CommerceDirectivesModule } from './commerce/directives/commerce-directives.module';

import { CommerceModule } from './commerce/commerce.module';
import { ConfigService } from './commerce/common/config.service';
import { CachingInterceptor } from './commerce/common/util/caching.interceptor';
import { HttpErrorInterceptor } from './commerce/common/util/http.error.interceptor';
import { GlobalErrorHandler } from './commerce/common/util/global.error-handler';
import { HttpSessionCache } from './commerce/common/util/http.session.cache';
import { AuthenticationTransactionService } from './commerce/services/componentTransaction/authentication.transaction.service';
import { LoggerOptions as AppLoggerOptions } from './commerce/common/logger.options';
import { StorefrontUtils } from './commerce/common/storefrontUtils.service';
import { Angular2LoggerFactory } from './commerce/common/Angular2LoggerFactory';
import { AuthGuard } from './commerce/guard/auth-guard.guard';
import { SigninPageGuard } from './commerce/guard/signin-page-guard.guard';
import { CheckoutGuard } from './commerce/guard/checkout-guard.guard';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { SessionErrorComponent } from 'app/commerce/components/generic/session-error/sessionError.component';
import { SiteContentService } from './commerce/services/rest/search/siteContent.service';
import { CommercePipesModule } from './commerce/pipes/commerce-pipes.module';
import { GenerateEventGuard } from 'app/commerce/guard/generate-event-guard.guard';
import { ModalBaseComponent } from './commerce/components/generic/modal/modal.base.component';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { PrivacyPolicyService } from './commerce/services/componentTransaction/privacypolicy.service';
import { LocalStorageUtilService } from './commerce/common/util/localStorage.util.service';
import { DynamicComponentManifest, DynamicComponentLoaderModule } from './dynamic-component-loader/dynamic-component-loader.module';
import { PaginationLayoutModule } from './commerce/components/generic/pagination/paginationLayout.module';
import { CustomerServiceGuard } from './commerce/guard/customer-service-guard.guard.';
import {SecureGuard} from './commerce/guard/secure-guard.guard';
import { DynamicStoreLocatorModule } from 'app/commerce/dynamic/store-locator/store-locator.dynamic.module';

export function ConfigInitializer( cs: ConfigService, h: HttpXhrBackend, s: StorefrontUtils, i: Injector ) {
	return () => Promise.all([cs.init(), s.init()]);
}

export function HttpLoaderFactory( http: HttpClient ) {
	return new TranslateHttpLoader( http, 'locales/' );
}

export function FalseIdempotent() { return () => false; }

const manifests: DynamicComponentManifest[] = [
	{
		componentId: 'personal-info',
		path: 'personal-info-dynamic',
		loadChildren: './commerce/dynamic/personal-info/personal-info.dynamic.module#DynamicPersonalInformationModule'
	},
	{
		componentId: 'address-book',
		path: 'address-book-dynamic',
		loadChildren: './commerce/dynamic/address-book/address-book.dynamic.module#DynamicAddressBookModule'
	},
	{
		componentId: 'sign-in',
		path: 'sign-in-dynamic',
		loadChildren: './commerce/dynamic/sign-in/sign-in-dynamic.module#DynamicSignInModule'
	},
	{
		componentId: 'registration',
		path: 'registration-dynamic',
		loadChildren: './commerce/dynamic/registration/registration.dynamic.module#DynamicRegistrationModule'
	},
	{
		componentId: 'registration-simple',
		path: 'registration-simple-dynamic',
		loadChildren: './commerce/dynamic/registration-simple/registration-simple.dynamic.module#DynamicRegistrationSimpleModule'
	},
	{
		componentId: 'order-details',
		path: 'order-details-dynamic',
		loadChildren: './commerce/dynamic/order-details/order-details.dynamic.module#DynamicOrderDetailsModule'
	},
	{
		componentId: 'order-history',
		path: 'order-history-dynamic',
		loadChildren: './commerce/dynamic/order-history/order-history.dynamic.module#DynamicOrderHistoryModule'
	},
	{
		componentId: 'checkout',
		path: 'checkout-dynamic',
		loadChildren: './commerce/dynamic/checkout/checkout.dynamic.module#CheckoutDynamicModule'
	},
	{
		componentId: 'pdp',
		path: 'pdp-dynamic',
		loadChildren: './commerce/dynamic/pdp/pdp.dynamic.module#DynamicPDPModule'
	},
	{
		componentId: 'csr',
		path: 'csr-dynamic',
		loadChildren: './commerce/dynamic/csr/csr.dynamic.module#DynamicCSRModule'
    },
    {
		componentId: 'store-locator',
		path: 'store-locator-dynamic',
		loadChildren: './commerce/dynamic/store-locator/store-locator.dynamic.module#DynamicStoreLocatorModule'
	}
];

const pageRoutes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{
		path: '**',
		component: PageComponent,
		canActivate: [
			AuthGuard,
			SigninPageGuard,
			CheckoutGuard,
			GenerateEventGuard,
			CustomerServiceGuard,
            SecureGuard
		]
	}
];

@NgModule( {
	imports: [
		AngularSvgIconModule,
		RouterModule.forRoot( pageRoutes ),
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		CommonModule,
		WchNgModule.forRoot( environment ),
		WchNgEditModule.forRoot(),
		SiteCommonModule,
		GenericLayoutModule,
		GenericCommerceLayoutModule,
		PaginationLayoutModule,
		CommerceDirectivesModule,
        CommercePipesModule,
        DynamicStoreLocatorModule,
		HttpClientModule,
		CommerceModule,
		ResponsiveHeaderModule,
		BrowserAnimationsModule,
		SAMPLE_MODULE,
		TranslateModule.forRoot( {
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		} ),
		DynamicComponentLoaderModule.forRoot(manifests)
	],
	declarations: [
		AppComponent,
		SessionErrorComponent,
		PageNotFoundComponent,
		ModalBaseComponent,
		...LAYOUTS,
		...COMMERCE_LAYOUTS
	],
	providers: [
		ConfigService,
		StorefrontUtils,
		{
			provide: APP_INITIALIZER,
			useFactory: ConfigInitializer,
			deps: [ConfigService, HttpXhrBackend, StorefrontUtils, Injector],
			multi: true
		},
		AppLoggerOptions,
		{
			provide: LoggerOptions,
			useClass: AppLoggerOptions
		},
		Logger,
		Angular2LoggerFactory,
		{
			provide: WchLoggerFactory,
			useClass: Angular2LoggerFactory
		},
		HttpSessionCache,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: CachingInterceptor,
			multi: true,
		},
		AuthenticationTransactionService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true,
		},
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		},
		{
			provide: 'CanNeverActivateGuard',
			useValue: FalseIdempotent
		},
		AuthGuard,
		SigninPageGuard,
		CheckoutGuard,
		GenerateEventGuard,
		CustomerServiceGuard,
        SecureGuard,
		HighlightService,
		BreadcrumbService,
		ModalDialogService,
		SiteContentService,
		StoreConfigurationsCache,
        PrivacyPolicyService,
        LocalStorageUtilService
	],
	entryComponents: [
		PageNotFoundComponent,
		SessionErrorComponent,
		ModalBaseComponent,
		...LAYOUTS,
		...COMMERCE_LAYOUTS
	],
	bootstrap: [AppComponent]
} )
export class AppModule { }
