import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractContactInfoComponent } from './abstractContactInfoComponent';

/*
 * @name Contact Info
 * @id 2725e6d0-11d2-4345-95c4-1a447c874bcb
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-contact-info-component',
  templateUrl: './typeContactInfoComponent.html',
  styleUrls: ['./typeContactInfoComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeContactInfoComponent extends AbstractContactInfoComponent {

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
