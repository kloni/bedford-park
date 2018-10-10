import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { CartTransactionService } from './../../../services/componentTransaction/cart.transaction.service';
import { Subscription } from 'rxjs/Subscription';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-wishlist-card-layout',
  templateUrl: './wishlist-card-layout.html',
  styleUrls: ['./wishlist-card-layout.scss']
})
export class WishlistCardLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input('wishListId') wishListId;
  @Input('product') product;
  id : string;
  @Input('wishlists') wishlists: any[];
  @Output('removeItem') removeEmitter = new EventEmitter<{wishListId,productId,itemId}>();
  @ViewChild("itemDropDown") itemDropDown : ElementRef;
  @Output('newWishList') newWishListEmitter = new EventEmitter<void>();
  @Output('moveToWishList') moveToEmitter = new EventEmitter<{targetId, oldId, productId,itemId}>();
  AddedToCart: boolean = false;
  numInCart: number = 0;
  cartSub : Subscription;
  constructor(
    private cartService: CartTransactionService) {
  }


  ngOnInit() {
    this.id = uniqueId();
    this.cartSub = this.cartService.cartSubject.subscribe(cart=>{
        if (!cart)
            return;

        this.numInCart = 0;
        let items : any[] = cart.orderItem;
        if (items !== undefined) {
            items.forEach(item=>{
                if ( item.productId === this.product.productId) {
                    this.numInCart++;
                }
            });
        }
    });
  }

  ngOnDestroy(){
    if ((<any>$(`#confirmationModal_${this.id}`)).length > 0) {
        (<any>$(`#confirmationModal_${this.id}`)).foundation('close');
        (<any>$(`#confirmationModal_${this.id}`)).foundation('_destroy');
        (<any>$(`#confirmationModal_${this.id}`)).remove();
    }
  }

  ngAfterViewInit() {
    (<any>$(`#confirmationModal_${this.id}`)).foundation();
  }

  addToCart() {
    this.cartService.addToCart(1, this.product.productId).then(res =>{
        this.AddedToCart = true;
        setTimeout(()=>{
            this.AddedToCart = false;
        }, 10000);
    }).catch(e=>{
        (<any>$(`#confirmationModal_${this.id}`)).foundation('open');
        setTimeout(() => {
            (<any>$(`#confirmationModal_${this.id}`)).foundation('close');
        }, 4000);
    });
  }

  removeItem() {
    this.removeEmitter.emit({
        wishListId: this.wishListId,
        productId :this.product.productId,
        itemId: this.product.itemId
    })
  }

  showItemDropdown() {
    this.itemDropDown.nativeElement.style.display = "inline-block";
    this.itemDropDown.nativeElement.focus();
  }

  hideItemDropdown() {
    this.itemDropDown.nativeElement.style.display = "none";
  }

  newWishList() {
    this.newWishListEmitter.emit();
    this.hideItemDropdown();
  }

  moveToWishList(targetId: string) {
      let event = {
        targetId: targetId,
        productId: this.product.productId,
        itemId: this.product.itemId,
        oldId: this.wishListId
      }
      this.moveToEmitter.emit(event);
      this.hideItemDropdown();
  }
}
