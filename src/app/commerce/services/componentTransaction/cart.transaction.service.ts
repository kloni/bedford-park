/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import {CartService} from '../rest/transaction/cart.service';
import {ProductService} from '../product.service';
import {AssignedPromotionCodeService} from '../rest/transaction/assignedPromotionCode.service';
import {StorefrontUtils} from '../../../commerce/common/storefrontUtils.service';
import {AuthenticationTransactionService} from '../../../commerce/services/componentTransaction/authentication.transaction.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ShippingInfoService} from './../rest/transaction/shippingInfo.service';
import {PaymentInstructionService} from './../rest/transaction/paymentInstruction.service';
import {TranslateService} from '@ngx-translate/core';
import {CommerceEnvironment} from './../../../commerce/commerce.environment';
import {DigitalAnalyticsService} from '../digitalAnalytics.service';

@Injectable()
export class CartTransactionService {
  cartSubject: BehaviorSubject<any>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private storefrontUtils: StorefrontUtils,
    private assignedPromotionCode: AssignedPromotionCodeService,
    private authService: AuthenticationTransactionService,
    private shippingInfoService: ShippingInfoService,
    private paymentInstructionService: PaymentInstructionService,
    private translate: TranslateService,
    private da: DigitalAnalyticsService
  ) {
    this.cartSubject = new BehaviorSubject(null);
  }

  unlockCart(cartId:string,queryParams?:any){
    const parameters=  {
      'storeId': this.storefrontUtils.commerceStoreId,
      'cartId' : cartId,
      '$queryParameters': queryParams
    };
    return this.cartService.unlockCart(parameters).toPromise();
  }

  lockCart(cartId:string,queryParams?:any){
    const parameters=  {
      'storeId': this.storefrontUtils.commerceStoreId,
      'cartId' : cartId,
      '$queryParameters': queryParams
    };
    return this.cartService.lockCart(parameters).toPromise();
  }

  lockCartOnBehalf(cartId: string, forUser:any, takeLockOver?: boolean){
    const parameters=  {
      'storeId': this.storefrontUtils.commerceStoreId,
      'cartId' : cartId
    };

    if (!!forUser) {
      if(forUser.userName){
        parameters['forUser'] = forUser.userName;
      }
      if(forUser.userId){
        parameters['forUserId'] = forUser.userId;
      }
      if(takeLockOver){
        parameters['$queryParameters']={takeOverLock:'Y'}
      }
    }
    return this.cartService.lockCartOnBehalf(parameters).toPromise();
  }

  unlockCartOnBehalf(cartId: string, forUser?:any){
    const parameters=  {
      'storeId': this.storefrontUtils.commerceStoreId,
      'cartId' : cartId
    };

    if (!!forUser) {
      if(forUser.userName){
        parameters['forUser'] = forUser.userName;
      }
      if(forUser.userId){
        parameters['forUserId'] = forUser.userId;
      }
    }
    return this.cartService.unlockCartOnBehalf(parameters).toPromise();
  }

  getCart() {
    const parameters = {
      'sortOrderItemBy': 'orderItemID',
      'storeId': this.storefrontUtils.commerceStoreId
    };
    return this.cartService.getCart(parameters, undefined).toPromise().then(
      (response: HttpResponse<any>) => {
        if (!response.body.orderItem) {
          response.body.orderItem = [];
        }
        const cart = response.body;
        for (const item of cart.orderItem) {
          item.quantity = parseInt(item.quantity);
          item.totalAdjustment = parseFloat(item.totalAdjustment);
          let availability = '';
          if (item.orderItemInventoryStatus ==
            CommerceEnvironment.order.orderItemInventoryStatus.available ||
            item.orderItemInventoryStatus ==
            CommerceEnvironment.order.orderItemInventoryStatus.allocated) {
            availability = 'inStock';
          } else if (item.orderItemInventoryStatus ==
            CommerceEnvironment.order.orderItemInventoryStatus.backordered) {
            availability = 'backOrdered';
          } else {
            availability = 'outOfStock';
          }
          item.availability = availability;
        }
        this.cartSubject.next(cart);
      },
      (error) => {
        if (error.status == 404) {
          this.cartSubject.next(null);
        } else {
          this.cartSubject.next(error);
        }
      }
    );
  }

  normalizeOrderItems(items: any): Promise<any> {
    return this.productService.normalizeOrderItems(items);
  }

  getShippingCostEstimated(address: any): Promise<HttpResponse<any>> {
    const addressUpdateParam = address.addressId ? {
        'body': {
          'orderId': '.',
          'addressId': address.addressId,
          'x_calculationUsage': CommerceEnvironment.order.calculationUsage
        },
        storeId: this.storefrontUtils.commerceStoreId
      } :
      {
        'body': {
          'orderId': '.',
          'applePayAddress': address,
          'x_calculationUsage': CommerceEnvironment.order.calculationUsage
        },
        storeId: this.storefrontUtils.commerceStoreId
      };
    return this.cancelApplePayOrder().then(
      r => {
        return this.updateApplePayOrder(addressUpdateParam).then(
          r => this.preCheckout()
        )
      }
    );
  }


  private updateApplePayOrder(addressUpdateParam: any): Promise<HttpResponse<any>> {
    return this.cartService.updateApplePayOrder(addressUpdateParam, undefined)
    .toPromise();
  }

  cancelApplePayOrder(): Promise<HttpResponse<any>> {
    return this.cartService.cancelApplePayOrder({
      storeId: this.storefrontUtils.commerceStoreId
    }).toPromise();
  }

  preCheckout(): Promise<HttpResponse<any>> {
    const param = {
      'body': {
        'orderId': '.',
      },
      storeId: this.storefrontUtils.commerceStoreId
    };
    return this.cartService.preCheckout(param, undefined).toPromise();
  }

  checkout(address: any): Promise<HttpResponse<any>> {
    const param = {
      'body': {
        'orderId': '.',
        'notifyOrderSubmitted': '1',
        'notify_EMailSender_recipient': address.ShippingAndBilling.email1
      },
      storeId: this.storefrontUtils.commerceStoreId
    };
    return this.cartService.checkOut(param, undefined).toPromise();
  }

  findProductByPartNumber(partNumber: string): Promise<HttpResponse<any>> {
    return this.productService
    .findProductByPartNumber(partNumber, this.storefrontUtils.commerceStoreId,
      this.storefrontUtils.commerceCatalogId, '',
      'catalogEntryView.thumbnail,catalogEntryView.partNumber,catalogEntryView.name,catalogEntryView.price,catalogEntryView.attributes,catalogEntryView.parentCatalogEntryID');
  }

  getProduct(partNumber: string): Promise<any> {
    return this.productService.getProduct(partNumber);
  }

  findProductById(id: string) {
    return this.productService.findProductsById(
      this.storefrontUtils.commerceStoreId, id,
      'catalogEntryView.thumbnail,catalogEntryView.partNumber,catalogEntryView.name,catalogEntryView.price,catalogEntryView.attributes');
  }

  applyPromotionCode(promoCode: string): Promise<HttpResponse<any>> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'body': {
        'promoCode': promoCode
      }
    };
    return this.assignedPromotionCode.applyPromotioncode(param,
      undefined).toPromise();
  }

  removePromotionCode(promoCode: string): Promise<HttpResponse<any>> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'promoCode': promoCode
    };
    return this.assignedPromotionCode.removePromotionCode(param,
      undefined).toPromise();
  }

  getPromotionCode(): Promise<HttpResponse<any>> {
    const param = {
      storeId: this.storefrontUtils.commerceStoreId
    }

    return this.assignedPromotionCode.getAssignedPromotioncodeInfo(param,
      undefined).toPromise();
  }

  updateOrderItem(updatingItem: any): Promise<HttpResponse<any>> {
    const cart = this.cartSubject.getValue();
    const param = {
      storeId: this.storefrontUtils.commerceStoreId
    };
    const body: any = {
      'orderId': '.',
      'x_calculationUsage': CommerceEnvironment.order.calculationUsage,
      'x_calculateOrder': CommerceEnvironment.order.calculateOrder,
      'x_inventoryValidation': 'true',
      'orderItem': []
    };
    body.orderItem = cart.orderItem.map(
      function (item: any) {
        let cItem = item;
        if (cItem.orderItemId == updatingItem.orderItemId) {
          cItem = updatingItem;
        }
        const r = {};
        for (const k in cItem) {
          if (CommerceEnvironment.order.orderItemParams.indexOf(k) > -1) {
            r[k] = cItem[k].toString();
          }
        }
        return r;
      }
    );
    param['body'] = body;
    return this.cartService.updateOrderItem(param, undefined).toPromise();
  }

  deleteOrderItem(item: any) {
    const orderItemParam = {
      storeId: this.storefrontUtils.commerceStoreId,
      body: {
        'calculationUsage': CommerceEnvironment.order.calculationUsage,
        'calculateOrder': CommerceEnvironment.order.calculateOrder,
        'orderItemId': item.orderItemId
      }
    };
    return this.cartService.deleteOrderItem(orderItemParam,
      undefined).toPromise();
  }

  addToCart(quantity: number, productId: string): Promise<any> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'body': {
        'x_inventoryValidation': 'true',
        'orderId': '.',
        'orderItem': [{
          'quantity': quantity.toString(),
          'productId': productId,
          'contractId': this.storefrontUtils.getContractId(),
          'orderItemExtendAttribute': [
            {
              'attributeValue': this.da.analyticsFacet,
              'attributeName': CommerceEnvironment.analytics.orderItemAttrFacetAnalytics
            },
            {
              'attributeValue': this.da.currentParentCategory,
              'attributeName': CommerceEnvironment.analytics.orderItemAttrParentCategory
            }
          ]
        }],
        'x_calculateOrder': CommerceEnvironment.order.calculateOrder,
      }
    };

    return this.cartService.addOrderItem(param, undefined).toPromise().then(
      res => {
        this.getCart();
        return res;
      });
  }

  addMutlipleToCart(quantities: number[], productIds: string[]): Promise<any> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'body': {
        'x_inventoryValidation': 'true',
        'orderId': '.',
        'orderItem': [{}],
        'x_calculateOrder': '1',
      }
    };
    for (const i in productIds) {
      param.body.orderItem[i] = {
        'quantity': quantities[i].toString(),
        'productId': productIds[i],
        'contractId': this.storefrontUtils.getContractId()
      }
    }
    return this.cartService.addOrderItem(param, undefined).toPromise().then(
      res => {
        this.getCart();
        return res;
      });
  }

  copyOrder(fromOrderId: string): Promise<any> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'body': {
        'fromOrderId_1': fromOrderId,
        'toOrderId': '.**.',
        'copyOrderItemId_1': '*'
      }
    };
    return this.cartService.copyOrder(param, undefined).toPromise();
  }


  private updateItemParent(item: any, catEnt: any): any {
    //get parent product using cat SKU's parentCatalogEntryID
    //so that we create a link back to product (not the sku)
    if (catEnt && catEnt.parentCatalogEntryID) {
      return this.findProductById(catEnt.parentCatalogEntryID)
      .then(response => {
        catEnt['parentCatalogEntyPartnumber'] = response[0].partNumber;
        return item.item = catEnt;
      });
    } else {
      return item.item = catEnt;
    }
  }

  getUsableShippingMode(): Promise<HttpResponse<any>> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      'orderId': this.cartSubject.getValue().orderId,
      $queryParameters: {
        'locale': this.translate.currentLang
      }
    };
    return this.cartService.getUsableShippingMode(param).toPromise();
  }

  getUsableShippingInfo(): Promise<HttpResponse<any>> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      $queryParameters: {
        'locale': this.translate.currentLang
      }
    };
    return this.cartService.getUsableShippingInfo(param).toPromise();
  }

  getUsablePaymentInfo(): Promise<HttpResponse<any>> {
    const param = {
      'storeId': this.storefrontUtils.commerceStoreId,
      $queryParameters: {
        'locale': this.translate.currentLang
      }
    };
    return this.cartService.getUsablePaymentInfo(param).toPromise();
  }

  updateOrderShippingInfo(addressId: string, physicalStoreId: string, shipModeId: string): Promise<any> {
    const param = {
      body: {
        'x_calculationUsage': CommerceEnvironment.order.calculationUsage,
        'orderId': '.',
        'shipModeId': shipModeId,
        'x_calculateOrder': '1',
        'x_allocate': '***',
        'x_backorder': '***',
        'x_remerge': '***',
        'x_check': '*n'
      },
      storeId: this.storefrontUtils.commerceStoreId,
      $queryParameters: {
        'locale': this.translate.currentLang
      }
    }
    if (addressId) {
        param.body['addressId'] = addressId;
    }
    if (physicalStoreId) {
        param.body['physicalStoreId'] = physicalStoreId;
    }
    return this.shippingInfoService.updateOrderShippingInfo(param,
      undefined).toPromise();
  }

  updateOrderShippingAddress(addressId: string): Promise<any> {
    const param = {
      body: {
        'x_calculationUsage': CommerceEnvironment.order.calculationUsage,
        'orderId': '.',
        'addressId': addressId,
        'x_calculateOrder': '1',
        'x_allocate': '***',
        'x_backorder': '***',
        'x_remerge': '***',
        'x_check': '*n'
      },
      storeId: this.storefrontUtils.commerceStoreId,
      $queryParameters: {
        'locale': this.translate.currentLang
      }
    }
    return this.shippingInfoService.updateOrderShippingInfo(param,
      undefined).toPromise();
  }

  addPaymentInstruction(paymentId: any, billAddressId: string): Promise<any> {
    const cart = this.cartSubject.getValue();
    if (cart && cart.grandTotal) {
      const orderId = cart.orderId;
      const amount = cart.grandTotal;
      const param = {
        body: {
          'orderId': cart.orderId,
          'piAmount': cart.grandTotal.toString(),
          'billing_address_id': billAddressId,
          'payMethodId': paymentId
        },
        storeId: this.storefrontUtils.commerceStoreId
      };
      // hard coded to cash on delivery
      return this.paymentInstructionService.addPaymentInstruction(param,
        undefined).toPromise().then(
        (res) => {
          if (res.body['paymentInstruction']) {
            // we are using single payment, remove extra one.
            const pr = [];
            for (const p of res.body.paymentInstruction) {
              pr.push(this.deletePaymentInstruction(p.piId));
            }
            return Promise.all(pr);
          }
        }
      );
    }
  }

  deletePaymentInstruction(piId: any): Promise<any> {
    const param = {
      paymentInstruction_id: piId,
      storeId: this.storefrontUtils.commerceStoreId
    };
    // hard coded to cash on delivery
    return this.paymentInstructionService.deletePaymentInstruction(param,
      undefined).toPromise();
  }
}

