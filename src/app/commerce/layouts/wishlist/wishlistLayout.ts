import { style } from '@angular/animations';
import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { TypeWishlistComponent } from './../../components/wishlist/typeWishlistComponent';
import { OrderTransactionService } from './../../services/componentTransaction/order.transaction.service'
import { NgForm } from '@angular/forms';
import { ProductService } from 'app/commerce/services/product.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { TranslateService } from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {
  FormControl,
} from '@angular/forms';
// import { ItemSortPipe } from '../../../common/itemSort/item-sort.pipe';
const uniqueId = require('lodash/uniqueId');


/*
 * @name wishlist
 * @id wishlist
 */
@LayoutComponent({
    selector: 'wishlist'
})
@Component({
  /**
  * Consider to code your component such that all elements will be immutable and that it only
  * depends on its inputs. This can e.g. be achieved by basing all state changes on observables.
  *
  * @see https://angular-2-training-book.rangle.io/handout/change-detection/change_detection_strategy_onpush.html
  *
  * import { ChangeDetectionStrategy } from '@angular/core';
  */
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wishlist-layout-component',
  templateUrl: './wishlistLayout.html',
  styleUrls: ['./wishlistLayout.scss'],
  preserveWhitespaces: false,
})
export class WishlistLayoutComponent extends TypeWishlistComponent implements OnInit, OnDestroy, AfterViewInit {
    id: any;

    wishLists : any[] = [];
    readonly newWishListModalId : string = "newWishListModal";
    readonly deleteWishListModalId : string = "deleteWishListModal";
    readonly renameInputId : string = "renameInput";
    selectedWishlist : any = {item:[],uniqueID:""};
    defaultListId: string;
    defaultListNameTranslated : string;
    products : any[] = []
    editNameBool: boolean = false;
    @ViewChild('newName') newNameInput: ElementRef;
    @ViewChild("newForm") newForm: NgForm;
    private resizeSub: Subscription;
    private isMobileWishDetail : boolean = false;

    constructor(
        private orderTranService: OrderTransactionService,
        protected productService: ProductService,
        protected storefrontUtils: StorefrontUtils,
        protected translate: TranslateService
    ) {
        super();
        this.resizeSub = Observable.fromEvent(window, 'resize')
        .debounceTime(200)
        .distinctUntilChanged()
        .subscribe((screen: any) => {
            let screenWidth = screen.target.innerWidth;
            this.onResize(screenWidth);
        });
        this.id = uniqueId();
    }

    ngOnInit() {
        /** Get translated name of default wishlist in current langauge */
        this.translate.get("wishlist.DefaultListName").subscribe(res => {
            this.defaultListNameTranslated = res;
            this.updateWishlists("");
        });

        let screenWidth = window.innerWidth;
        this.onResize(screenWidth);
    }

    ngAfterViewInit() {
      [this.deleteWishListModalId, this.newWishListModalId]
      .forEach(mId=>{
        (<any>$(`#${mId}_${this.id}`)).foundation();
      });
  }

    ngOnDestroy() {
        this.resizeSub.unsubscribe();
        [this.deleteWishListModalId, this.newWishListModalId]
        .forEach(mId=>{
          const obj=(<any>$(`#${mId}_${this.id}`))
          if (obj.length > 0) {
            if (typeof obj.foundation === 'function') {
              obj.foundation('close');
              obj.foundation('_destroy');
            }
            obj.remove();
          }
        });

        // clear all local variables.
        this.wishLists = [];
        this.selectedWishlist = {item:[],uniqueID:""};
        this.defaultListId = "";
        this.products = []
    }

    private updateWishlists(wishListId: string): Promise<any> {
        return this.orderTranService.getAllWishList().then(res => {
            this.editNameBool = false;
            this.newNameInput.nativeElement.style.display = "none";
            this.wishLists = res.GiftList;
            this.wishLists = this.wishLists.map(list => {
                if (list.item === undefined)
                    list.item = [];
                return list;
            });

            if (this.wishLists.length > 0) {
                this.selectedWishlist = this.wishLists.find(wishList => {

                    if (wishList.descriptionName === "DefaultListName") {
                        this.defaultListId = wishList.uniqueID;
                        if (wishListId === "") {
                            return wishList;
                        }
                    }

                    if (wishListId === wishList.uniqueID) {
                        return wishList;
                    }
                });

                this.updateWishListItems();
            }
        });
    }

    updateWishListItems() {
        this.editNameBool = false;
        this.newNameInput.nativeElement.style.display = "none";
        let productIds = this.selectedWishlist.item.map(item=>item.productId);

        this.productService.findProductByIds(this.storefrontUtils.commerceStoreId,
                                            productIds,
                                            "catalogEntryView.uniqueID,"+
                                            "catalogEntryView.thumbnail,"+
                                            "catalogEntryView.price,"+
                                            "catalogEntryView.name,"+
                                            "catalogEntryView.partNumber,"+
                                            "catalogEntryView.parentCatalogEntryID").then(childProducts => {
            const parentIds = childProducts.map(c=>c.parentCatalogEntryID);

            this.productService.findProductByIds(this.storefrontUtils.commerceStoreId,
                parentIds,
                "catalogEntryView.uniqueID,"+
                "catalogEntryView.partNumber,"+
                "catalogEntryView.catalogEntryTypeCode"
                ).then(parentProducts => {

                this.storefrontUtils.getSeoUrlMapForProducts(parentProducts).then(urlIdMap =>{
                    childProducts = childProducts.map(c => {
                        let parent = parentProducts.find(p => {
                            if (p.uniqueID === c.parentCatalogEntryID)
                                return p;
                        })
                        c['seoUrl'] = urlIdMap['idc-product-'+parent.partNumber]
                        return c;
                    })

                    this.products = this.selectedWishlist.item.map(i =>{
                        let tmp = {};
                        let p = childProducts.find(p => {
                            if (p.uniqueID === i.productId)
                                return p;
                        });
                        tmp['thumbnail'] = p.thumbnail;
                        tmp['name'] = p.name;
                        tmp['price'] = p.price;
                        tmp['productId'] = i.productId;
                        tmp['itemId'] = i.giftListItemID;
                        tmp['seoUrl'] = p.seoUrl;
                        return tmp;
                    });
                });
            })
        });
    }

    wishListCreation(f: NgForm) {
        let isValidName = this.wishlistNameValidation(f.value.descriptionName);
        if (!isValidName) {
            return;
        }

        this.orderTranService.createNewWishList([], f.value.descriptionName, "").then(res => {
            this.updateWishlists(res.uniqueID);
            f.reset();
            this.closeModal(this.newWishListModalId);
        })
    }

    removeItem(event: any) {
        this.orderTranService.deleteWishListItem(this.selectedWishlist.externalIdentifier, event.itemId, event.productId).then(res =>{
            this.updateWishlists(this.selectedWishlist.uniqueID);
        });
    }

    removeList() {
      this.openModal(this.deleteWishListModalId);
    }

    removeListConfirmation() {
        this.orderTranService.deleteWishList(this.selectedWishlist.externalIdentifier).then(res=>{
            this.updateWishlists("");
            this.closeModal(this.deleteWishListModalId);
        })
    }

    changeName(name: string) {
        if (name === this.selectedWishlist.descriptionName) {
            this.editNameBool = false;
            this.newNameInput.nativeElement.style.display = "none";
            return;
        }
        let isValidName = this.wishlistNameValidation(name);
        if (!isValidName) {
            this.editNameBool = true;
            this.newNameInput.nativeElement.style.border = "2px solid #cc4b37";
            return;
        }
        this.orderTranService.changeWishListName(this.selectedWishlist.externalIdentifier, name).then(res=>{
            this.updateWishlists(this.selectedWishlist.uniqueID);
            this.editNameBool = false;
            this.newNameInput.nativeElement.style.display = "none";
            this.newNameInput.nativeElement.style.border = "";
        });
    }

    showCreateModal() {
        this.newForm.reset();
        this.openModal(this.newWishListModalId);
    }

    showRenameInput() {
        this.editNameBool = true;
        this.newNameInput.nativeElement.style.display = "inline";
        this.newNameInput.nativeElement.focus();
    }

    moveToWishList(event: any) {
        return this.orderTranService.addItemToWishList(event.targetId, event.productId).then(res=>{
            this.removeItem(event);
        });
    }

    onResize(screenWidth: number) {

        if (screenWidth >= 640) {
            // medium and large
            $('span#wishlist_details').css('display','inline');
        } else {
            // small
            if (this.isMobileWishDetail) {
                $('span#wishlist_details').css('display','inline');
                $('span#all_wishlists_mobile').css('display','none');
            } else {
                $('span#wishlist_details').css('display','none');
                $('span#all_wishlists_mobile').css('display','inline');
            }
        }
    }

    showWishlistDetail(wishListId: string) {
        this.selectedWishlist = this.wishLists.find(w => {
            if (w.uniqueID === wishListId)
                return w;
        });
        this.updateWishListItems();
        this.isMobileWishDetail = true;
        let screenWidth = window.innerWidth;
        this.onResize(screenWidth);
    }

    showAllWishlists() {
        this.isMobileWishDetail = false;
        let screenWidth = window.innerWidth;
        this.onResize(screenWidth);
    }

    wishlistNameValidation(name: string) {
        if (name === '' || name.startsWith(' ') || name.length > 16 || name === "DefaultListName") {
            return false;
        } else {
            return true;
        }
    }

    openModal(mId:string) {
      (<any>$(`#${mId}_${this.id}`)).foundation('open');
    }

    closeModal(mId:string) {
      (<any>$(`#${mId}_${this.id}`)).foundation('close');
    }
}