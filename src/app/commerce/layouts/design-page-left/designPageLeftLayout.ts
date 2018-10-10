import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeDesignPageComponent } from './../../components/design-page/typeDesignPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';

const uniqueId = require('lodash/uniqueId');

/*
 * @name designPageLeft
 * @id 20e018d7-7b88-4a45-9b24-449dcb917661
 */
@LayoutComponent({
    selector: 'design-page-left'
})
@Component({
  selector: 'app-design-page-left-layout-component',
  templateUrl: './designPageLeftLayout.html',
  styleUrls: ['./designPageLeftLayout.scss'],
  preserveWhitespaces: false
})
export class DesignPageLeftLayoutComponent extends TypeDesignPageComponent {

  id: any;

  constructor(private utilService: UtilsService) {
    super(utilService);
    this.id = uniqueId();
  }

}
