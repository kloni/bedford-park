import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractWishlistComponent } from './abstractWishlistComponent';

/** Useful imports */
// import { map } from 'rxjs/operators/map';
// import { takeUntil } from 'rxjs/operators/takeUntil';
// import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/*
 * @name Wishlist
 * @id com.ibm.commerce.store.angular-types.wishlist
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-wishlist-component',
  templateUrl: './typeWishlistComponent.html',
  styleUrls: ['./typeWishlistComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeWishlistComponent extends AbstractWishlistComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * common to all layouts.
     */

    constructor() {
        super();
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Expose your custom fields as observables in your class
         * and subscribe from the template via the async pipe.
         */

         /*
          * Sample
          *
          * const that = this;
          * const onDestroy = that.onOnDestroy;
          */
    }

}