import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractProductGridInsertedContentComponent } from './abstractProductGridInsertedContentComponent';

/** Useful imports */
// import { map } from 'rxjs/operators/map';
// import { takeUntil } from 'rxjs/operators/takeUntil';
// import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/*
 * @name Product Grid Inserted Content
 * @id 7e7b2096-031b-4ad1-8886-b0be506086eb
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-product-grid-inserted-content-component',
  templateUrl: './typeProductGridInsertedContentComponent.html',
  styleUrls: ['./typeProductGridInsertedContentComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeProductGridInsertedContentComponent extends AbstractProductGridInsertedContentComponent {

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