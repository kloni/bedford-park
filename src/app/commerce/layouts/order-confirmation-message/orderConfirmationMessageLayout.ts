import {LayoutComponent} from 'ibm-wch-sdk-ng';
import { Component, OnInit } from '@angular/core';
import { TypeOrderConfirmationMessageComponent } from './../../components/order-confirmation-message/typeOrderConfirmationMessageComponent';
import { ActivatedRoute, ParamMap, Router  } from '@angular/router';
import { HttpResponse, HttpErrorResponse} from "@angular/common/http";
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { Constants } from 'app/Constants';
import { PageComponent } from 'ibm-wch-sdk-ng';

const uniqueId = require('lodash/uniqueId');

/*
 * @name orderConfirmationMessageLayout
 * @id order-confirmation-message-layout
 */
@LayoutComponent({
    selector: 'order-confirmation-message-layout'
})
@Component({
  selector: 'app-order-confirmation-message-layout-component',
  templateUrl: './orderConfirmationMessageLayout.html',
  styleUrls: ['./orderConfirmationMessageLayout.scss'],
  preserveWhitespaces: false
})
export class OrderConfirmationMessageLayoutComponent extends TypeOrderConfirmationMessageComponent {
    orderId: string;
    confirmedOrderId: string;
    storeId: string;
    redirectUrl: string;
    imageAvailable:boolean;
    id: string;
    private readonly confirmLink:string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService,
        private storeUtils: StorefrontUtils)
    {
        super();
        this.confirmLink=this.storeUtils.getPageLink(Constants.orderConfirmationPageIdentifier);
    }

    ngOnInit(): void {
        this.id = uniqueId();

        if (this.redirectLinkToHome != undefined && this.redirectLinkToHome.linkURL != undefined) {
            this.redirectUrl = this.redirectLinkToHome.linkURL;
        }

        if (this.confirmationImage!=undefined && this.confirmationImage.asset!=undefined) {
            this.imageAvailable= true;
        }

        this.initId();
    }

    initOrderData(){
       return this.orderService
        .findByOrderId({storeId: this.storeId, orderId: this.orderId} ,undefined, undefined ).toPromise()
        .then(response =>{
            this.confirmedOrderId=this.orderId;
        }).catch((err: HttpErrorResponse) => {
            this.goToRedirectPage();
        })
    }

    initId(){
        return this.route.queryParams.subscribe( params => {
            this.orderId=params['orderId'];
            this.storeId= params['storeId']
            if (this.orderId != undefined && this.storeId != undefined) {
                this.initOrderData();
            } else if (this.storeUtils.onSamePage(this.confirmLink)) {
                this.goToRedirectPage();
            }
        });
    }

    goToRedirectPage() {
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
        } else {
            this.storeUtils.gotoNotFound();
        }
    }
}
