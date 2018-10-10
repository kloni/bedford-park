import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeTimelessIconsPageComponent } from './../../components/timeless-icons-page/typeTimelessIconsPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name timelessIconsPageLayout
 * @id timeless-icons-page-layout
 */
@LayoutComponent({
    selector: 'timeless-icons-page-layout'
})
@Component({
  selector: 'app-timeless-icons-page-layout-component',
  templateUrl: './timelessIconsPageLayout.html',
  styleUrls: ['./timelessIconsPageLayout.scss'],
  preserveWhitespaces: false
})
export class TimelessIconsPageLayoutComponent extends TypeTimelessIconsPageComponent {

  constructor(private utilService: UtilsService) {
    super(utilService);
  }

}
