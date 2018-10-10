import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { DynamicSimplifiedRegistrationLayoutComponent } from './registration-simple.dynamic.component';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';

@NgModule({
	declarations: [
		DynamicSimplifiedRegistrationLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicSimplifiedRegistrationLayoutComponent),
		CommerceDirectivesModule
	],
	entryComponents: [
		DynamicSimplifiedRegistrationLayoutComponent
	]
})
export class DynamicRegistrationSimpleModule {}
