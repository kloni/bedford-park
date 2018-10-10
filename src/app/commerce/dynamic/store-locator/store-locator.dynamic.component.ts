import {
    RenderingContext, WchInfoService, Category
} from 'ibm-wch-sdk-ng';
import {
    Component,
    ViewChild,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewEncapsulation,
    ChangeDetectorRef,
    ElementRef,
    ViewChildren,
    QueryList,
    Input
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import { } from '@types/googlemaps';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { MenuService } from 'app/responsiveHeader/services/MenuService';


const uniqueId = require('lodash/uniqueId');
const isEqual = require('lodash/isEqual');
const escapeRegExp = require('lodash/escapeRegExp');
declare var Foundation: any;

@Component({
  selector: 'app-dynamic-store-locator-layout-component',
  templateUrl: './store-locator.dynamic.html',
  styleUrls: ['./store-locator.dynamic.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class DynamicStoreLocatorLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

    readonly CTX_SEARCH_SERVICE_API_URL: string = '/delivery/v1/contextualsearch';
    readonly GOOGLE_MAP_API_KEY: string = 'AIzaSyCWfQ7AmdXGG4u3NaOw6h92es4Yh_0P5xI';
    readonly GOOGLE_MAP_DEST_URL = 'https://www.google.com/maps/dir/?api=1&destination=';
    readonly NAME_KEY: string = 'name';
    readonly ADDRESS_KEY: string = 'address';
    readonly PHONE_NUMBER_KEY: string = 'phoneNumber';
    readonly SERVICES_KEY: string = 'services';
    readonly HOURS_KEY: string = 'hours';
    readonly PHYSICAL_STORE_IDENTIFIER_KEY: string = 'physicalStoreIdentifier';
    readonly PREFERRED_STORE_KEY: string = 'preferredStore';
    // North America coordinate
    readonly DEFAULT_CENTER_COORDINATES = {
        lat: 54.5260,
        lng: -105.2551
    };
    readonly DEFAULT_DISTANCE: number = 50; // in km
    readonly DISTANCE_CHOICES: number[] = [10, 25, 50, 100];
    readonly DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    id: any;
    filterModalId: string;
    expansionAccordionId: string;
    expansionAccordionModalId: string;
    setPreferredStoreId: string;
    rContext: RenderingContext;
    @ViewChildren('searchResultTarget') searchResultTarget: QueryList<ElementRef>;
    @ViewChild('gmap') gmapElement: ElementRef;
    @ViewChildren('expansionAccordion') expansionAccordion: QueryList<ElementRef>;
    @ViewChildren('expansionAccordionModal') expansionAccordionModal: QueryList<ElementRef>;
    map: google.maps.Map;
    searchResults: RenderingContext[] = [];
    selectedResultItem: string = '';
    searchBounds: google.maps.LatLngBounds;
    savedSearchBounds: google.maps.LatLngBounds;
    latCoordinate: number = this.DEFAULT_CENTER_COORDINATES.lat;
    lngCoordinate: number = this.DEFAULT_CENTER_COORDINATES.lng
    distance: number = this.DEFAULT_DISTANCE;
    proximityQuery: string = '';
    addressQuery: string = '';
    markerArray: google.maps.Marker[] = [];
    infoWindow: google.maps.InfoWindow;
    currentLocationLoading: boolean = false;
    allowLocationService: boolean = true;
    addressSearchTerm: string = '';
    noAddressFound: boolean = false;
    onAvailableServiceTypes : Observable<string[]>;
    serviceTypes: any[] = [];
    filteredServiceTypes: string[] = [];
    savedFilteredServiceTypes: string[] = [];
    selectedFilteredServiceTypes: string[] = [];
    savedDocuments: any;
    subscriptions: Subscription[] = [];
    suggestionView: string[] = [];
    navigationViewReferences: any = {
        pointerIndex: -1,
        entries: [],
        originalQuery: ""
    };
    triggeringSearch: boolean = false;
    isNavigatingDropdown: boolean = false;
    showSuggestion: boolean = false;
    currentClosingHour: string = '';
    todaysDate = new Date();
    selectedDistance: number = this.DEFAULT_DISTANCE;
    savedDistance: number = this.selectedDistance;
    translationKey: string[] = ['StoreLocator.Services', 'StoreLocator.Hours', 'StoreLocator.Directions', 'StoreLocator.YourLocation', 'StoreLocator.MyStore', 'StoreLocator.SetAsMyStore', 'StoreLocator.ClosedToday',];
    translatedString: string[] = [];
    listViewTabOpened: boolean = true;
    accordionInit: boolean = false;
    catSubj: Subject<Category> = new ReplaySubject<Category>();
    onAvailableServices: Observable<Category> = this.catSubj.asObservable();
    title: string;
    currentPreferredStore: any = localStorage.getItem(this.PREFERRED_STORE_KEY) ? JSON.parse(localStorage.getItem(this.PREFERRED_STORE_KEY)) : null;
    @Input() modalView: boolean = false;
    filterAccordion: string = 'filter_accordion';
    selectFilterPane : string = 'select_filter_pane';
    @Input() set availableServices(services) {
        this.serviceTypes = services;
    }
    get availableServices(): any[] {
        return this.serviceTypes;
    }
    _query: string = '';
    set query(q: string) {
        this._query = q;
        if (!this.isNavigatingDropdown) {
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
    private static isLoading: boolean = false;

    constructor(private http: HttpClient, private storefrontUtils: StorefrontUtils, private translate: TranslateService,
        private ref: ChangeDetectorRef, private wchInfo: WchInfoService, private menuService: MenuService) {
        this.id = uniqueId();
        this.filterModalId = "storeLocator_filter_modal_" + this.id;
        this.expansionAccordionId = "storeLocator_exp_accordion_" + this.id;
        this.expansionAccordionModalId = "storeLocator_exp_accordion_modal_" + this.id;
        this.setPreferredStoreId = "storeLocator_set_preferred_store_" + this.id;

        for (let key of this.translationKey) {
            this.subscriptions.push(translate.get(key).subscribe((translated: string) => {
                this.translatedString.push(translated);
            }));
        }

        const onAvailableServiceTypes: Observable<string[]> = this.onAvailableServiceTypes =
            this.onAvailableServices
            .filter(Boolean)
            .distinctUntilChanged(isEqual)
            .pluck('categoryPaths')
            .filter(Boolean)
            /* istanbul ignore next */
            .map(paths => Object.keys(paths).map(key => paths[key][1]))
            .distinctUntilChanged(isEqual)
            .shareReplay(1);

        /* istanbul ignore next */
        this.subscriptions.push(onAvailableServiceTypes.subscribe( service => { this.serviceTypes = service }));
    }

    ngOnInit() {
        this.loadScript().then(() => {
            // Initialize map to the page
            this.initDefaultMap();

            // Try setting current geolocation
            this.setCurrentGeoLocation();
        });
    }

    ngAfterViewInit() {
        (<any>$(`#${this.filterModalId}`)).foundation();
        (<any>$(`#${this.filterAccordion}`)).foundation();
        this.subscriptions.push(
            this.expansionAccordion.changes.subscribe((change) => {
                (<any>$(`#${this.expansionAccordionId}`)).foundation();
                Foundation.reInit((<any>$(`#${this.expansionAccordionId}`)));
            })
        );
        if (this.modalView) {
            this.subscriptions.push(
                this.expansionAccordionModal.changes.subscribe((change) => {
                    (<any>$(`#${this.expansionAccordionModalId}`)).foundation();
                    Foundation.reInit((<any>$(`#${this.expansionAccordionModalId}`)));
                })
            );
        }
    }

    loadScript(): Promise<any> {
        return new Promise((resolve) => {
            if (!DynamicStoreLocatorLayoutComponent.isLoading) {
                let id = 'google-map-api-library';
                if (!document.getElementById(id)) {
                    let script: HTMLScriptElement = document.createElement('script');
                    script.type = 'text/javascript';
                    script.id = id;
                    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.GOOGLE_MAP_API_KEY + '&libraries=places';
                    document.head.appendChild(script);

                    DynamicStoreLocatorLayoutComponent.isLoading = true;
                    script.onload = () => {
                        DynamicStoreLocatorLayoutComponent.isLoading = false;
                        resolve(true);
                    };
                }
                else {
                    DynamicStoreLocatorLayoutComponent.isLoading = false;
                    resolve(true);
                }
            }
        });
    }

	ngOnDestroy() {
		if ((<any>$(`#${this.filterModalId}`)).length) {
            (<any>$(`#${this.filterModalId}`)).foundation("_destroy");
			(<any>$(`#${this.filterModalId}`)).remove();
        }
		if ((<any>$(`#${this.expansionAccordionId}`)).length) {
            (<any>$(`#${this.expansionAccordionId}`)).foundation("_destroy");
			(<any>$(`#${this.expansionAccordionId}`)).remove();
        }
        if ((<any>$(`#${this.expansionAccordionModalId}`)).length && this.modalView) {
            (<any>$(`#${this.expansionAccordionModalId}`)).foundation("_destroy");
			(<any>$(`#${this.expansionAccordionModalId}`)).remove();
        }
        if ((<any>$(`#${this.filterAccordion}`)).length) {
            (<any>$(`#${this.filterAccordion}`)).foundation("_destroy");
            (<any>$(`#${this.filterAccordion}`)).remove();
        }
        if (this.subscriptions) {
            this.subscriptions.forEach( subscription => {
                subscription.unsubscribe();
            });
        }
        this.ref.detach();
    }

    search(): void {
        this.addressSearchTerm = this.query;
        this.resetAttributes();
        let request = {
            query: this.query,
            fields: ['geometry']
        }
        let placeService = new google.maps.places.PlacesService(this.map);
        placeService.findPlaceFromQuery(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                this.noAddressFound = false;
                this.updateSearchCoordinate(results);
                Promise.resolve(this.addSearchResultsOnMap());
            }
            else {
                this.clearMarkers();
                this.searchResults = [];
                this.noAddressFound = true;
                this.ref.detectChanges();
            }
        });
    }

    triggerSearch(suggestion: any): void {
        this.triggeringSearch = true;
        this.query = suggestion.description;
        this.search();
    }

    retrieveSuggestions(): void {
        if (this.query.length >= 3) {
            let autocompleteService = new google.maps.places.AutocompleteService();
            let request = {
                input: this.query,
                bounds: this.searchBounds,
                types: ['geocode']
            }
            autocompleteService.getPlacePredictions(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                    const queryRegExp = new RegExp(escapeRegExp(this.query), "ig");
                    this.suggestionView = [];
                    for (let res of results) {
                        let suggestion: any = res;
                        suggestion.displayName = this.generateHighlightedTermString(res.description, queryRegExp);
                        this.suggestionView.push(suggestion);
                    }
                    this.navigationViewReferences.pointerIndex = -1;
                    this.navigationViewReferences.originalQuery = this.query;
                    this.navigationViewReferences.entries = this.suggestionView;
                }
                else {
                    this.suggestionView = [];
                }
            });
        }
        else {
            this.resetAttributes();
        }
    }

    keyDown(event: any): void {
        this.showSuggestion = true;
    }

    removeFocus(): void {
        setTimeout(() => {
            //blur happens before click
            if (!this.triggeringSearch) {
                this.showSuggestion = false;
            }
        }, 300);
    }

    arrowUp(event: any): void {
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

    arrowDown(event: any): void {
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

    hoverSelect(suggestion: any): void {
        for (let i = 0; i < this.navigationViewReferences.entries.length; i++) {
            if (this.navigationViewReferences.entries[i].id === suggestion.id) {
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

    resetAttributes(): void {
        this.showSuggestion = false;
        this.triggeringSearch = false;
        this.isNavigatingDropdown = false;
        this.navigationViewReferences.pointerIndex = -1;
        this.navigationViewReferences.originalQuery = "";
        this.navigationViewReferences.entries = [];
        this.suggestionView = [];
    }

    setSelectedSuggestion(suggestion: any, originalQuery: string): void {
        if (suggestion && suggestion.description) {
            this.query = suggestion.description;
        }
        else {
            this.query = originalQuery;
        }
    }

    generateHighlightedTermString(termString: string, regexp: RegExp): string {
        let matches = termString.match(regexp) || [];
        matches.forEach(m => {
            termString = termString.replace(m, "<b>" + m + "</b>");
        });
        return termString;
    }

    // Function to make the contextual search call and update the markers on the map with the results
    addSearchResultsOnMap(): Promise<any> {
        return this.proximitySearch().then((res) => {
            return this.addContentOnMap(res.documents);
        });
    }

    fitMapBoundary(): void {
        this.map.fitBounds(this.searchBounds);
        this.map.panToBounds(this.searchBounds);
        if (this.map.getZoom() > 18) {
            this.map.setZoom(this.map.getZoom()-6);
        }
    }

    proximitySearch(): Promise<any> {
        let url: string;
        if (this.storefrontUtils.useMocks) {
            url = 'mocks/commerce/contextualsearch/contextualSearchResult.mocks.json';
        } else {
            /* istanbul ignore next */
            url = this.wchInfo.apiUrl + this.CTX_SEARCH_SERVICE_API_URL + this.getContextualSearchQuery();
        }
        return this.http.get(url).toPromise();
    }

    // Update the center point for the contextual search
    updateContextualSearchCoordinate(lat: number, lng: number): void {
        this.latCoordinate = lat;
        this.lngCoordinate = lng;
        this.updateContextualSearchQuery();
    }

    // Update the distance for the contextual search
    updateContextualSearchDistance(distance: number): void {
        this.searchBounds = new google.maps.LatLngBounds();
        this.distance = distance;
        this.updateContextualSearchQuery();
    }

    // Update the address geocode (lat/lng) for the contextual search
    updateSearchCoordinate(results: google.maps.places.PlaceResult[]): void {
        this.latCoordinate = results[0].geometry.location.lat();
        this.lngCoordinate = results[0].geometry.location.lng();

        this.searchBounds = new google.maps.LatLngBounds();
        let nePoint = new google.maps.LatLng(results[0].geometry.viewport.getNorthEast().lat(), results[0].geometry.viewport.getNorthEast().lng());
        let swPoint = new google.maps.LatLng(results[0].geometry.viewport.getSouthWest().lat(), results[0].geometry.viewport.getSouthWest().lng());
        this.searchBounds.extend(nePoint);
        this.searchBounds.extend(swPoint);

        this.savedSearchBounds = new google.maps.LatLngBounds();
        this.savedSearchBounds.union(this.searchBounds);

        this.updateContextualSearchQuery();
    }

    // Updating the proximity search query
    updateContextualSearchQuery(): void {
        this.proximityQuery = '?filter=proximity&position=' + this.latCoordinate + ',' + this.lngCoordinate + '&distance=' + this.distance + '&rows=100&q=id:*&fl=document:[json]';
    }

    getContextualSearchQuery(): string {
        return this.proximityQuery;
    }

    addContentOnMap(searchDocuments: any[]): void {
        this.clearMarkers();
        this.searchResults = [];
        let markerLabelNumber = 1;
        this.savedDocuments = searchDocuments;

        // Adding new markers for the new results
        if (searchDocuments) {
            for (let docCount = 0; docCount < searchDocuments.length; docCount++) {
                let searchDocument: RenderingContext = searchDocuments[docCount].document;
                let store : any = this.getElementValue(searchDocument, this.PHYSICAL_STORE_IDENTIFIER_KEY);
                if (store && store.physicalStoreId) {
                    searchDocument['storeId'] = store.physicalStoreId.value
                }

                // Filter by services
                let currentCategoryList: string[] = this.getCategoryList(searchDocument, this.SERVICES_KEY);
                let serviceFilterExists: boolean = this.filteredServiceTypes.every((filteredServices) => {
                    return currentCategoryList.includes(filteredServices);
                });
                if (this.filteredServiceTypes && this.filteredServiceTypes.length === 0) {
                    // If no selected filters, show all by default
                    serviceFilterExists = true;
                }
                if (serviceFilterExists) {
                    let coordinates = {
                        lat: searchDocument.elements.coordinates.latitude,
                        lng: searchDocument.elements.coordinates.longitude
                    }
                    let marker = new google.maps.Marker({
                        position: coordinates,
                        title: this.getElementValue(searchDocument, this.NAME_KEY),
                        label: String(markerLabelNumber++),
                        map: this.map
                    });
                    marker.addListener('click', () => {
                        if (this.infoWindow) {
                            this.infoWindow.close();
                        }
                        this.infoWindow = new google.maps.InfoWindow({
                            content: this.getInfoWindowContent(searchDocument, marker.getLabel()),
                            maxWidth: 211
                        });
                        this.infoWindow.open(this.map, marker);

                        // click event for info window's set preferred store
                        setTimeout(() => {
                            (<any>$('#'+this.setPreferredStoreId)).on('click', () => {
                                this.setPreferredStore(searchDocument);
                                this.infoWindow.setContent(this.getInfoWindowContent(searchDocument, marker.getLabel()));
                                this.ref.detectChanges();
                            });
                        }, 300);

                        this.map.setCenter(marker.getPosition());
                        this.selectedResultItem = searchDocument.name;
                        this.ref.detectChanges();
                        this.scrollToSearchResultItem();
                    });

                    this.markerArray.push(marker);
                    this.searchResults.push(searchDocument);
                    this.searchBounds.extend(marker.getPosition());
                }
            }
        }
        else {
            this.searchBounds.union(this.savedSearchBounds);
        }
        this.fitMapBoundary();
        if (!this.ref['destroyed'])
            this.ref.detectChanges();
    }

    scrollToSearchResultItem(): void {
        let searchResultArray =  this.searchResultTarget.toArray();
        for (let target of searchResultArray) {
            if (target.nativeElement.className.includes('active')) {
                target.nativeElement.scrollIntoView({ block: "nearest", behavior: 'smooth' });
            }
        }
    }

    clearMarkers(): void {
        for (var i = 0; i < this.markerArray.length; i++) {
            this.markerArray[i].setMap(null);
        }
        this.markerArray.length = 0;
        this.markerArray = [];
    }

    initDefaultMap(): void {
        let mapProp: any = {
            center: new google.maps.LatLng(this.latCoordinate, this.lngCoordinate),
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            }],
            mapTypeControl: false,
            streetViewControl: false
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    }

    getInfoWindowContent(document: RenderingContext, labelNumber: any): string {
        let infoWindowContent = '<div id="storeLocator_div_92_' + this.id + '" class="info-win-content">' +
            '<div id="storeLocator_div_93_' + this.id + '" class="info-win-header">' +
            '<p id="storeLocator_p_94_' + this.id + '" class="info-win-title">' + labelNumber + '. ' + this.getElementValue(document, this.NAME_KEY) + '</p>' +
            '</div>' +
            '<div id="storeLocator_div_95_' + this.id + '" class="info-win-body">';
        if (this.getElementValue(document, this.HOURS_KEY)) {
            infoWindowContent = infoWindowContent.concat(
                '<p id="storeLocator_p_96_' + this.id + '" class="info-win-closing-hour info-win-section info-win-bold">' + this.getInfoContentClosingHour(document) + '</p>'
            );
        }
        infoWindowContent = infoWindowContent.concat('<div id="storeLocator_div_97_' + this.id + '" class="info-win-address">' + this.getElementValue(document, this.ADDRESS_KEY) + '</div>');
        if (this.getElementValue(document, this.PHONE_NUMBER_KEY)) {
            infoWindowContent = infoWindowContent.concat(
                '<p id="storeLocator_p_98_' + this.id + '" class="info-win-phone info-win-section info-win-underline">' +
                '<a id="storeLocator_a_99_' + this.id + '" href="tel:' + this.getElementValue(document, this.PHONE_NUMBER_KEY)  + '">' + this.getElementValue(document, this.PHONE_NUMBER_KEY) + '</a>' +
                '</p>'
            );
        }
        if (this.getElementValue(document, this.HOURS_KEY)) {
            infoWindowContent = infoWindowContent.concat(
                '<div id="storeLocator_div_100_' + this.id + '" class="info-win-hours-container">' +
                '<p id="storeLocator_p_101_' + this.id + '" class="info-win-hours-title info-win-bold">' + this.translatedString[1] + ':</p>' +
                '<div id="storeLocator_div_102_' + this.id + '" class="info-win-hours info-win-section">' + this.getElementValue(document, this.HOURS_KEY) + '</div>' +
                '</div>'
            );
        }
        infoWindowContent = infoWindowContent.concat(
            '<p id="storeLocator_p_103_' + this.id + '" class="info-win-direction info-win-section info-win-underline">' +
            '<a id="storeLocator_a_104_' + this.id + '" href="' + this.getDirectionLink(document) + '" target="_blank">' + this.translatedString[2] + '</a>' +
            '</p>'
        );
        if (this.getCategoryList(document, this.SERVICES_KEY)) {
            infoWindowContent = infoWindowContent.concat(
                '<div id="storeLocator_div_105_' + this.id + '" class="info-win-services-container">' +
                '<p id="storeLocator_p_106_' + this.id + '" class="info-win-services-title info-win-bold">' + this.translatedString[0] + ':</p>' +
                '<p id="storeLocator_p_107_' + this.id + '" class="info-win-services">' + this.getInfoContentServices(document) + '</p>' +
                '</div>'
            );
        }
        if (this.isPreferredStore(document)) {
            infoWindowContent = infoWindowContent.concat(
                '<span id="storeLocator_span_108_' + this.id + '" class="info-win-preferred-store">' +
                this.translatedString[4] +
                '</span>'
            );
        }
        else {
            infoWindowContent = infoWindowContent.concat(
                '<button id="' + this.setPreferredStoreId + '" class="button button-dark expanded info-win-set-preferred-store-button">' +
                this.translatedString[5] +
                '</button>'
            );
        }
        infoWindowContent = infoWindowContent.concat(
            '</div>' +
            '</div>'
        );
        return infoWindowContent;
    }

    setCurrentGeoLocation(): void {
        this.currentLocationLoading = true;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let currentPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                this.updateContextualSearchCoordinate(currentPos.lat, currentPos.lng);
                this.searchBounds = new google.maps.LatLngBounds();
                this.searchBounds.extend(new google.maps.LatLng(currentPos.lat, currentPos.lng));
                return this.addSearchResultsOnMap().then(() => {
                    this.currentLocationLoading = false;
                    this.allowLocationService = true;
                    this.query = '';
                    this.addressSearchTerm = this.translatedString[3];
                    this.noAddressFound = false;
                });
            },
            (error) => {
                this.currentLocationLoading = false;
                this.allowLocationService = false;
            });
        }
        else {
            this.currentLocationLoading = false;
            this.allowLocationService = false;
        }
    }

    getElementValue(rc: RenderingContext, elem: string): string {
		if (rc && rc.elements[elem] && rc.elements[elem].value) {
            return rc.elements[elem].value;
        }
        else {
            return '';
        }
    }

    getCategoryList(rc: RenderingContext, elem: string): string[] {
        let categoryList: string[] = [];
		if (rc && rc.elements[elem] && rc.elements[elem].categories) {
            for (let cat of rc.elements[elem].categories) {
                categoryList.push(cat.split('/').pop());
            }
        }
        return categoryList;
    }

    getInfoContentClosingHour(res: RenderingContext): string {
        if (this.getClosingHour(res)) {
            this.subscriptions.push(this.translate.get('StoreLocator.OpenUntil', { closingHour: this.currentClosingHour }).subscribe((res: string) => {
                this.translatedString.push(res);
            }));
            return this.translatedString[7];
        }
        else {
            return this.translatedString[6];
        }
    }

    getInfoContentServices(res: RenderingContext): string {
        return this.getCategoryList(res, this.SERVICES_KEY).join(", ");
    }

    openFilterOptionDialog(): void {
        (<any>$(`#${this.filterModalId}`)).foundation("open");
        this.fetchFilterOption();
    }

    fetchFilterOption(): void {
        this.selectedFilteredServiceTypes = this.savedFilteredServiceTypes.slice(0);
        this.selectedDistance = this.savedDistance;
    }

    closeModal(): void {
        (<any>$(`#${this.filterModalId}`)).foundation("close");
    }

    updateFilterOption(): void {
        this.closeModal();
        // Update search result when the distance option has changed
        let distanceChanged: boolean = false;
        let servicesChanged: boolean = false;
        this.selectedDistance = Number(this.selectedDistance);
        if (this.savedDistance != this.selectedDistance) {
            distanceChanged = true;
            this.savedDistance = this.selectedDistance;
            this.updateContextualSearchDistance(this.selectedDistance);
        }
        // Update search result when the service filter option has changed
        if (this.filteredServiceTypesChanged(this.savedFilteredServiceTypes, this.selectedFilteredServiceTypes)) {
            servicesChanged = true;
            this.savedFilteredServiceTypes = this.selectedFilteredServiceTypes;
            this.filteredServiceTypes = this.selectedFilteredServiceTypes;
        }

        if (distanceChanged) {
            Promise.resolve(this.addSearchResultsOnMap());
        }
        else if (servicesChanged) {
            this.addContentOnMap(this.savedDocuments);
        }
    }

    filteredServiceTypesChanged(savedFilteredServiceTypes: string[], selectedFilteredServiceTypes: string[]): boolean {
        if (savedFilteredServiceTypes === selectedFilteredServiceTypes) return false;
        if (savedFilteredServiceTypes.length !== selectedFilteredServiceTypes.length) return true;
        savedFilteredServiceTypes.sort();
        selectedFilteredServiceTypes.sort();
        for (let i = 0; i < savedFilteredServiceTypes.length; i++) {
            if (savedFilteredServiceTypes[i] !== selectedFilteredServiceTypes[i]) return true;
        }
        return false;
    }

    selectResultItem(item: RenderingContext): void {
        for (let marker of this.markerArray) {
            if (marker.getTitle() === this.getElementValue(item, this.NAME_KEY)) {
                if (this.infoWindow) {
                    this.infoWindow.close();
                }
                this.infoWindow = new google.maps.InfoWindow({
                    content: this.getInfoWindowContent(item, marker.getLabel()),
                    maxWidth: 211
                });
                this.infoWindow.open(this.map, marker);

                // click event for info window's set preferred store
                setTimeout(() => {
                    (<any>$('#'+this.setPreferredStoreId)).on('click', () => {
                        this.setPreferredStore(item);
                        this.infoWindow.setContent(this.getInfoWindowContent(item, marker.getLabel()));
                    });
                }, 300);

                this.map.setCenter(marker.getPosition());
                this.selectedResultItem = item.name;
            }
        }
    }

    getClosingHour(currentItem: RenderingContext): string {
        let today = this.DAYS[this.todaysDate.getDay()];
        let closingHour = '';
        let openingHours = this.getElementValue(currentItem, this.HOURS_KEY);
        if (openingHours.includes(today)) {
            let startingHourIndex = openingHours.indexOf(today);
            let closingHourIndex = openingHours.substring(startingHourIndex).indexOf('<');
            let hourPeriod = openingHours.substring(startingHourIndex, startingHourIndex+closingHourIndex);
            closingHour = hourPeriod.split(' ').pop() || hourPeriod.split('-').pop();
            closingHour = closingHour.trim().toUpperCase();
        }
        else if (openingHours.includes(this.DAYS[1]+'-'+this.DAYS[5])) {
            let startingHourIndex = openingHours.indexOf(this.DAYS[5]);
            let closingHourIndex = openingHours.substring(startingHourIndex).indexOf('<');
            let hourPeriod = openingHours.substring(startingHourIndex, startingHourIndex+closingHourIndex);
            closingHour = hourPeriod.split(' ').pop() || hourPeriod.split('-').pop();
            closingHour = closingHour.trim().toUpperCase();
        }

        return this.currentClosingHour = closingHour;
    }

    getDirectionLink(res: RenderingContext): string {
        let address: string = this.getElementValue(res, this.ADDRESS_KEY);
        address = address.replace('<br />', ' ');
        let htmlObject: HTMLDivElement = document.createElement('div');
        htmlObject.innerHTML = address;
        let dest: string = htmlObject.getElementsByTagName("p")[0].innerText;
        return this.GOOGLE_MAP_DEST_URL + dest;
    }

    checkBoxClicked(e: any): void {
        let checkbox_id = e.target.id;
        // ID for checkbox is storeLocator_input_43_{{i}}_{{id}}
        let typesIndex: number = parseInt(checkbox_id.split('_')[3]);
        let selectedType: string = this.serviceTypes[typesIndex];
        if (!e.target.checked) {
            this.removeFilter(selectedType);
        }
        else {
            this.addFilter(selectedType);
        }
        if(this.modalView){
            this.updateFilterOption();
        }
    }

    addFilter(filterToAdd: string): void {
        this.selectedFilteredServiceTypes.push(filterToAdd);
    }

    removeFilter(filterToRemove: string): void {
        this.selectedFilteredServiceTypes = this.selectedFilteredServiceTypes.filter(obj => obj !== filterToRemove);
    }

    removeFilterSelection(filterToRemove: string): void {
        this.filteredServiceTypes = this.filteredServiceTypes.filter(obj => obj !== filterToRemove);
        this.savedFilteredServiceTypes = this.filteredServiceTypes.slice(0);
        this.selectedFilteredServiceTypes = this.filteredServiceTypes.slice(0);
        this.addContentOnMap(this.savedDocuments);
    }

    clearAllFilterSelection(): void {
        this.selectedFilteredServiceTypes = [];
        this.filteredServiceTypes = [];
        this.savedFilteredServiceTypes = [];
        this.addContentOnMap(this.savedDocuments);
    }

    openTab(tabName: string): void {
        if (tabName === 'listViewTab') {
            this.listViewTabOpened = true;
        }
        else {
            this.listViewTabOpened = false;
            setTimeout(() => {
                this.fitMapBoundary();
            }, 300);
        }
        this.ref.detectChanges();
    }

    isPreferredStore(item: RenderingContext): boolean {
        let physicalStoreIdentifier: any = this.getElementValue(item, this.PHYSICAL_STORE_IDENTIFIER_KEY);
        if (!this.currentPreferredStore) {
            return false;
        }
        return physicalStoreIdentifier.physicalStoreId.value === this.currentPreferredStore.storeId;
    }

    setPreferredStore(item: RenderingContext): void {
        let physicalStoreIdentifier: any = this.getElementValue(item, this.PHYSICAL_STORE_IDENTIFIER_KEY);
        let preferredStore = {
            storeName: physicalStoreIdentifier.physicalStoreName.value,
            storeId: physicalStoreIdentifier.physicalStoreId.value
        };
        this.currentPreferredStore = preferredStore;
        this.menuService.pushPreferredStore(this.PREFERRED_STORE_KEY, preferredStore);
    }

}