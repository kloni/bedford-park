import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractOrderHistoryComponent } from './abstractOrderHistoryComponent';

/*
 * @name Order History
 * @id com.ibm.commerce.store.angular-types.orderhistory
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-order-history-component',
  templateUrl: './typeOrderHistoryComponent.html',
  styleUrls: ['./typeOrderHistoryComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeOrderHistoryComponent extends AbstractOrderHistoryComponent {

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
  
