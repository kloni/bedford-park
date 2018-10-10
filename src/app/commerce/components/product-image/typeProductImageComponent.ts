import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractProductImageComponent } from './abstractProductImageComponent';
import { Input } from '@angular/core/src/metadata/directives';

/*
 * @name Product Image
 * @id com.ibm.commerce.store.angular-types.productimage
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-product-image-component',
  templateUrl: './typeProductImageComponent.html',
  styleUrls: ['./typeProductImageComponent.scss'],
  preserveWhitespaces: false
})
*/

export class TypeProductImageComponent extends AbstractProductImageComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * common to all layouts.r
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
