import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeDesignIdeasPageComponent } from './../../components/design-ideas-page/typeDesignIdeasPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name designIdeasPageLayout
 * @id design-ideas-page-layout
 */
@LayoutComponent({
    selector: 'design-ideas-page-layout'
})
@Component({
  selector: 'app-design-ideas-page-layout-component',
  templateUrl: './designIdeasPageLayout.html',
  styleUrls: ['./designIdeasPageLayout.scss'],
  preserveWhitespaces: false
})
export class DesignIdeasPageLayoutComponent extends TypeDesignIdeasPageComponent {


  constructor(private utilService: UtilsService) {
    super(utilService);
  }

}
