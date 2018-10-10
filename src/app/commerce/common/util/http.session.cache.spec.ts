import { HttpModule, Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { HttpSessionCache } from './http.session.cache';
import { HttpResponse, HttpRequest} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';


declare var __karma__: any;

describe('HttpSessionCache', () => {

  let httpSessionCache : any;
  let httpRequest: HttpRequest<any>;
  let httpResponse: HttpResponse<any>;
  let isPreviewSpy: any;

  beforeEach(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpModule, CommonTestModule ],
      providers: [
          HttpSessionCache,
          StorefrontUtils
      ]
  });
    __karma__.config.testGroup = '';
  });


  beforeEach(() => {
    httpSessionCache = TestBed.get(HttpSessionCache);
    httpSessionCache.storefrontUtils = TestBed.get(StorefrontUtils);
    isPreviewSpy = spyOn(httpSessionCache.storefrontUtils, 'isPreview');
    isPreviewSpy.and.returnValue(false);
    httpRequest = new HttpRequest('GET', 'mockurl.com', null, null);
    httpResponse = new HttpResponse({
        body: "this is sample body"
      });
      httpSessionCache.invalidateAll();

    __karma__.config.testGroup = "";
});


  it('should instantiate', () => {
      // instatiation test case
      expect(httpSessionCache).toEqual(jasmine.any(HttpSessionCache));
  });

  it('Expect httpSessionCache to return null when it is empty',() => {

    expect(httpSessionCache.get(httpRequest)).toBeNull();
  });

  it('Expect httpSessionCache to return info from HttpResponse', () => {

      let httpRequest2 = new HttpRequest('GET', 'mockurl2.com?', null, ({params: new HttpParams({
        fromString: "test=test"
      })}));
      let httpResponse2 = new HttpResponse({
        body:"this is an example"
      })
      //first entry in cache
      httpSessionCache.put(httpRequest,httpResponse);
      //second entry in cache
      httpSessionCache.put(httpRequest2,httpResponse2);

      let testString: String;
      let testString2: String;

      testString = httpSessionCache.get(httpRequest).body;
      testString2 = httpSessionCache.get(httpRequest2).body;

      expect(testString.includes("this is sample body")).toBe(true);
      expect(testString2.includes("this is an example")).toBe(true);

  });

  it('Expect httpSessionCache to return null after removing entry',() => {

     httpSessionCache.put(httpRequest,httpResponse);
     httpSessionCache.remove(httpRequest);
     expect(httpSessionCache.get(httpRequest)).toBeNull();
  });

  it ('Expect httpSessionCache to return null after invalidatiion',() => {

    httpSessionCache.put(httpRequest,httpResponse);
    httpSessionCache.invalidateAll();
    expect(httpSessionCache.get(httpRequest)).toBeNull();

  });

  it ('should not cache when in preview mode', () => {
    let isSetCacheSpy = spyOn(httpSessionCache.sscache, 'set');
    let httpResponse3 = new HttpResponse({ body:"this is an example" });
    let httpRequest3 = new HttpRequest('GET', 'mockurl2.com?', null, ({params: new HttpParams({ fromString: "test=test" })}));

    isPreviewSpy.and.returnValue(true);
    httpSessionCache.put(httpRequest3,httpResponse3);
    expect(httpSessionCache.sscache.set).toHaveBeenCalledTimes(0);
  });
});
