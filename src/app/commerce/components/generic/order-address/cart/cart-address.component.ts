import { Component, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { OrderAddressComponent } from './../order-address.component';

import * as $ from 'jquery';
import { CommerceEnvironment } from '../../../../commerce.environment';

@Component( {
    selector: 'commerce-cart-address',
    templateUrl: './cart-address.component.html',
    styleUrls: ['./cart-address.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
} )
export class CartAddressComponent extends OrderAddressComponent implements OnInit, OnDestroy {

    country: any = "";
    zip: string = "";
    componentName: string = "commerce-cart-address";
    @Input('cartLocked') cartLocked: string;
    @Input('isCSR') isCSR: boolean;

    zipPattern = {
        "US": "^\\d{5}(?:[-\\s]\\d{4})?$",
        "CA": "^([a-zA-Z]\\d[a-zA-Z]\\s?\\d[a-zA-Z]\\d)$"
    };

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        try {
            (<any>$( '#' + this.componentName + '_small_' + this.id )).foundation( "_destroy" );
        }
        catch ( e ) { }
        super.ngOnDestroy();
    }

    ngAfterViewInit() {
        (<any>$( '#' + this.componentName + '_small_' + this.id )).foundation();
    }

    initAddressList(): Promise<any> {

            return this.countryService.findCountryStateList( { "storeId": this.storefrontUtils.commerceStoreId } ).toPromise()
            .then(
            response => {
                let iAddresses = response.body.countries;
                if ( this.isLoggedIn() ) {
                       return this.personservice.findPersonBySelf({ storeId: this.storefrontUtils.commerceStoreId }).toPromise().then( r => {
                        let book = r.body.contact;
                        if ( !book ) {
                            book = [];
                        }
                        delete r.body.contact;
                        book.push(r.body);
                        book = book.filter(e => {
                            return e.addressLine && !this.isShippingEstimateAddress(e.nickName);
                        });
                        if ( iAddresses && iAddresses.length && book.length > 0 ) {
                            book.push( {
                                "displayName": "──────────",
                                "isSeparator": true
                            } )
                            iAddresses.splice( 0, 0, ...book );
                            this.country = iAddresses[0];
                        }
                        else if ( iAddresses.length > 0 ) {
                            for( let add of iAddresses ){
                                if(add.code == "US")
                                this.country = add;
                            }
                        }
                        this.addresses = iAddresses;
                    } );
                } else {
                    if ( iAddresses.length > 0 && !this.country ) {
                        for( let add of iAddresses ){
                            if(add.code == "US")
                            this.country = add;
                        }
                    this.addresses = iAddresses;
                    }
                }
            }
            );
    }

    getQuote() {

        const addressId = this.country.addressId;
        const dummyAddress = {
            "country": this.country.code,
            "zip": this.zip
        }
        if ( !!addressId ) {
           return this.cartTransactionService.getShippingCostEstimated( { "addressId": addressId } )
                .then( ( res ) => this.updateEstimate() );
        }
        else if ( !!dummyAddress.zip && dummyAddress.zip.length > 0 ) {
           return this.cartTransactionService.getShippingCostEstimated( dummyAddress )
                .then( ( res ) => this.updateEstimate() );
        }
    }

    private updateEstimate() {
        this.cartTransactionService.getCart();
    }

}
