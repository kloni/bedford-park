import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component,Input } from '@angular/core';
import { TypeSlideComponent } from './../../components/slide/typeSlideComponent';
import { UtilsService } from '../../../common/utils/utils.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Router } from '@angular/router';;


/*
 * @name textRight
 * @id text-right
 */
@LayoutComponent({
    selector: 'text-right'
})
@Component({
  selector: 'app-text-right-layout-component',
  templateUrl: './textRightLayout.html',
  styleUrls: ['./textRightLayout.scss'],
  preserveWhitespaces: false
})
export class TextRightLayoutComponent extends TypeSlideComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    imageUrl : string;
    smallImageUrl: string;
    rc:RenderingContext;
    actionLink: string;
    foregroundImageUrl:string;

    @Input()rendition:string= 'featureProduct' ;

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
                this.imageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'short');
                this.smallImageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'smallresolution');
            }
            if(this.foregroundImage&&this.foregroundImage.url) {
                this.foregroundImageUrl=this.utilsService.getImageUrl(this.renderingContext, 'foregroundImage', this.rendition);
            }
        });
    }

    navigateToLink(){
        this.router.navigateByUrl(this.callToActionLink.linkURL);
    }

}
