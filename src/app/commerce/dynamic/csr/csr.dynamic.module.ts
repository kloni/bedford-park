import { NgModule } from '@angular/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicCSRComponent } from './csr.dynamic.component';
import { WchNgComponentsModule } from 'ibm-wch-sdk-ng';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		DynamicCSRComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicCSRComponent),
		WchNgComponentsModule
	],
	entryComponents: [
		DynamicCSRComponent
	]
})
export class DynamicCSRModule {}
