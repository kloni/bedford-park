import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ConfigService } from 'app/commerce/common/config.service';
import { ConfigTestService } from 'app/commerce/common/configTest.service';
import { Logger } from 'angular2-logger/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { WCHMegaMenuComponent } from './wchMegaMenu.component';
import { ConfigServiceService } from './../../common/configService/config-service.service';
import { CommonModule } from '@angular/common';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { Component } from '@angular/core';
import { WchNgModule, PageComponent, ComponentsService, RenderingContext } from 'ibm-wch-sdk-ng';
import { FormsModule } from '@angular/forms';
import { CategoryService } from "app/commerce/services/category.service";
import { CategoryViewService } from "app/commerce/services/rest/search/categoryView.service";
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { PersonContactService } from 'app/commerce/services/rest/transaction/personContact.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { CountryService } from 'app/commerce/services/rest/transaction/country.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';



import { PaymentInstructionService } from 'app/commerce/services/rest/transaction/paymentInstruction.service';
import { AssignedPromotionCodeService } from 'app/commerce/services/rest/transaction/assignedPromotionCode.service';
import { ShippingInfoService } from 'app/commerce/services/rest/transaction/shippingInfo.service';
import { ProductService } from 'app/commerce/services/product.service';
import { CartService } from 'app/commerce/services/rest/transaction/cart.service';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ProductViewService } from 'app/commerce/services/rest/search/productView.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { MenuService } from 'app/responsiveHeader/services/MenuService';


import { RouterTestingModule } from '@angular/router/testing';

declare var __karma__: any;


describe('WCHMegaMenuComponent', () => {
  let component: WCHMegaMenuComponent;
  let fixture: ComponentFixture<WCHMegaMenuComponent>;
  let translateService: TranslateService;
  let cartTransactionService: CartTransactionService;
  let menuService : MenuService;
  let httpMock: HttpTestingController;

  let mockConfigServiceService: any = {
    getConfig: function() {
      let source = Observable.of("");
      return source.publish();
    }
  };

  let authenticationTransactionService: AuthenticationTransactionService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WCHMegaMenuComponent, RouterMockTestComponent],
      imports: [HttpClientModule, HttpModule, AngularSvgIconModule, BrowserAnimationsModule, CommonModule, CommonTestModule, FormsModule, RouterTestingModule.withRoutes([
        { path: '**', component: RouterMockTestComponent }
      ]), TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }),
      ],
      providers: [
        Logger,
        MenuService,
        ConfigServiceService,
        CartTransactionService,
        ProductService,
        ProductViewService,
        CartService,
        AssignedPromotionCodeService,
        AuthenticationTransactionService,
        LoginIdentityService,
        PersonService,
        ShippingInfoService,
        PaymentInstructionService,

      ]
    }).compileComponents();
  }));

  beforeEach(async(inject([TranslateService, CartTransactionService, AuthenticationTransactionService, MenuService], (_translateService: TranslateService, _cartTransactionService: CartTransactionService, _authenticationTransactionService: AuthenticationTransactionService, _menuService: MenuService) => {
    __karma__.config.testGroup = '';

    translateService = _translateService;
    translateService.use(CommerceEnvironment.defaultLang);

    cartTransactionService = _cartTransactionService;
    cartTransactionService.getCart().then(() => {
      cartTransactionService.cartSubject.subscribe((cart) => {
        this.cart = cart;
      });
    });

    authenticationTransactionService = _authenticationTransactionService;

    menuService = _menuService;
    menuService.pushSearchKeyword("Stockholm");

    fixture = TestBed.createComponent(WCHMegaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })));


  afterEach((done) => {
    __karma__.config.testGroup = "";
    authenticationTransactionService.logout().then(() => {
      expect(authenticationTransactionService.isLoggedIn()).toBe(false);
      done();
    });
  });

  it('should instantiate', (done) => {

    expect(component).toBeTruthy();

    done();
  });

  it('should be able to open and close subMenu', (done) => {
    component.pages = [{"id": "Sustainability", "children" : ["Sustainability123"]}];
    component.theme = "dark";

    component.openSubmenu("Sustainability123");
    expect(component.subMenuPage).toBe("Sustainability123");

    component.closeSubmenu();
    expect(component.subMenuPage).toBe(null);

    done();
  });

  it('should be able to set theme', (done) => {
    component.theme = "dark";

    expect(component.themeClass).toBe("dark");

    component.theme = "light";
    expect(component.themeClass).toBe("light");

    done();
  });

  it('should be able to set and get page toggle', (done) => {
    component.pages = [{"id": "Sustainability", "children" : ["Sustainability123"]}];

    component._setPageToggle("Sustainability", true);
    expect(component.getPageToggle("Sustainability")).toBe(true);

    component._setPageToggle("Sustainability123", false);
    expect(component.getPageToggle("Sustainability123")).toBe(false);

    done();
  });

  it('should be able to track by page id', (done) => {
    var page = {"id": "Sustainability", "children" : ["Sustainability123"]};

    menuService.openMenu(123, page);
    component.trackByPageId(0, "Sustainability");

    component.menuItemSelected();

    menuService.closeMenu(0, "Sustainability");


    done();
  });

  it('should be able to navigate to subMenu page and go back', (done) => {
    var page = {"id": "Sustainability", "children" : ["Sustainability123"]};
    var mockEvent = new Event('click');
    component.navigate(mockEvent, page);

    expect(component.subMenuPage).toBe(page);

    component.goBack(mockEvent);
    menuService.notifyFocusRemoved(true);
    done();
  });

  it('should not be able to navigate to subMenu if there is no children page', (done) => {
    var page = {"id": "Sustainability", "children" : []};
    var mockEvent = new Event('click');

    try {
      component.navigate(mockEvent, page);
    } catch (err) {
      // Mock router
    }

    done();
  });

  it('should be able to get breakpoint from service', (done) => {
     expect(menuService.isBreakpoint('small')).toBe(true);
     expect(menuService.isBreakpoint('medium')).toBe(false);
     expect(menuService.isBreakpoint('large')).toBe(false);
     expect(menuService.isBreakpoint('xlarge')).toBe(false);
     expect(menuService.isBreakpoint('xxlarge')).toBe(false);

     expect(menuService.getBreakpoint()).toBe("small");
     menuService.ngOnDestroy();
    done();
  });

});

@Component({
  template: `
    <a routerLink="/test/page/{{pageName}}">link</a>
    <router-outlet></router-outlet>
  `
})

@Component({
  template: ''
})

/**
 * Mocks routerLink
 */
class RouterMockTestComponent {

}
