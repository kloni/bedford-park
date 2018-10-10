import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, ViewEncapsulation } from '@angular/core';
import { ProductComponent } from './../../components/generic/product/product.component';

/*
 * @name productCard
 * @id product-card
 */
@LayoutComponent({
    selector: 'product-card'
})
@Component({
  selector: 'app-product-card-layout-component',
  templateUrl: './productCardLayout.html',
  styleUrls: ['./../../components/generic/product/product.component.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class ProductCardLayoutComponent extends ProductComponent {

    getFields():string {
        return "catalogEntryView,-catalogEntryView.buyable,-catalogEntryView.longDescription,-catalogEntryView.shortDescription,-catalogEntryView.resourceId,-catalogEntryView.hasSingleSKU,-catalogEntryView.numberOfSKUs,-catalogEntryView.sKUs,-catalogEntryView.attachments,-catalogEntryView.merchandisingAssociations,-catalogEntryView.components";
    }
}