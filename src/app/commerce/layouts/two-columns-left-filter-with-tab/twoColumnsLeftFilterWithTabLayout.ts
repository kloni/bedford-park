/*******************************************************************************
 * twoColumnsLeftFilterWithTabLayout.ts
 *
 * Copyright IBM Corp. 2018
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
 ******************************************************************************/

import {
    LayoutComponent, WchInfoService
} from 'ibm-wch-sdk-ng';
import { TypeSearchResultsComponent } from './../../components/search-results/typeSearchResultsComponent';
import {Component, ElementRef, Injector, ViewChild} from '@angular/core';
import { trigger, style, transition, animate, group } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { Constants } from '../../../Constants';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';

import * as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { StorefrontUtils } from '../../common/storefrontUtils.service';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/throttleTime';

const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');

/*
 * @name twoColumnsLeftFilterWithTab
 * @id two-columns-left-filter-with-tab
 */
@LayoutComponent({
    selector: 'two-columns-left-filter-with-tab'
})
@Component({
  selector: 'app-two-columns-left-filter-with-tab-layout-component',
  templateUrl: './twoColumnsLeftFilterWithTabLayout.html',
  styleUrls: ['./twoColumnsLeftFilterWithTabLayout.scss'],
  preserveWhitespaces: false,
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({opacity: 0}),
        animate(300)
      ])
    ])
  ]
})
export class TwoColumnsLeftFilterWithTabLayoutComponent extends TypeSearchResultsComponent {

    id: any;
    wchInfo: WchInfoService;
    dynamicIds: any = {};
    // The list of search results shown in the page
    searchResults: any[] = [];
    numFound: number;
    constants: any = Constants;
    searchTerm = '';
    navSub: Subscription;
    inFlight: boolean;
    searchError = false;
    analyticsFacet: string = this.storefrontUtils.commerceStoreId;
    analyticsFacetList: string[] = [ this.storefrontUtils.commerceStoreId ];

    // Page types that are available to be searched.  e.g. Design Page
    searchTypes: string[] = [];

    currentTab = 'product-tab';

    // All article types that are available to be searched
    articleTypes: string[] = [];

    // Article types that are selected in the filter
    filteredArticleTypes: string[] = [];

    // The array of keywords users typed in search-box
    searchKeywords: string[] = [];


    onArticleTypes: Observable<string[]>;
    onFilteredArticleTypes: Observable<string[]>;
    onSearchTerm: Observable<string>;
    onScrollSub: Subscription;

  //rowsPerRequest is used for customization purpose. It defines the # of search results returned from server per API request. In default, it is 4.
    rowsPerRequest = 4;

    start = 0;

    @ViewChild('loadIcon') loadIndicator: ElementRef;

    constructor(
        route: ActivatedRoute,
        private http: Http,
        private da: DigitalAnalyticsService,
        private storefrontUtils: StorefrontUtils,
        private inj: Injector) {
        super();
        const onArticleTypes: Observable<string[]> = this.onArticleTypes =
            this.onArticleType
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .pluck('categoryPaths')
            .filter(Boolean)
            .map(paths => Object.keys(paths).map(key => paths[key][1]))
            .distinctUntilChanged(isEqual)
            .shareReplay(1);

        onArticleTypes.subscribe( article => { this.articleTypes = article; });
        const onFilteredArticleTypes: Observable<string[]> = this.onFilteredArticleTypes = onArticleTypes;

        this.navSub = route.queryParamMap
        .map(params => params.get('searchTerm') || '')
        .subscribe((searchTerm) => {
            searchTerm = searchTerm.trim();
            if (searchTerm.length > 0) {
                this.filteredArticleTypes = [];
                this.searchTerm = searchTerm;
                this.searchTypes = Constants.PAGE_TYPES_SEARCHED;
                // Escape special characters in the searchTerm
                this.searchKeywords = searchTerm.split(/[\s&#.,]/);
                this.searchKeywords.forEach(function(word, index, array) {
                    array[index] = word.replace(/[-[\]{}()+\-*"&!~?:\\^|]/g, '\\$&');
                });
                if (this.currentTab === 'article-tab') {
                    this.new_search();
                }
            }
        });
    }

    ngOnInit() {
      super.ngOnInit();
      this.id = uniqueId();
      this.wchInfo = this.inj.get(WchInfoService);
      this.dynamicIds.searchTab = 'searchResults_ul_3_' + this.id;
      this.dynamicIds.accordion = 'searchResults_ul_19_' + this.id;
      this.dynamicIds.filterBy = 'searchResults_ul_46_' + this.id;
      this.dynamicIds.checkboxPrefix = 'searchResults_input_25_';
    }

    _scrollHandler = () => {
        /*
            On page load we need to check in the loading icon is on screen.  If so, load more items until it is not longer visible or scroll reaches 70%
        */
        const scrollTop = $(document).scrollTop();
        const scrollPercentage = (scrollTop / ($(document).height() - $(window).height()));

        if (this.loadIndicator) {
            const rect = this.loadIndicator.nativeElement.getBoundingClientRect();
            const clientHeight = document.documentElement.clientHeight;
            const windowHeight = $(window).innerHeight();
            const viewHeight = Math.max(clientHeight, windowHeight);
            if (scrollPercentage > 0.70 || !(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
                this.getMoreResults();
            }
        }
    }

    ngAfterViewInit() {
        if (this.currentTab === 'article-tab') {
            //throttle the scroll event to improve performance
            this.onScrollSub = Observable.fromEvent(window,'scroll').throttleTime(300).subscribe(this._scrollHandler);
            this.initAccordion();
        }
        (<any>$('#' + this.dynamicIds.searchTab)).foundation();
    }


    _search() {
        const apiUrl = this.wchInfo.apiUrl;
        // Used to construct query with keywords users typed
        const textQuery = this.searchKeywords.reduce((query, currentVal) => `${query} AND (text:*${currentVal}* OR name:*${currentVal}*)`, '');
        // Used to filter page types
        const typeQuery = this.searchTypes.reduce((types, currentVal, index) => {
          return (index === 0) ? `&fq=type:"${currentVal}"` : `${types} OR type:"${currentVal}"`;
        }, '');
        // Used to filter article types users selected in the filter
        const categoryQuery = (this.filteredArticleTypes.length === 0)
          ? ''
          : ' AND categoryLeaves:('
            + this.filteredArticleTypes.reduce((types, currentVal, index) => {
                return (index === 0) ? `"${currentVal}"` : `${types} OR "${currentVal}"`;
              }, '')
            + ')';


         const searchURL = `${apiUrl}/delivery/v1/search?q=siteId:default`
        + typeQuery
        + `&fq={!join from=id to=aggregatedContentIds}classification:content`
        + textQuery
        + categoryQuery
        + `&rows=${this.rowsPerRequest}&start=${this.start * this.rowsPerRequest}&fl=*`;

        console.log(`searchURL: ${searchURL}`);

        this.start++;
        this.http.get(searchURL).map((response) => {
          return response.json();
        }).subscribe(
            (res) => {
              this.inFlight = false;
              this.numFound = res.numFound;
              this.searchResults = this.searchResults.concat(res.documents);
              this._scrollHandler();
              this.initAccordion(); // may not need
              this.createPageviewTag();
            },
            (err) => {
              this.searchError = true;
              this.inFlight = false;
            });
    }

    getMoreResults() {
        if (this.moreToLoad()) {
          this._search();
        }
    }

    moreToLoad() {
        return this.numFound > (this.rowsPerRequest * this.start);
    }

    new_search() {
        this.inFlight = true;
        this.searchResults = [];
        this.start = 0;
        this.searchError = false;
        this.numFound = 0;
        this._search();
    }

    checkBoxClicked(e) {
        const checkbox_id = e.target.id;
        // ID for checkbox is searchResults_div_25_<typesIndex>_index_<uniqueId>
        const typesIndex = parseInt(checkbox_id.split('_')[3]);
        const selectedType = this.articleTypes[typesIndex];

        if (!e.target.checked) {
            this.removeFilter(selectedType);
        } else {
            this.addFilter(selectedType);
        }
    }

    addFilter(filterToAdd) {
        this.filteredArticleTypes.push(filterToAdd);
        this.updateAnalyticsFacet(filterToAdd, 'add');
        this.new_search();
    }

    removeFilter(filterToRemove) {
        this.filteredArticleTypes = this.filteredArticleTypes.filter(obj => obj !== filterToRemove);
        this.updateAnalyticsFacet(filterToRemove, 'remove');
        this.new_search();
    }

    clearAll() {
        this.filteredArticleTypes = [];
        this.clearAllAnalyticsFacet();
        this.new_search();
    }

    articlePanelActive() {
        return this.currentTab === 'article-tab';
    }

    tabClicked(e) {
        const previousTab = this.currentTab;
        this.currentTab = e.target.dataset.tabsTarget;
        // avoid doing extra work if same tab clicked twice
        if (previousTab !== this.currentTab && this.currentTab === 'article-tab') {
            this.filteredArticleTypes = [];
            this.new_search();
        } else if (previousTab !== this.currentTab && this.currentTab === 'product-tab') {
            this.onScrollSub.unsubscribe();
        }
    }

    initAccordion() {
        (<any>$('#' + this.dynamicIds.accordion)).foundation();
        (<any>$('#' + this.dynamicIds.filterBy)).foundation();
    }

    updateAnalyticsFacet(filter: string, action: string) {
        const attribute = CommerceEnvironment.analytics.searchFacetFilterName + ':' + filter;
        if (action === 'add') {
            this.analyticsFacetList.push(attribute);
        } else {
            this.analyticsFacetList = this.analyticsFacetList.filter( elem => elem !== attribute);
        }
        this.analyticsFacet = this.analyticsFacetList.join('-_-');
    }

    clearAllAnalyticsFacet() {
        this.analyticsFacetList = [ this.storefrontUtils.commerceStoreId ];
        this.analyticsFacet = this.storefrontUtils.commerceStoreId;
    }

    createPageviewTag() {
        const pageID = this.numFound === 0 ? CommerceEnvironment.analytics.articleSearchUnsuccessfulPageName :
            CommerceEnvironment.analytics.articleSearchSuccessfulPageName;

        const pageParam = {
            pageName: pageID,
            category: CommerceEnvironment.analytics.searchCategoryId,
            searchTerm: this.searchTerm,
            searchResults: this.numFound.toString(),
            facet: this.analyticsFacet
        };
        this.da.viewPage(pageParam);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.navSub.unsubscribe();
        if (this.onScrollSub !== undefined)
            this.onScrollSub.unsubscribe();
    }

}
