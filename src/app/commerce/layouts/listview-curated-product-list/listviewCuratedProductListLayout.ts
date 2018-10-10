import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { StandardCuratedProductListLayoutComponent } from '../standard-curated-product-list/standardCuratedProductListLayout';

/*
 * @name listviewCuratedProductListLayout
 * @id listview-curated-product-list
 */
@LayoutComponent({
    selector: 'listview-curated-product-list'
})
@Component({
  selector: 'app-listview-curated-product-list-layout-component',
  templateUrl: '../listview-product-recommendation/listviewProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class ListviewCuratedProductListLayoutComponent extends StandardCuratedProductListLayoutComponent {
    getLayoutId() {
        return "collection-card";
    }
}
