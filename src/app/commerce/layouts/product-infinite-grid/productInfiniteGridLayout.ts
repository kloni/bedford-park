import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeProductGridWithContentComponent } from './../../components/product-grid-with-content/typeProductGridWithContentComponent';
import { ProductGridWithContentComponent } from './../../components/generic/product-grid/product-grid-with-content.component';
import { ProductListingTransactionService } from '../../services/componentTransaction/productlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { ProductListingInfiniteTransactionService } from 'app/commerce/services/componentTransaction/productlist-infinite.service';



/** Useful imports */
// import { map } from 'rxjs/operators/map';
// import { takeUntil } from 'rxjs/operators/takeUntil';
// import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/*
 * @name productInfiniteGrid
 * @id product-infinite-grid
 */
@LayoutComponent({
    selector: 'product-infinite-grid'
})
@Component({
  /**
  * Consider to code your component such that all elements will be immutable and that it only
  * depends on its inputs. This can e.g. be achieved by basing all state changes on observables.
  *
  * @see https://angular-2-training-book.rangle.io/handout/change-detection/change_detection_strategy_onpush.html
  *
  * import { ChangeDetectionStrategy } from '@angular/core';
  */
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-infinite-grid-layout-component',
  templateUrl: './productInfiniteGridLayout.html',
  styleUrls: ['./productInfiniteGridLayout.scss'],
  preserveWhitespaces: false
})
export class ProductInfiniteGridLayoutComponent extends ProductGridWithContentComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    constructor(
        productListingTransactionService : ProductListingInfiniteTransactionService, 
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