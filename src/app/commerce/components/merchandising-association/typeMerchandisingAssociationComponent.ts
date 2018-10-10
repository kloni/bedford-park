import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractMerchandisingAssociationComponent } from './abstractMerchandisingAssociationComponent';

/*
 * @name Merchandising association
 * @id com.ibm.commerce.store.angular-types.merchandising-association
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-merchandising-association-component',
  templateUrl: './typeMerchandisingAssociationComponent.html',
  styleUrls: ['./typeMerchandisingAssociationComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeMerchandisingAssociationComponent extends AbstractMerchandisingAssociationComponent {

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
