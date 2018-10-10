import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { FeaturedProductRecommendationLayoutComponent } from "app/commerce/layouts/featured-product-recommendation/featuredProductRecommendationLayout";
import { CommerceEnvironment } from "app/commerce/commerce.environment";

/*
 * @name featuredProductRecommendationWithImageOnRight
 * @id featured-product-recommendation-with-image-on-right
 */
@LayoutComponent({
    selector: 'featured-product-recommendation-with-image-on-right'
})
@Component({
  selector: 'app-featured-product-recommendation-with-image-on-right-layout-component',
  templateUrl: '../featured-product-recommendation/featuredProductRecommendationLayout.html',
  preserveWhitespaces: false
})
export class FeaturedProductRecommendationWithImageOnRightLayoutComponent extends FeaturedProductRecommendationLayoutComponent {

    getLayoutMode():string {
        return CommerceEnvironment.featureCardImageRight;
    }
}
