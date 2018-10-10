import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractEventComponent } from './abstractEventComponent';

/*
 * @name Event
 * @id 10ed9f3f-ab41-45a9-ba24-d988974affa7
 * @description Content created from this template is included on the events page in the Oslo site.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-event-component',
  templateUrl: './typeEventComponent.html',
  styleUrls: ['./typeEventComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeEventComponent extends AbstractEventComponent {

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
