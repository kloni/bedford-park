import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component,Input } from '@angular/core';
import { TypeHeroComponent } from './../../components/hero/typeHeroComponent';
import { UtilsService } from '../../../common/utils/utils.service';

/*
 * @name textCentered
 * @id text-centered
 */
@LayoutComponent({
    selector: 'text-centered'
})
@Component({
  selector: 'app-text-centered-layout-component',
  templateUrl: './textCenteredLayout.html',
  styleUrls: ['./textCenteredLayout.scss'],
  preserveWhitespaces: false
})
export class TextCenteredLayoutComponent extends TypeHeroComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    imageUrl: string;
    smallImageUrl: string;
    rc: RenderingContext;
    foregroundImageUrl:string;
    
    @Input()rendition:string= 'featureProduct' ;

    constructor(private utilsService: UtilsService) {
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
                this.imageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', this.rendition);
                this.smallImageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'smallresolution');
            }
            if(this.foregroundImage&&this.foregroundImage.url) {
                this.foregroundImageUrl=this.utilsService.getImageUrl(this.renderingContext, 'foregroundImage', this.rendition);
            } 
        });
    }

}
