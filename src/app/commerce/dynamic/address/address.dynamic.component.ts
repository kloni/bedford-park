import { Component, AfterViewInit, OnInit, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DynamicAddressEditableComponent } from "../address-editable/address-editable.dynamic.component";

const uniqueId = require('lodash/uniqueId');

@Component({
	selector: 'dynamic-commerce-address',
	templateUrl: './address.dynamic.html',
	styleUrls: ['./address.dynamic.scss'],
	encapsulation: ViewEncapsulation.None
})
export class DynamicAddressComponent extends DynamicAddressEditableComponent implements OnInit, OnDestroy {
		@Output() reflectActions=new EventEmitter<any>();

		ngOnInit() {
			super.ngOnInit();
			this.id=uniqueId();
		}

		ngOnDestroy() {
			super.ngOnDestroy();
		}

		setActions(payload:any) {
			this.reflectActions.emit(payload);
		}

		setDefault() {
			let rc=super.copyValidAttrs();
			rc["primary"]="true";
			this.setActions({defAddr:rc});
		}

		edit() {
			this.setActions({editAddr:this._addr});
		}

		delete() {
			this.setActions({delAddr:this._addr});
		}


}