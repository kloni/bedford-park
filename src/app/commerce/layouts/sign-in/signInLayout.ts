import { CurrentUser } from '../../common/util/currentUser';
import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicSignInLayoutComponent } from 'app/commerce/dynamic/sign-in/sign-in.dynamic.component';
import { TypeSignInComponent } from 'app/commerce/components/sign-in/typeSignInComponent';

/*
 * @name signInLayout
 * @id sign-in-layout
 */
@LayoutComponent({
    selector: 'sign-in-layout'
})
@Component({
  selector: 'app-sign-in-layout-component',
  templateUrl: './signInLayout.html',
})
export class SignInLayoutComponent extends TypeSignInComponent implements OnInit {

	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

	constructor(private loader: DynamicComponentLoader) {
	  super();
  }

	ngOnInit() {
		this.loader.getComponentFactory<DynamicSignInLayoutComponent>('sign-in').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
		},
		(error) => {
			console.warn(error);
		});
	}
}
