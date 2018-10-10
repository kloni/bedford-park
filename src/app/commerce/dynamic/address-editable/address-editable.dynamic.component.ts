import { Constants } from 'app/Constants';
import { Component, OnInit, Input, Output, OnDestroy, OnChanges, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { CurrentUser } from 'app/commerce/common/util/currentUser';
import * as $ from 'jquery';

@Component({
	selector: 'dynamic-commerce-address-editable',
	templateUrl: './address-editable.dynamic.html',
	encapsulation: ViewEncapsulation.None
})
export class DynamicAddressEditableComponent implements OnInit, OnDestroy, OnChanges {
	_addr:any=this.initAddr({});
	origAddr:any;
	@Input() id:any=-1;
	@Output() reflectChanges=new EventEmitter<any>();
	@Input() set address(address:any) {
		if (address) {
			delete this._addr;
			this._addr=this.deepCopy(address);
			let disp:string="";
			for (let a of this._addr.addressLine)
				if (a)
					disp += (disp?", ":"")+a;
			this._addr.lines=disp;
			this.adjustStateProv();
			this.origAddr=this.deepCopy(this._addr);
		}
	}
	readonly addrTypes:string[]=CommerceEnvironment.address.types;
	modalId:string;
	countries:any[];
	cDescs:any;
	saveProcessing:boolean=false;
	saveErrorMsg:string="";

	/* istanbul ignore next */
	constructor(protected contactSvc: PersonContactService,
				protected storeUtils: StorefrontUtils,
				protected countrySvc: CountryService,
				protected da: DigitalAnalyticsService) {
	}

	ngOnInit() {
		this.modalId="addressEditable_"+this.id;
		this.getCountries()
		.then((r)=>{this.initCountries(r)})
		.catch(
			/* istanbul ignore next */
			(e)=>{
				/* istanbul ignore next */
				this.storeUtils.handleErrorCase(e,"Unable to retrieve country and state list")
			}
		);
	}

	ngOnDestroy() {
		if (this._addr) {
			delete this._addr;
			delete this.origAddr;
		}
	}

	/* istanbul ignore next */
	ngOnChanges() {
		$(`#${this.modalId}`).on("open.zf.reveal", ()=>{
			this.clearError();
			if (this._addr) {
				delete this._addr;
				this._addr = this.deepCopy(this.origAddr);
			}
		});
	}

	initAddr(inAddr:any):any {
		let defsCopy:any;
		for (let a of CommerceEnvironment.address.reqAttrs)
			if (!inAddr[a])
				if (CommerceEnvironment.address.defaults[a]) {
					if (!defsCopy)
						defsCopy=this.deepCopy(CommerceEnvironment.address.defaults);
					inAddr[a]=defsCopy[a];
				} else {
					inAddr[a]=""
				}
		return inAddr;
	}

	setChanges(addrSelect:string,success?:boolean) {
		this.clearError();
		this.reflectChanges.emit({addrSelect:addrSelect,success:success,newAddr:this._addr.newAddr});
	}

	performSave():Promise<HttpResponse<any>> {
		this.saveProcessing=true;
		this.clearError();

		if (this._addr.newAddr) {
			const p={storeId:this.storeUtils.commerceStoreId,body:this._addr};
			return this.contactSvc.addPersonContact(p).toPromise()
			.then((r)=>{this.performAfterSave(); return r;})
			.catch(
				/* istanbul ignore next */
				(e)=>{
					/* istanbul ignore next */
					return this.handleError(e,"Unable to create new address")
				}
			);
		} else {
			const p={storeId:this.storeUtils.commerceStoreId,nickName:this.urlEncode(this._addr.nickName),body:this.copyValidAttrs()};
			return this.contactSvc.updatePersonContact(p).toPromise()
			.then((r)=>{this.performAfterSave(); return r;})
			.catch((e)=>{return this.handleError(e,"Unable to modify address")});
		}
	}

	performAfterSave() {
		this.setChanges(this._addr.nickName,true);
		this.saveProcessing=false;

		let userParam: any = {
			pageName: Constants.addressBookPageIdentifier,
			user: {
				userId: StorefrontUtils.getCurrentUser().userId,
				email1: this._addr.email1,
				city: this._addr.city,
				state: this._addr.state,
				zipCode: this._addr.zipCode,
				country: this._addr.country
			}
		};
		this.da.updateUser(userParam);
	}

	handleError(error:any,fallback:string):Promise<HttpResponse<any>> {
		this.saveErrorMsg=this.storeUtils.handleErrorCase(error, fallback);
		this.saveProcessing=false;
		return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
	}

	copyValidAttrs():any {
		let dest={};
		for (let c of CommerceEnvironment.address.reqAttrs)
			dest[c]=this._addr[c];
		return dest;
	}

	initCountries(r:any) {
		this.countries=r.body.countries;
		this.cDescs={};
		for (let c of this.countries) {
			this.cDescs[c.code]=c;
			c.stDescs={};
			c.states.forEach((s:any)=>c.stDescs[s.code]=s);
		}
		this.adjustStateProv();
	}

	getCountries():Promise<HttpResponse<any>> {
		if (!this.countries) {
			return this.countrySvc.findCountryStateList({storeId:this.storeUtils.commerceStoreId}).toPromise();
		} else {
			return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
		}
	}

	adjustStateProv() {
		let b:boolean=this._addr&&this.cDescs&&this.cDescs[this._addr.country];
		let d:any=b?this.cDescs[this._addr.country]:undefined;
		if (b&&d.states.length>0&&!d.stDescs[this._addr.state])
			this._addr.state="";
	}

	clearError() {
		this.saveErrorMsg="";
	}

	deepCopy(i:any):any {
		return JSON.parse(JSON.stringify(i));
	}

	urlEncode(u:string):string {
		return encodeURI(u)
		.replace(/\+/g, "%2B")
		.replace(/=/g, "%3D")
		.replace(/#/g, "%23")
		.replace(/@/g, "%40")
		.replace(/!/g, "%21")
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/&/g, "%26")
		.replace(/;/g, "%3B")
		.replace(/\~/g, "%7E")
		.replace(/\*/g, "%2A")
		.replace(/'/g, "%27")
		.replace(/\$/g, "%24")
		.replace(/%20/g, "+")
		;
	}
}