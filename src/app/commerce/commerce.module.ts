/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AccountTransactionService } from "./services/componentTransaction/account.transaction.service";
import { AuthenticationTransactionService } from "./services/componentTransaction/authentication.transaction.service";
import { CartTransactionService } from "./services/componentTransaction/cart.transaction.service";
import { OrderTransactionService } from "./services/componentTransaction/order.transaction.service";
import { ProductListingTransactionService } from './services/componentTransaction/productlist.service';
import { ProductListingInfiniteTransactionService } from './services/componentTransaction/productlist-infinite.service';

import { CategoryService } from './services/category.service';
import { CommerceService } from './services/commerce.service';
import { DigitalAnalyticsService } from './services/digitalAnalytics.service';
import { ProductService } from './services/product.service';
import { RecommendationService } from './services/recommendation.service';

import { FilterService } from "./util/FilterService";

import { RestModule } from "./services/rest/rest.module";

@NgModule( {
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RestModule,
		RouterModule,
		TranslateModule
	],
	declarations: [
	],
	providers: [
		AccountTransactionService,
		CartTransactionService,
		CategoryService,
		CommerceService,
		DigitalAnalyticsService,
		FilterService,
		OrderTransactionService,
		ProductListingTransactionService,
		ProductListingInfiniteTransactionService,
		ProductService,
		RecommendationService,
		DatePipe
	],
	exports: [
	]
} )
export class CommerceModule {}
