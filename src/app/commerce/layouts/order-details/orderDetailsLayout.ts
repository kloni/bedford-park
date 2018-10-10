import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicOrderDetailsLayoutComponent } from 'app/commerce/dynamic/order-details/order-details.dynamic.component';
import { TypeOrderDetailsComponent } from './../../components/order-details/typeOrderDetailsComponent';

/*
 * @name orderDetailsLayout
 * @id order-details-layout
 */
@LayoutComponent({
	selector: 'order-details-layout'
})
@Component({
	selector: 'app-order-details-layout-component',
	templateUrl: './orderDetailsLayout.html',
	preserveWhitespaces: false
})
export class OrderDetailsLayoutComponent extends TypeOrderDetailsComponent implements OnInit {
	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

	constructor(private loader: DynamicComponentLoader) {
		super();
	}

	ngOnInit() {
		this.loader.getComponentFactory<DynamicOrderDetailsLayoutComponent>('order-details').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
			ref.instance.title = this.title;
		},
		(error) => {
			console.warn(error);
		});
	}
}
