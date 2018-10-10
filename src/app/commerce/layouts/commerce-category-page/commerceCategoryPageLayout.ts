import {
    LayoutComponent, RenderingContext
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypeCommerceCategoryPageComponent } from './../../components/commerce-category-page/typeCommerceCategoryPageComponent';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/shareReplay';

const isEqual = require('lodash/isEqual');

/*
 * @name commerceCategoryPageLayout
 * @id commerce-category-page-layout
 */
@LayoutComponent({
    selector: 'commerce-category-page-layout'
})
@Component({
  selector: 'app-commerce-category-page-layout-component',
  templateUrl: './commerceCategoryPageLayout.html',
  styleUrls: ['./commerceCategoryPageLayout.scss'],
  preserveWhitespaces: false
})
export class CommerceCategoryPageLayoutComponent extends TypeCommerceCategoryPageComponent implements OnInit, OnDestroy {

    rContext: RenderingContext;
	readonly VALID_PROPERTIES:string[]=["id"];

	constructor() {
		super();
	}

	ngOnInit() {
		super.ngOnInit();

		const categoryContext: Observable<any> = this.onRenderingContext
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .map(rc => Object.keys(rc).filter(k=>this.VALID_PROPERTIES.includes(k)).reduce((o,k)=>{o[k]=rc[k];return o;},{}))
        .filter(Boolean)
        .distinctUntilChanged(isEqual)
        .shareReplay(1);

		this.safeSubscribe(categoryContext, (renderingContext) => {
			this.rContext = renderingContext;
		})
	}

	ngOnDestroy () {
		super.ngOnDestroy();
	}

}
