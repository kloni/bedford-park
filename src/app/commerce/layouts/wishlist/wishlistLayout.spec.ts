import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WishlistLayoutComponent } from './wishlistLayout';
import { WishlistCardLayoutComponent } from './wishlist-card-layout/wishlist-card-layout';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { RouterModule, Router } from '@angular/router';
import { CommercePipesModule } from 'app/commerce/pipes/commerce-pipes.module';
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterTestingModule } from '@angular/router/testing';
import { Logger } from 'angular2-logger/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'locales/');
}

declare var __karma__: any;

describe('WishlistLayoutComponent', () => {
  let component: WishlistLayoutComponent;
  let fixture: ComponentFixture<WishlistLayoutComponent>;
  let ngAfterViewInitSpy;
  let openMdl;
  let closMdl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishlistLayoutComponent, WishlistCardLayoutComponent],
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]}
        }),
        CommercePipesModule,
        CommonTestModule,
        HttpClientModule,
        HttpModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        Logger
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    __karma__.config.testGroup = 'wishlist';
    fixture = TestBed.createComponent(WishlistLayoutComponent);
    component = fixture.componentInstance;
    ngAfterViewInitSpy = spyOn(component, 'ngAfterViewInit').and.callFake(function(){});
    closMdl = spyOn(component, 'closeModal').and.callFake(function(){});
    openMdl = spyOn(component, 'openModal').and.callFake(function(){});
    fixture.detectChanges();
  }));

  it('should instantiate', (done) => {
    setTimeout(()=>{
        expect(component.wishLists.length).toBeGreaterThanOrEqual(1);
        expect(component.selectedWishlist.descriptionName).toBe("DefaultListName");
        done();
    }, 1000);
 });

  it("should be able to select different wishlist", (done) => {
    setTimeout(()=>{
        component.showWishlistDetail("11504");
        expect(component.selectedWishlist.uniqueID).toBe("11504");
        done();
    }, 1000);
  });
});
