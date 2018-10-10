import {
  LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { TypeHeroImageComponent } from './../../components/hero-image/typeHeroImageComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name sustainabilityHeroImage
 * @id sustainability-hero-image
 */
@LayoutComponent({
    selector: 'sustainability-hero-image'
})
@Component({
  selector: 'app-sustainability-hero-image-layout-component',
  templateUrl: './sustainabilityHeroImageLayout.html',
  styleUrls: ['./sustainabilityHeroImageLayout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class SustainabilityHeroImageLayoutComponent extends TypeHeroImageComponent implements OnInit, OnDestroy {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    rContext: RenderingContext;
    useRouterLink: boolean = false;
    public readonly IMAGE_KEY: string = 'image';

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
            this.useRouterLink = this.utilsService.useRouterLink(this.link);
        });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
