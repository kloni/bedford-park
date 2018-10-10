import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit, Input } from '@angular/core';
import * as $ from 'jquery';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'commerce-order-promotion',
  templateUrl: './order-promotion.component.html',
  styleUrls: ['./order-promotion.component.scss']
})
export class OrderPromotionComponent implements OnInit, OnDestroy, AfterViewInit {

  private _promoCode: string;
  private _appliedPromoCodes: Set<string> = new Set<string>();
  private _cartSubscriber: Subscription;
  private _cart: any;
  private _isCheckout: boolean = false;

  id: any;
  promoCodeError: any = null;
  errorParameters: any = null;
  componentName: string = "commerce-order-promotion";

  @Input('cartLocked') cartLocked: string;
  @Input('isCSR') isCSR: boolean;

  constructor(
    private cartTransactionService: CartTransactionService,
    private storefrontUtils: StorefrontUtils
  ) {
    this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe((cart) => {
      if (cart != null) {
        this.cart = cart;
      }
    });
  }

  @Input()
  set isCheckout(isCheckout: boolean){
    this._isCheckout = !!isCheckout;
  }

  get isCheckout(): boolean{
    return this._isCheckout;
  }

  ngOnInit() {
    this.id = uniqueId();
  }

  ngOnDestroy() {
    this._cartSubscriber.unsubscribe();
    try {
      (<any>$('#' + this.componentName + '_mobile_' + this.id)).foundation("_destroy");
    }
    catch (e) { }
  }

  ngAfterViewInit() {
    (<any>$('#' + this.componentName + '_mobile_' + this.id)).foundation();
  }

  set cart(cart: any) {
    this._cart = cart;
  }

  get cart(): any {
    return this._cart;
  }

  set promoCode(promoCode: string) {
    this._promoCode = promoCode;
  }

  get promoCode(): string {
    return this._promoCode;
  }

  get appliedPromoCodes(): Set<string> {
    return this._appliedPromoCodes;
  }

  onPromoCodeChange() {
    if (!!this.promoCodeError) {
      this.promoCodeError = null;
    }
  }

  applyPromotionCode() {
    if (!!this._promoCode && this._promoCode.length > 0) {
      return this.cartTransactionService
        .applyPromotionCode(this._promoCode)
        .then(response => { this.updateCartPromotion() })
        .catch(err => {
          this.handleErrorCase(err);
        });
    }
  }

   /* istanbul ignore next */
   updateCartPromotion() {
    if (!!this._promoCode && this._promoCode.length > 0) {
      this.promoCode = "";
    }
    return this.cartTransactionService.getCart();
  }

  handleErrorCase(error: HttpErrorResponse) {
    this.promoCodeError = this.storefrontUtils.handleErrorCase(error, "order-promotion.promotCodeErrorFallback")
  }

  removePromotionCode(code: string) {
    return this.cartTransactionService
      .removePromotionCode(code)
      .then(response => this.updateCartPromotion())
      .catch(err => {
        /* istanbul ignore next */
        this.handleErrorCase(err)

      });
  }

}
