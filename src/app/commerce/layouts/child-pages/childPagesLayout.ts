import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { TypeChildPagesComponent } from './../../components/child-pages/typeChildPagesComponent';
import {Constants} from '../../../Constants';
import {Subscription} from 'rxjs/Subscription';



/*
 * @name childPagesLayout
 * @id child-pages-layout
 */
@LayoutComponent({
    selector: 'child-pages-layout'
})
@Component({
  selector: 'app-child-pages-layout-component',
  templateUrl: './childPagesLayout.html',
  styleUrls: ['./childPagesLayout.scss'],
  preserveWhitespaces: false
})


export class ChildPagesLayoutComponent extends TypeChildPagesComponent implements OnInit, OnDestroy  {


  rContext: RenderingContext;
  constants:any = Constants;
  rcSub: Subscription;



  constructor() {
        super();

  }


  ngOnInit() {
    super.ngOnInit();
    this.rcSub = this.onRenderingContext
      .subscribe((rc) => {
        this.rContext = rc;
      });
  }

  ngOnDestroy(){
    this.rcSub.unsubscribe();
  }

}
