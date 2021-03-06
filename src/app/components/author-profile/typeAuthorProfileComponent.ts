import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractAuthorProfileComponent } from './abstractAuthorProfileComponent';

/*
 * @name Author profile
 * @id b0b91aad-8a9a-4d46-9aff-e35d004f0a1f
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-author-profile-component',
  templateUrl: './typeAuthorProfileComponent.html',
  styleUrls: ['./typeAuthorProfileComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeAuthorProfileComponent extends AbstractAuthorProfileComponent {

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
