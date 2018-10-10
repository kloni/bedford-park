import { Constants } from './../../Constants';
import { CurrentUser } from './../common/util/currentUser';
import { StorefrontUtils } from './../../commerce/common/storefrontUtils.service';
import { AuthenticationTransactionService } from './../services/componentTransaction/authentication.transaction.service';
import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly signInLink:string;
    private readonly addrLink:string;
    private readonly maLink:string;

    constructor( private authService: AuthenticationTransactionService, private router: Router, private storeUtils: StorefrontUtils ) {
        this.signInLink=this.storeUtils.getPageLink(Constants.signInPageIdentifier);
        this.addrLink=this.storeUtils.getPageLink(Constants.addressBookPageIdentifier);
        this.maLink=this.storeUtils.getPageLink(Constants.myAccountPageIdentifier);
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkLogin( state.url );
    }

    checkLogin( url: string ): boolean {
        if (this.authService.isLoggedIn()) {
            const cu:CurrentUser=StorefrontUtils.getCurrentUser();

            if (cu.isCSR&&!!cu.forUser&&!cu.forUser.userName) {
              if (url.startsWith(this.addrLink)) {
                this.router.navigate([this.maLink])
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
        }

        let isGuardUrl: boolean = this.storeUtils.getAuthGuardUrls().some((r)=>{
            return url.startsWith(r);
        });

        if (!isGuardUrl) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        // Navigate to the login page
        this.router.navigate( [this.signInLink] );

        return false;
    }
}