import { Constants } from './../../Constants';
import { StorefrontUtils } from './../../commerce/common/storefrontUtils.service';
import { Injectable, Output } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DigitalAnalyticsService } from '../services/digitalAnalytics.service';
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { ActivePageService, RenderingContext } from 'ibm-wch-sdk-ng';
import { Subscription } from 'rxjs/Subscription';
import { CategoryService } from 'app/commerce/services/category.service';
import { ProductService } from 'app/commerce/services/product.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/shareReplay';
import { filterNotNil } from "ibm-wch-sdk-utils";
import { map } from 'rxjs/operators/map';
import { pluck } from 'rxjs/operators/pluck';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

const isEqual = require('lodash/isEqual');

function _notNull(aValue: any): boolean {
    return aValue != null;
}

@Injectable()
export class GenerateEventGuard implements CanActivate {

    @Output()
	onRenderingContext: Observable<RenderingContext>;
    rcSub: Subscription;
    plpPageLink: string;
    currentPageKinds: string[];
    previousPageKinds: string[];
    identifier: string;  // Page identifier, can be category identifier or product part number

    @Output()
    onPageContext: Observable<any>;
    private readonly mktPages:Set<string> = new Set<string>([Constants.commerceCategoryPageIdentifier,
                                                             Constants.productListingPageIdentifier,
                                                             Constants.productDetailPageIdentifier,
                                                             Constants.searchResultsPageIdentifier]);

    constructor( private da: DigitalAnalyticsService, private recSvc: RecommendationService, private aPageService: ActivePageService,
        private router: Router, private categoryService: CategoryService, private storefrontUtils: StorefrontUtils, private productService: ProductService ) {
        // decode the references
        this.onRenderingContext = aPageService.onRenderingContext;
        // make sure we do have a context
        const onContext = aPageService.onRenderingContext.filter(_notNull);

        this.onPageContext = onContext
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .map(rc => rc.name)
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .shareReplay(1)
            .debounceTime(500);

        // get the context of current page
        const currentPage = onContext.pipe(
            filterNotNil(),
            pluck<any, any[]>('context', 'breadcrumb'),
            map(breadcrumb => breadcrumb[breadcrumb.length - 1])
        ).subscribe( page => {
            if (!!page) {
                this.currentPageKinds = page.kind === undefined? [] : page.kind;
                this.identifier = page.externalContext === undefined? "" : page.externalContext.identifier;
            } else {
                this.storefrontUtils.gotoNotFound();
            }
        });

        this.plpPageLink = this.storefrontUtils.getPageLink(Constants.productListingPageIdentifier);
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {

        if (!this.da.isInitialized) {
            this.da.initializeDA();
        }

        if (this.rcSub) {
            this.rcSub.unsubscribe();
        }
        this.rcSub = this.onPageContext.subscribe(ctxName => {
            this.triggerMarketingEvent(ctxName);
            if (!this.isPreviousPagePLP()) {
                this.da.clearAnalyticsFacet();
            }
            this.handlePageview(ctxName);
            this.previousPageKinds = this.currentPageKinds;
        });

        return true;
    }

    isPreviousPagePLP(){
        return !!this.previousPageKinds && this.previousPageKinds.length !== 0 && this.previousPageKinds.indexOf('category-products-page') !== -1;
    }

    handlePageview(pageName: string): void {
        var pageGroup = "";
        var storeId = this.storefrontUtils.commerceStoreId;
        var catalogId = this.storefrontUtils.commerceCatalogId;
        var langId = "-1";
        var objectParamName = "";
        var objectParamValue = "";
        var pageIdInPreview = "";
        var currency = "USD";
        var thisPageContext = [];

        if (this.currentPageKinds.length !== 0 && (this.currentPageKinds.indexOf('category-page') !== -1 || this.currentPageKinds.indexOf('category-products-page') !== -1)) {
            this.getCategoryId(this.identifier).then(categoryId => {
                pageGroup = "Category";
                objectParamName = "categoryId";
                objectParamValue = categoryId;

                thisPageContext = [{'pageGroup':pageGroup, 'objectParamName':objectParamName, 'objectParamValue':objectParamValue, 'storeId':storeId,'langId':langId}];
                ciHandshake(thisPageContext);
            });
        }
        else if (this.currentPageKinds.length !== 0 && this.currentPageKinds.indexOf('product-page') !== -1) {
            this.getProductId(this.identifier).then(productId => {
                pageGroup = "Product";
                objectParamName = "productId";
                objectParamValue = productId;

                thisPageContext = [{'pageGroup':pageGroup, 'objectParamName':objectParamName, 'objectParamValue':objectParamValue, 'storeId':storeId,'langId':langId}];
                ciHandshake(thisPageContext);
            });
        }
        else {
            pageGroup = "Content";
            objectParamName = "pageId";
            objectParamValue = "";

            thisPageContext = [{'pageGroup':pageGroup, 'objectParamName':objectParamName, 'objectParamValue':objectParamValue, 'storeId':storeId,'langId':langId}];
            ciHandshake(thisPageContext);
        }

        // pages under exclusion list and dynamic-page handle pageviewtag by themselves
        // no need to send from event guard to avoid duplicate
        if (!Constants.pageviewEventGuardExclusionList.has(pageName) && !this.isDynamicPage()) {
            this.da.viewPage({pageName: pageName});
        }
    }

    isDynamicPage(){
        return this.currentPageKinds.length !== 0 &&
        (this.currentPageKinds.indexOf('dynamic-page') !== -1)
    }

    async triggerMarketingEvent(pageName: string): Promise<Subscription> {
		let categoryIdParam: string = "";
		let productIdParam: string = "";
		let searchTermParam: string = "";
		let currentRouter: Router = this.router;

		// TEMP: if the page is Category/Product List/Product Detail/Search Results page, then get the query parameter
		if (this.mktPages.has(pageName)) {
			let param = currentRouter.parseUrl(currentRouter.url).queryParams;
			if (param['categoryIdentifier']) {
				categoryIdParam = await this.getCategoryId(param['categoryIdentifier']);
			}
			else if (param['categoryId']) {
				categoryIdParam = param['categoryId'];
			}
			else if (param['productNumber']) {
				productIdParam = await this.getProductId(param['productNumber']);
			}
			else if (param['searchTerm']) {
				searchTermParam = param['searchTerm'];
			}
		}

		return this.recSvc.performTriggerMarketing(pageName, searchTermParam, categoryIdParam, productIdParam).subscribe();
	}

	private getCategoryId(categoryIdentifier: string): Promise<any> {
		let identifier: string = categoryIdentifier.split( '-' ).join( ' ' );
		return this.categoryService.findCategoryByIdentifier(this.storefrontUtils.commerceStoreId, identifier)
		.then(category => {
			if (category[0]) {
				return category[0].uniqueID;
			}
		});
	}

	private getProductId(productNumber: string): Promise<any> {
		return this.productService.findProductByPartNumber(productNumber, this.storefrontUtils.commerceStoreId, this.storefrontUtils.commerceCatalogId)
		.then(product => {
			if (product) {
				return product.uniqueID;
			}
		});
	}

}