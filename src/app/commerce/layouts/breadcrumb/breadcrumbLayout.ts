import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TypeBreadcrumbComponent } from './../../components/breadcrumb/typeBreadcrumbComponent';
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { CategoryService } from 'app/commerce/services/category.service';
import { ProductService } from 'app/commerce/services/product.service';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

const uniqueId = require('lodash/uniqueId');

function _notNull(aValue: any): boolean {
	return aValue != null;
}
/*
 * @name breadcrumbLayout
 * @id breadcrumb-layout
 */
@LayoutComponent({
    selector: 'breadcrumb-layout'
})
@Component({
  selector: 'app-breadcrumb-layout-component',
  templateUrl: './breadcrumbLayout.html',
  styleUrls: ['./breadcrumbLayout.scss']
})
export class BreadcrumbLayoutComponent extends TypeBreadcrumbComponent implements OnInit, OnDestroy {

	id: any;
	isLongestPath: boolean;
	onBreadcrumb : Observable<any>;
	identifierNameMap = {};
	pathMap = {};
	bcSubscription : Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private categoryService: CategoryService,
		private productService: ProductService,
		private storefrontUtils: StorefrontUtils,
		private breadcrumbService: BreadcrumbService
	) {
		super();

		this.onBreadcrumb = this.onRenderingContext
		.filter(_notNull)
		.pluck<any, any[]>('context', 'breadcrumb')
		.shareReplay(1);
	}

    ngOnInit() {
		this.id = uniqueId();
		this.isLongestPath = this.longestPossiblePath;

		this.bcSubscription = this.onBreadcrumb.subscribe( breadcrumbArray => {
			// wait until breadcrumb trail finished populating
			if (this.isDefaultCatalogLoaded(breadcrumbArray)) {
				let promiseArray = breadcrumbArray.slice(1).map( breadcrumb => {
					this.pathMap[breadcrumb.route] = decodeURI(breadcrumb.route);
					if (this.isCategory(breadcrumb)) {
						return this.categoryService.findCategoryByIdentifier(
							this.storefrontUtils.commerceStoreId,
							breadcrumb.externalContext.identifier,
							'catalogGroupView.identifier,catalogGroupView.name'
						);
					}
					else if (this.isProduct(breadcrumb)) {
						return this.productService.findProductByPartNumber(
							breadcrumb.externalContext.identifier,
							this.storefrontUtils.commerceStoreId,
							this.storefrontUtils.commerceCatalogId,
							'partNumber,name'
						);
					}
				});

				Promise.all(promiseArray)
				.then( result => {
					// get product / category name from IDC
					this.identifierNameMap = this.getIdentifierNameMap(result);
				});
			}
		})
	}

	isProduct(breadcrumb){
		return this.hasPageKind(breadcrumb, 'product-page');
	}

	isCategory(breadcrumb){
		return this.hasPageKind(breadcrumb, 'category-page') || this.hasPageKind(breadcrumb, 'category-products-page');
	}

	hasPageKind(breadcrumb, pageKind){
		return !!breadcrumb.kind && (breadcrumb.kind.indexOf(pageKind) !== -1);
	}

	isDefaultCatalogLoaded(breadcrumbArray){
		return !!breadcrumbArray[0].defaultCatalogPageIds && !!breadcrumbArray[0].kind && breadcrumbArray[0].kind[0] === 'catalog-page';
	}

	getIdentifierNameMap(categories : any){
		let identifierNameMap = {};
		categories.forEach( (cat, index) => {
			if (Array.isArray(cat) && cat.length !== 0) {
				// category
				identifierNameMap[cat[0].identifier] = cat[0].name;
				if (index === (categories.length -1) ) {
					this.breadcrumbService.updateCategoryName(cat[0].name);
				}
			} else {
				// product
				identifierNameMap[cat.partNumber] = cat.name;
			}
		});
		return identifierNameMap;
	}
	ngOnDestroy() {
		this.bcSubscription.unsubscribe();
		this.pathMap = {};
	}
}
