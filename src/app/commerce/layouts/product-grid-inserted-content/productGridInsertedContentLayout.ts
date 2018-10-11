import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeProductGridInsertedContentComponent } from './../../components/product-grid-inserted-content/typeProductGridInsertedContentComponent';

/** Useful imports */
// import { map } from 'rxjs/operators/map';
// import { takeUntil } from 'rxjs/operators/takeUntil';
// import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

/*
 * @name productGridInsertedContentLayout
 * @id product-grid-inserted-content-layout
 */
@LayoutComponent({
    selector: 'product-grid-inserted-content-layout'
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
  selector: 'app-product-grid-inserted-content-layout-component',
  templateUrl: './productGridInsertedContentLayout.html',
  styleUrls: ['./productGridInsertedContentLayout.scss'],
  preserveWhitespaces: false
})
export class ProductGridInsertedContentLayoutComponent extends TypeProductGridInsertedContentComponent {

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