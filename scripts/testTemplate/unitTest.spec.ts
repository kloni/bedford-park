import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

declare var __karma__: any;

describe('UnitTestTemplate', () => {

  beforeEach(() => {
    // use mock service for dependency
    TestBed.configureTestingModule({
        imports: [ HttpClientModule, HttpModule ],
        providers: [
        ]
    });
    __karma__.config.testGroup = '';
  });


  it('should instantiate', () => {
      // instatiation test case
  });

});
