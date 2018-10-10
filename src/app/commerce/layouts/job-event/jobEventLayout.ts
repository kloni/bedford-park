import {
  LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TypeEventComponent } from './../../components/event/typeEventComponent';
import {UtilsService} from '../../../common/utils/utils.service';

/*
 * @name eventLayout
 * @id 3996c6ec-bc66-4600-a0f3-727d0a1c9900
 */
@LayoutComponent({
  selector: 'job-event'
})
@Component({
  selector: 'app-job-event-layout-component',
  templateUrl: './jobEventLayout.html',
  styleUrls: ['./jobEventLayout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class JobEventLayoutComponent extends TypeEventComponent implements OnInit {

  /*
   * TODO add custom fields here. These fields should be those
   * specific to this layout.
   */
  rContext: RenderingContext;
  userouterLink: boolean = false;

  constructor(public utilsService: UtilsService) {
    super();
    /*
     * TODO initialize your custom fields here, note that
     * you can refer to the values bound via @RenderingContextBinding from
     * your super class.
     *
     * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
     */
  }

  ngOnInit() {
    super.ngOnInit();
    this.safeSubscribe(this.onRenderingContext, renderingContext => {
      this.rContext = renderingContext;
      this.userouterLink = this.utilsService.useRouterLink(this.link);
    });
  }

}
