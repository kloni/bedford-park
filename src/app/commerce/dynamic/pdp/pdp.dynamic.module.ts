import { NgModule } from '@angular/core';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicPDPLayoutComponent } from './pdp.dynamic.component';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { WchNgComponentsModule } from 'ibm-wch-sdk-ng';
import { GenericLayoutModule } from 'app/components/generic/generic.layout.module';
import { TranslateModule } from '@ngx-translate/core';
import { WchNgEditComponentsModule } from 'ibm-wch-sdk-ng-edit';
import { CommerceDirectivesModule } from 'app/commerce/directives/commerce-directives.module';
import { DynamicStoreLocatorModule } from '../store-locator/store-locator.dynamic.module';

@NgModule({
	declarations: [
        DynamicPDPLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicPDPLayoutComponent),
		CommercePipesModule,
		GenericLayoutModule,
        WchNgComponentsModule,
        CommerceDirectivesModule,
        DynamicStoreLocatorModule
	],
	entryComponents: [
        DynamicPDPLayoutComponent
	]
})
export class DynamicPDPModule {}
