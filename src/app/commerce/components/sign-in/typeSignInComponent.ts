import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractSignInComponent } from './abstractSignInComponent';

/*
 * @name Sign-in
 * @id a41f0dad-2f13-4b0d-92fe-6ee6f33b674e
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-sign-in-component',
  templateUrl: './typeSignInComponent.html',
  styleUrls: ['./typeSignInComponent.scss']
})
*/
export class TypeSignInComponent extends AbstractSignInComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * common to all layouts.
     */
    
    constructor() {
        /* istanbul ignore next */
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
