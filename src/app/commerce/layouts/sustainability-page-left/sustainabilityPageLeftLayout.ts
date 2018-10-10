import {
  LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import { TypeSustainabilityPageComponent } from './../../components/sustainability-page/typeSustainabilityPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name Two column, left
 * @id sustainability-page-left
 */
@LayoutComponent({
    selector: 'sustainability-page-left'
})
@Component({
  selector: 'app-sustainability-page-left-layout-component',
  templateUrl: './sustainabilityPageLeftLayout.html',
  styleUrls: ['./sustainabilityPageLeftLayout.scss'],
  preserveWhitespaces: false
})
export class SustainabilityPageLeftLayoutComponent extends TypeSustainabilityPageComponent implements OnInit, OnDestroy {

  constructor(private utilService: UtilsService) {
    super(utilService);
  }

}


