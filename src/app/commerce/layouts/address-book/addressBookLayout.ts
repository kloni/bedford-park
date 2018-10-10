import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicAddressBookLayoutComponent } from 'app/commerce/dynamic/address-book/address-book.dynamic.component';
import { TypeAddressBookComponent } from 'app/commerce/components/address-book/typeAddressBookComponent';

/*
 * @name addressBookLayout
 * @id address-book-layout
 */
@LayoutComponent({
	selector: 'address-book-layout'
})
@Component({
  selector: 'app-address-book-layout-component',
  templateUrl: './addressBookLayout.html'
})

export class AddressBookLayoutComponent extends TypeAddressBookComponent implements OnInit {

	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

	constructor(private loader: DynamicComponentLoader) {
	  super();
  }

	ngOnInit() {
		this.loader.getComponentFactory<DynamicAddressBookLayoutComponent>('address-book').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
			ref.instance.title = this.title;
		},
		(error) => {
			console.warn(error);
		});
	}
}