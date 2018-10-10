/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Logger } from "angular2-logger/core";
import { CommerceEnvironment } from "../../commerce.environment";
import { ModalDialogService } from 'app/commerce/common/util/modalDialog.service';
import { SessionErrorComponent } from "app/commerce/components/generic/session-error/sessionError.component";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  errorInProg: boolean;

  constructor( private logger: Logger, private modalDialogService: ModalDialogService ) {
    this.errorInProg = false;
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    return next.handle( req ).do( event => { }, error => {

      if ( error instanceof HttpErrorResponse ) {
        this.logger.info( this.constructor.name + " intercept: " + error.message );
        this.logger.debug( this.constructor.name + " intercept: " + JSON.stringify( error ) );

        if ( error.error && error.error.errors) {
          let e = error.error.errors[0];

          this.modalDialogService.sessionError$.subscribe(
            response => {
                this.errorInProg = response;
            }
          );

          this.collectFailedRequests(req);

          // handle one error at a time
          if (!this.errorInProg) {
            this.modalDialogService.sessionErrorSource.next(true);
            this.handleErrors(e);
          }
        }
        return Observable.throw(error);
      }
    } );
  }

  private collectFailedRequests(req): void {
    this.modalDialogService.failedReqSource.next(req);
  }

  private handleErrors(e): void {
      // handle expired session
      if ( e.errorCode === CommerceEnvironment.errors.expiredActivityTokenError ||
        e.errorKey === CommerceEnvironment.errors.expiredActivityTokenError ) {
          this.createSessionErrorComp(CommerceEnvironment.errors.sessionTimeoutError);
      }
      // handle invalid session where another user logged in from different location
      else if ( e.errorCode === CommerceEnvironment.errors.invalidCookieErrorCode &&
        e.errorKey === CommerceEnvironment.errors.invalidCookieErrorKey ) {
          this.createSessionErrorComp(CommerceEnvironment.errors.sessionInvalidError);
      }
  }

  // Create target component
  createSessionErrorComp( error: string ): void {
    let currentTitle: string = "";
    let currentMsg: string = "";
    if (error === CommerceEnvironment.errors.sessionTimeoutError) {
      currentTitle = "SessionError.TimeoutTitle";
      currentMsg = "SessionError.TimeoutMsg";
    }
    else if (error === CommerceEnvironment.errors.sessionInvalidError) {
      currentTitle = "SessionError.InvalidTitle";
      currentMsg = "SessionError.InvalidMsg";
    }
    else {
        currentTitle = "SessionError.GenericTitle";
    }

    let inputs = {
      title: currentTitle,
      msg: currentMsg
    }
    this.modalDialogService.errorInputSource.next(inputs);

    this.modalDialogService.addTargetComponent(SessionErrorComponent);
  }

}