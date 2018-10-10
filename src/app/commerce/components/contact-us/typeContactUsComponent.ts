import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractContactUsComponent } from './abstractContactUsComponent';

/*
 * @name Contact Us
 * @id 0f4d2371-591b-4cca-b0e7-b6dff6e3a62f
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-contact-us-component',
  templateUrl: './typeContactUsComponent.html',
  styleUrls: ['./typeContactUsComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeContactUsComponent extends AbstractContactUsComponent {

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
