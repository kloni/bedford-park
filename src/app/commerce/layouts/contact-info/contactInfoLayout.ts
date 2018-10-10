import {
  LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { TypeContactInfoComponent } from '../../components/contact-info/typeContactInfoComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name contactInfoLayout
 * @id contact-info-layout
 */
@LayoutComponent({
    selector: 'contact-info-layout'
})
@Component({
  selector: 'app-contact-info-layout-component',
  templateUrl: './contactInfoLayout.html',
  styleUrls: ['./contactInfoLayout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class ContactInfoLayoutComponent extends TypeContactInfoComponent implements OnInit {

    rContext: RenderingContext;
    public readonly IMAGE_KEY: string = 'icon';

    constructor(public utilsService: UtilsService) {
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
        this.safeSubscribe(this.onRenderingContext, renderingContext => {
            this.rContext = renderingContext;
        });
    }

}
