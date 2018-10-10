import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { TypeProductImageComponent } from './../../components/product-image/typeProductImageComponent';
import * as $ from 'jquery';

/*
 * @name productDetailsImage
 * @id product-details-image
 */
@LayoutComponent({
    selector: 'product-details-image'
})
@Component({
  selector: 'app-product-details-image-layout-component',
  templateUrl: './productDetailsImageLayout.html',
  styleUrls: ['./productDetailsImageLayout.scss'],
  preserveWhitespaces: false
})
export class ProductDetailsImageLayoutComponent extends TypeProductImageComponent implements OnInit, AfterViewInit {
    ctx:any;
    images:any={thumb:"", full:""};
    thumbId:string="";

    ngOnInit() {
        super.ngOnInit();
        this.safeSubscribe(this.onRenderingContext, /* istanbul ignore next */(renderingContext) => {
            this.ctx=renderingContext;
            this.thumbId=this.ctx.id.split("_").pop()
            this.images=JSON.parse(JSON.stringify(this.ctx.images));
        });
    }

    ngAfterViewInit() {
        let thumb = $("#pdpCarThumbId_"+this.thumbId).find("img");
        if (!thumb.attr("src")) {
            thumb.attr("src", this.images.thumb);
        }
    }
}
