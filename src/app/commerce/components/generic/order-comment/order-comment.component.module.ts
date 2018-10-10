import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrderCommentComponent } from './order-comment.component';
import { PaginationLayoutModule } from '../pagination/paginationLayout.module';

@NgModule({
	declarations: [
		OrderCommentComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		PaginationLayoutModule
	],
	entryComponents: [
		OrderCommentComponent
	],
	exports: [
		OrderCommentComponent
	]
})
export class OrderCommentComponentModule {}
