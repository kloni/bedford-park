import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component, Input } from '@angular/core';
import { TypeHeroComponent } from './../../components/hero/typeHeroComponent';
import { UtilsService } from '../../../common/utils/utils.service';
const uniqueId = require('lodash/uniqueId');

/*
 * @name textLeftHero
 * @id text-left-hero
 */
@LayoutComponent({
    selector: 'text-left-hero'
})
@Component({
  selector: 'app-text-left-hero-layout-component',
  templateUrl: './textLeftHeroLayout.html',
  styleUrls: ['./textLeftHeroLayout.scss'],
  preserveWhitespaces: false
})
export class TextLeftHeroLayoutComponent extends TypeHeroComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    id: any;
    rc: RenderingContext;
    imageUrl: string;
    smallImageUrl: string;
    foregroundImageUrl : string;

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
        this.id = uniqueId();
        this.safeSubscribe(this.onRenderingContext, (renderingContext) =>{
            this.rc= renderingContext;
            if(this.backgroundImage!=undefined){
                this.imageUrl=this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'short');
                this.smallImageUrl =this.utilsService.getImageUrl(this.renderingContext, 'backgroundImage', 'smallresolution');
            }
            if(this.foregroundImage&&this.foregroundImage.url) {
                this.foregroundImageUrl=this.utilsService.getImageUrl(this.renderingContext, 'foregroundImage', this.rendition);
             }

        });
    }

}
