import { CurrentUser } from './../../common/util/currentUser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { TypeShoppingcartComponent } from './../../components/shoppingcart/typeShoppingcartComponent';
import { Constants } from '../../../Constants';
import { CartTransactionService } from '../../services/componentTransaction/cart.transaction.service';
import { Subscription } from 'rxjs/Subscription';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { CommerceEnvironment } from '../../commerce.environment';

const uniqueId = require('lodash/uniqueId');

/*
 * @name shoppingcartLayout
 * @id shoppingcart-layout
 */
@LayoutComponent( {
    selector: 'shoppingcart-layout'
} )
@Component( {
    selector: 'app-shoppingcart-layout-component',
    templateUrl: './shoppingcartLayout.html',
    styleUrls: ['./shoppingcartLayout.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class ShoppingcartLayoutComponent extends TypeShoppingcartComponent implements OnInit, OnDestroy {
    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    id: any;
    rContext: RenderingContext;
    constants: any = Constants;
    isLoggedIn: boolean = false;

    isCSR: boolean;
    isLockOwner: boolean;
    onBehalf: any;
    lockOwner: string;

    cartId: string;
    _isLocked: boolean;


    set isLocked(locked: boolean){
        this._isLocked = locked;
    }
    get isLocked(): boolean{
        return this._isLocked? this._isLocked : false;
    }

    private _cartSubscriber: Subscription;
    private _cart: any;
    private readonly coLink:string;

    errorUserName: string;
    errorMsg: string;

    constructor(
        private cartTransactionService: CartTransactionService,
        private router: Router,
        private storeUtils: StorefrontUtils,
        protected da: DigitalAnalyticsService
    ) {
        super();
        this.coLink = this.storeUtils.getPageLink(Constants.checkoutPageIdentifier);
        this.initializeCart();
    }

    ngOnInit() {
        super.ngOnInit();
        this.id = uniqueId();
        this.safeSubscribe( this.onRenderingContext, ( renderingContext ) => {
            this.rContext = renderingContext;
            window.scrollTo( 0, 0 );
            this.setUserName();
        } );
    }

    setUserName(){
        let currentUser = StorefrontUtils.getCurrentUser();
        this.errorUserName = currentUser?currentUser.username:"";
        if(currentUser && currentUser.isCSR && currentUser.forUser !== undefined){
            this.errorUserName = currentUser.forUser.userName||"";
        }
    }

    ngOnDestroy() {
        if (this._cartSubscriber) {
            this._cartSubscriber.unsubscribe();
        }
    }

    set cart( cart: any ) {
        this._cart = cart;
    }

    get cart(): any {
        return this._cart;
    }

    public initializeCart() {
        return this.cartTransactionService.getCart().then(() => {
            return this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe((cart)=>{
                if (cart) {
                    this.cartTransactionService.normalizeOrderItems( cart.orderItem ).then((r) => {
                        const cartParam: any = {
                            pageName: Constants.shoppingCartPageIdentifier,
                            cart: cart,
                            currency: sessionStorage.getItem('currentUserCurrency') === null ? this.storeUtils.commerceCurrency : sessionStorage.getItem('currentUserCurrency')
                        };
                        const cu:CurrentUser=StorefrontUtils.getCurrentUser();

                        this.da.viewCart(cartParam);
                        this.cartId   = cart.orderId;
                        this.isLocked = cart.locked ==='true' || cart.locked === true;

                        this.isCSR = cu&&cu.isCSR;
                        this.onBehalf = StorefrontUtils.getForUser(null);

                        if (this.isLocked) {
                          if (cart.orderEditor.externalIdentifier.identifier === StorefrontUtils.getCurrentUser().username) {
                            this.isLockOwner=true
                          } else {
                            this.isLockOwner=false;
                            this.lockOwner=cart.orderEditor.externalIdentifier.identifier;
                          }
                        }
                        return this.cart = cart;

                    });
                }
                else {
                    let cartParam: any = {
                        pageName: Constants.shoppingCartPageIdentifier,
                        cart: {
                            orderItem: []
                        }
                    };
                    this.da.viewCart(cartParam);
                }
            });
        });
    }

    beginCheckout(){
        this.router.navigate([this.coLink]);
    }

    lock(){
        if(this.onBehalf){
            return this.cartTransactionService.lockCartOnBehalf(this.cartId, this.onBehalf, !this.lockOwner?true:undefined).then(res => {
                return this.initializeCart().then(()=>{
                    this.isLocked = true;
                });
            }).catch(e => {
                this.errorMsg = e.error.errors[0].errorMessage;
                setTimeout(() => {

                    return this.initializeCart().then(()=>{
                        this.clearError();
                    });
                }, 3000);
            });
        }else{
            return this.cartTransactionService.lockCart(this.cartId).then(res => {
                this.isLocked = true;
            });
        }
    }

    unlock(){
        if(this.onBehalf){
            return this.cartTransactionService.unlockCartOnBehalf(this.cartId, this.onBehalf).then(res => {
               return this.initializeCart().then(()=>{
                    this.isLocked = false;
                });
            }).catch(e => {
                this.errorMsg = e.error.errors[0].errorMessage;
                setTimeout(() => {
                    return this.initializeCart().then(()=>{
                        this.clearError();
                    });
                }, 3000);
            });
        }else{
           return  this.cartTransactionService.unlockCart(this.cartId).then(res=>{
                this.isLocked = false;
            });
        }
    }

    clearError(){
        this.errorMsg=undefined;
    }

}
