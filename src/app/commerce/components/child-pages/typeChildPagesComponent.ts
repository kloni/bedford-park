import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractChildPagesComponent } from './abstractChildPagesComponent';

/*
 * @name Child pages
 * @id c7532e99-d428-4314-9088-40f3d8b5ed37
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-child-pages-component',
  templateUrl: './typeChildPagesComponent.html',
  styleUrls: ['./typeChildPagesComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeChildPagesComponent extends AbstractChildPagesComponent {

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