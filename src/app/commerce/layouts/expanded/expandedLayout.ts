import { ProductDetailLayoutComponent } from 'app/commerce/components/generic/product-detail/productDetailLayout';;
import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/*
 * @name expanded
 * @id expanded
 */
@LayoutComponent({
    selector: 'expanded'
})
@Component({
    selector: 'app-expanded-layout-component',
    templateUrl: './../../components/generic/product-detail/productDetailLayout.html',
    styleUrls: [
        './../../../components/generic/carousel/carousel.component.scss',
        './../../dynamic/pdp/pdp.dynamic.scss'
    ],
    preserveWhitespaces: false,
    encapsulation: ViewEncapsulation.None
})
export class ExpandedLayoutComponent extends ProductDetailLayoutComponent implements OnInit {
    ngOnInit() {
        this.specifyLayout("expanded");
        super.ngOnInit();
    }
}

