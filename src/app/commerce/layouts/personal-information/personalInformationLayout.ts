/*******************************************************************************
 * personalInformationLayout.ts
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

import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicPersonalInformationLayoutComponent } from 'app/commerce/dynamic/personal-info/personal-info.dynamic.component';
import { TypePersonalInformationComponent } from 'app/commerce/components/personal-information/typePersonalInformationComponent';

/*
 * @name personalInformationLayout
 * @id personal-information-layout
 */
@LayoutComponent({
    selector: 'personal-information-layout'
})
@Component({
  selector: 'app-personal-information-layout-component',
  templateUrl: './personalInformationLayout.html',
})
export class PersonalInformationLayoutComponent extends TypePersonalInformationComponent implements OnInit {

	@ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;


	constructor(private loader: DynamicComponentLoader) {
	  super();
  }

	ngOnInit() {
		this.loader.getComponentFactory<DynamicPersonalInformationLayoutComponent>('personal-info').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
			ref.changeDetectorRef.detectChanges();
			ref.instance.title = this.title;
		},
		(error) => {
			console.warn(error);
		});
	}
}
