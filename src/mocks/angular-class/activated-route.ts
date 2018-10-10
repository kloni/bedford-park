import { convertToParamMap, ParamMap, Params, UrlSegment } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export class MockActivatedRoute {
    private paramsSubject = new BehaviorSubject(this.testParams);
    private _testParams: {};
    private _testQueryParamMap: Observable<ParamMap>;
    private _testQueryParams = {
        "searchTerm": "cap"
    };
    snapshot : any = {
        queryParams:{},
        url: [""]
    };

    params  = this.paramsSubject.asObservable();

    get testParams() {
        return this._testParams;
    }

    get queryParamMap(): Observable<ParamMap> {
        if (!this._testQueryParamMap) {
           this._testQueryParamMap = new BehaviorSubject(convertToParamMap(this._testQueryParams)).asObservable();
        }
        return this._testQueryParamMap;
      }
}