/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import {Injectable, Injector} from '@angular/core';
import { HttpXhrBackend, HttpRequest, HttpResponse } from "@angular/common/http";
import { Constants } from './../../Constants';
import { Observable } from 'rxjs/Observable';
import { Options } from "angular2-logger/core";
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CommerceEnvironment } from '../commerce.environment';
import {WchInfoService} from 'ibm-wch-sdk-ng';

@Injectable()
export class ConfigService {

	private loggerOptionsSubj:Subject<Options> = new ReplaySubject<Options>();
	protected commerceConfigSubj:Subject<any> = new ReplaySubject<any>();
	protected servicesConfigSubj:Subject<any> = new ReplaySubject<any>();
	protected configJSONSubj:Subject<any> = new ReplaySubject<any>();
	protected siteConfigSubj:Subject<any> = new ReplaySubject<any>();

	private onLoggerOptions:Observable<Options> = this.loggerOptionsSubj.asObservable();
	private onServicesConfig:Observable<any> = this.servicesConfigSubj.asObservable();
	private onConfigJSON:Observable<any> = this.configJSONSubj.asObservable();
	private onCommerceConfig:Observable<any> = this.commerceConfigSubj.asObservable();
	private onSiteConfig:Observable<any> = this.siteConfigSubj.asObservable();

	private configJSON: any;
	private servicesConfig: any;
	private sessionId: number;
	private commerceConfig: any;
	private siteConfig: any;
	private loggerOptions:Options;

	private wchInfoService: WchInfoService;

	constructor(private backend: HttpXhrBackend, private inj: Injector) {}

	init(): Promise<any> {
        this.wchInfoService = this.inj.get(WchInfoService);
		const  apiUrl = this.wchInfoService.apiUrl;

		let configPromises: Promise<any>[] = [];

		const req0 = new HttpRequest('GET', `${apiUrl}/registry/v1/currenttenant`);
		configPromises.push(
			this.backend.handle(req0)
			.toPromise()
			.then((res:HttpResponse<any>)=>{
				this.commerceConfig=res.body;
				this.commerceConfigSubj.next(this.commerceConfig);
			})
			.catch((e:any)=>{
				console.log("Unable to retrieve IDC domain configuration from WCH: %o",e);
			})
		);

		const req1 = new HttpRequest('GET', `${apiUrl}/delivery/v1/rendering/sites/${Constants.SITE_ID}`);
		configPromises.push(
			this.backend.handle(req1)
			.toPromise()
			.then((res: HttpResponse<any>) => {
				this.siteConfig = res.body;
				this.siteConfigSubj.next(this.siteConfig);
			})
		);

		if (this.isLocalSPA()) {
			const req2 = new HttpRequest('GET', 'serverConfig.json');
			configPromises.push(
				this.backend.handle(req2)
				.toPromise()
				.then((res:HttpResponse<any>) => {
					this.configJSON = res.body;
					this.configJSONSubj.next(this.configJSON);

					this.loggerOptions = this.configJSON.logger;
					this.loggerOptionsSubj.next(this.loggerOptions);
				})
				.catch((e)=>{
					this.emptyServerConfigOverride();
				})
			);
		} else {
			this.emptyServerConfigOverride();
		}

		const req3 = new HttpRequest('GET', 'servicesConfig.json');
		configPromises.push(
			this.backend.handle(req3)
			.toPromise()
			.then((res:HttpResponse<any>) => {
				this.servicesConfig = res.body
				this.servicesConfigSubj.next(this.servicesConfig);
			})
		);

		return Promise.all(configPromises).catch(e => {
			console.log("Loading configs fail: %o", e);
		});
	}

	emptyServerConfigOverride() {
		this.loggerOptions = CommerceEnvironment.defaultLoggerOptions as Options;
		this.configJSON = null;
		this.loggerOptionsSubj.next(this.loggerOptions);
		this.configJSONSubj.next(this.configJSON);
	}

	getSessionId():number {
		let numOfDigits = 8;
		if (!this.sessionId){
			this.sessionId = Math.floor(Math.pow(10, numOfDigits-1) + Math.random() * 9 * Math.pow(10, numOfDigits-1));
		}
		return this.sessionId;
	};

	getLoggerOptions():Observable<Options> {
		return this.onLoggerOptions;
	}

	getConfigJSON():Observable<any> {
		return this.onConfigJSON;
	}

	getServicesConfig():Observable<any> {
		return this.onServicesConfig;
	}

	getCommerceConfig():Observable<any> {
		return this.onCommerceConfig;
	}

	getSiteConfig():Observable<any> {
		return this.onSiteConfig;
	}

	async getStoreData(ctx:any) {
		const getStoreIdRequestUrl = ctx.mocks?'mocks/commerce/transaction/store/0/getStoreId.mocks.json':`${ctx.hostCtx}/store/0/adminLookup?q=findByStoreIdentifier&storeIdentifier=${ctx.storeName}`;
		const reqx = new HttpRequest('GET', getStoreIdRequestUrl);
		const resp:HttpResponse<any> = await this.backend.handle(reqx).toPromise() as HttpResponse<any>;
		return resp.body.resultList[0];
	}

	isLocalSPA():boolean {
		return window.location.hostname==='localhost';
	}

}
