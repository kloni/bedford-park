import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { CommerceEnvironment } from "../../../commerce.environment";
import * as $ from 'jquery';

const uniqueId = require('lodash/uniqueId');

@Component( {
  selector: 'commerce-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
} )
export class OrderTotalComponent implements OnInit, OnDestroy {

  id: any;
  componentName: string = "commerce-order-total";
  discountTooltipClass: string = "commerce-order-total tooltip";
  tooltipText: string = "";

  private _cartSubscriber: Subscription;
  private _cart: any;
  private _isCheckout: boolean = false;
  public VATEnabled = false;
  private VAT;

  constructor(
    private cartTransactionService: CartTransactionService,
    private storeConfigCache: StoreConfigurationsCache
  ) {
    this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe( ( cart ) => {
      /*istanbul ignore next*/
      if ( cart != null) {
        this.cart = cart;
      }
    } );
  }

  ngOnInit() {
    this.id = uniqueId();
    this.storeConfigCache.isEnabled(CommerceEnvironment.VATFeatureName).then(isVATEnabled => {
      this.VATEnabled = isVATEnabled;
      if(this.VATEnabled){
        this.VAT = parseInt(this.cart.totalShippingTax) + parseInt(this.cart.totalSalesTax);
      }
    });
  }

  ngOnDestroy(){
    this._cartSubscriber.unsubscribe();
    try {
      (<any>$('#' + this.componentName + '_discount_' + this.id)).foundation("_destroy");
    }
    catch (e) { }
  }

  ngAfterViewInit() {
    (<any>$('#' + this.componentName + '_discount_' + this.id)).foundation();
  }

  @Input()
  set isCheckout(isCheckout: boolean){
    this._isCheckout = !!isCheckout;
  }

  get isCheckout(): boolean{
    return this._isCheckout;
  }
  set cart( cart: any ) {
    this._cart = cart;
    let template;
    let adjustment = [];
    if(this._cart && this._cart.orderItem && this._cart.orderItem[0]){
      adjustment = this._cart.orderItem[0].adjustment || adjustment;
    }
    for (let dis of adjustment){
      template = (template ||'') + "<li>" + dis.description +"</li>";
    }
    if (template){
      template = "<ul class=\"no-bullet\">" + template + "</>";
        this.tooltipText = template;
        $('.tooltip' + '.' + this.componentName).html(template);
    }
  }

  get cart(): any {
    return this._cart;
  }

}
