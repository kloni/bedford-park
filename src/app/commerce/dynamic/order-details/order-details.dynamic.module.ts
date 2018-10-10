import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicComponentLoaderModule } from '../../../dynamic-component-loader/dynamic-component-loader.module';
import { DynamicOrderDetailsLayoutComponent } from './order-details.dynamic.component';
import { OrderCommentComponentModule } from '../../components/generic/order-comment/order-comment.component.module';

@NgModule({
	declarations: [
		DynamicOrderDetailsLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		TranslateModule,
		DynamicComponentLoaderModule.forChild(DynamicOrderDetailsLayoutComponent),
		OrderCommentComponentModule
	],
	entryComponents: [
		DynamicOrderDetailsLayoutComponent
	]
})
export class DynamicOrderDetailsModule {}
