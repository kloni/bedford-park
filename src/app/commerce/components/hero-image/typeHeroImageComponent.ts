import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractHeroImageComponent } from './abstractHeroImageComponent';

/*
 * @name Hero image
 * @id aca5ee5c-a89b-4cf8-aa62-e43a77674663
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-hero-image-component',
  templateUrl: './typeHeroImageComponent.html',
  styleUrls: ['./typeHeroImageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeHeroImageComponent extends AbstractHeroImageComponent {

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
