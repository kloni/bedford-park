import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Constants } from "app/Constants";
import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationTransactionService } from "../../../services/componentTransaction/authentication.transaction.service";
import { OrderTransactionService } from '../../../services/componentTransaction/order.transaction.service';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
const uniqueId = require('lodash/uniqueId');

@Component( {
    selector: 'commerce-order-items',
    templateUrl: './order-items.component.html',
    styleUrls: ['./order-items.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
} )
export class OrderItemsComponent implements OnInit, OnDestroy, AfterViewInit {

    id: any;
    componentName: string = "commerce-order-items";
    _orderItems = [];
    readonly pageLink:string;
    isGuest : boolean;
    private _cartSubscriber: Subscription;
    private _isCheckout: boolean = false;
    private _removeClicked: boolean = false;
    readonly moveToWishListModelId: string = "moveToWishListModal";
    readonly newWishListModalId: string = "newWishListModal";
    wishLists: any[] = [];
    selectedWishListId: string;
    private selectedItem : any = {};
    readonly signInModelId: string = "signInModal";
    private signInLink: string;
    errorMsg: string;
    user: any = {};
    loginErrorMsg: any;
    private resizeSub: Subscription;
    private isSmall: boolean;
    @Input('cartLocked') cartLocked: string;
    @Input('isCSR') isCSR: boolean;
    @ViewChild("newForm") newForm: NgForm;

    constructor(
        private cartTransactionService: CartTransactionService,
        private storeUtils: StorefrontUtils,
        private orderTranService: OrderTransactionService,
        private router: Router,
        private authSvc: AuthenticationTransactionService
    ) {
        this.pageLink=this.storeUtils.getPageLink(Constants.productDetailPageIdentifier);
        this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe( ( cart ) => {
            if ( cart != null ) {
                this.orderItems = cart.orderItem;
            }
            else {
                this.orderItems = [];
            }
            this._removeClicked = false;
        });

        this.id = uniqueId();
        this.isGuest = StorefrontUtils.isGuestOrActingAs();
        this.signInLink = this.storeUtils.getPageLink(Constants.signInPageIdentifier);
        if (!this.isGuest) {
             this.getWishLists();
        }
        this.resizeSub = Observable.fromEvent(window, 'resize')
        .debounceTime(100)
        .distinctUntilChanged()
        .subscribe((screen: any) => {
            let screenWidth = screen.target.innerWidth;
            this.onResize(screenWidth);
        });
    }

    ngOnInit() {
      this.id = uniqueId();
      this.isGuest = StorefrontUtils.isGuestOrActingAs();
      let screenWidth = window.innerWidth;
      this.onResize(screenWidth);
    }

    ngAfterViewInit() {
      [this.moveToWishListModelId, this.signInModelId, this.newWishListModalId].forEach(mId=>(<any>$(`#${mId}_${this.id}`)).foundation());
    }

    ngOnDestroy() {
      this._cartSubscriber.unsubscribe();
      this.resizeSub.unsubscribe();
      [this.moveToWishListModelId, this.signInModelId, this.newWishListModalId].forEach(mId=>{
        const obj=(<any>$(`#${mId}_${this.id}`))
        if (obj.length > 0) {
          if (typeof obj.foundation === 'function') {
            obj.foundation('close');
            obj.foundation('_destroy');
          }
          obj.remove();
        }
      });
    }

    closeModal(mId:string) {
      (<any>$(`#${mId}_${this.id}`)).foundation('close');
    }

    openModal(mId:string) {
      (<any>$(`#${mId}_${this.id}`)).foundation('open');
    }

    @Input()
    set isCheckout(isCheckout: boolean){
      this._isCheckout = !!isCheckout;
    }

    get isCheckout(): boolean{
      return this._isCheckout;
    }

    set orderItems( items: any ) {
        let lItems = this.deepCopy( items );
        //use existing items as base and merge properly to avoid page flashing
        if ( lItems.length == 0 ) {
            this._orderItems = lItems;
        }
        else {
            let currenItemIds = [];
            lItems.forEach( item => {
                currenItemIds.push( item.orderItemId );
                let f = false;
                for ( let e of this._orderItems ) {
                    if ( e.orderItemId == item.orderItemId ) {
                        Object.assign( e, item );
                        f = true;
                        break;
                    }
                }
                if ( !f ) {
                    this._orderItems.push( item );
                }
            } );
            //find all removed items
            let index2delete = [];
            for ( let i = 0; i < this._orderItems.length; i++ ) {
                if ( currenItemIds.indexOf( this._orderItems[i].orderItemId ) < 0 ) index2delete.push( i );
            }
            for ( let j = 0; j < index2delete.length; j++ ) {
                this._orderItems.splice( index2delete[j] - j, 1 );
            }
        }
        this.cartTransactionService.normalizeOrderItems( this._orderItems );
    }

    get orderItems(): any {
        return this._orderItems;
    }

    quantityKeyup( event: any, item: any ) {
        let qty = parseInt( event.target.value );

        if ( isNaN( qty ) || qty < 1 ) {
            event.target.value = item.quantity;
        }
        else {
            event.target.style.width = ((event.target.value.length + 1) * 8 + 40) + 'px';
           return this.applyQuantityUpdate( item, qty );
        }
    }

    private applyQuantityUpdate( item: any, value: number ) {
      item.quantity = value;
      return this.cartTransactionService //update to server
            .updateOrderItem( item )
            .then( response => this.cartTransactionService.getCart() );
    }

    deleteOrderItem( item: any ) {
        if (!this._removeClicked){
            this._removeClicked = true;

            return this.cartTransactionService
                .deleteOrderItem( item )
                .then( response => this.cartTransactionService.getCart() );
        }
    }

    private deepCopy( src: any ): any {
        return JSON.parse( JSON.stringify( src ) );
    }

    moveToWishList(wishlistId: string, index:number=-1): Promise<any> {
        if (StorefrontUtils.isGuestOrActingAs() || wishlistId === undefined) {
            return Promise.resolve({});
        }

        return this.orderTranService.addItemToWishList(wishlistId, this.selectedItem.uniqueId).then(res=>{
            this.deleteOrderItem({orderItemId: this.selectedItem.orderItemId});
            if (index === -1) {
                this.closeModal(this.moveToWishListModelId);
            } else {
                this.hideDropDownMenu(index);
            }
        });
    }

    openSignInModal() { this.openModal(this.signInModelId); }

    goToRegistrationPage(){
        this.router.navigate( [this.signInLink] );
    }

    login(): Promise<void> {
        return this.authSvc.login(this.user.username, this.user.password).then(res => {
            this.closeModal(this.signInModelId);
            this.isGuest = StorefrontUtils.isGuestOrActingAs();
            this.getWishLists();
        }).catch((error: HttpErrorResponse) => {
            this.loginErrorMsg = this.storeUtils.handleErrorCase(error, 'Could not log in');
        })
    }

    getWishLists() : Promise<any> {
        return this.orderTranService.getAllWishList().then(res => {
            this.wishLists = res.GiftList.map(list => {
                let tmp = {}
                tmp['externalId'] = list.externalIdentifier;
                tmp['name'] = list.descriptionName;
                return tmp;
            });
        });
    }

    openMoveToWishListDropdown(item: any, index: number) {
        this.selectedItem = {
            orderItemId: item.orderItemId,
            uniqueId: item.item.uniqueID
        };

        if(!this.isSmall){

            let targetDropdownId = 'wishList_dropDown_'+this.id+'_'+index;
            let id = this.id;
            /** Hide all other dropdown menu */
            $('ul[id^=wishList_dropDown_'+this.id+'_]').each(function(i){
                if (targetDropdownId !==  $(this).attr('id')) {
                    StorefrontUtils.hideWishlistDropDownMenu(id, i);
                }
            });

            if ($('#'+targetDropdownId).css('display') ==='none') {
                StorefrontUtils.showWishlistDropDownMenu(this.id,index);

                /** let product recommendation field under shopping cart */
                const shoppingCartObj = $('app-shoppingcart-layout-component > div.shopping-cart');
                shoppingCartObj.css('position','relative');
                shoppingCartObj.css('z-index','2');

                const prodRecommObj = $('div.product-recommendation-container');
                prodRecommObj.css('position','relative');
                prodRecommObj.css('z-index','1');
            }
            else {
                this.hideDropDownMenu(index);
            }
        } else {
            this.openModal(this.moveToWishListModelId);
        }
    }

    showCreateModal(index : number) {
        this.newForm.reset();
        this.hideDropDownMenu(index);
        this.openModal(this.newWishListModalId);
    }

    public hideDropDownMenu(index: number) {
        /** Hide dropdown menu */
        StorefrontUtils.hideWishlistDropDownMenu(this.id, index);

        /** back product recommendation and shopping cart field back to normal */
        const shoppingCartObj = $('app-shoppingcart-layout-component > div.shopping-cart');
        shoppingCartObj.css('position','static');
        shoppingCartObj.css('z-index','auto');

        const prodRecommObj = $('div.product-recommendation-container');
        prodRecommObj.css('position','static');
        prodRecommObj.css('z-index','auto');
    }

    wishListCreation(f: NgForm) {
        this.orderTranService.createNewWishList([], f.value.descriptionName, f.value.description).then(res => {
            f.reset();
            this.closeModal(this.newWishListModalId);
            this.getWishLists();
        });
    }

    onResize(screenWidth: number) {
        if (screenWidth >= 640)
            this.isSmall = false;
        else
            this.isSmall = true;
    }
}
