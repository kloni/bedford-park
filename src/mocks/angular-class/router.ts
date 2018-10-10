import { Observable } from 'rxjs/Observable';
import { NavigationStart, NavigationEnd } from '@angular/router';

export class MockRouter {
    public url: string = '/';
    navigate = jasmine.createSpy('navigate');
    navigateByUrl = jasmine.createSpy('navigate');
    start = new NavigationStart(0, '/home');
    end = new NavigationEnd(1, '/home', '/careers');
    events = new Observable(observer => {
      observer.next(this.start);
      observer.next(this.end);
      observer.complete();
    });
    initialNavigation = jasmine.createSpy('navigate');
}