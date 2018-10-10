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

import { ProductViewService } from "./rest/search/productView.service";
import { StorefrontUtils } from "../../commerce/common/storefrontUtils.service";

@Injectable()
export class ProductService {
	constructor(private productViewService: ProductViewService,
		private storefrontUtils: StorefrontUtils) {
	}

	getProduct(id: string): Promise<any> {
		return this.findProductByPartNumber(id, this.storefrontUtils.commerceStoreId, this.storefrontUtils.commerceCatalogId);
	}

	findProductBySearchTerm(storeId: string, searchTerm: string): Promise<any[]> {
		return this.findProductBy(storeId, 'bySearchTerm', searchTerm);
	}

	findProductByIds(storeId: string, ids: string[], fields: string): Promise<any[]> {
		if (ids.length === 0) {
			return Promise.resolve([]);
		} else {
			return this.findProductBy(storeId, 'byIds', ids, fields);
		}
  }

	private findProductBy(storeId: string, byType: string, byTerm: any, fields?: string, currency?: string): Promise<any[]> {
		let parameters = {
			'langId': '-1',
			'storeId': storeId,
			'_fields': fields,
			'currency': currency? currency : this.storefrontUtils.commerceCurrency,
			'contractId': this.storefrontUtils.getContractId()
		};
		switch (byType) {
			case 'byCategory':
				parameters['categoryId'] = byTerm;
				return this.productViewService.findProductsByCategory(parameters)
					.toPromise()
					.then(response => response.body.catalogEntryView as any[]);
			case 'byId':
				parameters['productId'] = byTerm;
				return this.productViewService.findProductById(parameters)
					.toPromise()
					.then(response => response.body.catalogEntryView as any[]);
      case 'byIds':
        parameters['id'] = byTerm;
        return this.productViewService.findProductsByIds(parameters)
          .toPromise()
          .then(res => res.body.catalogEntryView as any[]);
			default:
				//bySearchTerm
				parameters['searchTerm'] = byTerm;
				return this.productViewService.findProductsBySearchTerm(parameters)
					.toPromise()
					.then(response => response.body.catalogEntryView as any[]);
		}
	}

	findProductsByCategory(storeId: string, categoryId: string): Promise<any[]> {
		return this.findProductBy(storeId, 'byCategory', categoryId);
	}

	findProductsById(storeId: string, productId: string, fields?: string, currency?: string): Promise<any[]> {
		return this.findProductBy(storeId, 'byId', productId, fields, currency);
	}

	findProductByPartNumber(partNumber: string, storeId: string, catalogId: string, currency?:string, fields?: string): Promise<any> {
		let parameters = {
			'langId': '-1',
			'storeId': storeId,
			'partNumber': partNumber,
			'catalogid': catalogId,
			'currency' : currency,
			'_fields' : fields,
			'contractId': this.storefrontUtils.getContractId()
		};
		return this.productViewService.findProductByPartNumber(parameters).toPromise()
		.then((response) => {return response.body.catalogEntryView?response.body.catalogEntryView[0]:null as any;});
    }

    findProductByPartNumbers(partNumbers: string[], storeId: string, catalogId: string, currency?:string, fields?: string): Promise<any> {
		let parameters = {
			'langId': '-1',
			'storeId': storeId,
			'partNumber': partNumbers,
			'catalogid': catalogId,
			'currency' : currency,
			'_fields' : fields,
			'contractId': this.storefrontUtils.getContractId()
		};
		return this.productViewService.findProductByPartNumbers(parameters).toPromise()
		.then((response) => {return response.body.catalogEntryView?response.body.catalogEntryView:null as any;});
	}

	findByPartNumber(params: any): Promise<any> {
		return this.productViewService.findProductByPartNumber(params).toPromise()
		.then((r) => {return r.body.catalogEntryView?r.body.catalogEntryView[0]:null as any;});
	}

	findProductsBreadcrumb(storeId: string, byTerm: string): Promise<any> {
		let parameters = {
            'langId': '-1',
			'storeId': storeId,
			'categoryId': byTerm,
			'contractId': this.storefrontUtils.getContractId()
		};
		return this.productViewService.findProductsByCategory(parameters).toPromise()
		.then((response) => {
			return response.body.breadCrumbTrailEntryViewExtended;
		});
	}

  normalizeOrderItems(items: any): Promise<any> {
    const productIds = items.map(i => {
      return i.productId;
    });
    return this.findProductByIds(
      this.storefrontUtils.commerceStoreId,
      productIds,
      'catalogEntryView.uniqueID,catalogEntryView.thumbnail,catalogEntryView.partNumber,catalogEntryView.name,catalogEntryView.price,catalogEntryView.attributes,catalogEntryView.parentCatalogEntryID,catalogEntryView.catalogEntryTypeCode').then(
      cats => {
        const ids = cats.map(c => {
          return c.parentCatalogEntryID
        });
        return this.findProductByIds(
          this.storefrontUtils.commerceStoreId, ids,
          'catalogEntryView.uniqueID,catalogEntryView.partNumber,catalogEntryView.catalogEntryTypeCode').then(
          pCats => {
            cats.forEach((product) => {
              for (const pcat of pCats) {
                if (pcat.uniqueID === product.parentCatalogEntryID) {
                  product['parentCatalogEntryPartnumber'] = pcat.partNumber;
                  product['parentCatalogEntryTypeCode'] =
                    pcat['catalogEntryTypeCode'];
                  break;
                }
              }
            });
            return this.storefrontUtils.getSeoUrlMapForProducts(cats,
              'parentCatalogEntryPartnumber').then(res => {
              const urlIdMap = res;
              for (const product of cats) {
                switch (product['parentCatalogEntryTypeCode']) {
                  case 'ProductBean': {
                    product.seoUrl =
                      urlIdMap['idc-product-' + product.parentCatalogEntryPartnumber];
                    break;
                  }
                  case 'BundleBean': {
                    product.seoUrl =
                      urlIdMap['idc-bundle-' + product.parentCatalogEntryPartnumber];
                    break;
                  }
                  case 'PackageBean': {
                    product.seoUrl =
                      urlIdMap['idc-kit-' + product.parentCatalogEntryPartnumber];
                    break;
                  }
                }
                items.forEach(item => {
                  if (item.productId === product.uniqueID) {
                    item.item = product;
                  }
                });
              }
            });
          });
      });
  }
}
