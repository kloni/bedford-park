import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TypeMyAccountLinkComponent } from './../../components/my-account-link/typeMyAccountLinkComponent';
import { Constants } from 'app/Constants';

const uniqueId = require('lodash/uniqueId');

/*
 * @name myAccountLinkLayout
 * @id my-account-link-layout
 */
@LayoutComponent({
    selector: 'my-account-link-layout'
})
@Component({
  selector: 'app-my-account-link-layout-component',
  templateUrl: './myAccountLinkLayout.html',
  styleUrls: ['./myAccountLinkLayout.scss']
})
export class MyAccountLinkLayoutComponent extends TypeMyAccountLinkComponent implements OnInit, OnDestroy {
    @Input() layoutMode: string;
	rContext: RenderingContext;
	constants: any = Constants;
    imgUri: any;
    id: any;

    constructor() {
        super();
    }

	ngOnInit() {
        this.id = uniqueId();
		super.ngOnInit();
		this.safeSubscribe(this.onRenderingContext, (renderingContext) => {
            this.rContext = renderingContext;
            this.imgUri = this.rContext.context.hub.deliveryUrl["origin"] + this.image.url;
			this.layoutMode = this.layoutMode || this.constants.DETAIL;
		});
	}

	ngOnDestroy () {
		super.ngOnDestroy();
	}
}
