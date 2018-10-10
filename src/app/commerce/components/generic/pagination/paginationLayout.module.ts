import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationLayoutComponent } from './paginationLayout';

@NgModule({
	declarations: [
		PaginationLayoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule
	],
	entryComponents: [
		PaginationLayoutComponent
	],
	exports: [
		PaginationLayoutComponent
	]
})
export class PaginationLayoutModule {}
