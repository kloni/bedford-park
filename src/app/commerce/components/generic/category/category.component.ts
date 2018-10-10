import { Component } from "@angular/core";
import { CategoryService } from "app/commerce/services/category.service";
import { Logger } from "angular2-logger/core";
import { Router } from "@angular/router";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { Constants } from "app/Constants";
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { Subscription } from 'rxjs/Subscription';
import { TypeChildPimCategoriesComponent } from "app/commerce/components/child-pim-categories/typeChildPimCategoriesComponent";
import { DigitalAnalyticsService } from '../../../services/digitalAnalytics.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Observable } from "rxjs/Observable";
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/pluck';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-category-component',
  template: ``
})
export class CategoryComponent extends TypeChildPimCategoriesComponent {
    ctx: any;
    category: any;
    catIdentifierQueryParam: string;
    catIdQueryParam: string;
    id: any;
    click: Subscription;
    pageName: string = '';
    categoryInBreadcrumb: any;
    productInBreadcrumb: any;
    subscriptions: Subscription[] = [];
    private readonly catLink:string;
    private readonly plpLink:string;

    constructor(private categoryService: CategoryService,
                private logger: Logger,
                private router: Router,
                private storefrontUtils: StorefrontUtils,
                private recSvc: RecommendationService,
                private da: DigitalAnalyticsService,
                private activePageService: ActivePageService,
                private breadcrumbService: BreadcrumbService) {
        super();
        this.catLink=this.storefrontUtils.getPageLink(Constants.commerceCategoryPageIdentifier);
        this.plpLink=this.storefrontUtils.getPageLink(Constants.productListingPageIdentifier);
        this.catIdentifierQueryParam = "";
        this.catIdQueryParam = "";
    }

    ngOnInit() {
        super.ngOnInit();
        this.id=uniqueId();
        this.safeSubscribe(this.onRenderingContext, /* istanbul ignore next */(renderingContext) => {
            this.ctx=renderingContext;
            this.category = this.ctx.categoryInternal;
            
            if(this.category.seoUrl == undefined){
                this.getSeoUrl(Array.of(this.category.identifier)).then( urlIdMap => {
                    this.category.seoUrl= urlIdMap['idc-category-' + this.category.identifier];
                });
            }
            // If leaf category, use category ID as parameter
            if (!this.category.childCatalogGroupID) {
                this.category.leaf = true;
                this.catIdQueryParam = this.category.uniqueID;
            }
            // Else, use categoryIdentifier as parameter
            else {
                this.catIdentifierQueryParam = this.category.identifier;
            }
        });

        const pageOnRenderingContext: Observable<any> =
                this.activePageService.onRenderingContext
                .filter(Boolean)
                .pluck('name')
                .debounceTime(500);

        let pageRc = pageOnRenderingContext.subscribe( pageName => {
            this.pageName = pageName;
        });
        this.subscriptions.push(pageRc);
    }

    onClick(){
        this.informMarketingOfClick();
        if (this.hasESpotRule()){
            this.da.clearAnalyticsFacet();
            this.da.sendESpotTag(this.ctx, this.pageName);
        }
    }

    hasESpotRule(){
        return this.ctx.eSpotDescInternal && Object.keys(this.ctx.eSpotDescInternal).length > 0;
    }

    informMarketingOfClick() {
        if (this.ctx.eSpotDescInternal && Object.keys(this.ctx.eSpotDescInternal).length > 0) {
            this.click=this.recSvc.performClickEvent(this.ctx.eSpotInternal,this.ctx.eSpotDescInternal).subscribe();
        }
    }

    ngOnDestroy() {
        if (this.click) {
            this.click.unsubscribe();
        }
        this.subscriptions.forEach( subscription => {
            subscription.unsubscribe();
        });
    }

    getSeoUrl(categoryIdentifier){
        return this.storefrontUtils.getPageSeoUrlByIds(categoryIdentifier, 'category');
    }

}
