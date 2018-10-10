/*******************************************************************************
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicPDPLayoutComponent } from 'app/commerce/dynamic/pdp/pdp.dynamic.component';
import { TypeProductComponent } from '../../product/typeProductComponent';

@Component({
  selector: 'product-detail-layout-component',
  templateUrl: './productDetailLayout.html',
  preserveWhitespaces: false
})
export class ProductDetailLayoutComponent extends TypeProductComponent implements OnInit {

    @ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;
    private layoutSpec:string="";

    constructor(private loader: DynamicComponentLoader) {
        super();
    }

    ngOnInit() {
        this.loader.getComponentFactory<DynamicPDPLayoutComponent>('pdp').subscribe((cf)=>{
            const ref = this.outlet.createComponent(cf);
            ref.changeDetectorRef.detectChanges();
            ref.instance.setLayout(this.layoutSpec);
            this.onRenderingContext.subscribe(r=>ref.instance.rcSubj.next(r));
            this.onAvailableServices.subscribe(r=>ref.instance.catSubj.next(r));
        },
        (error) => {
            console.warn(error);
        });
    }

    specifyLayout(layout:string) {
        this.layoutSpec=layout;
    }
}
