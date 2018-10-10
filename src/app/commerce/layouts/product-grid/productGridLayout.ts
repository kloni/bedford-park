import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { ProductGridComponent } from './../../components/generic/product-grid/product-grid.component';
import { ProductListingTransactionService } from '../../services/componentTransaction/productlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
/*
 * @name productGridLayout
 * @id product-grid-layout
 */
@LayoutComponent({
    selector: 'product-grid-layout'
})
@Component({
  selector: 'app-product-grid-layout-component',
  templateUrl: './productGridLayout.html',
  styleUrls: ['./productGridLayout.scss'],
  preserveWhitespaces: false
})
export class ProductGridLayoutComponent extends ProductGridComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    constructor(
        productListingTransactionService : ProductListingTransactionService, 
        route: ActivatedRoute,
        storefrontUtils: StorefrontUtils, 
        router: Router,
        bcService: BreadcrumbService) {
        super(productListingTransactionService, route, storefrontUtils, router, bcService);
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
    }

}