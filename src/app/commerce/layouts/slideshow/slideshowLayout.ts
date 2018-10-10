import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeSlideshowComponent } from './../../components/slideshow/typeSlideshowComponent';

const uniqueId = require('lodash/uniqueId');

/*
 * @name slideshow
 * @id slideshow
 */
@LayoutComponent({
    selector: 'slideshow'
})
@Component({
  selector: 'app-slideshow-layout-component',
  templateUrl: './slideshowLayout.html',
  styleUrls: ['./slideshowLayout.scss'],
  preserveWhitespaces: false
})
export class SlideshowLayoutComponent extends TypeSlideshowComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */
    speed:any=2000;
    dots:boolean=true;
    arrows: boolean = true;
    autoplay:boolean = true;
    transitionStyle:string;
    fadeTransition: boolean = false;
    autoplaySpeed: number = 2000;

    id: string;

    slideConfig: any;
    constructor() {
        super();
        this.id = uniqueId();
    }

    ngOnInit(): void {
        if(this.autoPlay!=undefined){
            this.autoplay=true;
        }
        if(this.slideTransitionStyle!=undefined){
            this.transitionStyle=this.slideTransitionStyle.selection;
        }
        if(this.transitionSpeed > 0 ){
            this.speed= this.transitionSpeed * 1000;
        }
        if(this.fade){
            this.fadeTransition= true;
        }
        if(this.slideDurationSeconds > 0){
            this.autoplaySpeed= this.slideDurationSeconds * 1000;
        }
        
        this.slideConfig = 
        {
            'speed': this.speed, 
            'useTransform': false,
            'dots': this.dots, 
            'arrows': this.arrows,
            'autoplay': this.autoplay,
            'autoplaySpeed':this.autoplaySpeed,
            'cssEase': this.transitionStyle,
            'fade': this.fadeTransition,
            'slidesToShow': 1,
            'slidesToScroll': 1
        };
    }

}