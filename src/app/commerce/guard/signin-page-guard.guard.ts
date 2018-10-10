import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { CurrentUser } from './../common/util/currentUser';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from './../../Constants';

@Injectable()
export class SigninPageGuard implements CanActivate {
    private readonly signInLink:string;
    private readonly homeLink:string;
    constructor( private router: Router, private storeUtils: StorefrontUtils ) {
        this.signInLink=this.storeUtils.getPageLink(Constants.signInPageIdentifier);
        this.homeLink=this.storeUtils.getPageLink(Constants.homePageIdentifier);
    }

    canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        let url: string = state.url;
        if ( url.startsWith(this.signInLink) ) {
            let currentUser: CurrentUser = StorefrontUtils.getCurrentUser();
            let canAccess: boolean = StorefrontUtils.isGuestOrActingAs(currentUser);
            if (!canAccess){
                this.router.navigate( [this.homeLink] );
                //to home page
            }
            return canAccess;
        }
        return true;
    }
}
