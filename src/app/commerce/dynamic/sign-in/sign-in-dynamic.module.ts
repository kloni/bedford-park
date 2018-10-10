import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { DynamicSignInLayoutComponent } from './sign-in.dynamic.component';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';

@NgModule({
	declarations: [
		DynamicSignInLayoutComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicSignInLayoutComponent),
		CommerceDirectivesModule
	],
	entryComponents: [
		DynamicSignInLayoutComponent
	]
})
export class DynamicSignInModule {}
