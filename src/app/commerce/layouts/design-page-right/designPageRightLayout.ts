import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeDesignPageComponent } from './../../components/design-page/typeDesignPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';


/*
 * @name designPageRight
 * @id 53256da5-689e-494c-9672-f3b7d6fd2aa8
 */
@LayoutComponent({
    selector: 'design-page-right'
})
@Component({
  selector: 'app-design-page-right-layout-component',
  templateUrl: './designPageRightLayout.html',
  styleUrls: ['./designPageRightLayout.scss'],
  preserveWhitespaces: false
})
export class DesignPageRightLayoutComponent extends TypeDesignPageComponent {

  constructor(private utilService: UtilsService) {
    super(utilService);
  }

}
