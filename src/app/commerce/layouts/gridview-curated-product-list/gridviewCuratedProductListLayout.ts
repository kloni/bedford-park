import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { StandardCuratedProductListLayoutComponent } from '../standard-curated-product-list/standardCuratedProductListLayout';

/*
 * @name gridviewCuratedProductListLayout
 * @id gridview-curated-product-list
 */
@LayoutComponent({
    selector: 'gridview-curated-product-list'
})
@Component({
  selector: 'app-gridview-curated-product-list-layout-component',
  templateUrl: '../gridview-product-recommendation/gridviewProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class GridviewCuratedProductListLayoutComponent extends StandardCuratedProductListLayoutComponent {
}
