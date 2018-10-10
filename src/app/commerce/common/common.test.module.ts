/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorefrontUtilsTest } from './storefrontUtilsTest.service';
import { StorefrontUtils } from './storefrontUtils.service';
import { ConfigService } from './config.service';
import { ConfigTestService } from './configTest.service';
import { MenuService } from 'app/responsiveHeader/services/MenuService';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { EventService } from "app/commerce/services/rest/transaction/event.service";
import { BreadcrumbService } from "app/commerce/common/util/breadcrumb.service";
import { CategoryService } from "app/commerce/services/category.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { ProductViewService } from "app/commerce/services/rest/search/productView.service";
import { ProductService } from "app/commerce/services/product.service";
import { ActivePageService, WchInfoService } from 'ibm-wch-sdk-ng';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { ESpotService } from 'app/commerce/services/rest/transaction/eSpot.service';
import { CartService } from 'app/commerce/services/rest/transaction/cart.service';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';
import { CartTransactionService } from "app/commerce/services/componentTransaction/cart.transaction.service";
import { AssignedPromotionCodeService } from 'app/commerce/services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from 'app/commerce/services/rest/transaction/shippingInfo.service';
import { PaymentInstructionService } from 'app/commerce/services/rest/transaction/paymentInstruction.service';
import { CommonModule } from '@angular/common';
import { LocalStorageUtilService } from './util/localStorage.util.service';
import { PrivacyPolicyService, PrivacyPolicyTestService } from '../services/componentTransaction/privacypolicy.service';
import { ModalDialogService } from './util/modalDialog.service';
import { PersonService } from '../services/rest/transaction/person.service';
import { ModalBaseComponent } from '../components/generic/modal/modal.base.component';
import { ContractService } from '../services/rest/transaction/contract.service';
import { SearchService } from '../services/rest/search/search.service';
import { WishListService } from '../services/rest/transaction/wishList.service'
import { OrderTransactionService } from '../services/componentTransaction/order.transaction.service'
import { OrderService } from "../services/rest/transaction/order.service";
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/publish';
import { ConfigServiceService } from '../../common/configService/config-service.service';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreService } from "../services/rest/transaction/store.service"

class DummyWchInfoService {
	isPreviewMode:boolean=false;
	constructor() {}
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
  }

@NgModule( {
	declarations: [ModalBaseComponent],
	entryComponents: [ModalBaseComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
        CommonModule, // for async pipe template errors
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
	providers: [
		{ provide: ConfigService, useClass: ConfigTestService },
		{ provide: StorefrontUtils, useClass: StorefrontUtilsTest },
		ActivePageService,
		AssignedPromotionCodeService,
		AuthenticationTransactionService,
		BreadcrumbService,
		CartService,
		CartTransactionService,
		CategoryService,
		CategoryViewService,
		ContractService,
		DigitalAnalyticsService,
		ESpotService,
		EventService,
		LocalStorageUtilService,
		LoginIdentityService,
		MenuService,
		ModalDialogService,
		OrderTransactionService,
		OrderService,
		PaymentInstructionService,
		PersonService,
		PrivacyPolicyService,
		ProductService,
		ProductViewService,
		RecommendationService,
		SearchService,
		ShippingInfoService,
		StoreConfigurationsCache,
		StoreService,
		TranslateService,
		WishListService,
		ConfigServiceService,
		{ provide: WchInfoService, useClass: DummyWchInfoService }
	]
} )
export class CommonTestModule {}
