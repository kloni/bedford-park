import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractCompanyPageComponent } from './abstractCompanyPageComponent';

/*
 * @name Company page
 * @id fa65a34c-fa4f-4e22-93ac-535a1f052b79
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-company-page-component',
  templateUrl: './typeCompanyPageComponent.html',
  styleUrls: ['./typeCompanyPageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeCompanyPageComponent extends AbstractCompanyPageComponent {

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
