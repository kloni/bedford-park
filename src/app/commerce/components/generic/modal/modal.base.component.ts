/*******************************************************************************
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

import { Subscription } from 'rxjs/Subscription';
import { OnDestroy, AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { ModalComponent } from './modal.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const uniqueId = require('lodash/uniqueId');

@Component( {
    selector: 'app-modal',
    templateUrl: './modal.base.component.html',
    styleUrls: ['./modal.base.component.scss']
} )
export class ModalBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    public componentName: string;
    public id: string;
    public componentId: string;
    public contentId: string;

    private $reveal: FoundationSites.Reveal;

    private $revealOptions: FoundationSites.IRevealOptions;

    private viewInitSubject: BehaviorSubject<boolean>;

    private dialogObservable: Subject<boolean>;

    private confirmSubscription: Subscription;

    private cancelSubscription: Subscription;

    private showCloseButtonSubscription: Subscription;

    private childComponent: ModalComponent;

    childComponentName: any;

    showClose: boolean;

    constructor(
      private _changeDetectorRef: ChangeDetectorRef) {
        this.viewInitSubject  = new BehaviorSubject<boolean>(false);
        this.dialogObservable = new Subject<boolean>();
        this.$revealOptions = null;
        this.contentId = null;
    }

    ngOnInit() {
        this.id = uniqueId();
        this.componentName = 'modalComponent';
        this.componentId = this.componentName + '_' + this.id;
    }

    ngOnDestroy() {
        this.dialogObservable.unsubscribe();
        this.dialogObservable = null;
        this.$reveal.destroy();
        if ((<any>$(`#${this.componentId}`)).length) {
          (<any>$(`#${this.componentId}`)).remove();
        }
        (<any>$(document)).off('closed.zf.reveal', '[data-reveal]');
        if (this.cancelSubscription && !this.cancelSubscription.closed) {
            this.cancelSubscription.unsubscribe();
            delete this.cancelSubscription;
        }
        if (this.confirmSubscription && !this.confirmSubscription.closed) {
            this.confirmSubscription.unsubscribe();
            delete this.confirmSubscription;
        }
        if (this.showCloseButtonSubscription && !this.showCloseButtonSubscription.closed) {
          this.showCloseButtonSubscription.unsubscribe();
          delete this.showCloseButtonSubscription;
        }
        this.viewInitSubject.complete();
        this.viewInitSubject.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.viewInitSubject.next(true);
    }

  /**
   * Load a WCH Content(layout) into this modal template.
   * @param {string} contentId the WCH content id, the corresponding layout
   *                 must implement interface `ModalComponent`
   * @returns {Observable<boolean>}
   */
    public loadContent(contentId: string): Observable<boolean> {
      this.contentId = contentId;
      return this.dialogObservable.asObservable();
    }

    private openDialog() {
        (<any>$(document)).on('closed.zf.reveal', '[data-reveal]', () => {
            this.dialogObservable.next(true);
        });
        this.$reveal = new Foundation.Reveal($(`#${this.componentId}`), this.$revealOptions);
        this.$reveal.open();
        this.childComponentName = this.childComponent.constructor.name;
        this._changeDetectorRef.detectChanges();
    }

  /**
   * The child component that included in this component must be an implementation of `ModalComponent`
   * @param {ModalComponent} component
   */
  onComponent(component: ModalComponent) {
    this.childComponent = component;
    this.$revealOptions = this.childComponent.getRevealOptions();
    this.viewInitSubject.subscribe( (viewInitiated: boolean) => {
      if (viewInitiated && this.$revealOptions != null) {
        this.openDialog();
      }
    });
    this.confirmSubscription = this.childComponent.onConfirm().subscribe((r) => {
        if (r) {
            this.closeDialog();
        }
    });
    this.cancelSubscription = this.childComponent.onCancel().subscribe((r) => {
        if (r) {
            this.closeDialog();
        }
    });
    this.showCloseButtonSubscription = this.childComponent.onShowCloseButton().subscribe((r) => {
      this.showClose = r;
    });
  }

    closeDialog() {
        this.$reveal.close();
    }
}
