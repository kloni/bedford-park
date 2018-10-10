import { Component, AfterViewInit, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { AccountTransactionService } from "app/commerce/services/componentTransaction/account.transaction.service";
import { AuthenticationTransactionService } from "app/commerce/services/componentTransaction/authentication.transaction.service";
import { PersonContactService } from "app/commerce/services/rest/transaction/personContact.service";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { TypeAddressBookComponent } from '../../components/address-book/typeAddressBookComponent';
import * as $ from 'jquery';
import { Constants } from 'app/Constants';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-dynamic-address-book-layout-component',
  templateUrl: './address-book.dynamic.html',
  styleUrls: ['./address-book.dynamic.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicAddressBookLayoutComponent implements AfterViewInit, OnInit, OnDestroy {
	@Input() title: any;
	isLoggedIn:boolean=false;
	authSub:any;
	addrList:any[]=[];
	modAddrNickName:string="";
	success:boolean=false;
	deleteAddr:boolean=false;
	processing:boolean=false;
	errorMsg:string="";
	ctxAddr:any;
	id:any;
	editId:string;
	remvId:string;

	constructor(private storeUtils:StorefrontUtils,
				private contactSvc:PersonContactService,
				private route:ActivatedRoute,
				private router:Router,
				private accountService:AccountTransactionService,
				private authService:AuthenticationTransactionService,
				private da: DigitalAnalyticsService) {
		this.isLoggedIn=this.authService.isLoggedIn();
		this.authSub=this.authService.authUpdate.subscribe(status=>this.isLoggedIn=status);
	}

	ngOnInit() {
		this.id=uniqueId();
		this.editId="addressEditable_"+this.id;
		this.remvId="addressBook_removeAddress_container_"+this.id;
		if (this.isLoggedIn) {
			this.initializeAddressBook();

			let pageParam = {
                pageName: Constants.addressBookPageIdentifier
            };
            this.da.viewPage(pageParam);
		}
	}

	ngAfterViewInit() {
		(<any>$(`#${this.editId}`)).foundation();
		(<any>$(`#${this.remvId}`)).foundation();
	}

	ngOnDestroy() {
		if ((<any>$(`#${this.editId}`)).length) {
            (<any>$(`#${this.editId}`)).foundation("_destroy");
			(<any>$(`#${this.editId}`)).remove();
		}

		if ((<any>$(`#${this.remvId}`)).length) {
            (<any>$(`#${this.remvId}`)).foundation("_destroy");
			(<any>$(`#${this.remvId}`)).remove();
		}

		this.addrList.forEach((a,i)=>{ delete this.addrList[i]; });
		delete this.addrList;
	}

	setChanges(payload:any) {
		if (payload.deleteAddr)
			(<any>$(`#${this.remvId}`)).foundation("close");
		else if (!payload.madeDefault)
			(<any>$(`#${this.editId}`)).foundation("close");

		if (payload.success) {
			this.initializeAddressBook(payload.addrSelect);
			this.deleteAddr=payload.deleteAddr;
		}

		this.success=payload.success;
		this.modAddrNickName=payload.success?payload.addrSelect:"";
	}

	setAddrActions(payload:any) {
		if (payload.editAddr) {
			this.modalEdit(payload.editAddr);
		} else if (payload.delAddr) {
			this.modalDelete(payload.delAddr);
		}
		/* ignore next block for UT since it is a promise; we test it explicitly anyway */
		/* istanbul ignore next */
		else
			/* istanbul ignore next */
			if (payload.defAddr) {
				this.doSetDefault(payload.defAddr);
		}
	}

	modalEdit(addr?:any){
		this.reset();
		this.ctxAddr=addr?addr:this.initAddr({newAddr:true});
		(<any>$(`#${this.editId}`)).foundation("open");
	}

	modalDelete(addr:any) {
		this.reset();
		this.ctxAddr=addr;
		(<any>$(`#${this.remvId}`)).foundation("open");
	}

	doDelete():Promise<HttpResponse<any>> {
		this.processing=true;
		const p={storeId:this.storeUtils.commerceStoreId,nickName:this.urlEncode(this.ctxAddr.nickName)};
		return this.contactSvc.deletePersonContact(p).toPromise()
		.then((r)=>{
			this.setChanges({addrSelect:this.ctxAddr.nickName,success:true,deleteAddr:true});
			this.processing=false;
			return r;
		})
		.catch((e)=>{return this.handleError(e,"Unable to delete address with nickName: " + this.ctxAddr.nickName)});
	}

	doSetDefault(addr:any):Promise<HttpResponse<any>> {
		if (!this.processing) {
			this.processing=true;
			const p={storeId:this.storeUtils.commerceStoreId,nickName:this.urlEncode(addr.nickName),body:addr};
			return this.contactSvc.updatePersonContact(p).toPromise()
			.then((r)=>{
				this.setChanges({addrSelect:addr.nickName,success:true,madeDefault:true});
				this.processing=false;
				return r;
			})
			.catch((e)=>{return this.handleError(e,"Unable to modify address with nickName: " + addr.nickName + " to default")});
		}
	}

	deepCopy(i:any):any {
		return JSON.parse(JSON.stringify(i));
	}

	reset() {
		this.success=this.deleteAddr=false;
		this.modAddrNickName="";
		if (this.ctxAddr)
			delete this.ctxAddr;
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

	populate(inAddr:any) {
		this.initAddr(inAddr);
		this.addrList.push(inAddr);
	}

	initializeAddressBook(addrSelect?:string):Promise<HttpResponse<any>> {
		return this.accountService.getCurrentUserPersonalInfo()
		.then((r)=>{
			let def=r.body;
			def.regAddr=true;

			this.addrList=[];
			this.populate(def);

			return this.contactSvc.getAllPersonContact({storeId:this.storeUtils.commerceStoreId}).toPromise()
			.then((r)=>{
				let book=r.body.contact;
				if (book&&book.length)
					for (let c of book)
						this.populate(c);
				/* istanbul ignore next */
				return r;
			})
			.catch((e)=>{return this.handleError(e,"Unable to retrieve addresses")});
		})
		.catch((e)=>{return this.handleError(e,"Unable to retrieve registered address")});
	}

	handleError(error:any,fallback:string):Promise<HttpResponse<any>> {
		this.errorMsg = this.storeUtils.handleErrorCase(error, fallback);
		this.processing=false;
		return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
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
