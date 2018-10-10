import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DynamicStoreLocatorLayoutComponent } from './store-locator.dynamic.component';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { MockRouter } from 'mocks/angular-class/router';
import {WchInfoService} from 'ibm-wch-sdk-ng';

declare var __karma__: any;

describe('DynamicStoreLocatorLayoutComponent', () => {
    let component: DynamicStoreLocatorLayoutComponent;
    let fixture: ComponentFixture<DynamicStoreLocatorLayoutComponent>;
    let ngAfterViewInitSpy;
    let loadScriptSpy;
    let placesService;
    let findPlaceResults = [
        {
            "geometry" : {
                "location" : {
                    "lat" : 43.653226,
                    "lng" : -79.3831843
                },
                "viewport" : {
                    "northeast" : {
                        "lat" : 43.8554579,
                        "lng" : -79.00248100000002
                    },
                    "southwest" : {
                        "lat" : 43.45829699999999,
                        "lng" : -79.639219
                    }
                }
            }
        }
    ];

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicStoreLocatorLayoutComponent],
            imports: [ HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
                loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                CommonTestModule
            ],
            providers: [
                Logger,
                { provide: Router, useClass: MockRouter },
                { provide: WchInfoService, useClass: MockWchInfoService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicStoreLocatorLayoutComponent);
        component = fixture.componentInstance;
        ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
        loadScriptSpy = spyOn(component, 'loadScript').and.callFake(function() { return new Promise((resolve) => resolve(true)) });
        fixture.detectChanges();
        component.ngOnDestroy = function(){};
        __karma__.config.testGroup = "";
        done();
    });

    beforeEach((done) => {
        let placesSpy = spyOn(google.maps.places, 'PlacesService');
        placesService = jasmine.createSpyObj('PlacesService', ['findPlaceFromQuery']);
        placesSpy.and.returnValue(placesService);
        done();
    });

    it('should instantiate', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to search and retrieve an address', (done) => {
        let spy = spyOn(component, 'updateSearchCoordinate').and.callFake(
            function(results: google.maps.places.PlaceResult[]) {
                component.latCoordinate = findPlaceResults[0].geometry.location.lat;
                component.lngCoordinate = findPlaceResults[0].geometry.location.lng;

                component.searchBounds = new google.maps.LatLngBounds();
                let nePoint = new google.maps.LatLng(findPlaceResults[0].geometry.viewport.northeast.lat, findPlaceResults[0].geometry.viewport.northeast.lng);
                let swPoint = new google.maps.LatLng(findPlaceResults[0].geometry.viewport.southwest.lat, findPlaceResults[0].geometry.viewport.southwest.lng);
                component.searchBounds.extend(nePoint);
                component.searchBounds.extend(swPoint);

                component.savedSearchBounds = new google.maps.LatLngBounds();
                component.savedSearchBounds.union(this.searchBounds);
            }
        );
        placesService.findPlaceFromQuery.and.callFake(function(request, callback) {
            let status = google.maps.places.PlacesServiceStatus.OK;
            callback(findPlaceResults, status);
        });
        component.query = 'toronto';
        component.search();

        setTimeout(() => {
            expect(component.noAddressFound).toBe(false);
            expect(component.updateSearchCoordinate).toHaveBeenCalled();
            done();
        }, 500);
    });

    it('should be able to search a non-existing address', (done) => {
        placesService.findPlaceFromQuery.and.callFake(function(request, callback) {
            callback([], google.maps.places.PlacesServiceStatus.NOT_FOUND);
        });
        component.query = ' ';
        component.search();

        setTimeout(() => {
            expect(component.noAddressFound).toBe(true);
            expect(component.searchResults).toEqual([]);
            expect(component.markerArray).toEqual([]);
            done();
        }, 500);
    });

    it('should be able to click on typeahead suggestion and search an address', (done) => {
        let spy = spyOn(component, 'updateSearchCoordinate').and.callFake(
            function(results: google.maps.places.PlaceResult[]) {
                component.latCoordinate = findPlaceResults[0].geometry.location.lat;
                component.lngCoordinate = findPlaceResults[0].geometry.location.lng;

                component.searchBounds = new google.maps.LatLngBounds();
                let nePoint = new google.maps.LatLng(findPlaceResults[0].geometry.viewport.northeast.lat, findPlaceResults[0].geometry.viewport.northeast.lng);
                let swPoint = new google.maps.LatLng(findPlaceResults[0].geometry.viewport.southwest.lat, findPlaceResults[0].geometry.viewport.southwest.lng);
                component.searchBounds.extend(nePoint);
                component.searchBounds.extend(swPoint);

                component.savedSearchBounds = new google.maps.LatLngBounds();
                component.savedSearchBounds.union(this.searchBounds);
            }
        );
        placesService.findPlaceFromQuery.and.callFake(function(request, callback) {
            callback(findPlaceResults, google.maps.places.PlacesServiceStatus.OK);
        });

        let suggestion: any = {
            description: 'Toronto, ON, Canada'
        };
        component.triggerSearch(suggestion);

        setTimeout(() => {
            expect(component.query).toEqual(suggestion.description);
            expect(component.noAddressFound).toBe(false);
            expect(component.updateSearchCoordinate).toHaveBeenCalled();
            done();
        }, 500);
    });

    it('should be able to remove search input focus if triggeringSearch is true', (done) => {
        component.triggeringSearch = true;
        component.showSuggestion = false;
        component.removeFocus();
        setTimeout(() => {
            expect(component.showSuggestion).toBe(false);
            done();
        }, 500);
    });

    it('should be able to remove search input focus if triggeringSearch is false', (done) => {
        component.triggeringSearch = false;
        component.showSuggestion = true;
        component.removeFocus();
        setTimeout(() => {
            expect(component.showSuggestion).toBe(false);
            done();
        }, 500);
    });

    xit('should be able to set current geolocation', () => {
        component.ngOnInit();

        expect(component.latCoordinate).toEqual(43.653226);
        expect(component.lngCoordinate).toEqual(-79.3831843);
    });

    it('should open filter option dialog and fetch saved filter option', () => {
        let spy = spyOn(component, 'openFilterOptionDialog');
        component.openFilterOptionDialog();
        expect(component.openFilterOptionDialog).toHaveBeenCalled();
    });

    it('should add filter from filter dialog', () => {
        let event = {
            target: {
                id: "storeLocator_input_56_0_36",
                checked: true
            }
        }
        component.serviceTypes = ['Assembly services', 'Cafeteria'];
        component.checkBoxClicked(event);
        expect(component.selectedFilteredServiceTypes).toContain('Assembly services');
    });

    it('should remove filter from filter dialog', () => {
        let event = {
            target: {
                id: "storeLocator_input_56_0_36",
                checked: false
            }
        }
        component.serviceTypes = ['Assembly services', 'Cafeteria'];
        component.checkBoxClicked(event);
        expect(component.selectedFilteredServiceTypes).not.toContain('Assembly services');
    });

    it('should remove filter selection and refresh the content on map', () => {
        let spy = spyOn(component, 'addContentOnMap');
        component.filteredServiceTypes = ['Assembly services', 'Cafeteria'];
        component.removeFilterSelection('Assembly services');
        expect(component.filteredServiceTypes).toEqual(['Cafeteria']);
        expect(component.savedFilteredServiceTypes).toEqual(component.filteredServiceTypes);
        expect(component.selectedFilteredServiceTypes).toEqual(component.filteredServiceTypes);
        expect(component.addContentOnMap).toHaveBeenCalled();
    });

    it('should clear all filter selection', () => {
        let spy = spyOn(component, 'addContentOnMap');
        component.clearAllFilterSelection();
        expect(component.selectedFilteredServiceTypes).toEqual([]);
        expect(component.filteredServiceTypes).toEqual([]);
        expect(component.savedFilteredServiceTypes).toEqual([]);
        expect(component.addContentOnMap).toHaveBeenCalled();
    });

    it('should update distance filter option', (done) => {
        let spy1 = spyOn(component, 'addSearchResultsOnMap');
        let spy2 = spyOn(component, 'closeModal').and.callFake(function(){});
        component.selectedDistance = 25;
        component.updateFilterOption();
        setTimeout(() => {
            expect(component.distance).toEqual(component.selectedDistance);
            expect(component.savedDistance).toEqual(component.selectedDistance);
            expect(component.addSearchResultsOnMap).toHaveBeenCalled();
            expect(component.closeModal).toHaveBeenCalled();
            done();
        }, 1000);
    });

    describe('Search result', () => {
        let mockedSearchResult: any = [
            {
                name: "Markville Mall",
                elements: {
                    address:{
                        elementType: "formattedtext",
                        value: "<p>8000 McCowan Rd<br />↵Markham, Ontario L3P 3J3 Canada</p>↵"
                    },
                    coordinates:{
                        elementType: "location",
                        latitude: 43.868413,
                        longitude: -79.288097
                    },
                    hours:{
                        elementType: "formattedtext",
                        value: "<p>Mon-Fri: 10am - 9pm<br />↵Sat: 9am - 7pm<br />↵Sun: 11am - 6pm</p>↵"},
                        identifier:{elementType: "text", value: "Stockholm"
                    },
                    name:{
                        elementType: "text",
                        value: "Markville Mall"
                    },
                    phoneNumber:{
                        elementType: "text",
                        value: "905-416-6666"
                    },
                    services:{
                        elementType: "category",
                        categories: [
                            "Physical store services type/Cafeteria",
                            "Physical store services type/Click and Collect",
                            "Physical store services type/Kitchen services"
                        ]
                    },
                    physicalStoreIdentifier:{
                        value: {
                            "physicalStoreId" :{"value":"123456"},
                            "physicalStoreName": {"value" : "123456"}
                        }
                    }
                }
            }
        ];

        xit('should select result item', () => {
            let mockedMarkerList: any[] = [
                {
                    position: {
                        lat: 43.868413,
                        lng: -79.288097
                    },
                    title: "Markville Mall",
                    label: "1",
                }
            ];
            component.markerArray = mockedMarkerList;
            component.selectResultItem(mockedSearchResult[0]);
            expect(component.selectedResultItem).toEqual(mockedSearchResult[0].name);
        });

        it('should return info window content for popover marker', (done) => {
            setTimeout(() => {
                expect(component.getInfoWindowContent(mockedSearchResult[0], "1")).toBeDefined();
                done();
            }, 1000);
        });
    });

    describe('Search suggestion', () => {
        let searchSuggestionList = [
            {
                description: "Toronto, ON, Canada",
                displayName: "<b>Toron</b>to, ON, Canada"
            },
            {
                description: "Toronto Coach Terminal, Bay Street, Toronto, ON, Canada",
                displayName: "<b><b>Toron</b></b>to Coach Terminal, Bay Street, Toronto, ON, Canada"
            },
            {
                description: "Toronto City Hall, Queen Street West, Toronto, ON, Canada",
                displayName: "<b><b>Toron</b></b>to City Hall, Queen Street West, Toronto, ON, Canada",
                id: "49bd693667587b99e443adb74c53c334c27a07d0"
            },
            {
                description: "Toronto Islands, Toronto, ON, Canada",
                displayName: "<b><b>Toron</b></b>to Islands, Toronto, ON, Canada"
            },
            {
                description: "Toronto Airport-Terminal 1 (Ground Level), Mississauga, ON, Canada",
                displayName: "<b>Toron</b>to Airport-Terminal 1 (Ground Level), Mississauga, ON, Canada"
            }
        ];

        beforeEach(() => {
            component.showSuggestion = false;
            component.query = 'toron';
            component.navigationViewReferences.originalQuery = component.query;
            component.navigationViewReferences.pointerIndex = -1;
            component.navigationViewReferences.entries = searchSuggestionList;
        });

        it('should be able to show suggestion, arrow down and arrow up on search suggestion', () => {
            component.keyDown({});
            expect(component.showSuggestion).toBe(true);

            component.arrowDown({});
            expect(component.navigationViewReferences.pointerIndex).toEqual(0);
            expect(component.navigationViewReferences.entries[component.navigationViewReferences.pointerIndex].description).toEqual(
                "Toronto, ON, Canada"
            );
            expect(component.query).toEqual("Toronto, ON, Canada");

            for (let i = component.navigationViewReferences.pointerIndex; i < component.navigationViewReferences.entries.length; i++) {
                component.arrowDown({});
            }
            expect(component.navigationViewReferences.pointerIndex).toEqual(4);
            expect(component.navigationViewReferences.entries[component.navigationViewReferences.pointerIndex].description).toEqual(
                "Toronto Airport-Terminal 1 (Ground Level), Mississauga, ON, Canada"
            );
            expect(component.query).toEqual("Toronto Airport-Terminal 1 (Ground Level), Mississauga, ON, Canada");

            component.arrowUp({});
            expect(component.navigationViewReferences.pointerIndex).toEqual(3);
            expect(component.navigationViewReferences.entries[component.navigationViewReferences.pointerIndex].description).toEqual(
                "Toronto Islands, Toronto, ON, Canada"
            );
            expect(component.query).toEqual("Toronto Islands, Toronto, ON, Canada");

            for (let i = component.navigationViewReferences.pointerIndex; i > 0; i--) {
                component.arrowUp({});
            }
            expect(component.navigationViewReferences.pointerIndex).toEqual(0);
            expect(component.navigationViewReferences.entries[component.navigationViewReferences.pointerIndex].description).toEqual(
                "Toronto, ON, Canada"
            );
            expect(component.query).toEqual("Toronto, ON, Canada");

            component.arrowUp({});
            expect(component.navigationViewReferences.pointerIndex).toEqual(-1);
            expect(component.isNavigatingDropdown).toBe(false);
            expect(component.query).toEqual(component.navigationViewReferences.originalQuery);
            component.arrowUp({});
        });

        it('should NOT be able to arrow down or arrow up on search suggestion', () => {
            expect(component.showSuggestion).toBe(false);
            component.arrowUp({});
            expect(component.navigationViewReferences.pointerIndex).toEqual(-1);
            expect(component.isNavigatingDropdown).toBe(false);
            expect(component.query).toEqual(component.navigationViewReferences.originalQuery);

            component.arrowDown({});
            expect(component.navigationViewReferences.pointerIndex).toEqual(-1);
            expect(component.isNavigatingDropdown).toBe(false);
            expect(component.query).toEqual(component.navigationViewReferences.originalQuery);
        });

        it('should be able to hover select on search suggestion', () => {
            let suggestion = {
                description: "Toronto City Hall, Queen Street West, Toronto, ON, Canada",
                displayName: "<b><b>Toront</b></b>o City Hall, Queen Street West, Toronto, ON, Canada",
                id: "49bd693667587b99e443adb74c53c334c27a07d0"
            };
            component.hoverSelect(suggestion);
            expect(component.navigationViewReferences.pointerIndex).toEqual(2);
            expect(component.navigationViewReferences.entries[component.navigationViewReferences.pointerIndex].highlight).toBe(true);
            expect(component.isNavigatingDropdown).toBe(false);
            expect(component.query).toEqual(suggestion.description);
        });
    });

    it('should add the preferred store icon when a store is the preferred store', (done) => {
        let fakerc : any= {};
        spyOn(component, "getElementValue").and.returnValue({
            "physicalStoreId" :{"value":"123456"},
            "physicalStoreName": {"value" : "123456"}
        });
        spyOn(component, "getInfoContentClosingHour").and.returnValue({});
        spyOn(component, "getDirectionLink").and.returnValue({});
        spyOn(component, "getInfoContentServices").and.returnValue({});
        spyOn(component, "getCategoryList").and.returnValue(false);

        component.setPreferredStore(fakerc);
        expect(component.isPreferredStore(fakerc)).toBe(true);
        expect(component.getInfoWindowContent(fakerc, "")).toContain("info-win-preferred-store");
        done();
    });
});


export class MockWchInfoService{
    apiUrl: URL;
    deliveryUrl: URL;
    isPreviewMode: boolean;
    baseUrl?: URL;
    constructor(){}
}