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

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryComponent } from 'app/commerce/components/generic/category/category.component';
import { CategoryRecommendationListComponent } from './category-recommendation-list/category-recommendation-list.component';
import { ChildPimCategoriesComponent } from 'app/commerce/components/generic/child-pim-categories/child-pim-categories.component';
import { OrderTotalComponent } from './order-total/order-total.component';
import { OrderPromotionComponent } from './order-promotion/order-promotion.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { CartAddressComponent } from './order-address/cart/cart-address.component';
import { OrderAddressComponent } from './order-address/order-address.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';
import { CommerceMessageComponent } from './commerce-message/commerce-message.component';
import { ProductDetailLayoutComponent } from './product-detail/productDetailLayout';
import { CuratedCategoryListComponent } from 'app/commerce/components/generic/curated-category-list/curated-category-list.component';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { ProductComponent } from './product/product.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		TranslateModule,
		CommerceDirectivesModule,
		CommercePipesModule
	],
	declarations: [
		CartAddressComponent,
		CategoryComponent,
		CategoryRecommendationListComponent,
		ChildPimCategoriesComponent,
		CuratedCategoryListComponent,
		OrderAddressComponent,
		OrderItemsComponent,
		OrderPromotionComponent,
		OrderTotalComponent,
		ProductComponent,
		ProductGridComponent,
		CommerceMessageComponent,
		ProductDetailLayoutComponent
	],
	exports: [
		CartAddressComponent,
		CategoryComponent,
		CategoryRecommendationListComponent,
		ChildPimCategoriesComponent,
		CuratedCategoryListComponent,
		OrderAddressComponent,
		OrderItemsComponent,
		OrderPromotionComponent,
		OrderTotalComponent,
		ProductComponent,
		ProductDetailLayoutComponent,
		ProductGridComponent,
		CommerceMessageComponent
	]
})
export class GenericCommerceLayoutModule {
}
