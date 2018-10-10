import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { CategoryRecommendationListComponent } from 'app/commerce/components/generic/category-recommendation-list/category-recommendation-list.component';

/*
 * @name categoryRecommendationLayout
 * @id category-recommendation-layout
 */
@LayoutComponent({
    selector: 'category-recommendation-layout'
})
@Component({
  selector: 'app-category-recommendation-layout-component',
  templateUrl: './categoryRecommendationLayout.html',
  styleUrls: ['./categoryRecommendationLayout.scss'],
  preserveWhitespaces: false
})
export class CategoryRecommendationLayoutComponent extends CategoryRecommendationListComponent {

}
