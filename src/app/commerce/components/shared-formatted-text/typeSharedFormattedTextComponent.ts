import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractSharedFormattedTextComponent } from './abstractSharedFormattedTextComponent';

/*
 * @name Shared formatted text
 * @id 02f73c77-3c1f-48ec-98d0-3470193270e0
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-shared-formatted-text-component',
  templateUrl: './typeSharedFormattedTextComponent.html',
  styleUrls: ['./typeSharedFormattedTextComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeSharedFormattedTextComponent extends AbstractSharedFormattedTextComponent {

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