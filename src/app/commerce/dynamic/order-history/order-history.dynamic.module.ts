import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { DynamicComponentLoaderModule } from 'app/dynamic-component-loader/dynamic-component-loader.module';
import { DynamicOrderHistoryLayoutComponent } from './order-history.dynamic.component';
import { PaginationLayoutModule } from 'app/commerce/components/generic/pagination/paginationLayout.module';

@NgModule({
	declarations: [
		DynamicOrderHistoryLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicOrderHistoryLayoutComponent),
		CommercePipesModule,
		PaginationLayoutModule
	],
	entryComponents: [
		DynamicOrderHistoryLayoutComponent
	]
})
export class DynamicOrderHistoryModule {}
