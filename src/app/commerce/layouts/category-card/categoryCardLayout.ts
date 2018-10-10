import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, ViewEncapsulation } from '@angular/core';
import { CategoryComponent } from 'app/commerce/components/generic/category/category.component';

/*
 * @name categoryCard
 * @id category-card
 */
@LayoutComponent({
    selector: 'category-card'
})
@Component({
  selector: 'app-category-card-layout-component',
  templateUrl: './categoryCardLayout.html',
  styleUrls: ['./../../components/generic/category/category.component.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class CategoryCardLayoutComponent extends CategoryComponent {

}