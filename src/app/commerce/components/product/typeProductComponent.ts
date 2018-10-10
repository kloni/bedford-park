import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractProductComponent } from './abstractProductComponent';

/*
 * @name Product
 * @id com.ibm.commerce.store.angular-types.product
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-product-component',
  templateUrl: './typeProductComponent.html',
  styleUrls: ['./typeProductComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeProductComponent extends AbstractProductComponent {
    constructor() {
        super();
    }
}
