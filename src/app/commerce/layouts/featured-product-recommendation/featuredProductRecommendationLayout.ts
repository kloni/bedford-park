import {
    LayoutComponent,
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { TypeFeaturedProductComponent } from "app/commerce/components/featured-product/typeFeaturedProductComponent";
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ESpotService } from 'app/commerce/services/rest/transaction/eSpot.service';
import { ProductService } from 'app/commerce/services/product.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/shareReplay';

const isEqual = require('lodash/isEqual');

/*
 * @name featuredProductRecommendation
 * @id featured-product-recommendation
 */
@LayoutComponent({
    selector: 'featured-product-recommendation'
})
@Component({
  selector: 'app-featured-product-recommendation-layout-component',
  templateUrl: './featuredProductRecommendationLayout.html',
  preserveWhitespaces: false
})
export class FeaturedProductRecommendationLayoutComponent extends TypeFeaturedProductComponent {
    readonly ESPOT_TYPE_COMMON: string = "common";
    readonly ESPOT_TYPE_PAGE_PREFIX: string = "page-prefix";
    readonly ESPOT_TYPE_PAGE_SUFFIX: string = "page-suffix";
    readonly LAYOUT_ID:string = "feature-card";
    rc:RenderingContext;
    ctx:any;
    eSpot:any;

    constructor(
        private esSvc:ESpotService,
        private su:StorefrontUtils,
        private route:ActivatedRoute,
        private productService:ProductService) {
        super();
    }

    ngOnInit() {
        const onRenderingContext: Observable<any> =
            this.onRenderingContext
            .filter(Boolean)
            .pluck('name')
            .distinctUntilChanged(isEqual)
            .shareReplay(1);

        onRenderingContext.subscribe( rc => {
            /* istanbul ignore next */
            this.rc = rc;
            /* istanbul ignore next */
            if (this.useEspot) {
                this.generateCtxFromEspot(this.partNumberOrEspot);
            } else {
                this.generateCtx(this.partNumberOrEspot);
            }
        })
    }

    getFields():string {
        return "catalogEntryView,-catalogEntryView.buyable,-catalogEntryView.longDescription,-catalogEntryView.uniqueID,-catalogEntryView.resourceId,-catalogEntryView.hasSingleSKU,-catalogEntryView.numberOfSKUs,-catalogEntryView.sKUs,-catalogEntryView.attachments,-catalogEntryView.merchandisingAssociations,-catalogEntryView.components";
    }

    getProductDesc(partNumber): Promise<any>{
        return this.productService.findProductByPartNumber(
            partNumber,
            this.su.commerceStoreId,
            this.su.commerceCatalogId,
            this.su.commerceCurrency,
            this.getFields());
    }

    getSeoUrlByPartNumber(partNumber): Promise<string>{
        return this.su.getPageSeoUrlByIds([partNumber], 'product')
        .then( r => {
            return r['idc-product-' + partNumber];
        });
    }

    generateCtx(partNumber:string,eSpotDesc?:any){
        return this.getProductDesc(partNumber)
        .then( prodDesc => {
            this.getSeoUrlByPartNumber(partNumber)
            .then( seoUrl => {
                let c=JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
                c.id=partNumber;
                c.productDesc=prodDesc;
                c.productDesc.seoUrl = seoUrl;
                c.eSpotInternal=this.eSpot;
                c.eSpotDescInternal=eSpotDesc;
                c.selectedLayouts[0].layout.id=this.LAYOUT_ID;
                c.layouts.default.template=this.LAYOUT_ID;
                this.ctx=c;
            });
        });
    }

    generateCtxFromEspot(name:string):Promise<HttpResponse<any>> {
        let url = "/" + this.route.snapshot.url.join('');
        let pageName = this.su.getPageIdentifier(url) || '';
        let esName = name;

        return  this.esSvc.findByName({storeId:this.su.commerceStoreId,name:esName}).toPromise()
                .then((r:HttpResponse<any>)=>{
                    this.eSpot=r.body.MarketingSpotData[0];
                    let prodDescs:any[]=this.eSpot.baseMarketingSpotActivityData;
                    let product:string="";
                    let eSpotDesc:any;
                    for (let desc of prodDescs) {
                        if (desc.productPartNumber) {
                            product=desc.productPartNumber;
                            eSpotDesc=desc;
                            break;
                        }
                    }
                    this.generateCtx(product,eSpotDesc);
                    return r;
                });
    }

    getLayoutMode() {
        return "";
    }
}
