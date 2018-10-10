import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractCuratedCategoryListComponent } from './abstractCuratedCategoryListComponent';

/*
 * @name Curated category list
 * @id com.ibm.commerce.store.angular-types.curated-category-list
 * @description Hand selected collection of categories based on category identifiers
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-curated-category-list-component',
  templateUrl: './typeCuratedCategoryListComponent.html',
  styleUrls: ['./typeCuratedCategoryListComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeCuratedCategoryListComponent extends AbstractCuratedCategoryListComponent {

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