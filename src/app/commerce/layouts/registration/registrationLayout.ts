import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicRegistrationLayoutComponent } from 'app/commerce/dynamic/registration/registration.dynamic.component';
import { TypeRegistrationComponent } from './../../components/registration/typeRegistrationComponent';

/*
 * @name registrationLayout
 * @id registration-layout
 */
@LayoutComponent({
	selector: 'registration-layout'
})
@Component({
	selector: 'app-registration-layout-component',
	templateUrl: './registrationLayout.html',
	preserveWhitespaces: true
})
export class RegistrationLayoutComponent extends TypeRegistrationComponent {
	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

	constructor(private loader: DynamicComponentLoader) {
	  super();
  }

	ngOnInit() {
		this.loader.getComponentFactory<DynamicRegistrationLayoutComponent>('registration').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
			this.onRenderingContext.subscribe((r:any)=>ref.instance.csr=r.csr);
		},
		(error) => {
			console.warn(error);
		});
	}
}
