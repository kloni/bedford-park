import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractListComponent } from './abstractListComponent';

/*
 * @name List
 * @id 9aeeecef-85ce-4d41-a797-1ad27735d0cb
 * @description Use this to create curated lists of content to feature throughout your website. In Oslo we use it to create the Editor's Choice list which show up on the design.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-list-component',
  templateUrl: './typeListComponent.html',
  styleUrls: ['./typeListComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeListComponent extends AbstractListComponent {

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
