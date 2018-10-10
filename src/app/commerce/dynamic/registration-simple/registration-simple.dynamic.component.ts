import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component , OnInit } from '@angular/core';
import { TypeRegistrationComponent } from './../../components/registration/typeRegistrationComponent';
import { AuthenticationTransactionService } from 'app/commerce/services/componentTransaction/authentication.transaction.service';
import { OrderService } from 'app/commerce/services/rest/transaction/order.service';
import { HttpResponse, HttpErrorResponse} from "@angular/common/http";
import { ActivatedRoute, ParamMap, Router  } from '@angular/router';
import { DigitalAnalyticsService } from 'app/commerce/services/digitalAnalytics.service';
import { Constants } from 'app/Constants';

const uniqueId = require('lodash/uniqueId');

@Component({
  selector: 'app-dynamic-simplified-registration-layout-component',
  templateUrl: './registration-simple.dynamic.html',
  preserveWhitespaces: false
})
export class DynamicSimplifiedRegistrationLayoutComponent implements OnInit {

    orderId: string;
    storeId: string;

    confirmedOrderId: number;
    httpResponse: HttpResponse<any>;
    email: string;
    user: any = {};
    returnUrl: string;

    //Registration
    show: boolean;
    registerLoading: boolean = false;
    registerErrorMsg: string = '';
    registered: string;

    id: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService,
        private authService: AuthenticationTransactionService,
        private da: DigitalAnalyticsService) {
        this.show = false;
    }

    ngOnInit(){
        this.id = uniqueId();
        this.initId();
        this.returnUrl = this.route.queryParams['returnUrl'] || '/home';
        if(this.orderId !=undefined && this.storeId!=undefined){
            this.initBuyerData();
        }
    }


    private initBuyerData(){
        return this.orderService
            .findByOrderId({storeId: this.storeId, orderId: this.orderId} ,undefined, undefined ).toPromise()
            .then(response =>{
                this.registered= response.body.buyerDistinguishedName;
                this.user.firstName = response.body.paymentInstruction[0].firstName;
                this.user.lastName= response.body.paymentInstruction[0].lastName;
                this.user.email= response.body.paymentInstruction[0].email1;
                this.user.phone= response.body.paymentInstruction[0].phone1;

            }).catch((err: HttpErrorResponse) => {
                console.log("User registered:",this.registered);
            })
    }

    initId(){
        return this.route.queryParams.subscribe( params => {
            this.orderId=params['orderId'];
            this.storeId= params['storeId']
        });
    }

    register(){
        this.registerLoading = true;
        return this.authService.register(this.user.firstName, this.user.lastName, this.user.email, this.user.password, this.user.confirmPassword, this.user.phone, this.user.receiveEmail, this.user[Constants.MARKETING_TRACKING_CONSENT], this.user[Constants.DIGITAL_ANALYTICS_CONSENT]).then(res => {
            let userParam: any = {
                pageName: Constants.orderConfirmationPageIdentifier,
                user: {
                    userId: res.body.userId,
                    email1: this.user.email
                }
            };
            this.da.updateUser(userParam);

            // navigate home after a successful register
            this.goToHomePage(this.returnUrl);
        }).catch((error: HttpErrorResponse) => {
            this.registerErrorMsg = this._parseErrorMsg(error, 'Could not register new user');
            this.registerLoading = false;
            console.log('errorMsg:',this.registerErrorMsg)  ;

        });
    }

    private _parseErrorMsg(error: HttpErrorResponse, fallback: string): string {
        const eBody = error.error;
        return eBody.errors && eBody.errors.length && eBody.errors[0].errorMessage ? eBody.errors[0].errorMessage : fallback;
    }

    goToHomePage(returnUrl : string){
        return this.router.navigate([returnUrl]);
    }

    reset(){
        this.registerErrorMsg=undefined;
    }


}
