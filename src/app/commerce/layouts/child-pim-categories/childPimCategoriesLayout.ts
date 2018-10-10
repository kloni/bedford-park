import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { ChildPimCategoriesComponent } from 'app/commerce/components/generic/child-pim-categories/child-pim-categories.component';

/*
 * @name childPimCategoriesLayout
 * @id child-pim-categories-layout
 */
@LayoutComponent({
    selector: 'child-pim-categories-layout'
})
@Component({
  selector: 'app-child-pim-categories-layout-component',
  templateUrl: './childPimCategoriesLayout.html',
  styleUrls: ['./childPimCategoriesLayout.scss'],
  preserveWhitespaces: false
})
export class ChildPimCategoriesLayoutComponent extends ChildPimCategoriesComponent {

}
