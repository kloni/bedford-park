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

import { AssignedPromotionCodeService } from './transaction/assignedPromotionCode.service';
import { AssociatedPromotionCodeService } from "./transaction/associatedPromotionCode.service"
import { CartService } from "./transaction/cart.service";
import { ConfigurationService } from "./transaction/configuration.service";
import { CountryService } from "./transaction/country.service";
import { ESpotService } from "./transaction/eSpot.service";
import { EventService } from "./transaction/event.service";
import { GuestIdentityService } from "./transaction/guestIdentity.service";
import { InventoryavailabilityService } from "./transaction/inventoryavailability.service";
import { LoginIdentityService } from "./transaction/loginIdentity.service";
import { OrderService } from "./transaction/order.service";
import { PaymentInstructionService } from "./transaction/paymentInstruction.service";
import { PersonContactService } from "./transaction/personContact.service";
import { PersonService } from "./transaction/person.service";
import { ShippingInfoService } from "./transaction/shippingInfo.service";
import { StoreService } from "./transaction/store.service"
import { TransactionService } from "./transaction/transaction.service";
import { CategoryViewService } from "./search/categoryView.service";
import { ProductViewService } from "./search/productView.service";
import { ContractService } from './transaction/contract.service'
import { WishListService } from './transaction/wishList.service'

@NgModule({
    providers: [
        AssignedPromotionCodeService,
        AssociatedPromotionCodeService,
        CartService,
        CategoryViewService,
        ConfigurationService,
        ContractService,
        CountryService,
        ESpotService,
        EventService,
        GuestIdentityService,
        InventoryavailabilityService,
        LoginIdentityService,
        OrderService,
        PaymentInstructionService,
        PersonContactService,
        PersonService,
        ProductViewService,
        ShippingInfoService,
        StoreService,
        TransactionService,
        WishListService
	]
})
export class RestModule { }
