import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractSharedTextComponent } from './abstractSharedTextComponent';

/*
 * @name Shared text
 * @id 2b289ecc-5c98-4a9b-b591-f288e8a1394a
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-shared-text-component',
  templateUrl: './typeSharedTextComponent.html',
  styleUrls: ['./typeSharedTextComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeSharedTextComponent extends AbstractSharedTextComponent {

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