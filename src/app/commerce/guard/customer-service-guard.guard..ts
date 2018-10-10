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
export class CustomerServiceGuard implements CanActivate {

    private readonly csrLink:string;
    private readonly homeLink:string;

    constructor( private authService: AuthenticationTransactionService, private router: Router, private storeUtils: StorefrontUtils ) {
        this.csrLink=this.storeUtils.getPageLink( Constants.customerServiceIdentifier );
        this.homeLink=this.storeUtils.getPageLink( Constants.homePageIdentifier );
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        const rc:boolean=!state.url.startsWith(this.csrLink)||(this.authService.isLoggedIn()&&StorefrontUtils.getCurrentUser().isCSR);
        if (!rc) {
            this.router.navigate( [this.homeLink] );
        }
        return rc;
    }
}