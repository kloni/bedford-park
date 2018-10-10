import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { AbstractContentRecommendationComponent } from './abstractContentRecommendationComponent';

/*
 * @name Content Recommendation
 * @id com.ibm.commerce.store.angular-types.content-recommendation
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-content-recommendation-component',
  templateUrl: './typeContentRecommendationComponent.html',
  styleUrls: ['./typeContentRecommendationComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeContentRecommendationComponent extends AbstractContentRecommendationComponent {

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
