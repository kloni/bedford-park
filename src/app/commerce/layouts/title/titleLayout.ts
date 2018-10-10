import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeTitleComponent } from './../../components/title/typeTitleComponent';

/*
 * @name titleLayout
 * @id title-layout
 */
@LayoutComponent({
    selector: 'title-layout'
})
@Component({
  selector: 'app-title-layout-component',
  templateUrl: './titleLayout.html',
  styleUrls: ['./titleLayout.scss'],
  preserveWhitespaces: false
})
export class TitleLayoutComponent extends TypeTitleComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
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
