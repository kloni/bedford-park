import { HttpResponse } from '@angular/common/http';
import { StorefrontUtils } from './../../commerce/common/storefrontUtils.service';
import { SiteContentService } from './../../commerce/services/rest/search/siteContent.service';
import { CategoryViewService } from '../../commerce/services/rest/search/categoryView.service';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../Constants';
import { MenuService } from '../services/MenuService';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from "angular2-logger/core";
import { ConfigServiceService } from '../../common/configService/config-service.service'

const uniqueId = require('lodash/uniqueId');
const escapeRegExp = require('lodash/escapeRegExp');
//declare var $: any;

@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnDestroy, OnInit {

    @Output() onSearch = new EventEmitter<boolean>();
    @Output() onfocus = new EventEmitter<boolean>();
    @ViewChild('searchInput') searchInput: ElementRef;

    navSub: Subscription;
    constants: any = Constants;
    id: any;
    componentName: string = "search-box";

    cachedSuggestionView: any = [];
    suggestionView: any = [];
    navigationViewReferences: any = {
        pointerIndex: -1,
        entries: [],
        originalQuery: ""
    };

    triggerSearchSubscription: Subscription;
    showSuggestion: boolean = false;
    triggeringSearch: boolean = false;
    isNavigatingDropdown: boolean = false;
    selectedSuggestion: any;

    autoSuggestKeystrokeDelay: number = 400;
    autoSuggestTimeout: any = null;
    configSub: Subscription;
    redirectElements: any;
    o: any;
    map = new Map();

    _query = '';
    set query(q: string) {
        this._query = q;
        if (!this.isNavigatingDropdown) {
            this.selectedSuggestion = null;
            let index = this.navigationViewReferences.pointerIndex;
            if (index > -1) {
                this.navigationViewReferences.entries[index].highlight = false;
            }
            this.navigationViewReferences.pointerIndex = -1;
            this.retrieveSuggestions();
        }
    }
    get query(): string {
        return this._query;
    }
    private readonly catLink: string;
    private readonly plpLink: string;
    private keywordMapSubscripton: Subscription;

    constructor(
        private router: Router,
        private activeRoute: ActivatedRoute,
        private siteSuggestionService: SiteContentService,
        private storefrontUtils: StorefrontUtils,
        private categoryViewService: CategoryViewService,
        private translate: TranslateService,
        private logger: Logger,
        private menuService: MenuService,
        private configService: ConfigServiceService
    ) {
        this.catLink = this.storefrontUtils.getPageLink(Constants.commerceCategoryPageIdentifier);
        this.plpLink = this.storefrontUtils.getPageLink(Constants.productListingPageIdentifier);
        this.navSub = activeRoute
            .queryParamMap
            .map(params => params.get('searchTerm') || '')
            .subscribe((searchTerm) => {
                this.query = searchTerm;
            });
    }

    ngOnInit(): void {
        this.id = uniqueId();
        let parameters = {
            "storeId": this.storefrontUtils.commerceStoreId,
            "catalogId": this.storefrontUtils.commerceCatalogId,
            "suggestType": [
                "Category",
                "Brand"
            ],
            'contractId': this.storefrontUtils.getContractId()
        };
        this.cachedSuggestionView = this.siteSuggestionService
            .findSuggestions(parameters)
            .subscribe((resp: HttpResponse<any>) => {
                this.initializeSuggestionView(JSON.parse(JSON.stringify(resp.body.suggestionView)));
            },
                /* istanbul ignore next */
                (error) => {
                    /* istanbul ignore next */
                    this.logger.warn(this.constructor.name, + " onInit find suggestion fail");
                });
    }

    ngOnDestroy() {
        this.navSub.unsubscribe();
        if (this.triggerSearchSubscription && !this.triggerSearchSubscription.closed) {
            /* istanbul ignore next */
            this.triggerSearchSubscription.unsubscribe();
        }
        if (this.keywordMapSubscripton) {
            this.keywordMapSubscripton.unsubscribe();
        }
    }

    search() {

        if (!this.query) {
            this.searchInput.nativeElement.focus();
        } else {
            this.keywordMapSubscripton = this.storefrontUtils.getKeywordRedirectMap().subscribe((m) => {

                let keywordRedirectMatch = this.query.toLowerCase();
                let page = m.get(keywordRedirectMatch);
                if (!!page) {
                    decodeURI(page);
                    this.router.navigate([page]);
                } else if (this.selectedSuggestion) {
                    this.triggerSearch(this.selectedSuggestion);
                } else {
                    this.onSearch.emit();
                    const navigationExtras: NavigationExtras = {
                        queryParams: { 'searchTerm': this.query }
                    };
                    this.addSearchTermToHistory(this.query);
                    this.resetAttributes();
                    this.router.navigate([this.constants.SEARCH_RESULTS_PAGE_PATH], navigationExtras);
                }
            });
        }
    }

    setFocus() {
        this.onfocus.emit(true);
    }

    removeFocus() {
        this.menuService.pushSearchKeyword(this.query);
        setTimeout(() => {
            //blur happens before click
            if (!this.triggeringSearch) {
                this.showSuggestion = false;
            }
        }, 500);
        this.menuService.notifyFocusRemoved(true);
        this.onfocus.emit(false);
    }

    isQuery() {
        return this.query.length > 0;
    }

    keyDown($event: any) {
        this.showSuggestion = true;
    }

    clearSearch() {
        this.query = '';
        this.menuService.pushSearchKeyword('');
        this.menuService.notifyFocusRemoved(true);
    }

    triggerSearch(entry: any) {
        this.triggeringSearch = true;
        if (entry.term) {
            this.onSearch.emit();
            this.addSearchTermToHistory(entry.term);
            const navigationExtras: NavigationExtras = {
                queryParams: { 'searchTerm': entry.term }
            };
            this.resetAttributes();
            this.router.navigate([this.constants.SEARCH_RESULTS_PAGE_PATH], navigationExtras);
        }
        else if (entry.fullPath && entry.value) {
            this.onSearch.emit();
            this.addSearchTermToHistory(this.query);
            this.triggerCategorySearch(entry.value)
        }
        else {
            this.onSearch.emit();
            this.addSearchTermToHistory(this.query);
            const navigationExtras: NavigationExtras = {
                queryParams: { 'manufacturer': entry.name }
            };
            this.resetAttributes();
            this.router.navigate([this.constants.SEARCH_RESULTS_PAGE_PATH], navigationExtras);
        }
    }

    retrieveSuggestions() {
        if (this.autoSuggestTimeout) {
            clearTimeout(this.autoSuggestTimeout);
            this.autoSuggestTimeout = null;
        }
        if (this.query.length > 1) {
            this.autoSuggestTimeout = setTimeout(() => {
                let parameters = {
                    "storeId": this.storefrontUtils.commerceStoreId,
                    "catalogId": this.storefrontUtils.commerceCatalogId,
                    "term": encodeURIComponent(this.query),
                    'contractId': this.storefrontUtils.getContractId()
                };
                this.siteSuggestionService.findKeywordSuggestionsByTerm(parameters)
                    .subscribe(
                        (resp) => {
                            const queryRegExp = new RegExp(escapeRegExp(this.query), "ig");
                            let keywordSuggestionView = resp.body.suggestionView[0];
                            for (let i = 0; i < keywordSuggestionView.entry.length; i++) {
                                let e = keywordSuggestionView.entry[i];
                                e.displayName = this.generateHighlightedTermString(e.term, queryRegExp);
                                e.name = e.term;
                            }

                            /** === category suggestion section === */
                            //the service by default only return 4 entries
                            let categorySuggestion = {
                                "identifier": this.cachedSuggestionView[0].identifier,
                                "entry": []
                            };
                            categorySuggestion.entry = this.cachedSuggestionView[0].entry.filter(s => {
                                let cats = s.fullPath.split(" > ");
                                let cat = cats[cats.length - 1];
                                return cat.match(queryRegExp) != null;
                            });
                            categorySuggestion.entry.splice(4);
                            categorySuggestion.entry = this.deepCopy(categorySuggestion.entry);
                            //only keep 4 of them
                            for (let i = 0; i < categorySuggestion.entry.length; i++) {
                                let element = categorySuggestion.entry[i];
                                let paths = element.fullPath.split(" > ");
                                let aPath = paths[paths.length - 1];
                                // the string after  >
                                //replaced with the string before this.query
                                paths[paths.length - 1] = this.generateHighlightedTermString(aPath, queryRegExp);
                                element.displayName = paths.join(" > ");
                            }

                            /** == brand suggestion section == */
                            let brandSuggestion = {
                                "identifier": this.cachedSuggestionView[1].identifier,
                                "entry": []
                            };
                            brandSuggestion.entry = this.cachedSuggestionView[1].entry.filter(s => {
                                return s.name.match(queryRegExp) != null;
                            });
                            brandSuggestion.entry.splice(4);
                            brandSuggestion.entry = this.deepCopy(brandSuggestion.entry);
                            //only keep at most 4
                            for (let i = 0; i < brandSuggestion.entry.length; i++) {
                                let element = brandSuggestion.entry[i];
                                element.displayName = this.generateHighlightedTermString(element.name, queryRegExp);
                            }

                            /** == history suggestion section == */
                            let historySuggestion = {
                                "identifier": this.cachedSuggestionView[2].identifier,
                                "entry": []
                            };
                            historySuggestion.entry = this.cachedSuggestionView[2].entry.filter(s => {
                                return s.term.match(queryRegExp) != null;
                            });
                            historySuggestion.entry.splice(4);
                            historySuggestion.entry = this.deepCopy(historySuggestion.entry);
                            //only keep at most 4
                            for (let i = 0; i < historySuggestion.entry.length; i++) {
                                let element = historySuggestion.entry[i];
                                element.displayName = this.generateHighlightedTermString(element.term, queryRegExp);
                                element.name = element.term;
                            }

                            //arrow up and down navigation reference
                            this.navigationViewReferences.pointerIndex = -1;
                            this.navigationViewReferences.originalQuery = this.query;
                            this.navigationViewReferences.entries = keywordSuggestionView.entry.concat(categorySuggestion.entry, brandSuggestion.entry, historySuggestion.entry);

                            //suggestionView array to render the view element
                            let suggestionView = [];
                            if (keywordSuggestionView.entry.length > 0) {
                                suggestionView.push({
                                    "identifier": keywordSuggestionView.identifier
                                });
                            }
                            suggestionView = suggestionView.concat(keywordSuggestionView.entry);
                            if (categorySuggestion.entry.length > 0) {
                                suggestionView.push({
                                    "identifier": categorySuggestion.identifier
                                });
                            }
                            suggestionView = suggestionView.concat(categorySuggestion.entry);
                            if (brandSuggestion.entry.length > 0) {
                                suggestionView.push({
                                    "identifier": brandSuggestion.identifier
                                });
                            }
                            suggestionView = suggestionView.concat(brandSuggestion.entry);
                            if (historySuggestion.entry.length > 0) {
                                suggestionView.push({
                                    "identifier": historySuggestion.identifier
                                });
                            }
                            this.suggestionView = suggestionView.concat(historySuggestion.entry);
                            this.autoSuggestTimeout = null;
                        },
                        (error) => {
                            this.suggestionView = [];
                            this.autoSuggestTimeout = null;
                        }
                    )
            }, this.autoSuggestKeystrokeDelay);
        }
        else {
            this.resetAttributes();
        }
    }

    initializeSuggestionView(suggestionView: any) {
        this.cachedSuggestionView = suggestionView;
        this.cachedSuggestionView.push({
            "identifier": "History",
            "entry": []
        });
    }

    triggerCategorySearch(categoryId: string) {
        let parameters = {
            'locale': this.translate.currentLang,
            'storeId': this.storefrontUtils.commerceStoreId,
            'categoryId': categoryId,
            'contractId': this.storefrontUtils.getContractId()
        };
        if (this.triggerSearchSubscription && !this.triggerSearchSubscription.closed) {
            /* istanbul ignore next */
            this.triggerSearchSubscription.unsubscribe();
        }
        this.resetAttributes();
        this.triggerSearchSubscription = this.categoryViewService.findCategoryByUniqueId(parameters)
            .subscribe((resp: HttpResponse<any>) => {
                let category = resp.body.catalogGroupView[0];
                //this.triggerSearchSubscription.unsubscribe();
                this.navigateToCategoryPage(category);
            });
    }

    navigateToCategoryPage(category: any) {
        if (category && category.identifier) {
            this.storefrontUtils.getPageSeoUrlByIds([category.identifier], 'category')
                .then(map => {
                    if (map && map['idc-category-' + category.identifier]) {
                        this.router.navigate([map['idc-category-' + category.identifier]]);
                    }
                })
        };
    }

    generateHighlightedTermString(termString: string, regexp: RegExp) {
        let matches = termString.match(regexp) || [];
        matches.forEach(m => {
            termString = termString.replace(m, "<b>" + m + "</b>");
        });
        return termString;
    }

    addSearchTermToHistory(term: string): any {
        let exist = this.cachedSuggestionView[2].entry.some((e: any) => {
            return e.term.trim().toLowerCase() == term.trim().toLowerCase();
        });
        if (!exist) {
            this.cachedSuggestionView[2].entry.push({
                "term": term.trim()
            });
        }
    }

    arrowUp(event: any) {
        if (this.showSuggestion) {
            this.isNavigatingDropdown = true;
            if (this.navigationViewReferences.pointerIndex == -1) {
                this.isNavigatingDropdown = false;
                return;
            }
            let index = this.navigationViewReferences.pointerIndex;
            this.navigationViewReferences.entries[index].highlight = false;
            index = index - 1;
            this.navigationViewReferences.pointerIndex = index;
            this.setSelectedSuggestion(this.navigationViewReferences.entries[index], this.navigationViewReferences.originalQuery);
            if (this.navigationViewReferences.entries[index]) {
                this.navigationViewReferences.entries[index].highlight = true;
            }
            this.isNavigatingDropdown = false;
        }
    }

    arrowDown(event: any) {
        if (this.showSuggestion) {
            this.isNavigatingDropdown = true;
            if (this.navigationViewReferences.pointerIndex == this.navigationViewReferences.entries.length - 1) {
                this.isNavigatingDropdown = false;
                return;
            }
            let index = this.navigationViewReferences.pointerIndex;
            if (index > -1) {
                this.navigationViewReferences.entries[index].highlight = false;
            }
            index = index + 1;
            this.navigationViewReferences.pointerIndex = index;
            this.setSelectedSuggestion(this.navigationViewReferences.entries[index], this.navigationViewReferences.originalQuery);
            if (this.navigationViewReferences.entries[index]) {
                this.navigationViewReferences.entries[index].highlight = true;
            }
            this.isNavigatingDropdown = false;
        }
    }

    hoverSelect(suggestion: any) {
        for (let i = 0; i < this.navigationViewReferences.entries.length; i++) {
            if (this.navigationViewReferences.entries[i] == suggestion) {
                this.isNavigatingDropdown = true;
                let index = this.navigationViewReferences.pointerIndex;
                if (index > -1) {
                    this.navigationViewReferences.entries[index].highlight = false;
                }
                this.navigationViewReferences.pointerIndex = i;
                this.navigationViewReferences.entries[i].highlight = true;
                this.setSelectedSuggestion(this.navigationViewReferences.entries[i], this.navigationViewReferences.originalQuery);
                this.isNavigatingDropdown = false;
                break;
            }
        }
    }

    setSelectedSuggestion(suggestion: any, originalQuery: string) {
        if (suggestion && suggestion.term) {
            this.query = suggestion.term;
        }
        else {
            this.query = originalQuery;
        }
        this.selectedSuggestion = suggestion;
    }

    resetAttributes() {
        this.showSuggestion = false;
        this.triggeringSearch = false;
        this.isNavigatingDropdown = false;
        this.selectedSuggestion = null;
        this.navigationViewReferences.pointerIndex = -1;
        this.navigationViewReferences.originalQuery = "";
        this.navigationViewReferences.entries = [];
        this.suggestionView = [];
    }

    deepCopy(o: any) {
        return JSON.parse(JSON.stringify(o));
    }
}
