import { LayoutComponent, RenderingContext } from 'ibm-wch-sdk-ng';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TypeProductRecommendationComponent } from 'app/commerce/components/product-recommendation/typeProductRecommendationComponent';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ESpotService } from 'app/commerce/services/rest/transaction/eSpot.service';
import { ProductService } from 'app/commerce/services/product.service';

/*
 * @name standardProductRecommendation
 * @id standard-product-recommendation
 */
@LayoutComponent({
    selector: 'standard-product-recommendation'
})
@Component({
  selector: 'app-standard-product-recommendation-layout-component',
  templateUrl: './standardProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class StandardProductRecommendationLayoutComponent extends TypeProductRecommendationComponent implements OnInit {
    readonly ESPOT_TYPE_COMMON: string = "common";
    readonly ESPOT_TYPE_PAGE_PREFIX: string = "page-prefix";
    readonly ESPOT_TYPE_PAGE_SUFFIX: string = "page-suffix";
    showTitle:boolean=true;
    slides:any[];
    slideConfig:any=CommerceEnvironment.recommendationCarouselConfig;
    eSpotObject:any;

    /* istanbul ignore next */
    constructor(private esSvc:ESpotService,
                /* istanbul ignore next */
                private su:StorefrontUtils,
                /* istanbul ignore next */
                private route:ActivatedRoute,
                private productService:ProductService) {
        super();
    }

    ngOnInit() {
        this.safeSubscribe(this.onRenderingContext, /* istanbul ignore next */(renderingContext) => {
            /* istanbul ignore next */
            if (this.eSpot && this.eSpot.selection) {
                let eSpotName = this.eSpot.selection;
                this.generateSlidesFromEspot(eSpotName, this.eSpot.type);
            }
        });
    }

    generateSlidesFromEspot(name:string,type:string):Promise<HttpResponse<any>> {
        let url = "/" + this.route.snapshot.url.join('');
        let pageName = this.su.getPageIdentifier(url) || '';
        let esName = name;

        if (type == this.ESPOT_TYPE_PAGE_SUFFIX) {
            esName = name + pageName
        } else if (type == this.ESPOT_TYPE_PAGE_PREFIX) {
            esName = pageName + name;
        }

        return this.esSvc.findByName({storeId:this.su.commerceStoreId,name:esName}).toPromise()
        .then((r:HttpResponse<any>)=>{
            const rootEspot=r.body.MarketingSpotData[0];
            this.eSpotObject=rootEspot;
            const prodDescs:any[]=rootEspot.baseMarketingSpotActivityData;

            if (!!prodDescs) {
              this.getProductDetails(prodDescs)
              .then( productDetails => {
                  // first array is always urlIdentifierMap
                  const urlIdentifierMap = productDetails[0];
                  const products = {};
                  const buffer:any[]=[];

                  productDetails.shift();
                  productDetails.forEach( obj => {
                      products[obj.partNumber] = obj;
                  });
                  for (let desc of prodDescs) {
                      if (desc.productPartNumber) {
                          let s=JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
                          s.id=`${desc.productPartNumber}_${buffer.length}`;
                          s.productDesc=products[desc.productPartNumber];
                          s.productDesc.seoUrl = urlIdentifierMap['idc-product-' + desc.productPartNumber];
                          s.eSpotInternal=rootEspot;
                          s.eSpotDescInternal=desc;
                          s.selectedLayouts[0].layout.id=this.getLayoutId();
                          s.layouts.default.template=this.getLayoutId();
                          buffer.push(s);
                      }
                  }
                  this.showTitle=!!buffer.length;
                  this.slides=buffer;
              });
            } else {
              this.showTitle=false;
            }

            return r;
        });
    }

    getLayoutId() {
        return "product-card";
    }

    getProductDetails(products){
        let partNumbers = products.map( product => product.productPartNumber);
        let promises = [];
        promises.push(this.su.getPageSeoUrlByIds(partNumbers, 'product'));
        for( let partNumber of partNumbers) {
            promises.push(
                this.productService.findProductByPartNumber(
                    partNumber,
                    this.su.commerceStoreId,
                    this.su.commerceCatalogId,
                    this.su.commerceCurrency)
            );
        }
        return Promise.all(promises);
    }
}
