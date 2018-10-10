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

import { Component, OnInit, OnDestroy } from "@angular/core";
import { TypeChildPimCategoriesComponent } from "app/commerce/components/child-pim-categories/typeChildPimCategoriesComponent";
import { Constants } from "app/Constants";
import { CategoryService } from "app/commerce/services/category.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { CommerceEnvironment } from "app/commerce/commerce.environment";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');
import { Title } from '@angular/platform-browser';
import { DigitalAnalyticsService } from "app/commerce/services/digitalAnalytics.service";
import { filterNotNil, shareLast } from "ibm-wch-sdk-utils";

@Component({
    selector: 'app-child-pim-categories',
    templateUrl: './child-pim-categories.component.html',
    styleUrls: []
})
export class ChildPimCategoriesComponent extends TypeChildPimCategoriesComponent implements OnInit, OnDestroy {

    lists: any[];
    constants: any = Constants;
    errorMessage: string;
    categoryTitle: string;
    categoryIdentifier: string;
    id: any;
    subscription: Subscription;
    _substitute_var: string = '{name}';
    _title: string;
    onCategoryId: Observable<any>;
    categoryId: number;
    private readonly plpLink:string;
    private readonly catLink:string;

    /* istanbul ignore next */
    constructor(private categoryService: CategoryService, private router: Router, private route: ActivatedRoute,
        private storefrontUtils: StorefrontUtils, private titleService: Title, private da: DigitalAnalyticsService) {
        super();
        this.plpLink=this.storefrontUtils.getPageLink( Constants.productListingPageIdentifier );
        this.catLink=this.storefrontUtils.getPageLink (Constants.commerceCategoryPageIdentifier);
        this.categoryTitle = "";
        this.categoryIdentifier = "";
        this.errorMessage = "";
        this.lists = [];

        // get the context of current page
        const onCurrentPage = this.onRenderingContext.pipe(
            filterNotNil(),
            pluck<any, any[]>('context', 'breadcrumb'),
            map(breadcrumb => breadcrumb[breadcrumb.length - 1])
        );

        // get id of current categorypage
        this.onCategoryId = onCurrentPage.pipe(
            filterNotNil(),
            pluck<any, any>('externalContext'),
            filterNotNil(),
            shareLast(),
            pluck<any, any>('identifier'),
            distinctUntilChanged(isEqual)
        );
    };

    ngOnInit() {
        this.id=uniqueId();
        this._title = this.title;
        let currentRoute = this.route;

        this.subscription = this.onCategoryId.subscribe( catId => {
            if ($(`#childPimCategories_wci_toolbar_${this.id}`).length) {
                $(`#childPimCategories_wci_toolbar_${this.id}`).empty();
            }

            this.categoryService.findCategoryByIdentifier(this.storefrontUtils.commerceStoreId, catId).then(category => {
                if (category[0] !== undefined) {
                    this.categoryId = category[0].uniqueID;
                }
            });

            this.fetchChildCatList(catId).then(categories => {
                if (categories) {
                    let pageParam = {
                        pageName: this.categoryIdentifier
                    };
                    this.da.viewPage(pageParam);

                    this.generateLists(categories);
                } else {
                    this.storefrontUtils.gotoNotFound();
                }
            })
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getSeoUrls(categories){
        let ids = categories.map( cat => cat.identifier );
        return this.storefrontUtils.getPageSeoUrlByIds(ids, 'category');
    }

    generateLists(categories:any[]): Promise<any> {
        return this.getSeoUrls(categories)
        .then( urlIdMap => {
            let buffer:any[]=[];
            for (let cat of categories) {
                let skeleton = JSON.parse(JSON.stringify(CommerceEnvironment.categorySkeleton));
                skeleton.id = cat.identifier;
                skeleton.categoryInternal = cat;
                skeleton.categoryInternal.seoUrl = urlIdMap['idc-category-' + cat.identifier];
                skeleton.selectedLayouts[0].layout.id = this.getLayoutId();
                skeleton.layouts.default.template = this.getLayoutId();
                buffer.push(skeleton);
            }
            this.lists=buffer;
        });
    }

    getLayoutId(): string {
        return "category-card";
    }

    fetchChildCatList(categoryIdentifier: string): Promise<any[]> {
        return this.getSubCategories(categoryIdentifier).then(subcategories => {
            return subcategories;
        });
    }

    getCategoryByIdentifier(catIdentifier: string): Promise<any> {
		return this.categoryService.findCategoryByIdentifier(this.storefrontUtils.commerceStoreId, catIdentifier)
            .then(category => {
                return category[0];
            })
            .catch(e => {
				this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve category' );
			});
    }

    getSubCategories(catIdentifier: string): Promise<any> {
        return this.getCategoryByIdentifier(catIdentifier)
            .then(category => {
                // If category has childCatalogGroupID, then it has subcategories
				if (category && category.childCatalogGroupID) {
                    // Set category title
                    this.categoryTitle = this._title.replace(this._substitute_var, category.name);
                    this.categoryIdentifier = category.identifier;
					return this.categoryService.findSubCategories(this.storefrontUtils.commerceStoreId, category.uniqueID)
                        .then(subcategories => {
                            return subcategories;
                        })
                        .catch(e => {
                            this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve subcategories' );
                        });
                }
            }
        );
	}
}
