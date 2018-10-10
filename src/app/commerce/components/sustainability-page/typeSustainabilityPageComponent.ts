import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AbstractSustainabilityPageComponent } from './abstractSustainabilityPageComponent';
import {Constants} from '../../../Constants';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name Sustainability page
 * @id bb88eef0-149b-4e1f-a0ed-fd8efd5fa3a4
 * @description Design topic uses a two column layout with options for the column widths.  Decide if you want a 75/25% split in column width or 25/75% split in column width.
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-sustainability-page-component',
  templateUrl: './typeSustainabilityPageComponent.html',
  styleUrls: ['./typeSustainabilityPageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeSustainabilityPageComponent extends AbstractSustainabilityPageComponent implements OnInit, OnDestroy {

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
