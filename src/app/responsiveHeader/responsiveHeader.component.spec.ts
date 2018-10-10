/*******************************************************************************
 * responsiveHeader.component.spec.ts
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

import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { ConfigServiceService } from './../common/configService/config-service.service';
import { ResponsiveHeaderComponent } from './responsiveHeader.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { Logger } from 'angular2-logger/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SearchBoxComponent } from './search-box/search-box.component';
import { WCHMegaMenuComponent } from './wch-mega-menu/wchMegaMenu.component';
import { CommonModule } from '@angular/common';
import { CommonTestModule } from 'app/commerce/common/common.test.module';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommerceService } from '../commerce/services/commerce.service';
import { CategoryService } from 'app/commerce/services/category.service';
import { CategoryViewService } from 'app/commerce/services/rest/search/categoryView.service';
import { LoginIdentityService } from 'app/commerce/services/rest/transaction/loginIdentity.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { CartTransactionService } from 'app/commerce/services/componentTransaction/cart.transaction.service';
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { SiteContentService } from '../commerce/services/rest/search/siteContent.service';
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


describe('ResponsiveHeaderComponent', () => {
  let component: ResponsiveHeaderComponent;
  let fixture: ComponentFixture<ResponsiveHeaderComponent>;
  let translateService: TranslateService;
  let cartTransactionService: CartTransactionService;
  let menuService: MenuService;
  let httpMock: HttpTestingController;
  let myMockWindow: Window;


  const mockConfigServiceService: any = {
    getConfig: function() {
      const source = Observable.of('');
      return source.publish();
    }
  };
  const rContextMock: any = {
    id: 12345,
    context: {
      hub: {
        deliveryUrl: [{ 'origin': 'https://stockholm.digitalexperience.ibm.com/' }]
      },
      site: {
        pages: []
      }
    }
  };

  let authenticationTransactionService: AuthenticationTransactionService;


  beforeEach(async(() => {
    myMockWindow = <any> { innerWidth: 600};
    TestBed.configureTestingModule({
      declarations: [ResponsiveHeaderComponent, SearchBoxComponent, WCHMegaMenuComponent, RouterMockTestComponent],
      imports: [HttpClientModule, HttpModule, AngularSvgIconModule, BrowserAnimationsModule, CommonModule, CommonTestModule, FormsModule, RouterTestingModule.withRoutes([
        { path: '**', component: RouterMockTestComponent }
      ]), TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }),
      ],
      providers: [
        Logger,
        ConfigServiceService,
        CommerceService,
        CategoryService,
        CategoryViewService,
        TranslateService,
        AuthenticationTransactionService,
        CartTransactionService,
        ProductService,
        ProductViewService,
        CartService,
        AssignedPromotionCodeService,
        ShippingInfoService,
        PaymentInstructionService,
        ActivePageService,
        LoginIdentityService,
        PersonService,
        SiteContentService,
        HttpTestingController,
        MenuService,
        { provide: ConfigServiceService, useValue: mockConfigServiceService },
        {provide: Window, useValue: myMockWindow}

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
    menuService.pushSearchKeyword('Stockholm');

    fixture = TestBed.createComponent(ResponsiveHeaderComponent);
    component = fixture.componentInstance;
    component.renderingContext = rContextMock;
    fixture.detectChanges();
  })));


  afterEach((done) => {
    __karma__.config.testGroup = '';
    authenticationTransactionService.logout().then(() => {
      expect(authenticationTransactionService.isLoggedIn()).toBe(false);
      done();
    });
  });

  it('should instantiate and initialze all variables', (done) => {

    expect(component).toBeTruthy();
    expect(component.cartLength).toEqual(1);
    expect(component.mobileNavToggle).toBe(false);

    done();
  });

  it('should be able to set search focus', (done) => {

    // WHEN window is large
    component.setSearchFocus(true);
    //expect(component.bannerLogoState).toBe("active"); Passes in Chrome but fails in PhantomJS

    //WHEN window is small
    const spy = spyOn(menuService, 'isBreakpoint').and.returnValue(true);
    component.setSearchFocus(true);
    expect(component.bannerLogoState).toBe('inactive');

    //WHEN window is small but focus false and contains keyword
    component.keyword = 'Stockholm';
    component.setSearchFocus(false);
    expect(component.bannerLogoState).toBe('inactive');

    //WHEN window is small and focus is false and doesn't contains keyword
    component.keyword = '';
    component.setSearchFocus(false);
    setTimeout(function() {
      expect(component.bannerLogoState).toBe('active');
      done();
    }, 500);
  });

  it('should be able to toggle and close mobile nav', (done) => {

    //GIVEN mobil nav is false
    expect(component.mobileNavToggle).toBe(false);

    //WHEN toggled mobile nav
    component.toggleMobileNav();
    expect(component.mobileNavToggle).toBe(true);

    //WHEN close mobile nav
    component.closeMobileNav();
    expect(component.mobileNavToggle).toBe(false);

    done();
  });

  it('should be able to getURL', (done) => {
    component.headerConfig = {
      elements:
      [{
          renditions: { banner: { height: 800 }, default: { url: '/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg' } }

      }]
    };
    component.pages = [{ 'id': 'Sustainability', 'children': ['Sustainability123'] }];

    expect(component.getURL(0)).toContain('dxresources');
    done();
  });

  it('should be able to listen to pushSearchKeyword', (done) => {

    //WHEN window is small
    const spy = spyOn(menuService, 'isBreakpoint').and.returnValue(true);

    //AND
    //WHEN pushSearchKeyword is fired
     menuService.pushSearchKeyword('Stockholm');

     //THEN
     expect(component.bannerLogoState).toBe('inactive');
     expect(component.keyword).toBe('Stockholm');

    done();
  });

  it('should be able to listen to focusRemoved', (done) => {

    //WHEN window is small
    const spy = spyOn(menuService, 'isBreakpoint').and.returnValue(true);

    //AND
    //WHEN window is small and contains keyword
     component.keyword = 'Stockholm';
     menuService.pushSearchKeyword('Stockholm');
     menuService.notifyFocusRemoved(true);

     //THEN
     expect(component.bannerLogoState).toBe('inactive');

    //WHEN window is small and keyword  is empty
    component.keyword = '';
    menuService.notifyFocusRemoved(true);
     setTimeout(function() {
      expect(component.bannerLogoState).toBe('active');
      done();
    }, 500);

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
