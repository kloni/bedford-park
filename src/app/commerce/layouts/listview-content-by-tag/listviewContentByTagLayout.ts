

import { LayoutComponent, RenderingContext, ActivePageService, Category } from "ibm-wch-sdk-ng";
import { Component, OnInit, OnDestroy, Output } from "@angular/core";
import { TypeContentByTagComponent } from "app/commerce/components/content-by-tag/typeContentByTagComponent";
import { Observable } from "rxjs/Observable";
import { Query } from "ibm-wch-sdk-ng";
import { Subscription } from "ibm-wch-sdk-ng/src/utils/rx.utils";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CategoryService } from "app/commerce/services/category.service";
import { ProductService } from "app/commerce/services/product.service";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { UtilsService } from "app/common/utils/utils.service";
import { Constants } from "app/Constants";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/shareReplay';
import { CurrentUser } from "../../common/util/currentUser";

const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');

function _notNull(aValue: any): boolean {
    return aValue != null;
}

/*
 * @name listviewContentByTag
 * @id listview-content-by-tag
 */
@LayoutComponent({
    selector: 'listview-content-by-tag'
})
@Component({
  selector: 'app-listview-content-by-tag-layout-component',
  templateUrl: './listviewContentByTagLayout.html',
  styleUrls: [],
  preserveWhitespaces: false
})
export class ListviewContentByTagLayoutComponent extends TypeContentByTagComponent implements OnInit, OnDestroy {

    public readonly ROWS = 100;
    pageOnRenderingContext: Observable<RenderingContext>;
    @Output()
    onPageContext: Observable<any>;
    onCategoryId;
    subscriptions: Subscription[] = [];
    catId: string;
    id: any;
    rContext: RenderingContext;
    query: Query;
    sortOrderStr: string;
    sortField: string;
    maxItemsToDisplay: number;
    currentPageContext: any;

    constructor(private router: Router, private route: ActivatedRoute, private aPageService: ActivePageService,
        private categoryService: CategoryService, private storefrontUtils: StorefrontUtils, private utilsService: UtilsService, private productService: ProductService) {
        super();
        // decode the references
        this.pageOnRenderingContext = aPageService.onRenderingContext;
        // make sure we do have a context
        const onContext = aPageService.onRenderingContext.filter(_notNull);

        this.onPageContext = onContext
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .shareReplay(1)
            .debounceTime(500);
    }

    ngOnInit() {
        this.id = uniqueId();
        super.ngOnInit();

        const pageContextSub = this.onPageContext.subscribe( renderingContext => {
            this.rContext = renderingContext;
            this.layoutMode = this.layoutMode || Constants.DETAIL;
            this.sortOrderStr = this.getSortOrder(this.sortOrder);
            this.sortField = this.getSortField(this.sortOrderStr);
            this.maxItemsToDisplay = this.maxContents ? this.maxContents : this.ROWS;
            let pageName: string = renderingContext.name;
            this.currentPageContext = this.rContext.context.breadcrumb[this.rContext.context.breadcrumb.length - 1]

            this.query = this.buildQuery(pageName);
        });

        const csrSub = this.storefrontUtils.getCSRObservable().subscribe(r=>{
          if (!!r&&!!this.rContext) {
            this.query=this.buildQuery(this.rContext.name)
          }
        });

        this.subscriptions.push(pageContextSub);
        this.subscriptions.push(csrSub);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    buildQuery(pageName: string) {
        let queryType: string;
        let queryTag: string;
        const cu:CurrentUser=StorefrontUtils.getCurrentUser();

        if (pageName === Constants.productListingPageIdentifier ||
            pageName === Constants.commerceCategoryPageIdentifier ||
            (this.currentPageContext.kind && this.currentPageContext.kind.indexOf("dynamic-item-override-page") != -1)) {
            queryTag = this.storefrontUtils.getPropertyFromIdcContext(this.currentPageContext, 'identifier');
        } else if (pageName === Constants.productDetailPageIdentifier){
            queryTag = this.storefrontUtils.getPropertyFromIdcContext(this.currentPageContext, 'identifier');
        } else {
            queryTag = pageName;
        }

        if (cu&&cu.isCSR) {
          if (!cu.forUser) { // csr acting as herself
            queryTag=`"${queryTag}"`;
          } else if (!!cu.forUser.userName) { // acting-as registered user
            queryTag=`"${queryTag}"-"${Constants.CSR_ONLY}"`;
          } else { // csr acting as guest
            queryTag=`"${queryTag}"-"${Constants.CSR_ONLY}"-"${Constants.REG_ONLY}"`;
          }
        } else {
          queryTag=`"${queryTag}"-"${Constants.CSR_ONLY}"`;
        }
        queryType = this.getQueryType(this.contentType);

        let q: Query = {
            'q': `tags:(${queryTag}) AND (${queryType})`,
            'fq': ['classification:(content)', 'isManaged:("true")']
        };
        return q;
    }

    getSortOrder(category: Category): string {
        if (category && category.categories){
            return category.categories[0].split('/').pop();
        }
        return "";
    }

    getSortField(sortOrderStr: string): string {
        switch (sortOrderStr) {
            case Constants.ALPHABETICAL_ASCENDING: {
                return Constants.ALPHABETICAL_FIELD;
            }
            case Constants.ALPHABETICAL_DESCENDING: {
                return Constants.ALPHABETICAL_FIELD;
            }
            case Constants.LATEST_FIRST: {
                return Constants.DATE_FIELD;
            }
            case Constants.OLDEST_FIRST: {
                return Constants.DATE_FIELD;
            }
            case Constants.DISPLAY_SEQUENCE: {
                return Constants.DISPLAY_SEQUENCE_FIELD;
            }
            default: {
                return Constants.DISPLAY_SEQUENCE_FIELD;
            }
        }
    }

    getQueryType(category: Category): string {
        if (category && category.categories){
            let retVals: string[] = [];
            for (let eachCat of category.categories) {
                let query: string = `type:"` + eachCat.split('/').pop() + `"`;
                retVals.push(query);
            }
            return retVals.join(" OR ");
        }
        return `type:""`;
    }
}