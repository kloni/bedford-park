import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { AbstractDesignIdeasPageComponent } from './abstractDesignIdeasPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';
import {Constants} from '../../../Constants';

/** Useful imports */
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/takeUntil';
// import 'rxjs/add/operator/distinctUntilChanged';

/*
 * @name Design ideas page
 * @id 10562aef-b162-4d2b-8d1b-3a9182218eb8
 * @description Highlights disparate products across different catalog categories into a listing of products. Products are related be editorial theme
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-design-ideas-page-component',
  templateUrl: './typeDesignIdeasPageComponent.html',
  styleUrls: ['./typeDesignIdeasPageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeDesignIdeasPageComponent extends AbstractDesignIdeasPageComponent implements OnInit, OnDestroy {

  rContext: RenderingContext;
  constants: any = Constants;
  @Input() layoutMode: string;
  public readonly CARD_IMAGE_KEY: string = 'cardImage';

  constructor(public utils: UtilsService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.safeSubscribe(this.onRenderingContext, (renderingContext) => {
      this.layoutMode = this.layoutMode || this.constants.DETAIL;
      this.rContext = renderingContext;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  navLink() {
    return this.utils.getNavLink(this.renderingContext, this.renderingContext.id);
  }

}
