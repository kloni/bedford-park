import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { DynamicPersonalInformationLayoutComponent } from './personal-info.dynamic.component';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';

@NgModule({
	declarations: [
		DynamicPersonalInformationLayoutComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicPersonalInformationLayoutComponent),
		CommerceDirectivesModule
	],
	entryComponents: [
		DynamicPersonalInformationLayoutComponent
	]
})
export class DynamicPersonalInformationModule {}
