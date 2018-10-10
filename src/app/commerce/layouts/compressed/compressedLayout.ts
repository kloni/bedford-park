import { ProductDetailLayoutComponent } from 'app/commerce/components/generic/product-detail/productDetailLayout';;
import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/*
 * @name compressed
 * @id compressed
 */
@LayoutComponent({
    selector: 'compressed'
})
@Component({
    selector: 'app-compressed-layout-component',
    templateUrl: './../../components/generic/product-detail/productDetailLayout.html',
    styleUrls: [
        './../../../components/generic/carousel/carousel.component.scss',
        './../../dynamic/pdp/pdp.dynamic.scss'
    ],
    preserveWhitespaces: false,
    encapsulation: ViewEncapsulation.None
})
export class CompressedLayoutComponent extends ProductDetailLayoutComponent implements OnInit {
    ngOnInit() {
        this.specifyLayout("compressed");
        super.ngOnInit();
    }
}

