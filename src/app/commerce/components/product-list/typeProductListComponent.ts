import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractProductListComponent } from './abstractProductListComponent';

/*
 * @name Product list
 * @id com.ibm.commerce.store.angular-types.productlist
 * @description Uses a two column layout with a 25/75% split in column width of Filters and Products respectively. Second products column is then split into 3 columns.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-product-list-component',
  templateUrl: './typeProductListComponent.html',
  styleUrls: ['./typeProductListComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeProductListComponent extends AbstractProductListComponent {

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
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
    }

}