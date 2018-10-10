/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { Injectable } from '@angular/core';
import { OrderService } from "../rest/transaction/order.service";
import { StorefrontUtils } from "../../../commerce/common/storefrontUtils.service";
import { Logger } from "angular2-logger/core";
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { WishListService } from "../rest/transaction/wishList.service";

@Injectable()
export class OrderTransactionService {

    private defaultWishlistMade: Boolean = false;
	constructor(
		private orderService: OrderService,
		private storefrontUtils: StorefrontUtils,
		private logger: Logger,
        private wishlistService: WishListService
	) {
    }

	getCurrentUserOrderHistory(pageNumber: number, pageSize: number): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'pageNumber': pageNumber,
			'pageSize': pageSize,
			'status': 'N,M,A,B,C,R,S,D,F,G,L'
		};

		return this.orderService.findByStatus(params, undefined).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + "orderHistory data: %o", res );
			return res.body as any;
		});
	}

	getOrderDetails(orderId: any): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'orderId': orderId
		};

		return this.orderService.findByOrderId(params, undefined).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + "orderDetail data: %o", res );
			return res.body as any;
		});
	}

	getOrderPromotions(orderId: any): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'orderId': orderId,
			'q': CommerceEnvironment.orderServiceQueryFindOrderPromotions
		};

		return this.orderService.findOrderPromotions(params, undefined).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + "orderPromotions data: %o", res );
			return res.body as any;
		});
	}

	getAllWishList(): Promise<any> {

        const defaultWishlistParams = {
            'storeId': this.storefrontUtils.commerceStoreId,
            'responseFormat': 'json',
            'body': {
                'item': [],
                'descriptionName': "DefaultListName",
                'description': "Default Wishlist"
            }
        };

        return  new Promise(resolve=>{
            this.getWishlistsOnly().then(res=>{
                resolve(res);
            }).catch(reason=>{
                if (reason.status == 404 && !this.defaultWishlistMade) {
                    this.defaultWishlistMade = true;
                    this.wishlistService.createWishlist(defaultWishlistParams).toPromise().then(res=>{
                        if ( this.logger.level < 4 ) {
                            this.logger.info( this.constructor.name + "create default wishlist data: %o", res);
                        }
                        this.getWishlistsOnly().then(res=>{
                            resolve(res);
                        });
                    }).catch(reason=>{
                        this.defaultWishlistMade = false;
                    });
                } else if (reason.status == 404) {
                    this.getWishlistsWithCount(0).then(res=>{
                        resolve(res);
                    });
                }
            });
        });
    }

    private getWishlistsWithCount (count:number): Promise<any> {
        return  new Promise(resolve=>{
            setTimeout(()=>{
                this.getWishlistsOnly().then(res=>{
                    resolve(res);
                }).catch(reason=>{
                    /** set re-try limit to 2 */
                    if (reason.status == 404 && count < 2) {
                        count= count+1;
                        this.getWishlistsWithCount(count).then(res=>{
                            resolve(res);
                        });
                    }
                });
            },50);
        });
    }

    private getWishlistsOnly() : Promise<any>  {
        const wishlistParams = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json'
        };

        return this.wishlistService.findWishlist(wishlistParams).toPromise().then(res => {
            if (this.logger.level < 4) {
                this.logger.info(this.constructor.name + " All Wishlists data: %o", res);
            }
            return res.body as any;
        });
    }

	createNewWishList(items: any[], name: string, description: string): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json',
			'body':{
				'item': items,
				'descriptionName': name,
				'description': description
			}
		};
		return this.wishlistService.createWishlist(params).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + " create Wishlist: %o", res);
			return res.body as any;
		});
	}

	deleteWishList(externalId: string): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json',
			'externalId': externalId
		};
		return this.wishlistService.deleteWishlist(params).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + " delete Wishlist: %o", res);
			return res.body as any;
		});
	}

	changeWishListName(externalId: string, name: string): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json',
			'externalId': externalId,
			'addItem': 'false',
			'body': {
				'descriptionName': name
			}
		};
		return this.wishlistService.updateWishlist(params).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + " change Wishlist name: %o", res);
			return res.body as any;
		});
	}

	deleteWishListItem(externalId: string, itemId: string, productId: string): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json',
			'externalId': externalId,
			'itemId': itemId,
			'productId': productId
		};

		return this.wishlistService.deleteWishlist(params).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + " delete Wishlist item: %o", res);
			return res.body as any;
		});
	}

	addItemToWishList(externalId: string, productId: string): Promise<any> {
		const params = {
			'storeId': this.storefrontUtils.commerceStoreId,
			'responseFormat': 'json',
			'externalId': externalId,
			'addItem': 'true',
			'body':{
				'item': [{
					"location": "Waterloo",
					"quantityRequested": "1.0",
					"productId": productId
				}]
			}
		};

		return this.wishlistService.updateWishlist(params).toPromise().then(res => {
			if ( this.logger.level < 4 )
				this.logger.info( this.constructor.name + " delete Wishlist item: %o", res);
			return res.body as any;
		});
	}
}
