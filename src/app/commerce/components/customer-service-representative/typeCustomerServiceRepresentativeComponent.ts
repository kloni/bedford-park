import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractCustomerServiceRepresentativeComponent } from './abstractCustomerServiceRepresentativeComponent';

/** Useful imports */
// import { map } from 'rxjs/operators/map';
// import { takeUntil } from 'rxjs/operators/takeUntil';
// import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/*
 * @name Customer service representative
 * @id com.ibm.commerce.store.angular-types.csr
 * @description Perform tasks as a customer service representative (CSR)
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-customer-service-representative-component',
  templateUrl: './typeCustomerServiceRepresentativeComponent.html',
  styleUrls: ['./typeCustomerServiceRepresentativeComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeCustomerServiceRepresentativeComponent extends AbstractCustomerServiceRepresentativeComponent {

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