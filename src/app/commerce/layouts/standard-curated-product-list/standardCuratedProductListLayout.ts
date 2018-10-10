import { LayoutComponent, RenderingContext } from 'ibm-wch-sdk-ng';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TypeCuratedProductListComponent } from 'app/commerce/components/curated-product-list/typeCuratedProductListComponent';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ProductService } from 'app/commerce/services/product.service';

/*
 * @name standardCuratedProductListLayout
 * @id standard-curated-product-list
 */
@LayoutComponent({
    selector: 'standard-curated-product-list'
})
@Component({
    selector: 'app-standard-curated-product-list-layout-component',
    templateUrl: '../standard-product-recommendation/standardProductRecommendationLayout.html',
    styleUrls: [],
    preserveWhitespaces: false
})
export class StandardCuratedProductListLayoutComponent extends TypeCuratedProductListComponent implements OnInit {
    showTitle: boolean = true;
    slides: any[];
    errorMessage: string;
    slideConfig: any = CommerceEnvironment.recommendationCarouselConfig;
    eSpotObject:any;

    /* istanbul ignore next */
    constructor(
        private su: StorefrontUtils,
        private productService: ProductService) {
        super();
    }

    ngOnInit() {
        this.safeSubscribe(this.onRenderingContext, /* istanbul ignore next */(renderingContext) => {
            /* istanbul ignore next */
            this.generateSlides(this.productName);
        });
    }


    generateSlides(products: string[]) {
        let buffer: any[] = [];
        let i: number = 0;
        this.getProductDesc(products)
            .then(prodDescs => {
                this.getSeoUrlByPartNumber(prodDescs)
                    .then(urlIdMap => {
                        for (let prodDesc of prodDescs) {
                            let s = JSON.parse(JSON.stringify(CommerceEnvironment.productSkeleton));
                            s.id = `${prodDesc.partNumber}_${i}`;
                            s.productDesc = prodDesc;
                            s.productDesc.seoUrl = urlIdMap['idc-product-' + prodDesc.partNumber];
                            s.selectedLayouts[0].layout.id = this.getLayoutId();
                            s.layouts.default.template = this.getLayoutId();
                            buffer.push(s);
                            ++i;
                        }

                        this.slides = buffer;
                    })
            });
    }

    getFields(): string {
        return "catalogEntryView,-catalogEntryView.longDescription,-catalogEntryView.shortDescription,-catalogEntryView.resourceId,-catalogEntryView.hasSingleSKU,-catalogEntryView.numberOfSKUs,-catalogEntryView.attachments,-catalogEntryView.merchandisingAssociations,-catalogEntryView.components";
    }

    getSeoUrlByPartNumber(products): Promise<any> {
        let partNumbers = [];
        for (let prod of products) {
            partNumbers.push(prod.partNumber);
        }
        return this.su.getPageSeoUrlByIds(partNumbers, 'product');
    }

    getProductDesc(partNumbers: string[]): Promise<any> {
        let promises = this.productService.findProductByPartNumbers(
            partNumbers,
            this.su.commerceStoreId,
            this.su.commerceCatalogId,
            this.su.commerceCurrency,
            this.getFields()).then(product => {
                return product;
            })
            .catch(
                e => {
                    this.errorMessage = this.su.handleErrorCase(e, 'Could not retrieve products');
                }
            )
        return promises;
    }

    getLayoutId() {
        return "product-card";
    }
}
