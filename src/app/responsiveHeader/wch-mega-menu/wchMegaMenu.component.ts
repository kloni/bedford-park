/*******************************************************************************
 * Copyright IBM Corp. 2017
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
 *******************************************************************************/
import {
	Component,
	Input,
	OnDestroy,
	AfterViewInit,
	ViewEncapsulation, Output, EventEmitter, OnInit
} from '@angular/core';


import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {MenuService} from '../services/MenuService';
import {NavigationExtras, Router} from "@angular/router";

const uniqueId = require('lodash/uniqueId');

@Component({
	selector: 'wch-mega-menu',
	styleUrls: ['./wch-mega-menu.scss'],
	templateUrl: './wch-mega-menu.html',
	encapsulation: ViewEncapsulation.None
})
export class WCHMegaMenuComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input()
	public set pages(aValue: any[]) {
		if (aValue) {
			this.filteredPages = aValue.filter((page) => !page.hideFromNavigation);
			this.cachedChildren.clear();
		}
	}
	@Input()
	public set theme(aValue: string) {
		switch (aValue) {
			case 'dark' :
				this.themeClass = 'dark';
				break;
			default:
				this.themeClass = 'light';
		}

	}
	@Input()
	public set dynamicPages(aValue: any) {
		if (aValue) {
			this.categoryDynamicPages = aValue;
			this.filteredPages.forEach( category => {
				category.seoUrl = this.getSeoUrl(category);
			});
		}
	}
	@Input() level: number;
	@Input() menutitle: string;
	@Input() parent: any;
	@Input() menuOpen: boolean;
	@Input() maxLevel: number;
	@Output() onMenuItemSelected = new EventEmitter<any>();
	@Output() onGoBack = new EventEmitter<any>();

	/* The maximum level of navigation to display  */
	maxNavigationDepth = 2;

	cachedChildren = new Map<string, any[]>();
	pageToggles = new Map<string, boolean>();
	filteredPages: any[];
	categoryDynamicPages: any;
	themeClass: string;
	subMenuPage: any;
	id: any;

	constructor(private menuService: MenuService, private router: Router) {
		this.id = uniqueId();
		this.level = this.level || 1;
		this.maxLevel = this.maxLevel || this.maxNavigationDepth;
		if (this.level === 1) {
			this.menuOpen = true;
		}
	}

	ngOnInit() {

	}


	trackByPageId(index, page) {
		return `${page.id}:${page.url}:${page.name}`;
	}

	/*
	 * when a menu item is selected an event will be emitted to the original caller of the wch-menu component.
	 * This allows the caller to close the mobile nav toggle when navigating to a page.
	 */
	menuItemSelected() {
		this.closeAll();
	}

	/*
		In mobile view we want to open the submenu (if there are child pages) rather than navigate to the page.
	 */
	navigate($event, page) {
		if (page && this.menuService.isBreakpoint('small') && this.hasVisibleChildren(page)) {
			$event.preventDefault();
			$event.stopPropagation();
			this.openSubmenu(page);
		} else {
			this.closeAll();
			if (this.categoryDynamicPages) {
				this.router.navigate([page.seoUrl]);
			} else {
				// PLP dynamic page are not ready, use old way
				const navExtras: NavigationExtras = {
					queryParams: this.getRouteParams(page.routeParam)
				};
				this.router.navigate([page.route], navExtras);
			}
		}
	}

	getSeoUrl(selectedPage){
		return this.categoryDynamicPages['idc-category-' + selectedPage.identifier];
	}

	closeAll() {
		this.onMenuItemSelected.emit();
	}

	/*
	 Toggle submenu by parent page,  on mouseleave we want to force the submenu to close
	 */
	openSubmenu(page) {
		this.subMenuPage = page;
	}

	goBack(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		this.onGoBack.next();
	}

	closeSubmenu() {
		this.subMenuPage = null;
	}



	getPageToggle(page) {
		return this.pageToggles.get(page) || false;
	}

	_setPageToggle(page, value) {
		this.pageToggles.set(page, value);
	}


	getRouteURL(url) {
		return decodeURI(url);
	}

	getRouteParams(params) {
		return params || {};
	}



	getLevelClass() {
		return `level-${this.level}`;
	}

	/* We also need to consider the maximum navigation levels to display when determining visible children */
	hasVisibleChildren(page) {
		return this.getVisibleChildren(page).length > 0  && this.level < this.maxLevel;

	}

	getVisibleChildren(page): any[] {
		if (this.cachedChildren.get(page.id)) {
			return this.cachedChildren.get(page.id);
		} else {
			const visibleChildren = page.children.filter((child) => {
				return !child.hideFromNavigation;
			});
			this.cachedChildren.set(page.id, visibleChildren);
			return visibleChildren
		}
	}

	/*
		Used to set class on the menu element.  This is used instead of *ngIf to preservce CSS anmimation
	 */
	displaySubmenu(page) {
		if (!this.menuService.isBreakpoint('small')) {
			return this.hasVisibleChildren(page);
		} else {
			return ((page && this.subMenuPage) && this.hasVisibleChildren(page) && (page.id === this.subMenuPage.id));
		}
	}


	ngOnDestroy() {
	}

	ngAfterViewInit() {
	}
}
