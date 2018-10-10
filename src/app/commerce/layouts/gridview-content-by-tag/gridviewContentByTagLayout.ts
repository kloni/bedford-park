
import { ListviewContentByTagLayoutComponent } from "app/commerce/layouts/listview-content-by-tag/listviewContentByTagLayout";
import { LayoutComponent } from "ibm-wch-sdk-ng";
import { Component } from "@angular/core";

/*
 * @name gridviewContentByTag
 * @id gridview-content-by-tag
 */
@LayoutComponent({
    selector: 'gridview-content-by-tag'
})
@Component({
  selector: 'app-gridview-content-by-tag-layout-component',
  templateUrl: './gridviewContentByTagLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class GridviewContentByTagLayoutComponent extends ListviewContentByTagLayoutComponent {

}