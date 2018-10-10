import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../services/rest/transaction/person.service';
import { OrderService } from '../../../services/rest/transaction/order.service';
import { StorefrontUtils } from '../../../common/storefrontUtils.service';
import { DatePipe } from '@angular/common';
import { CommerceEnvironment } from '../../../commerce.environment';

const uniqueId = require('lodash/uniqueId');

/** Useful imports */
/*
 * @name orderComment
 * @id order-comment
 */
@Component({
  /**
  * Consider to code your component such that all elements will be immutable and that it only
  * depends on its inputs. This can e.g. be achieved by basing all state changes on observables.
  *
  * @see https://angular-2-training-book.rangle.io/handout/change-detection/change_detection_strategy_onpush.html
  *
  * import { ChangeDetectionStrategy } from '@angular/core';
  */
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-order-comment-layout-component',
  templateUrl: './order-comment.component.html',
  styleUrls: ['./order-comment.component.scss'],
  preserveWhitespaces: false
})
export class OrderCommentComponent implements OnInit, AfterViewInit {

    id: string;
    accordion : string;

    comment:string;
    currentDate : Date;

    @Input() orderId: string;
    urlParams: any = {};

    commentDisplay : string;
    commentCount : number;
    pageSize: number = CommerceEnvironment.orderCommentpageSize;
    pageNumber: number = 1;
    maxPageNumber : number;

    actingDesc:any;

    constructor(private personService: PersonService,
        private storefrontUtils : StorefrontUtils,
        private datePipe: DatePipe,
        private orderService : OrderService,
        private route: ActivatedRoute) {
    }

    ngOnInit(){
        this.id = uniqueId();
        this.accordion = 'accordion_' + this.id;
        this.actingDesc = StorefrontUtils.getForUser(null);
        this.refreshCommentView();
    }

    ngAfterViewInit(){
        (<any>$(`#${this.accordion}`)).foundation();
    }

    prepareSubmit(){
        this.currentDate = new Date();
        let formattedDate = this.datePipe.transform(this.currentDate, 'short');

        this.urlParams.storeId = this.storefrontUtils.commerceStoreId;
        this.urlParams.orderId = this.orderId;

        this.urlParams.mode = 'self';

        this.urlParams.body = {
            "commentField": this.comment,
            "sendEmail" : true
        }

        this.comment='';
        return this.submit(this.urlParams);
    }

    cancel(){
        this.comment='';
    }

    submit(params: any){
        this.wipeForUser();
        return this.orderService.addCSROrderComments(params).toPromise()
        .then(r => {
            this.restoreForUser();
            return this.refreshCommentView().then(()=>{
                return this.goToPage(this.maxPageNumber);
            });
        })
        .catch(e=>{
          this.restoreForUser();
          throw e;
        });
    }

    wipeForUser() {
      StorefrontUtils.wipeForUser(null);
    }

    restoreForUser() {
      StorefrontUtils.setForUser(null, this.actingDesc);
    }

    refreshCommentView(){
        this.urlParams.storeId = this.storefrontUtils.commerceStoreId;
        this.urlParams.orderId = this.orderId;
        this.urlParams.isAsc = true
        this.urlParams.pageNumber = this.pageNumber;
        this.urlParams.pageSize = this.pageSize;

        this.wipeForUser();
        return this.orderService.getOrderCommentsByOrderId(this.urlParams).toPromise()
        .then(r => {
            this.restoreForUser();
            this.commentDisplay = r.body.orderComments;
            this.commentCount = r.body.recordSetTotal;
            this.maxPageNumber = Math.ceil(Number(r.body.recordSetTotal)/this.pageSize);
        })
        .catch(e=>{
          this.restoreForUser();
          throw e;
        })
    }

    goToPage(n: number): void {
        this.pageNumber = n;
        this.refreshCommentView();
    }

    onNext(): void {
        this.pageNumber++;
        this.refreshCommentView();
    }

    onPrev(): void {
        this.pageNumber--;
        this.refreshCommentView();
    }
}