import {
  LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TypeContactUsComponent } from './../../components/contact-us/typeContactUsComponent';
const uniqueId = require('lodash/uniqueId');

/*
 * @name contactUsLayout
 * @id contact-us-layout
 */
@LayoutComponent({
    selector: 'contact-us-layout'
})
@Component({
  selector: 'app-contact-us-layout-component',
  templateUrl: './contactUsLayout.html',
  styleUrls: ['./contactUsLayout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class ContactUsLayoutComponent extends TypeContactUsComponent implements OnInit {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    id: any;
    rContext: RenderingContext;
    contextList: RenderingContext[]= [];
    public readonly LOCATION_WIDTH: number = 600;
    public readonly LOCATION_HEIGHT: number = 300;

    constructor() {
        super();
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
    }
    ngOnInit() {
        super.ngOnInit();
        this.id = uniqueId();
        this.safeSubscribe(this.onRenderingContext, renderingContext => {
            this.rContext = renderingContext;
            this.contextList = this.rContext.elements.contactDetails.values;
        });
    }

    encodeAddress(address) {
      return encodeURI(address);
    }
}
