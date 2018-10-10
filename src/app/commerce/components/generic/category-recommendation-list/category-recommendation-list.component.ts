/*******************************************************************************
 * Copyright IBM Corp. 2017
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

import { Component, OnInit } from "@angular/core";
import { TypeCategoryRecommendationComponent } from "app/commerce/components/category-recommendation/typeCategoryRecommendationComponent";
import { RenderingContext } from "ibm-wch-sdk-ng";
import { Constants } from "app/Constants";
import { ESpotService } from "app/commerce/services/rest/transaction/eSpot.service";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "app/commerce/services/category.service";
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { HttpResponse } from "@angular/common/http";

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'app-category-recommendation-list',
    templateUrl: './category-recommendation-list.component.html',
    styleUrls: []
})
export class CategoryRecommendationListComponent extends TypeCategoryRecommendationComponent implements OnInit {

    readonly ESPOT_TYPE_COMMON: string = "common";
    readonly ESPOT_TYPE_PAGE_PREFIX: string = "page-prefix";
    readonly ESPOT_TYPE_PAGE_SUFFIX: string = "page-suffix";
    rc: RenderingContext;
    lists: any[];
    errorMessage: string;
    constants: any = Constants;
    id: any;
    eSpotObject:any;

    /* istanbul ignore next */
    constructor(private esSvc: ESpotService, private su:StorefrontUtils, private route:ActivatedRoute,
        private categoryService: CategoryService) {
        super();
        this.lists = [];
        this.errorMessage = "";
    }

    ngOnInit() {
        this.id = uniqueId();
        this.safeSubscribe(this.onRenderingContext, /* istanbul ignore next */(renderingContext) => {
            /* istanbul ignore next */
            this.rc = renderingContext;
            /* istanbul ignore next */
            let name = this.eSpot && this.eSpot.selection ? this.eSpot.selection : "";
            /* istanbul ignore next */
            this.generateListsFromEspot(name, this.eSpot.type);
        });
    }

    generateLists(categories: any[], espots?:any[]): void {
        let buffer: any[] = [];
        let i:number=0;
        for (let cat of categories) {
            if (cat) {
                let skeleton = JSON.parse(JSON.stringify(CommerceEnvironment.categorySkeleton));
                skeleton.id = cat.identifier;
                skeleton.categoryInternal = cat;
                skeleton.eSpotInternal=this.eSpot;
                skeleton.eSpotDescInternal=espots?espots[i]:{};
                skeleton.selectedLayouts[0].layout.id = this.getLayoutId();
                skeleton.layouts.default.template = this.getLayoutId();
                buffer.push(skeleton);
                ++i;
            }
        }
        this.lists=buffer;
    }

    generateListsFromEspot(name:string,type:string): Promise<HttpResponse<any>> {
        let url = "/" + this.route.snapshot.url.join('');
        let pageName = this.su.getPageIdentifier(url) || '';
        let esName = name;

        if (type == this.ESPOT_TYPE_PAGE_SUFFIX) {
            esName = name + pageName
        } else if (type == this.ESPOT_TYPE_PAGE_PREFIX) {
            esName = pageName + name;
        }

        return this.esSvc.findByName({storeId:this.su.commerceStoreId,name:esName}).toPromise()
            .then((r: HttpResponse<any>)=>{
                this.eSpotObject=r.body.MarketingSpotData[0];
                let catDescs: any[]=this.eSpotObject.filteredResult;
                let categoryIds: string[]=[];
                let catEspots: any[]=[];
                for (let desc of catDescs) {
                    if (desc.filteredResultId) {
                        categoryIds.push(desc.filteredResultId);
                        catEspots.push(desc);
                    }
                }
                this.fetchCatList(categoryIds).then(categories => {
                    if (categories) {
                        this.generateLists(categories,catEspots);
                    }
                });
                return r;
            })
            .catch(
                e => {
                    this.errorMessage = this.su.handleErrorCase( e, 'Could not retrieve esport' );
                    return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
                }
            );
    }

    getLayoutId(): string {
        return "category-card";
    }

    fetchCatList(categoryIds: string[]): Promise<any> {
        if (categoryIds && categoryIds.length > 0) {
            return this.categoryService.findCategoryByUniqueIds(this.su.commerceStoreId, categoryIds)
                .then(category => {
                    return category;
                })
                .catch(
                    e => {
                        this.errorMessage = this.su.handleErrorCase( e, 'Could not retrieve category' );
                        return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
                    }
                );
        }
        else {
            /* istanbul ignore next */
           return Promise.resolve("");
       }
    }
}
