/*******************************************************************************
 * Copyright IBM Corp. 2017, 2018
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
 *******************************************************************************/
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Constants} from '../../Constants';
import {Http} from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/publishReplay';
import {WchInfoService} from 'ibm-wch-sdk-ng';

@Injectable()
export class ConfigServiceService {

	// cache config results
	public config: Map<string, any> = new Map();
	private wchInfoSvc: WchInfoService;


	constructor(private http: Http, private inj: Injector) {
        this.wchInfoSvc = this.inj.get(WchInfoService);
	}

	getConfig(name: string): Observable<any> {
		if (this.config.has(name)) {
			return Observable.of(this.config.get(name));
		}

		if (name === Constants.HEADER_CONFIG) {
			const headerId = '90d184ea-eb9c-4316-97a8-9d1ebc3029fc';
			return this.http.get(`${this.wchInfoSvc.apiUrl}/delivery/v1/content/${headerId}`)
				.map(res => res.json()).do(res => this.config.set(name, res))
				.publishReplay(1)
				.refCount();
		}

		if (name === Constants.FOOTER_CONFIG) {
			const footerId = 'ae72d304-ad18-4bf3-b213-4a79c829e458';
			return this.http.get(`${this.wchInfoSvc.apiUrl}/delivery/v1/content/${footerId}`)
				.map(res => res.json()).do(res => this.config.set(name, res))
				.publishReplay(1)
				.refCount();
		}

		const searchURL = `${this.wchInfoSvc.apiUrl}/delivery/v1/search?q=name:%22${name}%22&fl=document:%5Bjson%5D`;
		return this.http.get(searchURL)
			.map((response) => {
				const res = response.json();
				if (res && res.numFound > 0) {
					return response.json().documents.shift().document
				} else {
					return {};
				}
			})
			.do((res) => {
				this.config.set(name, res);
			})
			.publishReplay(1)
	}

}
