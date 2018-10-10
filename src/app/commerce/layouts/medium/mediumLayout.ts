import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypePromotionComponent } from './../../components/promotion/typePromotionComponent';
import { UtilsService } from '../../../common/utils/utils.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Router } from '@angular/router';;

/*
 * @name medium
 * @id medium
 */
@LayoutComponent({
    selector: 'medium'
})
@Component({
  selector: 'app-medium-layout-component',
  templateUrl: './mediumLayout.html',
  preserveWhitespaces: false
})
export class MediumLayoutComponent extends TypePromotionComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    rc: RenderingContext;
    imageUrl: string;
    actionLink: string;

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
                this.imageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'medium');
            }
        });
    }


    navigateToLink(){
        this.router.navigateByUrl(this.callToActionLink.linkURL);
    }

}
