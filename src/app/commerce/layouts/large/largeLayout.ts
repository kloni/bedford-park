import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypePromotionComponent } from './../../components/promotion/typePromotionComponent';
import { UtilsService } from '../../../common/utils/utils.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Router } from '@angular/router';;

/*
 * @name large
 * @id large
 */
@LayoutComponent({
    selector: 'large'
})
@Component({
  selector: 'app-large-layout-component',
  templateUrl: './largeLayout.html',
  preserveWhitespaces: false
})
export class LargeLayoutComponent extends TypePromotionComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    rc: RenderingContext;
    imageUrl: string;
    actionLink: string;
    smallImageUrl: string;

    constructor(
        private utilsService: UtilsService,
        private storeFront: StorefrontUtils,
        private router: Router
    ) {
        super();
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
    }

    ngOnInit(){
        this.safeSubscribe(this.onRenderingContext, (renderingContext) =>{
            this.rc= renderingContext;
            if(this.backgroundImage!=undefined){
                this.imageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'large');
                this.smallImageUrl = this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'mobileresolutionforlarge');
            }
        });
    }

    navigateToLink(){
        this.router.navigateByUrl(this.callToActionLink.linkURL);
    }

}
