import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { StorefrontUtils } from '../storefrontUtils.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    /**
     * @param inj Using injector instead of service to workaround compiler restriction
     */
    constructor(private inj:Injector) {
        super();
    }

    handleError(error:any) {
        if (error instanceof URIError) {
            const su = this.inj.get(StorefrontUtils);
            console.error("Navigation to url:\n%o\nmet with uncaught error:\n%o", window.location.href, error);
            su.gotoNotFoundReplace();
        } else {
            super.handleError(error);
        }
    }
  }