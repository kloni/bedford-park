import { Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { CategoryService } from 'app/commerce/services/category.service';
import { ProductService } from 'app/commerce/services/product.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Constants } from 'app/Constants';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

export interface IBreadcrumb {
	name: string,
	url: string,
	params?: Params,
	breadcrumbTrail: string,
	order: number
}

function compare(a, b){return b.order-a.order}

@Injectable()
export class BreadcrumbService {
	errorMessage: string;
	breadcrumbOrder: number = 0;

	directParentCategorySource = new Subject<any>();
	selectedProductSource = new Subject<any>();
	selectedDepartmentSource = new Subject<any>();
	categoryNameSource = new Subject<any>();
	categoryName$ = this.categoryNameSource.asObservable();
	directParentCategory$ = this.directParentCategorySource.asObservable();
	selectedProduct$ = this.selectedProductSource.asObservable();
	selectedDepartment$ = this.selectedDepartmentSource.asObservable();

	private readonly catLink:string;
	private readonly plpLink:string;
	private readonly pdpLink:string;

	constructor(private categoryService: CategoryService, private productService: ProductService,
        private storefrontUtils: StorefrontUtils) {
			this.catLink=this.storefrontUtils.getPageLink(Constants.commerceCategoryPageIdentifier);
			this.plpLink=this.storefrontUtils.getPageLink(Constants.productListingPageIdentifier);
			this.pdpLink=this.storefrontUtils.getPageLink(Constants.productDetailPageIdentifier);
			this.errorMessage = "";
		}
	
	updateCategoryName(categoryName){
		this.categoryNameSource.next(categoryName);
			
    }

	async buildCatalogBreadcrumb(currentPageQueryParams: Params, isLongestPath: boolean, currentBreadcrumb: IBreadcrumb[] = []): Promise<IBreadcrumb[]> {
		let catIdentifierParam: string = currentPageQueryParams['categoryIdentifier'];
		let catIdParam: string = currentPageQueryParams['categoryId'];
		let prodParam: string = currentPageQueryParams['productNumber'];
		let queryParam: Params = null;

		// department/category
		if (catIdentifierParam) {
			let selectedCat: any = await this.getCategoryByIdentifier(catIdentifierParam);

			if (selectedCat) {
				this.selectedDepartmentSource.next(selectedCat);
				queryParam = { categoryIdentifier: catIdentifierParam };
				let currentCat: IBreadcrumb = {
					breadcrumbTrail: this.catLink + "?categoryIdentifier=" + catIdentifierParam,
					url: this.catLink,
					params: queryParam,
					name: selectedCat.name,
					order: this.breadcrumbOrder++
				};

				await currentBreadcrumb.push(currentCat);

				let category: any;
				let parentCategoryList: string[] = selectedCat.parentCatalogGroupID || [];
				for (let parentCat of parentCategoryList) {
					if (parentCat.includes(this.storefrontUtils.commerceCatalogId)) {
						parentCat = parentCat.replace(this.storefrontUtils.commerceCatalogId+'_', '');
						if (parentCat !== '-1') {
							category = await this.getCategoryByUniqueId(parentCat);
						}
					}
				}

				if (category) {
					category.identifier = category.identifier.split( ' ' ).join( '-' );
					let parentCatParam: Params = { categoryIdentifier: category.identifier };
					this.buildCatalogBreadcrumb(parentCatParam, isLongestPath, currentBreadcrumb);
				}
			}
		}

		// product
		else if (prodParam) {
			let selectedProduct: any = await this.getProductByPartNumber(prodParam);

			if (selectedProduct) {
				this.selectedProductSource.next(selectedProduct);
				queryParam = { productNumber: prodParam };
				let currentProd: IBreadcrumb = {
					breadcrumbTrail: this.pdpLink + "?productNumber=" + prodParam,
					url: this.pdpLink,
					params: queryParam,
					name: selectedProduct.name,
					order: this.breadcrumbOrder++
				};

				if (isLongestPath !== undefined && !isLongestPath) {
					await currentBreadcrumb.pop();
				}
				await currentBreadcrumb.push(currentProd);

				let productListingCat: any;
				let parentCategoryList: string[] = selectedProduct.parentCatalogGroupID || [];
				for (let parentCat of parentCategoryList) {
					if (parentCat.includes(this.storefrontUtils.commerceCatalogId)) {
						parentCat = parentCat.replace(this.storefrontUtils.commerceCatalogId+'_', '');
						if (parentCat !== '-1') {
							productListingCat = await this.getCategoryByUniqueId(parentCat);
						}
					}
				}

				if (productListingCat) {
					let productListingParam: Params = { categoryId: productListingCat.uniqueID };
					this.buildCatalogBreadcrumb(productListingParam, isLongestPath, currentBreadcrumb);
				}
			}
		}

		// product listing (leaf category)
		else if (catIdParam) {
			let selectedProductListing: any = await this.getCategoryByUniqueId(catIdParam);

			if (selectedProductListing) {
				this.directParentCategorySource.next(selectedProductListing);
				queryParam = { categoryId: catIdParam };
				let currentProdListing: IBreadcrumb = {
					breadcrumbTrail: this.plpLink + "?categoryId=" + catIdParam,
					url: this.plpLink,
					params: queryParam,
					name: selectedProductListing.name,
					order: this.breadcrumbOrder++
				};

				await currentBreadcrumb.push(currentProdListing);

				let category: any;
				let parentCategoryList: string[] = selectedProductListing.parentCatalogGroupID || [];
				for (let parentCat of parentCategoryList) {
					if (parentCat.includes(this.storefrontUtils.commerceCatalogId)) {
						parentCat = parentCat.replace(this.storefrontUtils.commerceCatalogId+'_', '');
						if (parentCat !== '-1') {
							category = await this.getCategoryByUniqueId(parentCat);
						}
					}
				}

				if (category) {
					category.identifier = category.identifier.split( ' ' ).join( '-' );
					let parentCatParam: Params = { categoryIdentifier: category.identifier };
					this.buildCatalogBreadcrumb(parentCatParam, isLongestPath, currentBreadcrumb);
				}
			}
		}

		return currentBreadcrumb.sort(compare);
    }

    getBreadcrumbTrail(catIdentifier: string): Promise<any> {
		return this.getCategoryByIdentifier(catIdentifier)
			.then(category => {
				if (category) {
					return this.productService.findProductsBreadcrumb(this.storefrontUtils.commerceStoreId, category.uniqueID)
						.then(breadcrumbList => {
							return breadcrumbList;
						}
						).catch(
						e => {
							this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve products breadcrumb' );
							return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
						}
						);
				}
				else {
					return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
				}
            }
        );
	}

	getCategoryByIdentifier(catIdentifier: string): Promise<any> {
		let identifier: string = catIdentifier.split('-').join(' ');
		return this.categoryService.findCategoryByIdentifier(this.storefrontUtils.commerceStoreId, identifier)
            .then(category => {
				return category[0];
            }
			).catch(
				e => {
					this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve category' );
					return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
				}
			);
	}

	getCategoryByUniqueId(uniqueId: string): Promise<any> {
		return this.categoryService.findCategoryByUniqueId(this.storefrontUtils.commerceStoreId, uniqueId)
			.then(category => {
				return category[0];
			})
			.catch(
				e => {
					this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve category' );
					return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
				}
			);
	}

	getProductByPartNumber(partNumber: string): Promise<any> {
		return this.productService.findProductByPartNumber(partNumber, this.storefrontUtils.commerceStoreId, this.storefrontUtils.commerceCatalogId)
            .then(product => {
				return product;
            }
			).catch(
				e => {
					this.errorMessage = this.storefrontUtils.handleErrorCase( e, 'Could not retrieve product' );
					return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
				}
			);
	}

	private convertObjToArray(breadcrumbItem: any): any[] {
		let newBreadcrumbItem: string[] = [];
		let length: number = Object.keys(breadcrumbItem).length;
		for (let i = 0; i < length; i++) {
			newBreadcrumbItem.push(breadcrumbItem[i]);
		}
		return newBreadcrumbItem;
	}
}