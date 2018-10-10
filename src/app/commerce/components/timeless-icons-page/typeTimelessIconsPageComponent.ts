import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, Input} from '@angular/core';
import { AbstractTimelessIconsPageComponent } from './abstractTimelessIconsPageComponent';
import {UtilsService} from '../../../common/utils/utils.service';
import {Constants} from '../../../Constants';

/** Useful imports */
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/takeUntil';
// import 'rxjs/add/operator/distinctUntilChanged';

/*
 * @name Timeless icons page
 * @id fce5897f-ee8e-4dfc-a150-a828e873d30a
 * @description Highlights disparate products across different catalog categories into a listing of products. Products are related be editorial theme
 */
/* TODO uncomment this if you plan to use the component standalone, i.e. not as the basis of a layout.
@Component({
  selector: 'app-type-timeless-icons-page-component',
  templateUrl: './typeTimelessIconsPageComponent.html',
  styleUrls: ['./typeTimelessIconsPageComponent.scss'],
  preserveWhitespaces: false
})
*/
export class TypeTimelessIconsPageComponent extends AbstractTimelessIconsPageComponent {

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
