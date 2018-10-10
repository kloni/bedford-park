import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractChildPimCategoriesComponent } from './abstractChildPimCategoriesComponent';

/*
 * @name Child PIM categories
 * @id com.ibm.commerce.store.angular-types.child-pim-categories
 * @description Dynamically builds a list of child categories using the PIM hierarchy and displays the results as a list. Website user can click image in result and go to page
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-child-pim-categories-component',
  templateUrl: './typeChildPimCategoriesComponent.html',
  styleUrls: ['./typeChildPimCategoriesComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeChildPimCategoriesComponent extends AbstractChildPimCategoriesComponent {

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