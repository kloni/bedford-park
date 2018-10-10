import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeCompanyPageComponent } from './../../components/company-page/typeCompanyPageComponent';

/*
 * @name companyPageLayout
 * @id company-page-layout
 */
@LayoutComponent({
    selector: 'company-page-layout'
})
@Component({
  selector: 'app-company-page-layout-component',
  templateUrl: './companyPageLayout.html',
  styleUrls: ['./companyPageLayout.scss'],
  preserveWhitespaces: false
})
export class CompanyPageLayoutComponent extends TypeCompanyPageComponent {

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
