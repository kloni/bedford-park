import { StorefrontUtils } from './../../common/storefrontUtils.service';
import { ESpotService } from './../../services/rest/transaction/eSpot.service';
import { TypeContentRecommendationComponent } from './../../components/content-recommendation/typeContentRecommendationComponent';
import {
    LayoutComponent, RenderingContext, Query, ActivePageService
} from 'ibm-wch-sdk-ng';
import {  OnInit, Component } from '@angular/core';
import { Constants } from 'app/Constants';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { RecommendationService } from 'app/commerce/services/recommendation.service';
import { DigitalAnalyticsService } from "app/commerce/services/digitalAnalytics.service";
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/pluck';

const uniqueId = require('lodash/uniqueId');

/*
 * @name contentRecommendationLayout
 * @id content-recommendation-layout
 */
@LayoutComponent({
    selector: 'content-recommendation-layout'
})
@Component({
  selector: 'app-content-recommendation-layout-component',
  templateUrl: './contentRecommendationLayout.html',
  styleUrls: ['./contentRecommendationLayout.scss'],
  preserveWhitespaces: false
})
export class ContentRecommendationLayoutComponent extends TypeContentRecommendationComponent implements OnInit{

    readonly ESPOT_TYPE_COMMON: string = "common";
    readonly ESPOT_TYPE_PAGE_PREFIX: string = "page-prefix";
    readonly ESPOT_TYPE_PAGE_SUFFIX: string = "page-suffix";

    id: any;
    rContext: RenderingContext;
    queryString: string;
    eSpotName: string;
    query: Query;
    id2espot: Map<string,any>=new Map<string,any>();
    eSpotRoot: any;
    clicks:Subscription[]=[];
    pageName: string = '';
    categoryInBreadcrumb: any;
    productInBreadcrumb: any;

    constructor(private eSpotService: ESpotService,
                private storefrontUtils: StorefrontUtils,
                private route: ActivatedRoute,
                private recSvc: RecommendationService,
                private da: DigitalAnalyticsService,
                private activePageService: ActivePageService,
                private breadcrumbService: BreadcrumbService) {
        super();
    }

    ngOnInit() {
        this.id = uniqueId();
        super.ngOnInit();
		this.safeSubscribe(this.onRenderingContext, (renderingContext) => {
            let url = "/" + this.route.snapshot.url.join('');
            let pageName = this.storefrontUtils.getPageIdentifier(url);
            this.rContext = renderingContext;
            this.layoutMode = this.layoutMode || Constants.DETAIL;
            let oldEspotName = this.eSpotName;
            let name = this.eSpot && this.eSpot.selection ? this.eSpot.selection : "";
            let type = this.eSpot.type;
            if (type == this.ESPOT_TYPE_PAGE_SUFFIX){
                this.eSpotName = name + pageName; //pagename
            }
            else if (type == this.ESPOT_TYPE_PAGE_PREFIX){
                this.eSpotName = pageName + name;
            }
            else {
                this.eSpotName = name;
            }
            if (oldEspotName != this.eSpotName){
                this.eSpotService.findByName({
                    storeId:this.storefrontUtils.commerceStoreId,
                    name:this.eSpotName
                }).subscribe((res: HttpResponse<any>) => {
                    this.eSpotRoot=res.body.MarketingSpotData[0];
                    this.query = this.buildQuery(this.eSpotRoot.baseMarketingSpotActivityData);
                });
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
        this.clicks.push(pageRc);
    }

    buildQuery(data: any): Query {
        /**
         * the current format of the text is 'content:{id}:{thumbnailpath}'
         * retrieving the id only
         */
        let terms: string[] = [];
        for (let a of data){
            let contentId = a.marketingContentDescription[0].marketingText.split(":").slice(1,2);
            terms.push(contentId);
            this.id2espot.set(contentId,a);
        }
        let q: Query = {
            'q': 'id:(' + terms.join(' OR ') + ')'
        };
        return q;
    }

    informMarketingOfClick(rc:any) {
        let eSpotDesc = this.id2espot.get(rc.id) === undefined ? {} : this.id2espot.get(rc.id);
        this.clicks.push(this.recSvc.performClickEvent(this.eSpotRoot,eSpotDesc).subscribe());
    }

    onClick(rc: any){
        this.informMarketingOfClick(rc);
        if (this.hasESpotRule()) {
            let ctx = {
                eSpotDescInternal: this.eSpotRoot.baseMarketingSpotActivityData[0],
                eSpotInternal: this.eSpotRoot
            };
            this.da.clearAnalyticsFacet();
            this.da.sendESpotTag(ctx, this.pageName);
        }
    }

    hasESpotRule(){
        return this.eSpotRoot && this.eSpotRoot.baseMarketingSpotActivityData;
    }

    ngOnDestroy() {
        for (let c of this.clicks) {
            c.unsubscribe();
        }
    }
}
