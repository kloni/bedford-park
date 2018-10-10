import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DynamicCSRComponent } from './csr.dynamic.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { Logger } from 'angular2-logger/core';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MockRouter } from 'mocks/angular-class/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { ConfigService } from '../../common/config.service';
import { CommonTestModule } from '../../common/common.test.module';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { DatePipe } from '@angular/common';
import { GuestIdentityService } from '../../services/rest/transaction/guestIdentity.service';
import { PersonService } from '../../services/rest/transaction/person.service';
import { CartTransactionService } from '../../services/componentTransaction/cart.transaction.service';
import { PrivacyPolicyService } from '../../services/componentTransaction/privacypolicy.service';

declare var __karma__: any;
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'locales/');
}

describe('DynamicCSRComponent', () => {

    let component: DynamicCSRComponent;
    let fixture: ComponentFixture<DynamicCSRComponent>;
    let guestIdentityService: GuestIdentityService;
    let cartTransactionSvc: CartTransactionService;
    let personService: PersonService;
    let ngAfterViewInitSpy;
    let doAccordionSpy;
    let doTabSpy;
    let mockRouter: Router;
    const MockActivatedRoute = {
        storeId: '1'
    }

    beforeEach((done) => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            declarations: [DynamicCSRComponent],
            imports: [TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
                HttpClientModule, HttpModule, FormsModule, CommonTestModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                PersonContactService,
                CountryService,
                GuestIdentityService,
                Logger,
                HttpTestingController,
                { provide: Router, useClass: MockRouter },
                { provide: PrivacyPolicyService, useClass: class {} },
                { provide: StoreConfigurationsCache, useClass: class {} },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: Observable.from([MockActivatedRoute]) },
                },
                DatePipe
            ]
        }).compileComponents();
        done();
    });

    beforeEach(inject([GuestIdentityService, CartTransactionService, PersonService], (_guestIdentityService: GuestIdentityService, _personService: PersonService) => {
        guestIdentityService = _guestIdentityService;
        __karma__.config.testGroup = "";
    }));

    beforeEach(async(() => {
        __karma__.config.testGroup = '';
        cartTransactionSvc = TestBed.get(CartTransactionService);
        mockRouter = TestBed.get(Router);
        personService = TestBed.get(PersonService);
        fixture = TestBed.createComponent(DynamicCSRComponent);
        component = fixture.componentInstance;
        ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function (){});
        doAccordionSpy = spyOn(component, 'doAccordionAction').and.callFake(function (){});
        doTabSpy = spyOn(component, 'doTabAction').and.callFake(function (){});
        component.id = "testId";
        fixture.detectChanges();
        mockRouter.initialNavigation();
        let currentUser = 'eyJwZXJzb25hbGl6YXRpb25JRCI6IjE1MzExNjEzNDg2ODctMiIsIldDVG9rZW4iOiI5OTg2MTUlMkNJWEttRTlieFRueGt6UTJsTnlEckU3Vlh4a2dycDlnTVhreDlweTl2UUs3WjBYYzhLM0g2VGdDaHJkZk5lUVduaENqZ2FkNGxSVlZxakZiSFdMaEd3RmJ2dEFwQnV3OFI0WHh3SDZDc1k5Q0xYbnYyQTc3YW56UnVtVTJHYkN6VjdxeUxWN3BVSXpDZE1KRm1IYmlKbGxDc1dNSW96dURmViUyQjZuWHdhYnl6Q3huZXpNUWpuQWVrMExJVnNsdHdFenlxenkwMjlrMkFENCUyRnNRZVRDZlNCVWl2aEUyZVF0Wnd5VmlPOXolMkIyTm9DVGx4YnglMkY3aDBpZyUyQnhQeFhvZEVacyIsInVzZXJJZCI6Ijk5ODYxNSIsIldDVHJ1c3RlZFRva2VuIjoiOTk4NjE1JTJDTkdNRzlDdmZjNTNzJTJGQzMyUkthcFN4SGhLM0VFbkU2JTJGS1dHd2NFVzBNZDAlM0QiLCJ1c2VybmFtZSI6ImdyYWNlY3NyQGdtYWlsLmNvbSIsImlzR29pbmdUb0NoZWNrb3V0IjpmYWxzZSwiaXNDU1IiOnRydWV9';
        sessionStorage.setItem('currentUser' ,currentUser);
    }));

    afterEach((done) => {
        component = null;
        __karma__.config.testGroup = '';
        done();
    });

    it('should instantiate', () => {
        // instatiation test case
        expect(component).toBeTruthy();
    });

    it("should have inputs and invariants initialized", () => {
        expect(component.id).toEqual("testId");
        expect(component.countries.length).toBeGreaterThan(0);
        expect(Object.keys(component.cDescs).length).toEqual(component.countries.length);
    });

    it("should not refetch countries when already initialized", (done) => {
        component.getCountries()
        .then((r) => {
          expect(r.body).toBeNull();
          done();
        })
        .catch((e) => { expect(1).toEqual(0) });
    });

    it("should have countries and descriptors initialized", (done) => {
        let origLen = component.countries.length;
        delete component.countries;
        component.getCountries().then((r) => {
            expect(component.countries).toBeUndefined();
            component.initCountries(r);
            expect(component.countries).toBeDefined();
            expect(component.countries.length).toEqual(origLen);
            expect(Object.keys(component.cDescs).length).toEqual(origLen);
            done();
        })
        .catch((e) => { expect(1).toEqual(0) });
    });

    it("should be able to set state to empty", () => {
        let desc = {
            country: "ZZ",
            state: "ZZ"
        }
        component.cDescs = {
            "ZZ": {
                stDescs: {}
            }
        }
        component.fixState(desc);
        expect(desc.state).toBe("");
    });

    it("should return true if user search is invalid", () => {
        //values in component.userDescs are empty initially so below should work
        expect(component.isUserSearchInvalid()).toBeTruthy();
    });


    it("should return false if user search is valid", () => {
        component.userDesc.firstName = "firstName";
        expect(component.isUserSearchInvalid()).toBeFalsy();
    });

    it("should clear search results and attributes when entering userDesc", () => {
        component.searchResults = ['result1', 'result2'];
        component.SEARCH_ATTRS.forEach((a) => {
            component.userDesc[a] = "x";
        });
        component.clear();
        expect(component.searchResults).toEqual([])

    });

    it("should clear order form", () => {
        component.orderResults = ['result1', 'result2'];
        component.clearOrderForm();
        expect(component.orderResults).toEqual([])
    });

    it("should get registered users that CSR can manage", (done) => {
        let extra = {
            testprop: "testValue"
        }
        component.getRegUsersICanManage(extra).then(res => {
            expect(res.body).toBeDefined();
            done();
        });

    });

    it("should clear no results flag", () => {
        component.noResultsFound = true;
        component.clearNoResults();
        expect(component.noResultsFound).toBeFalsy();
    })

    it("should clear no order results flag", () => {
        component.noOrdersFound = true;
        component.clearNoOrderResults();
        expect(component.noOrdersFound).toBeFalsy();
    })

    it("should be able to shop as guest", (done) => {
        expect(component.csrDesc.actingAs).toBeUndefined();
        component.shopAsGuest().then(res => {
            expect(component.csrDesc.actingAs).toBeDefined();
            done();
        });
    })

    it("should search for user as CSR", (done) => {
        component.search().then(res => {
            expect(component.searchResults.length).toEqual(1);
            expect(component.noResultsFound).toBeFalsy();
            done();
        })

    })

    it("should start acting", () => {
        let spy = spyOn(cartTransactionSvc, 'getCart');
        expect(component.csrDesc.actingAs).toBeUndefined();
        let u = {
            logonId: "testLogon",
            memberId: "memberID",
            personalizationId: "personalizationId"
        }

        component.startActing(u);
        expect(component.csrDesc.actingAs.userName).toEqual("testLogon");
        expect(cartTransactionSvc.getCart).toHaveBeenCalled();
    })

    it("should stop acting", () => {
        component.csrDesc.actingAs = false;//setting to something to check if it is null after
        component.stopActing();
        expect(component.csrDesc.actingAs).toBeNull();
    })

    it("should be able to start-acting as CSR from user-search", (done) => {
        let spy = spyOn(component, 'startActing');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            personalizationId: "personalizationId",
            userRegistry: {
                status: "1"
            }
        }
        component.CHOICES.ACT = "testAction";
        component.doAction(u, "testAction");
        expect(component.startActing).toHaveBeenCalled();
        done();
    });

    it("should be able to do status-update as CSR from user-search", (done) => {
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            personalizationId: "personalizationId",
            userRegistry: {
                status: "1"
            }
        }

        let spy = spyOn(component, 'search').and.callFake(function (){});
        component.CHOICES.ACT = "testAction2" //exercise else branch
        component.doAction(u, "testAction").then(res => {
            // wait for the timeout inside the promise to finish
            setTimeout(()=>{
              expect(component.search).toHaveBeenCalled();
              done();
            }, 550);
        });
    })

    it("do order action should start acting as user", (done) => {
        let spy = spyOn(component, 'startActing');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            personalizationId: "personalizationId",
            memberDescriptor: {
              registerType: "C",
              userRegistry: {
                status: "1"
              }
            }
        }
        component.CHOICES.ACT = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
            expect(component.startActing).toHaveBeenCalled();
            done();
        });
    })

    it("do order action should search", (done) => {
        let spy = spyOn(component, 'searchOrders');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                userId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
        }

        component.CHOICES.STATUS = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
            expect(component.searchOrders).toHaveBeenCalled();
            done();
        });
    })

    it("do order action should navigate cart", (done) => {
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                logonId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
            status: "P"
        }

        component.CHOICES.VIEW_SUMMARY = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/Shopping cart']);
            done();
        });
    })

    it("do order action should navigate to order details", (done) => {
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                logonId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
            status: "ELSE",
            orderId: "1"
        }

        component.CHOICES.VIEW_SUMMARY = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/Order Details'], Object({ queryParams: Object({ orderId: '1' }) }));
            done();
        });
    })

    it("do order action should flip cart status", (done) => {
        let spy = spyOn(component, 'searchOrders');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                logonId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
            status: "ELSE",
            orderId: "1"
        }

        component.CHOICES.FLIP_LOCK = "lock";
        component.doOrderAction(u, "lock").then(res => {
            expect(component.searchOrders).toHaveBeenCalled();
            done();
        });
    })

    it("do order action should lock cart", (done) => {
        let spy = spyOn(component, 'searchOrders').and.callFake(function () { return "test" });
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                logonId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
            status: "ELSE",
            orderId: "1"
        }

        component.CHOICES.ACT = "actELSE";
        component.doOrderAction(u, "lock").then(res => {
            //expect searchOrders to be called as a result of doOrderActiom being called recursively
            expect(component.searchOrders).toHaveBeenCalled();
            done();
        });
    })

    it("search orders should populate order results", (done) => {
        let spy = spyOn(component, 'getMemberData').and.callFake(function () { return "test" });
        component.orderDesc.orderId = "12345";
        component.searchOrders().then(res => {
            expect(component.orderResults.length).toEqual(2);
            expect(component.orderResults[0].orderId).toEqual("order1");
            done();
        })
    })

    it(" search orders should return empty order results", (done) => {
        __karma__.config.testGroup = 'zero';
        let spy = spyOn(component, 'getMemberData').and.callFake(function () { return "test" });
        component.orderDesc.orderId = "12345";
        component.searchOrders().then(res => {
            expect(component.orderResults).toEqual([]);
            done();
        })
    })


    it("should get member data ", (done) => {
        let orderData = [{ memberId: "memberID", userId: "memberID" }];
        let desc:any={};
        Promise.all(component.getMemberData(orderData,desc)).then(res => {
            expect(desc['memberID'].logonId).toEqual('testLogon');
            done();
        })
    })

    it("should throw error when unable to search as CSR", (done) => {
        __karma__.config.testGroup = 'error';
        component.search().then(res => {
        }).catch(e => {
            expect(component.csrErrors.searchError).toEqual('Unable to perform user search as CSR');
            done();
        })
    })

    it("should throw error when Unable to fetch logon-data by user-id", (done) => {
        __karma__.config.testGroup = 'error';
        let spy = spyOn(component, 'startActing');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            personalizationId: "personalizationId",
            memberDescriptor: {
              registerType: "C",
              userRegistry: {
                status: "1"
              }
            }
        }
        component.CHOICES.ACT = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
            expect(component.startActing).toHaveBeenCalled();
        }).catch(e => {
            expect(e.error).toEqual('NOT FOUND');
            done();
        })
    })

    it("should throw error when unable to perform status update on user as CSR", (done) => {
        __karma__.config.testGroup = 'error';
        let spy = spyOn(component, 'searchOrders');
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                userId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
        }

        component.CHOICES.STATUS = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
        }).catch(e => {
            expect(e.error).toEqual('NOT FOUND');
            done();
        });
    })

    it("should throw error when unable to perform user search as CSR using order-data for view-summary", (done) => {
        __karma__.config.testGroup = 'error';
        let u = {
            userId: "testLogon",
            memberId: "memberID",
            memberDescriptor: {
                logonId: "userId",
                userRegistry: {
                    status: "1"
                }
            },
            personalizationId: "personalizationId",
            status: "P"
        }

        component.CHOICES.VIEW_SUMMARY = "testAction";
        component.doOrderAction(u, "testAction").then(res => {
        }).catch(e => {
            expect(component.csrErrors.searchError).toEqual(component.csrErrors.searchError);
            done();
        });
    })

    it("searchOrders should throw error when unable to perform status update on user as CSR", (done) => {
        __karma__.config.testGroup = 'error';
        let spy = spyOn(component, 'getMemberData').and.callFake(function () { return "test" });
        component.orderDesc.orderId = "12345";
        component.searchOrders().then(res => {
        }).catch( e=> {
            expect(component.csrErrors.searchOrderError).toEqual("Unable to search for orders as CSR");
            done();
        })
    })

})
