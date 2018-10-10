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
	ViewEncapsulation, OnInit, ChangeDetectorRef
} from '@angular/core';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import {RenderingContext} from 'ibm-wch-sdk-ng';
import {ConfigServiceService} from '../common/configService/config-service.service';
import {Constants} from '../Constants';
import {Subscription} from 'rxjs/Subscription';
import {StorefrontUtils} from '../commerce/common/storefrontUtils.service';
import {CommerceService} from '../commerce/services/commerce.service';
import {AuthenticationTransactionService} from '../commerce/services/componentTransaction/authentication.transaction.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NavigationStart, Router} from '@angular/router';
import {CartTransactionService} from '../commerce/services/componentTransaction/cart.transaction.service';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';

import {MenuService} from './services/MenuService';

const uniqueId = require('lodash/uniqueId');



@Component({
	selector: 'responsive-header',
	styleUrls: ['./responsive-header.scss'],
	templateUrl: './responsive-header.html',
	encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('bannerLogo', [
			state('inactive', style({
				width: 0
			})),
			state('active', style({
				opacity: 1
			})),
			transition('inactive => active', animate('100ms ease-in')),
			transition('active => inactive', animate('100ms ease-out'))
		])
	]
})
export class ResponsiveHeaderComponent implements OnDestroy, OnInit {
	@Input()
	public set renderingContext(aValue: RenderingContext) {
		this.rc = aValue;
	}


	rc: RenderingContext;
	headerConfig: any;
	public readonly LOGO: string = 'websiteLogo';
	configSub: Subscription;
	mobileNavToggle = false;
	pages: Array<any> = [];

	productPages: Array<any> = [];
	isLoggedIn = false;
	authSub: Subscription;
	private _cartSubscriber: Subscription;
	cartLength: any;
	id: any;
	bannerLogoState = 'active';
	routerSub: Subscription;
    _keywordSubscriber: Subscription;
    keyword: string;
    _preferredStoreSubscriber: Subscription;
    readonly PREFERRED_STORE_KEY: string = 'preferredStore';
    preferredStoreName: string = localStorage.getItem(this.PREFERRED_STORE_KEY) ? JSON.parse(localStorage.getItem(this.PREFERRED_STORE_KEY)).storeName : '';
	dynamicCategoryPages: any;
	private readonly searchLink:string;
	private readonly pdpLink:string;
    private readonly dgnLink:string;

	constructor(private menuService: MenuService, private router: Router, configService: ConfigServiceService, commerceService: CommerceService, private storeFrontUtils: StorefrontUtils, private authSvc: AuthenticationTransactionService, private cartTransactionService: CartTransactionService, private ref: ChangeDetectorRef) {
		this.id = uniqueId();
		this.searchLink=this.storeFrontUtils.getPageLink(Constants.searchResultsPageIdentifier);
		this.pdpLink=this.storeFrontUtils.getPageLink(Constants.productDetailPageIdentifier);
		this.dgnLink=this.storeFrontUtils.getPageLink(Constants.designPageIdentifier);

		/*
		 Watch for navigation start and force the megamenu to close.
		 */
		this.routerSub = router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.mobileNavToggle = false;
			}
			if (this.storeFrontUtils.onSamePage(this.searchLink) && this.menuService.isBreakpoint('small')) {
				this.bannerLogoState = 'inactive';
			}
			if ((this.storeFrontUtils.onSamePage(this.pdpLink) || this.storeFrontUtils.onSamePage(this.dgnLink)) && this.menuService.isBreakpoint('small')) {
				this.keyword=undefined;
				this.bannerLogoState = 'active';
			}
		});

		this.configSub = configService.getConfig(Constants.HEADER_CONFIG).subscribe((context) => {
			this.headerConfig = context;
		});

		this.isLoggedIn = authSvc.isLoggedIn();
		this.authSub = authSvc.authUpdate.subscribe(status => this.isLoggedIn = status);


		this.storeFrontUtils.getPageSeoUrlByPageKinds(['category-page', 'category-products-page'], false)
		.then( dynamicCategoryPages => {
			commerceService.getCategoryNavigation().then((cat) => {
				this.productPages = cat;
				this.dynamicCategoryPages = dynamicCategoryPages;
			});
		});

		/*
		 Get the product pages from IDC
		 */
		commerceService.getCategoryNavigation().then((cat) => {
			this.productPages = cat;
		});

		/*
		 Listen for updates to the cart.
		 */
		this._cartSubscriber = this.cartTransactionService.cartSubject.subscribe((cart) => {

			if (cart && cart.orderItem) {
				this.cartLength = cart.orderItem.reduce((val, item) => {
					return item.quantity + val;
				}, 0);
			}
			else {
				this.cartLength = 0;
			}

		});

		this._keywordSubscriber = menuService.keyword$.subscribe((s) => {
			if(this.menuService.isBreakpoint('small')){
				this.keyword= s;
				if(s.length > 0){
					this.bannerLogoState = 'inactive';

				}
			}
		});

		this._keywordSubscriber = menuService.focusRemoved$.subscribe((removed) => {
			if(this.menuService.isBreakpoint('small')){
				//keyword not empty
				if(this.keyword){
					if(this.keyword.length=== 0){
						setTimeout(()=>{
							this.bannerLogoState = 'active';
						}, 500);
					}else{
						//focus removed but keyword length is not zero
						this.bannerLogoState = 'inactive';
					}
				//keyword empty
				}else{
					setTimeout(()=>{
						this.bannerLogoState = 'active';
					}, 500);
				}
			}
		});

        this._preferredStoreSubscriber = menuService.preferredStore$.subscribe((preferredStore) => {
            this.preferredStoreName = preferredStore.storeName;
            this.ref.detectChanges();
		});
	}

	ngOnInit() {
		if (sessionStorage.getItem('currentUser')) {
			this.cartTransactionService.getCart();
		}
	}


	isImageURLAvailable(elem): boolean {
		return (this.rc && this.headerConfig && this.headerConfig.elements && this.headerConfig.elements[elem]);
	}

	/*
	 Clean up observables
	 */

	ngOnDestroy() {
		this._cartSubscriber.unsubscribe();
		this.configSub.unsubscribe();
		this.authSub.unsubscribe();
		this.routerSub.unsubscribe();
        this._keywordSubscriber.unsubscribe();
        this._preferredStoreSubscriber.unsubscribe();
	}

	getURL(img) {
		return this.rc.context.hub.deliveryUrl['origin'] + this.headerConfig.elements[img].renditions.default.url;
	}

	/* While is small screens the logo should fade out when the search input is expanded
	 *  This will change the bannerLogoState to provide the animation hooks
	 */
	setSearchFocus(aValue) {
		if (this.menuService.isBreakpoint('small')) {
			if (aValue) {
				this.bannerLogoState = 'inactive';
			}
			else if(this.keyword){
				this.bannerLogoState = 'inactive';
			}else {
				setTimeout(()=>{
					this.bannerLogoState = 'active';
				}, 500);
			}
		}
	}

	toggleMobileNav() {
		this.mobileNavToggle = !this.mobileNavToggle;
	}

	/*
	 When the search form is submitted we want to force the mobileNav to collapse
	 */
	closeMobileNav() {
		this.mobileNavToggle = false;
	}


	private handleError(error: HttpErrorResponse, fallback: string) {
		const eBody = error.error;
		return eBody && eBody.errors && eBody.errors.length && eBody.errors[0].errorMessage ? eBody.errors[0].errorMessage : fallback;
    }

}
