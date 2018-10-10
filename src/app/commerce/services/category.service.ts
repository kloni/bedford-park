/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CategoryViewService } from "./rest/search/categoryView.service";
import { StorefrontUtils } from '../../commerce/common/storefrontUtils.service';

@Injectable()
export class CategoryService {
    private depthAndLimit = "11,11";
    private topPromise: Promise<any>;
    constructor( private categoryViewService: CategoryViewService,
        private storefrontUtils: StorefrontUtils ) {
    }

    top( storeId: string, catalogId: string ): Promise<any[]> {
        if(this.topPromise){
            return this.topPromise;
        } else {
            let parameters = {
                'langId': '-1',
                'storeId': storeId,
                'catalogId': catalogId,
                'depthAndLimit': this.depthAndLimit,
                '_fields': 'catalogGroupView',
                'contractId' : this.storefrontUtils.getContractId()
            };
            this.topPromise = this.categoryViewService.findTopCategories(parameters).toPromise()

                .then((response) => {
                    return response.body.catalogGroupView as any[];
                });

            return this.topPromise;
        }
    };

    findCategoryByIdentifier( storeId: string, categoryIdentifier: string, fields = 'catalogGroupView' ): Promise<any> {
        let parameters = {
            'langId': '-1',
            'storeId': storeId,
            'categoryIdentifier': categoryIdentifier,
            'catalogId': this.storefrontUtils.commerceCatalogId,
            '_fields': fields,
            'contractId' : this.storefrontUtils.getContractId()
        };
        return this.categoryViewService.findCategoryByIdentifier(parameters).toPromise()
            .then((response) => {
                return response.body.catalogGroupView;
            }
        );
    };

    findCategoryByIdentifiers( storeId: string, Identifier: string[], fields = 'catalogGroupView' ): Promise<any> {
        let parameters = {
            'langId': '-1',
            'storeId': storeId,
            'identifier': Identifier,
            'catalogId': this.storefrontUtils.commerceCatalogId,
            '_fields': fields,
            'contractId' : this.storefrontUtils.getContractId()
        };
        return this.categoryViewService.findCategoryByIdentifiers(parameters).toPromise()
            .then((response) => {
                return response.body.catalogGroupView;
            }
        );
    };

    findSubCategories( storeId: string, parentCategoryId: string ): Promise<any> {
        let parameters = {
            'langId': '-1',
            'storeId': storeId,
            'parentCategoryId': parentCategoryId,
            'catalogId': this.storefrontUtils.commerceCatalogId,
            '_fields': 'catalogGroupView',
            'contractId' : this.storefrontUtils.getContractId()
        };
        return this.categoryViewService.findSubCategories(parameters).toPromise()
            .then((response) => {
                return response.body.catalogGroupView;
            }
        );
    };

    findCategoryByUniqueId( storeId: string, categoryId: string ): Promise<any> {
        let parameters = {
            'langId': '-1',
            'storeId': storeId,
            'categoryId': categoryId,
            'catalogId': this.storefrontUtils.commerceCatalogId,
            '_fields': 'catalogGroupView',
            'contractId' : this.storefrontUtils.getContractId()
        };
        return this.categoryViewService.findCategoryByUniqueId(parameters).toPromise()
            .then((response) => {
                return response.body.catalogGroupView;
            }
        );
    };

    findCategoryByUniqueIds( storeId: string, categoryIds: string[] ): Promise<any> {
        let parameters = {
            'langId': '-1',
            'storeId': storeId,
            'id': categoryIds,
            'catalogId': this.storefrontUtils.commerceCatalogId,
            '_fields': 'catalogGroupView',
            'contractId' : this.storefrontUtils.getContractId()
        };
        return this.categoryViewService.findCategoryByUniqueIds(parameters).toPromise()
            .then((response) => {
                return response.body.catalogGroupView;
            }
        );
    };
}