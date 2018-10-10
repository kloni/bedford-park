import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractMyAccountLinkComponent } from './abstractMyAccountLinkComponent';

/*
 * @name MyAccountLink
 * @id 60f3f7b0-a808-403b-b5e0-44d0b678fff0
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-my-account-link-component',
  templateUrl: './typeMyAccountLinkComponent.html',
  styleUrls: ['./typeMyAccountLinkComponent.scss']
})
*/
export class TypeMyAccountLinkComponent extends AbstractMyAccountLinkComponent {

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
