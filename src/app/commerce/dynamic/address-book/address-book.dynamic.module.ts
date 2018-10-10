import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { DynamicAddressBookLayoutComponent } from './address-book.dynamic.component';
import { DynamicAddressComponent } from 'app/commerce/dynamic/address/address.dynamic.component';
import { DynamicAddressEditableComponent } from 'app/commerce/dynamic/address-editable/address-editable.dynamic.component';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';

@NgModule({
	declarations: [
		DynamicAddressEditableComponent,
		DynamicAddressComponent,
		DynamicAddressBookLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicAddressBookLayoutComponent),
		CommerceDirectivesModule
	],
	entryComponents: [
		DynamicAddressEditableComponent,
		DynamicAddressComponent,
		DynamicAddressBookLayoutComponent
	]
})
export class DynamicAddressBookModule {}
