/*******************************************************************************
 * checkout.dynamic.module.ts
 *
 * Copyright IBM Corp. 2018
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';
import {CheckoutAddressDynamicComponent} from './checkout-address/checkout-address.dynamic.component';
import {ShipPaymentDynamicComponent} from './ship-payment/ship-payment.dynamic.component';
import {CheckoutDynamicComponent} from './checkout.dynamic.component';
import {GenericCommerceLayoutModule} from '../../components/generic/generic-commerce.layout.module';
import { CheckoutStoreLocatorDynamicComponent } from './checkout-store-locator/checkout-store-locator.dynamic.component';
import { DynamicStoreLocatorModule } from 'app/commerce/dynamic/store-locator/store-locator.dynamic.module';

@NgModule({
  declarations: [
    CheckoutAddressDynamicComponent,
    ShipPaymentDynamicComponent,
    CheckoutStoreLocatorDynamicComponent,
    CheckoutDynamicComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DynamicComponentLoaderModule.forChild(CheckoutDynamicComponent),
    CommerceDirectivesModule,
    GenericCommerceLayoutModule,
    DynamicStoreLocatorModule
  ],
  entryComponents: [
    CheckoutAddressDynamicComponent,
    ShipPaymentDynamicComponent,
    CheckoutStoreLocatorDynamicComponent,
    CheckoutDynamicComponent
  ]
})
export class CheckoutDynamicModule {}
