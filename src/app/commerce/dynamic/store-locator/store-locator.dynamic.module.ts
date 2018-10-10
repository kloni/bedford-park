import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';
import { DynamicStoreLocatorLayoutComponent } from './store-locator.dynamic.component';


@NgModule({
	declarations: [
		DynamicStoreLocatorLayoutComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicStoreLocatorLayoutComponent),
        CommerceDirectivesModule
	],
	entryComponents: [
		DynamicStoreLocatorLayoutComponent
    ],
    exports: [
        DynamicStoreLocatorLayoutComponent
    ]
})
export class DynamicStoreLocatorModule {}
