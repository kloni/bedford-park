import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ConfigServiceService } from './../common/configService/config-service.service';
import { PageNotFoundComponent } from './page-not-found.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable, ConnectableObservable } from 'rxjs/Rx';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let mockConfigServiceService: any = {
    getConfig: function(){
      let source = Observable.of("404 mock context");
      return source.publish();
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotFoundComponent ],
      imports: [ HttpClientModule, HttpModule ],
      providers: [{ provide: ConfigServiceService, useValue: mockConfigServiceService }]
    });
  }));

  beforeEach( () => {
    fixture = TestBed
    .overrideComponent(PageNotFoundComponent, {
      set: { template: '404 Dummy Template' }
    })
    .createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('getConfig returns a connectable observable', () => {
    expect(component.context).toBe('404 mock context');
    expect(component.o.connect).toBeDefined();
  });
});

describe('PageNotFoundComponent - No Connected Observable', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let configServiceStub: ConfigServiceService;

  let mockConfigServiceService: any = {
    getConfig: function(){ return Observable.of("404 mock context"); }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNotFoundComponent ],
      imports: [ HttpClientModule, HttpModule ],
      providers: [{ provide: ConfigServiceService, useValue: mockConfigServiceService }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed
    .overrideComponent(PageNotFoundComponent, {
      set: { template: '404 Dummy Template' }
    })
    .createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('getConfig returns normal observable and context is set properly during instatiation', () => {
    expect(component).toBeTruthy();
    expect(component.context).toBe('404 mock context');
  });

  it('getConfig returns normal observable, connect is not defined', () => {
    expect(component).toBeTruthy();
    expect(component.o.connect).toBeUndefined();
    component.configSub = undefined; // cover else branch in ngOnDestroy
    component.ngOnDestroy();
  });

});