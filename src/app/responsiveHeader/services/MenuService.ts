
import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Injectable()

export class MenuService implements OnDestroy {
	private menuActionSource = new Subject<any>();
	private searchKeyword = new Subject<string>();
    private focus = new Subject<boolean>();
    private preferredStore = new Subject<any>();

	private resizeSub: Subscription;
	private screenWidth: number;
	keyword$ =this.searchKeyword.asObservable();
    focusRemoved$ =this.focus.asObservable();
    preferredStore$ = this.preferredStore.asObservable();

	constructor() {
		this.resizeSub = Observable.fromEvent(window, 'resize')
			.debounceTime(500)
			.distinctUntilChanged()
			.subscribe((screen: any) => {
				this.screenWidth = screen.target.innerWidth;
			});


		this.screenWidth = window.innerWidth;
	}

	ngOnDestroy () {
		this.resizeSub.unsubscribe();
	}

	openMenu(rootmenuID, page) {
		this.menuActionSource.next({page: page, action: 'opened', rootID: rootmenuID});
	}

	closeMenu(rootmenuID, page) {
		this.menuActionSource.next({page: page, action: 'closed', rootID: rootmenuID});
	}

	watchForMenuAction(): Observable<any> {
		return this.menuActionSource.asObservable();
	}


	isBreakpoint(breakpoint: string = '') {
		let res = false;

		switch (breakpoint.toLowerCase()) {
			case 'small': {
				res = (this.screenWidth <= 640);
				break;
			}
			case 'medium': {
				res =  (641 <= this.screenWidth && this.screenWidth <= 1024);
				break;
			}
			case 'large': {
				res =  (1025 <= this.screenWidth && this.screenWidth <= 1440);
				break;
			}
			case 'xlarge': {
				res =  (1441 <= this.screenWidth && this.screenWidth <= 1920);
				break;
			}
			case 'xxlarge': {
				res =  (1921 <= this.screenWidth);
				break;
			}
		}

		return res;

	}

	getBreakpoint() {
		if (this.screenWidth <= 640) {
			return 'small';
		} else if (641 <= this.screenWidth && this.screenWidth <= 1024) {
			return 'medium';
		} else if (1025 <= this.screenWidth && this.screenWidth <= 1440) {
			return 'large';
		} else if (1441 <= this.screenWidth && this.screenWidth <= 1920) {
			return 'xlarge';
		} else if (1921 <= this.screenWidth) {
			return 'xxlarge';
		}
	}

	pushSearchKeyword(keyword: string) {
		this.searchKeyword.next(keyword);
	}
	notifyFocusRemoved(focusRemoved: boolean) {
		this.focus.next(focusRemoved);
    }

    pushPreferredStore(preferredStoreKey: string, store: any): void {
        localStorage.setItem(preferredStoreKey, JSON.stringify(store));
        this.preferredStore.next(store);
    }
}

