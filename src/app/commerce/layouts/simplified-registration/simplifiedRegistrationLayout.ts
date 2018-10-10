import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicSimplifiedRegistrationLayoutComponent } from 'app/commerce/dynamic/registration-simple/registration-simple.dynamic.component';
import { TypeRegistrationComponent } from './../../components/registration/typeRegistrationComponent';

/*
 * @name simplifiedRegistration
 * @id simplified-registration
 */
@LayoutComponent({
    selector: 'simplified-registration'
})
@Component({
  selector: 'app-simplified-registration-layout-component',
  templateUrl: './simplifiedRegistrationLayout.html',
  preserveWhitespaces: false
})
export class SimplifiedRegistrationLayoutComponent extends TypeRegistrationComponent {
	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

	constructor(private loader: DynamicComponentLoader) {
	  super();
  }

	ngOnInit() {
		this.loader.getComponentFactory<DynamicSimplifiedRegistrationLayoutComponent>('registration-simple').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
		},
		(error) => {
			console.warn(error);
		});
	}
}
