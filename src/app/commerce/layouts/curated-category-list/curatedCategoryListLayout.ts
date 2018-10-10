import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { CuratedCategoryListComponent } from 'app/commerce/components/generic/curated-category-list/curated-category-list.component';

/*
 * @name curatedCategoryListLayout
 * @id curated-category-list-layout
 */
@LayoutComponent({
    selector: 'curated-category-list-layout'
})
@Component({
  selector: 'app-curated-category-list-layout-component',
  templateUrl: './curatedCategoryListLayout.html',
  styleUrls: ['./curatedCategoryListLayout.scss'],
  preserveWhitespaces: false
})
export class CuratedCategoryListLayoutComponent extends CuratedCategoryListComponent {

}