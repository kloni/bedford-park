import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AbstractDesignPageComponent } from './abstractDesignPageComponent';
import {Constants} from '../../../Constants';
import {UtilsService} from '../../../common/utils/utils.service';


/*
 * @name Design page
 * @id bb79c338-1e20-4d53-9ff3-9a6970ad9ed3
 * @description Design topic uses a two column layout with options for the column widths.  Decide if you want a 75/25% split in column width or 25/75% split in column width.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-design-page-component',
  templateUrl: './typeDesignPageComponent.html',
  styleUrls: ['./typeDesignPageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeDesignPageComponent extends AbstractDesignPageComponent implements OnInit, OnDestroy{

  rContext: RenderingContext;
  matchingBodyImages: any[];
  leftoverBodyImages: any[];

  constants: any = Constants;
  @Input() layoutMode: string;

  public readonly LEAD_IMAGE_KEY: string = 'leadImage';
  readonly TEXT_FOR_BODY_KEY: string = 'body';
  readonly IMAGE_FOR_BODY_KEY: string = 'bodyImage';



  constructor(public utils: UtilsService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.safeSubscribe(this.onRenderingContext, (renderingContext) => {
      this.layoutMode = this.layoutMode || this.constants.DETAIL;
      this.rContext = renderingContext;

      this.matchingBodyImages = [];
      // in draft the formattedtexts may not be populated
      if (this.rContext.formattedtexts) {
        const numOfBodyTexts = this.rContext.formattedtexts[this.TEXT_FOR_BODY_KEY].length;

        if (this.rContext.references && this.rContext.references[this.IMAGE_FOR_BODY_KEY]) {
          const numOfBodyImages = this.rContext.references[this.IMAGE_FOR_BODY_KEY].length;
          if (numOfBodyTexts > 0) {
            this.matchingBodyImages = this.rContext.references[this.IMAGE_FOR_BODY_KEY].slice(0, numOfBodyTexts);
          }
          if (numOfBodyImages > numOfBodyTexts) {
            this.leftoverBodyImages = this.rContext.references[this.IMAGE_FOR_BODY_KEY].slice(numOfBodyTexts);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  navLink() {
    return this.utils.getNavLink(this.renderingContext, this.renderingContext.id);
  }

}
