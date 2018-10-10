import {
    LayoutComponent, OptionSelection, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TypeMerchandisingAssociationComponent } from './../../components/merchandising-association/typeMerchandisingAssociationComponent';
import { ActivatedRoute, Params } from '@angular/router';
import { Logger } from "angular2-logger/core";
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ProductService } from 'app/commerce/services/product.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from "app/Constants";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/shareReplay';
import { filterNotNil, shareLast } from "ibm-wch-sdk-utils";
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';


const isEqual = require('lodash/isEqual');

/*
 * @name merchandisingAssociationLayout
 * @id merchandising-association-layout
 */
@LayoutComponent({
    selector: 'merchandising-association-layout'
})
@Component({
  selector: 'app-merchandising-association-layout-component',
  templateUrl: '../standard-product-recommendation/standardProductRecommendationLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class MerchandisingAssociationLayoutComponent extends TypeMerchandisingAssociationComponent implements OnDestroy {
    /* services */
    su:StorefrontUtils;
    route:ActivatedRoute;
    prodSvc:ProductService;
    logger:Logger;
    rc:RenderingContext;
    paramSub:Subscription;
    eSpotObject:any;


    /* everything else */
    readonly skel:any={
        langId: '-1',
        storeId: "",
        catalogid: "",
        partNumber: "",
        _fields: "catalogEntryView.merchandisingAssociations,-catalogEntryView.merchandisingAssociations.buyable,-catalogEntryView.merchandisingAssociations.longDescription,-catalogEntryView.merchandisingAssociations.shortDescription,-catalogEntryView.merchandisingAssociations.resourceId,-catalogEntryView.merchandisingAssociations.hasSingleSKU,-catalogEntryView.merchandisingAssociations.numberOfSKUs,-catalogEntryView.merchandisingAssociations.sKUs,-catalogEntryView.merchandisingAssociations.attachments",
        associationType: []
    };
    restp:any=JSON.parse(JSON.stringify(this.skel));

    showTitle:boolean=false;
    product:any;
    slides:any[];
    productId: any;
    slideConfig:any=CommerceEnvironment.recommendationCarouselConfig;
    private readonly pdpLink:string;

    /* istanbul ignore next */
    constructor(su_:StorefrontUtils,
                /* istanbul ignore next */
                route_:ActivatedRoute,
                /* istanbul ignore next */
                prodSvc_:ProductService,
                /* istanbul ignore next */
                logger_:Logger) {
        super();
        this.su=su_;
        this.route=route_;
        this.prodSvc=prodSvc_;
        this.logger=logger_;
        this.pdpLink=this.su.getPageLink(Constants.productDetailPageIdentifier);
    }

    ngOnInit() {
        const assocVals: Observable<any[]> = this.onRenderingContext
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .pluck('elements','associationType','values')
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .shareReplay(1);

        // get the context of current page
        const onCurrentPage = this.onRenderingContext.pipe(
            filterNotNil(),
            pluck<any, any[]>('context', 'breadcrumb'),
            map(breadcrumb => breadcrumb[breadcrumb.length - 1])
        );

        // get id of current categorypage
        const onProductIdentifier = onCurrentPage.pipe(
            filterNotNil(),
            pluck<any, any>('externalContext'),
            filterNotNil(),
            shareLast(),
            pluck<any, any>('identifier'),
            distinctUntilChanged(isEqual)
        );

        /* istanbul ignore next */
        this.safeSubscribe(assocVals, /* istanbul ignore next */(filteredAssocVals) => {
            /* istanbul ignore next */
            this.paramSub = onProductIdentifier.subscribe( partNumber => {
                this.fillRestBody(filteredAssocVals, partNumber);
                if (this.restp.partNumber) {
                    this.prodSvc.findByPartNumber(this.restp)
                    .then((p:any)=>this.init(p))
                    .catch((e:any)=>this.logger.warn('Error getting product: %o',e));
                }
            });
        });
    }

    ngOnDestroy() {
        if (this.paramSub) {
            this.paramSub.unsubscribe();
            this.paramSub=null;
        }
    }

    fillRestBody(opts:OptionSelection[], partNumber:string):any {
        let assocType:string[]=[];
        for (let a of opts) {
            assocType.push(a.selection);
        }
        this.restp=JSON.parse(JSON.stringify(this.skel));
        this.restp.storeId=this.su.commerceStoreId,
        this.restp.catalogid=this.su.commerceCatalogId,
        this.restp.partNumber=partNumber;
        this.restp.associationType=assocType;
    }

    getSeoUrlByPartNumbers() : Promise<any> {
        let partNumbers = [];
        for (let prod of this.product.merchandisingAssociations) {
            partNumbers.push(prod.partNumber);
        }
        return this.su.getPageSeoUrlByIds(partNumbers, 'product');
    }

    init(product:any) {
        let buffer:any[]=[];
        if (product) {
            this.product = JSON.parse(JSON.stringify(product));
            if (this.product.merchandisingAssociations) {
                this.getSeoUrlByPartNumbers()
                .then( seoUrlIdMap => {
                    for (let prod of this.product.merchandisingAssociations) {
                        let s=JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
                        s.id=`${prod.partNumber}_${buffer.length}`;
                        s.productDesc=prod;
                        s.productDesc.seoUrl = seoUrlIdMap['idc-product-' + prod.partNumber];
                        s.selectedLayouts[0].layout.id="product-card";
                        s.layouts.default.template="product-card";
                        buffer.push(s);
                    }
                    this.slides=buffer;
                    this.showTitle=this.slides.length>0;
                });
            }
        }
    }
}
