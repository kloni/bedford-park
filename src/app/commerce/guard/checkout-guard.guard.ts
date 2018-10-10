/*******************************************************************************
 * checkout-guard.guard.ts
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

import { Constants } from './../../Constants';
import { CurrentUser } from './../common/util/currentUser';
import { StorefrontUtils } from './../../commerce/common/storefrontUtils.service';
import { AuthenticationTransactionService } from './../services/componentTransaction/authentication.transaction.service';
import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {CartTransactionService} from '../services/componentTransaction/cart.transaction.service';

@Injectable()
export class CheckoutGuard implements CanActivate {

    private readonly signInLink: string;
    private readonly coLink: string;

    constructor( private authService: AuthenticationTransactionService,
        private router: Router,
        private storeUtils: StorefrontUtils,
        private cartService: CartTransactionService) {
        this.signInLink = this.storeUtils.getPageLink(Constants.signInPageIdentifier);
        this.coLink = this.storeUtils.getPageLink(Constants.checkoutPageIdentifier);
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        const url: string = state.url;
        if ( !url.startsWith(this.signInLink) && !url.startsWith(this.coLink)  ) {
            //if it is not navigated to sign in, then remvoe the checkout flag
            const currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
            if ( currentUser && currentUser.WCTrustedToken && currentUser.WCToken ) {
                currentUser.isGoingToCheckout = false;
                StorefrontUtils.saveCurrentUser( currentUser );
            }
        }
        return this.validateCheckoutAndContinue( url );
    }

    private validateCheckoutAndContinue( url: string ): boolean |  Promise<boolean> {
        if ( url.startsWith(this.coLink) ) {
            const currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
            const isGuest:boolean = StorefrontUtils.isGuestOrActingAs(currentUser);
            if ( currentUser && (( isGuest && currentUser.isCheckoutAsGuest ) || !isGuest) ) {
                const promiseArray: Promise<any>[] = [];
                promiseArray.push (this.cartService.getCart());
                promiseArray.push (this.cartService.cancelApplePayOrder());
                return Promise.all(promiseArray).then(() => {
                    const cart = this.cartService.cartSubject.getValue();
                    if (cart && cart['orderItem']) {
                        return true;
                    } else {
                        this.storeUtils.locationReplace = null;
                        this.storeUtils.gotoNotFoundReplace();
                        return false;
                    }
                }).catch(e => {
                    console.error(e)
                    return true;
                })
            } else if ( !currentUser ) {
                this.storeUtils.locationReplace = null;
                this.storeUtils.gotoNotFoundReplace();
                return false;
            } else {
                this.storeUtils.locationReplace = null;
                // Store the attempted URL for redirecting
                this.authService.redirectUrl = url;
                // Navigate to the login page
                const curUser: CurrentUser = StorefrontUtils.getCurrentUser();
                if (curUser){
                    curUser.isGoingToCheckout = true;
                    StorefrontUtils.saveCurrentUser(curUser);
                }
                this.router.navigate( [this.signInLink] );
                return false;
            }
        } else {
            return true;
        }
    }
}
