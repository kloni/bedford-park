import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypePhysicalStoreComponent } from './../../components/physical-store/typePhysicalStoreComponent';

/*
 * @name physicalStoreLayout
 * @id physical-store-layout
 */
@LayoutComponent({
    selector: 'physical-store-layout'
})
@Component({
  selector: 'app-physical-store-layout-component',
  templateUrl: './physicalStoreLayout.html',
  styleUrls: ['./physicalStoreLayout.scss'],
  preserveWhitespaces: false
})
export class PhysicalStoreLayoutComponent extends TypePhysicalStoreComponent {

    constructor() {
        super();
    }

}