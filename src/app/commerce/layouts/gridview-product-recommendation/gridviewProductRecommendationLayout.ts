import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { StandardProductRecommendationLayoutComponent } from '../standard-product-recommendation/standardProductRecommendationLayout';

/*
 * @name gridviewProductRecommendationLayout
 * @id gridview-product-recommendation
 */
@LayoutComponent({
    selector: 'gridview-product-recommendation'
})
@Component({
  selector: 'app-gridview-product-recommendation-layout-component',
  templateUrl: './gridviewProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class GridviewProductRecommendationLayoutComponent extends StandardProductRecommendationLayoutComponent {
}
