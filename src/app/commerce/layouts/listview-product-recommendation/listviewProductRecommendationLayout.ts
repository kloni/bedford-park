import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { StandardProductRecommendationLayoutComponent } from '../standard-product-recommendation/standardProductRecommendationLayout';

/*
 * @name listviewProductRecommendationLayout
 * @id listview-product-recommendation
 */
@LayoutComponent({
    selector: 'listview-product-recommendation'
})
@Component({
  selector: 'app-listview-product-recommendation-layout-component',
  templateUrl: './listviewProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class ListviewProductRecommendationLayoutComponent extends StandardProductRecommendationLayoutComponent {
    getLayoutId() {
      return "collection-card";
    }
}
