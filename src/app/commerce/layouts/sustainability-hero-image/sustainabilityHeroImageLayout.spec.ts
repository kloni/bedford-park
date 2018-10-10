import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import {UtilsService} from "../../../common/utils/utils.service";
import { SustainabilityHeroImageLayoutComponent } from 'app/commerce/layouts/sustainability-hero-image/sustainabilityHeroImageLayout';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { AccountTransactionService } from 'app/commerce/services/componentTransaction/account.transaction.service';
import { ConfigurationService } from 'app/commerce/services/rest/transaction/configuration.service';
import { FormsModule } from '@angular/forms';
import { PersonService } from 'app/commerce/services/rest/transaction/person.service';
import { ConfigService } from 'app/commerce/common/config.service';
import { ConfigTestService } from 'app/commerce/common/configTest.service';
import { Logger } from 'angular2-logger/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from 'app/commerce/common/util/http.error.interceptor';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivePageService, RenderingContext, AbstractRenderingComponent, Image } from 'ibm-wch-sdk-ng';


declare var __karma__: any;

describe('SustainabilityHeroImageLayoutComponent', () => {
  let component: SustainabilityHeroImageLayoutComponent;
  let fixture: ComponentFixture<SustainabilityHeroImageLayoutComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let image:any = {
    altText: 'Sustainability'
  }
  let rContextMock: any = {
    id: 12345,
    context: {
      hub: {
        deliveryUrl: [{ 'origin': 'https://stockholm.digitalexperience.ibm.com/' }]
      }
    },
    image: {
      image: { altText: 'Sustainability', asset: { fileName: "hero-sustainability.jpg", fileSize: 369412, height: 833, id: "0973bc9d-3699-4c5f-be37-dde1cd57d239", mediaType: "image/jpeg" }, elementType: "image", renditions: { default: { height: 833, renditionId: "r=ea187c17-aff2-4ae8-8395-c926a71b0d16&a=0973bc9d-3699-4c5f-be37-dde1cd57d239", source: "/delivery/v1/resources/ea187c17-aff2-4ae8-8395-c926a71b0d16", url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg", width: 2000 } }, url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg"}
    },
    images: {
      image: [{ altText: 'Sustainability', asset: { fileName: "hero-sustainability.jpg", fileSize: 369412, height: 833, id: "0973bc9d-3699-4c5f-be37-dde1cd57d239", mediaType: "image/jpeg" }, elementType: "image", renditions: { default: { height: 833, renditionId: "r=ea187c17-aff2-4ae8-8395-c926a71b0d16&a=0973bc9d-3699-4c5f-be37-dde1cd57d239", source: "/delivery/v1/resources/ea187c17-aff2-4ae8-8395-c926a71b0d16", url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg", width: 2000 } }, url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg" }]
    },
    text: { text: "Sustainability" },
    texts: { text: ["Sustainability"] },
    name: "Sustainability Hero Image",
    elements:
    {
      image: {
        altText: 'Sustainability',
        asset: { fileName: "hero-sustainability.jpg", fileSize: 369412, height: 833, id: "0973bc9d-3699-4c5f-be37-dde1cd57d239", mediaType: "image/jpeg" },
        url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg",
        renditions: { banner: { height: 800 }, default: { url: "/40dc83ae-9f06-48b2-a8af-aa42912302dd/dxresources/ea18/ea187c17-aff2-4ae8-8395-c926a71b0d16.jpg" } }
      },
      link: { elementType: "link", linkDescription: "Developing sustainable practices matters to us.", linkText: "Developing sustainable practices matters to us.", linkURL: "#" },
      text: { elementType: "text", value: "Sustainability" },
      id: "019c75bf-054c-451b-a214-5a6c5fdac9da"
    },
    thumbnail: {id: "0973bc9d-3699-4c5f-be37-dde1cd57d239"}
  }

  beforeEach(async(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      declarations: [SustainabilityHeroImageLayoutComponent],
      imports: [HttpClientModule, HttpModule, FormsModule, TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }),
      ],
      providers: [
        UtilsService,
        Logger,
        // use ConfigTestService for mocking ConfigService
        { provide: ConfigService, useClass: ConfigTestService }
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    __karma__.config.testGroup = '';
    fixture = TestBed.createComponent(SustainabilityHeroImageLayoutComponent);
    component = fixture.componentInstance;
    component.rContext = rContextMock;
    fixture.detectChanges();

  }));

  it('should instantiate and initialze all variables', (done) => {
    component.ngOnInit();

    expect(component).toBeTruthy();

    component.ngOnDestroy();

    done();
  });

});
