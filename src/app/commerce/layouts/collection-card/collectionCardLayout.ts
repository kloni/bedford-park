import {
    LayoutComponent, Category
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { ProductComponent } from './../../components/generic/product/product.component';
import { NgForm } from '@angular/forms';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
const isEqual = require('lodash/isEqual');

/*
 * @name collectionCard
 * @id collection-card
 */
@LayoutComponent({
    selector: 'collection-card'
})
@Component({
  selector: 'app-collection-card-layout-component',
  templateUrl: './collectionCardLayout.html',
  styleUrls: ['./collectionCardLayout.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class CollectionCardLayoutComponent extends ProductComponent implements AfterViewInit, OnInit {

    @ViewChild("newForm") newForm: NgForm;
    catSubj: Subject<Category> = new ReplaySubject<Category>();
    onAvailableServicesCat: Observable<Category> = this.catSubj.asObservable();
    onAvailableServiceTypes : Observable<string[]>;
    serviceTypes: any[] = [];

    isInventoryServiceRequired():boolean {
        return true;
    }

    ngAfterViewInit() {
        (<any>$(`#confirmationModal_${this.id}`)).foundation();
        (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation();
        (<any>$(`#${this.signInModelId}${this.id}`)).foundation();
        (<any>$(`#${this.newWishListModalId}_${this.id}`)).foundation();
        (<any>$(`#${this.storeLocatorModelId}${this.id}`)).foundation();
	}

    /**
     * pre-set z-index before wishlist dialog is opened,
     * if it is about to be opened, 999 for z-index
     * set others card z-index to be auto.
     * set others dropdown ul to be hide, and set dropdown icon to be correct.
     */
    prepareForDropDownClick() {
      const display=$(`#wishList_dropDown_${this.id}`).css('display');
      const targetCardId = `collectionCard_${this.id}`;
      $('div[id^=collectionCard_]').each(function(index) {
            if ($(this).attr('id') ===  targetCardId) {
                if (display ==='none')
                    $(this).css('z-index', '999');
                else
                    $(this).css('z-index', 'auto');
            } else {
                $(this).css('z-index', 'auto');
                $(this).find('ul[id^=wishList_dropDown_]').css('display', 'none');
                $(this).find('i[id^=dropdown_down_]').css('display', 'inline-block');
                $(this).find('i[id^=dropdown_up_]').css('display', 'none');
            }
      });
    }

    /**
     * delay dialog open by 100 milliseconds so any blur events may fire
     */
    openAddToWishListDropdown() {
      setTimeout(() => {
        if (!this.isSmall) {
            this.prepareForDropDownClick();
        }
        super.openAddToWishListDropdown();
      }, 100);
    }

    /**
     * trivial override to allow dropdown display to go thru seamlessly
     * @param id wishlist-id
     */
    addToWishList(id:string):Promise<any> {
      return super.addToWishList(id)
      .then(r=>$(`#collectionCard_${this.id}`).css('z-index', 'auto'))
    }

    showCreateModal() {
        this.newForm.reset();
        super.showCreateModal();
    }

    /**
     * Only get wishlists in card collection components.
     * update wishlists when login status changed.
     */
    ngOnInit() {
        this.subscriptions.push(this.onAvailableServices.subscribe(r=>{
            this.catSubj.next(r);
        }));

        super.ngOnInit();

        this.isGuest = StorefrontUtils.isGuestOrActingAs();
        if (!this.isGuest) {
            this.getWishLists();
        }

        let authUpdate = this.authSvc.authUpdate.subscribe(res => {
            this.isGuest = StorefrontUtils.isGuestOrActingAs();
            if (!this.isGuest) {
                this.getWishLists();
            }
        });

        this.subscriptions.push(authUpdate);

        const onAvailableServiceTypes: Observable<string[]> = this.onAvailableServiceTypes =
            this.onAvailableServicesCat
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .pluck('categoryPaths')
            .filter(Boolean)
            /* istanbul ignore next */
            .map(paths => Object.keys(paths).map(key => paths[key][1]))
            .distinctUntilChanged(isEqual)
            .shareReplay(1);

        /* istanbul ignore next */
        this.subscriptions.push(onAvailableServiceTypes.subscribe( service => { this.serviceTypes = service }));
    }
}
