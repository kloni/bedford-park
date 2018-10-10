import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, ViewEncapsulation } from '@angular/core';
import { ProductComponent } from "app/commerce/components/generic/product/product.component";
import { CommerceEnvironment } from "app/commerce/commerce.environment";

/*
 * @name featureCard
 * @id feature-card
 */
@LayoutComponent({
    selector: 'feature-card'
})
@Component({
  selector: 'app-feature-card-layout-component',
  templateUrl: './featureCardLayout.html',
  styleUrls: ['./../../components/generic/product/product.component.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class FeatureCardLayoutComponent extends ProductComponent {
    readonly LAYOUT_IMAGE_RIGHT=CommerceEnvironment.featureCardImageRight;

    getFields():string {
        return "catalogEntryView,-catalogEntryView.buyable,-catalogEntryView.longDescription,-catalogEntryView.resourceId,-catalogEntryView.hasSingleSKU,-catalogEntryView.numberOfSKUs,-catalogEntryView.sKUs,-catalogEntryView.attachments,-catalogEntryView.merchandisingAssociations,-catalogEntryView.components";
    }
}
