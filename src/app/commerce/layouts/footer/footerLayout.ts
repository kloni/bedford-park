import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeFooterComponent } from './../../components/footer/typeFooterComponent';

/*
 * @name footerLayout
 * @id footer-layout
 */
@LayoutComponent({
    selector: 'footer-layout'
})
@Component({
  selector: 'app-footer-layout-component',
  templateUrl: './footerLayout.html',
  styleUrls: ['./footerLayout.scss'],
  preserveWhitespaces: false
})
export class FooterLayoutComponent extends TypeFooterComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    //copyright date
    currentYear: number = new Date().getFullYear();

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
