import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractRegistrationComponent } from './abstractRegistrationComponent';

/*
 * @name Registration
 * @id 60dd61ff-5cfe-4d33-90fe-fc8714607133
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-registration-component',
  templateUrl: './typeRegistrationComponent.html',
  styleUrls: ['./typeRegistrationComponent.scss']
})
*/
export class TypeRegistrationComponent extends AbstractRegistrationComponent {

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
