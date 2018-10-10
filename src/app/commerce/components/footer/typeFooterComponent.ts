import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractFooterComponent } from './abstractFooterComponent';

/*
 * @name Footer
 * @id cbde3c3b-d03f-484b-8aa2-0c35227db10c
 * @description Customize elements of the footer that shows up on website pages.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-footer-component',
  templateUrl: './typeFooterComponent.html',
  styleUrls: ['./typeFooterComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeFooterComponent extends AbstractFooterComponent {

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
