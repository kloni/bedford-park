import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeSustainabilityPageComponent } from './../../components/sustainability-page/typeSustainabilityPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';


/*
 * @name sustainabilityPageRight
 * @id 807f2fb8-19f2-4274-9427-e06a3ee407e0
 */
@LayoutComponent({
    selector: 'sustainability-page-right'
})
@Component({
  selector: 'app-sustainability-page-right-layout-component',
  templateUrl: './sustainabilityPageRightLayout.html',
  styleUrls: ['./sustainabilityPageRightLayout.scss'],
  preserveWhitespaces: false
})
export class SustainabilityPageRightLayoutComponent extends TypeSustainabilityPageComponent {

  constructor(private utilService: UtilsService) {
    super(utilService);
  }

}
