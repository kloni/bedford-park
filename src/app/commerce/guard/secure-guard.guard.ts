/*******************************************************************************
 * secure-guard.guard.ts
 *
 * Copyright IBM Corp. 2018
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
 ******************************************************************************/

import { StorefrontUtils } from './../../commerce/common/storefrontUtils.service';
import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SecureGuard implements CanActivate {

    constructor( private router: Router,
        private storeUtils: StorefrontUtils) {
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {
        return this.validateSecure();
    }

    private validateSecure( ): boolean {
        if (!!this.storeUtils.locationReplace) {
            const replace = this.storeUtils.locationReplace;
            this.storeUtils.locationReplace = null;
            window.location.replace(replace);
            return false;
        } else {
            return true;
        }
    }
}
