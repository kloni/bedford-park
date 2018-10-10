/*******************************************************************************
 * storefrontUtilsTest.service.ts
 *
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import { Injectable, Injector } from '@angular/core';
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { luceneEscapeTerm } from 'ibm-wch-sdk-ng';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

/**
 * This is a configuration for Unit TEST
 * This will be run for test environment only, doesn't apply to dev/prod.
 */
@Injectable()
export class StorefrontUtilsTest extends StorefrontUtils {

	private keywordSubjectTest = new ReplaySubject<Map<string, string>>();
	private keywordRedirectMapTest = new Map();
	private keywordObservableTest: Observable<Map<string, string>> = this.keywordSubjectTest.asObservable();

	constructor(private _inj: Injector) {
		super(_inj);
		super.init();
		this.keywordRedirectMapTest.set("keyword1", "url1");
		this.keywordRedirectMapTest.set("keyword2", "url2");
		this.keywordSubjectTest.next(this.keywordRedirectMapTest);
	}

	get commerceStoreId(): string { return "1"; }
	get commerceCatalogId(): string { return "10502"; }
	get commerceCurrency(): string { return "USD"; }


	public getKeywordRedirectMap(): Observable<Map<string, string>> {
		return this.keywordObservableTest;
	}


	generateSeoUrlId(id: any, type: string): string {
		let res = 'idc-';
		if (type !== undefined) {
			res = res + type + '-';
		} else {
			res = res + 'Product-';
		}
		if (id !== undefined) {
			res = res + luceneEscapeTerm(id);
		}
		else {
			res = res + luceneEscapeTerm('testId');
		}
		return res;
	}
}
