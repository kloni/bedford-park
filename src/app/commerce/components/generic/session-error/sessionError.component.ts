import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthenticationTransactionService } from "app/commerce/services/componentTransaction/authentication.transaction.service";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import * as $ from 'jquery';
import { ModalDialogService } from "app/commerce/common/util/modalDialog.service";
import { CurrentUser } from "app/commerce/common/util/currentUser";
import { Constants } from "app/Constants";
import { CartTransactionService } from "app/commerce/services/componentTransaction/cart.transaction.service";
import { Logger } from "angular2-logger/core";

const uniqueId = require('lodash/uniqueId');

function _notNull(aValue: any): boolean {
	return aValue != null;
}

@Component({
    selector: 'app-session-error',
    templateUrl: './sessionError.component.html',
    styleUrls: ['./sessionError.component.scss']
  })
export class SessionErrorComponent implements OnInit, OnDestroy {

    user: any;
    loginErrorMsg: string;
    sessionErrorModalId: string;
	id: any;
	username: string;
	sessionErrorTitle: string;
	sessionErrorMsg: string;
	failedReqUrlList: string[];
	isActionable: boolean;
	private readonly coLink:string;

	constructor(private router: Router, private authService: AuthenticationTransactionService, private storeUtils: StorefrontUtils,
		private modalDialogService: ModalDialogService, private cartTransactionService: CartTransactionService, private logger: Logger) {
		this.coLink=this.storeUtils.getPageLink( Constants.checkoutPageIdentifier );
		this.loginErrorMsg = "";
		this.user = {};
		this.username = "";
		this.failedReqUrlList = [];
		this.isActionable = false;
		this.sessionErrorTitle = "SessionError.GenericTitle";
		this.sessionErrorMsg = "";

		// Get session error input
		this.modalDialogService.errorInput$
			.filter(_notNull)
			.subscribe(input => {
				this.sessionErrorTitle = input.title;
				this.sessionErrorMsg = input.msg;
			});

		// Get failed requests URL
		this.modalDialogService.failedReq$
			.filter(_notNull)
			.map(res => res.url)
			.subscribe(response => {
				this.failedReqUrlList.push(response);
			});

		// Store the attempted URL for redirecting
		this.authService.redirectUrl = this.router.url;

		// Compare the failed requests URL to actionable call list
		let actionableCallList: any[] = this.storeUtils.actionableRestService;
		this.isActionable = actionableCallList.some((call) => {
			call = call['url'].replace( '{storeId}', this.storeUtils.commerceStoreId );
			let requestUrl: string = this.storeUtils.getTransactionUrl() + call;
			return this.failedReqUrlList.some((failedReqUrl) => {
				return failedReqUrl.includes(requestUrl);
			});
		});

		// if it is actionable REST service, do not go back to previous page.
		if (!this.isActionable) {
			this.router.navigateByUrl(this.storeUtils.getPreviousUrl(), { skipLocationChange: true });
		}
		else {
			this.sessionErrorMsg = "SessionError.ActionIncomplete";
		}
    }

    ngOnInit() {
		this.id = uniqueId();
		this.sessionErrorModalId = "sessionError_div_1_modal";

		// Store user logonId
		let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
		if ( currentUser && currentUser.WCTrustedToken && currentUser.WCToken && currentUser.username ) {
			this.username = currentUser.username;
		}

		// Logout and clear the shopping cart
		this.authService.logout()
			.then(r => {
				this.cartTransactionService.cartSubject.next(null);
			})
			.catch(error => this.logger.error(this.storeUtils.handleErrorCase(error, 'Could not log in')));

		this.openDialog();

		// listen to modal data-reveal event closing
		(<any>$(document)).on('closed.zf.reveal', '[data-reveal]', () => {
			// if Session Error occured due to actionable REST service, then navigate to previous page so that the target page can be relaoded.
			if (this.isActionable) {
				this.router.navigateByUrl(this.storeUtils.getPreviousUrl(), { skipLocationChange: true });
			}
			this.exitSessionLogin();
		});
    }

    ngOnDestroy() {
		if ((<any>$(`#${this.sessionErrorModalId}`)).length) {
            (<any>$(`#${this.sessionErrorModalId}`)).foundation("_destroy");
			(<any>$(`#${this.sessionErrorModalId}`)).remove();
			this.user = {};
		}
		(<any>$(document)).off('closed.zf.reveal', '[data-reveal]');
	}

    openDialog(): void {
		this.clearErrorMsg();
		// retrieve username
		this.user.username = this.username;
        (<any>$(`#${this.sessionErrorModalId}`)).foundation();
		(<any>$(`#${this.sessionErrorModalId}`)).foundation("open");
	}

	login(): Promise<void> {
        return this.authService.login(this.user.username, this.user.password).then( res => {
			(<any>$(`#${this.sessionErrorModalId}`)).foundation("close");
        }).catch((error: HttpErrorResponse) => {
			this.loginErrorMsg = this.storeUtils.handleErrorCase(error, 'Could not log in');
        })
	}

	clearErrorMsg(): void {
		this.loginErrorMsg = "";
	}

	exitSessionLogin(): void {
		let redirectUrl: string = this.authService.redirectUrl || "/home";
		this.authService.redirectUrl = null;

		// trigger navigate after previous navigation is resolved
		setTimeout(()=>{
			// If going to checkout, user needs a flag isGoingToCheckout
			if (redirectUrl === this.coLink) {
				let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
				if (currentUser){
					currentUser.isGoingToCheckout = true;
					StorefrontUtils.saveCurrentUser(currentUser);
				}
			}
			return this.router.navigateByUrl(redirectUrl);
		}, 0);

		// reset the observable listener
		this.modalDialogService.sessionErrorSource.next(false);
		this.modalDialogService.errorInputSource.next(null);

		// Destroy the event listener
		(<any>$(document)).off('closed.zf.reveal', '[data-reveal]');
	}
}