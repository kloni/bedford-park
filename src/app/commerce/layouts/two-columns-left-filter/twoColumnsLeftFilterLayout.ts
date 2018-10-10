import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeProductListComponent } from './../../components/product-list/typeProductListComponent';

/*
 * @name twoColumnsLeftFilter
 * @id two-columns-left-filter
 */
@LayoutComponent({
    selector: 'two-columns-left-filter'
})
@Component({
  selector: 'app-two-columns-left-filter-layout-component',
  templateUrl: './twoColumnsLeftFilterLayout.html',
  styleUrls: ['./twoColumnsLeftFilterLayout.scss'],
  preserveWhitespaces: false
})
export class TwoColumnsLeftFilterLayoutComponent extends TypeProductListComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
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