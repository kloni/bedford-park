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
import { TypeCuratedCategoryListComponent } from "app/commerce/components/curated-category-list/typeCuratedCategoryListComponent";
import { RenderingContext } from "ibm-wch-sdk-ng";
import { Constants } from "app/Constants";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "app/commerce/services/category.service";
import { CommerceEnvironment } from "app/commerce/commerce.environment";

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'app-curated-category-list',
    templateUrl: './curated-category-list.component.html',
    styleUrls: []
})
export class CuratedCategoryListComponent extends TypeCuratedCategoryListComponent implements OnInit {

    rc: RenderingContext;
    lists: any[];
    errorMessage: string;
    constants: any = Constants;
    id: any;

    /* istanbul ignore next */
    constructor(private su: StorefrontUtils, private route: ActivatedRoute, private categoryService: CategoryService) {
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
            if (this.categoryIdentifiers && this.categoryIdentifiers.length > 0) {
                this.fetchCatList(this.categoryIdentifiers).then(categories => {
                    if (categories) {
                        this.generateLists(categories);
                    }
                });
            }
        });
    }

    generateLists(categories: any[], espots?: any[]): Promise<any> {
        return this.getSeoUrls(categories)
            .then(urlIdentifierMap => {
                let buffer: any[] = [];
                let i: number = 0;
                for (let cat of categories) {
                    if (cat) {
                        let skeleton = JSON.parse(JSON.stringify(CommerceEnvironment.categorySkeleton));
                        skeleton.id = cat.identifier;
                        skeleton.categoryInternal = cat;
                        skeleton.categoryInternal.seoUrl = urlIdentifierMap['idc-category-' + cat.identifier];
                        skeleton.selectedLayouts[0].layout.id = this.getLayoutId();
                        skeleton.layouts.default.template = this.getLayoutId();
                        buffer.push(skeleton);
                        ++i;
                    }
                }
                this.lists = buffer;
            });
    }

    getLayoutId(): string {
        return "category-card";
    }

    fetchCatList(categoryIdentifiers: any[]): Promise<any[]> {
        let categoryPromises: Promise<any> = this.categoryService.findCategoryByIdentifiers(this.su.commerceStoreId, categoryIdentifiers)
            .then(category => {
                return category
            })
            .catch(
                e => {
                    this.errorMessage = this.su.handleErrorCase(e, 'Could not retrieve category');
                }
            )
        return categoryPromises;
    }

    getSeoUrls(categories: any[]): Promise<any> {
        let identifiers = categories.filter((c) => !!c).map(c => c.identifier);
        return this.su.getPageSeoUrlByIds(identifiers, 'category');
    }
}
