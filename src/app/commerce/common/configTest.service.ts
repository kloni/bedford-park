/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { HttpXhrBackend } from "@angular/common/http";
import { Injectable, Injector } from '@angular/core';
import { ConfigService } from './config.service';

/**
 * This is a configuration for Unit TEST
 * This will be run for test environment only, doesn't apply to dev/prod.
 */
@Injectable()
export class ConfigTestService extends ConfigService {

    private _configJSON: any = {
        "commerceSearchHostPort": "",
        "commerceSearchContextPath":"/search/resources",
        "commerceTransactionHostPort": "aas129.watsoncommerce.ibm.com",
        "commerceTransactionContextPath":"/wcs/resources",
        "logger":{
            "level": 2,
            "store": false
        },
        "useMockTransaction": true,
        "testType": "",
        "digitalAnalyticsConfig": {
            "ProductionClientIds": ["90110130"],
            "DevelopmentClientIds": ["90110130"],
            "DataCollectionMethod": true,
            "DataCollectionDomain": "data.coremetrics.com",
            "CookieDomain": "localhost"
        }
    };

    private _servicesConfig: any =
    {
        "restRequiringUser": ["/cart.addOrderItem.mocks.json"],
        "actionableRestService": [
            {
                "url": "/store/{storeId}/person/@self"
            },
            {
                "url": "/store/{storeId}/cart/@self/applepay_cancel"
            },
            {
                "url": "/store/{storeId}/cart/@self/precheckout"
            },
            {
                "url": "/store/{storeId}/cart/@self/assigned_promotion_code"
            },
            {
                "url": "/store/{storeId}/cart/@self/delete_order_item"
            },
            {
                "url": "/store/{storeId}/cart/@self/update_order_item"
            },
            {
                "url": "/store/{storeId}/person/@self/contact"
            },
            {
                "url": "/store/{storeId}/cart"
            }
        ]
    };
    private _siteConfig: any = {"classification":"site","created":"2017-11-24T16:12:05.195Z","creatorId":"00000000-0000-0000-0000-000000000009","id":"default","lastModified":"2017-12-11T18:01:57.978Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","name":"Stockholm","pages":[{"children":[],"classification":"page","contentId":"70babade-37f1-4c4f-9556-bda76779df7c","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:01.665Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"3658e6b2-734a-4a21-9823-6910b7913ffe","lastModified":"2017-12-11T19:58:56.873Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Home","path":"/home","position":1,"route":"/home","segment":"home","title":"Home","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/home"},{"children":[],"classification":"page","contentId":"ff5e04d5-ec9d-4750-a605-fdcb5ee5c361","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:01:58.705Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"a680d437-bbd1-4718-b2e7-f27b0461e18a","lastModified":"2017-12-11T18:01:58.705Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Address Book","path":"/address-book","position":2,"route":"/address-book","segment":"address-book","title":"Address Book","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/address-book"},{"children":[],"classification":"page","contentId":"fd96297c-591c-419b-97c6-fc91d71213c8","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:08.736Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"bd848d78-b7c0-4b39-b1d9-1f679f9e35cb","lastModified":"2017-12-11T18:02:08.736Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-hero-2-blocks","name":"Sign-in","path":"/sign-in","position":3,"route":"/sign-in","segment":"sign-in","title":"Sign-in","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/sign-in"},{"children":[],"classification":"page","contentId":"1a488dc5-ab43-48e3-bd68-268ac5f7c23a","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:02.420Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"62687ad8-2eb9-43ec-9e75-facc869c9387","lastModified":"2017-12-11T18:02:02.420Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"My Account","path":"/my-account","position":4,"route":"/my-account","segment":"my-account","title":"My Account","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/my-account"},{"children":[],"classification":"page","contentId":"232c05a5-0d10-4ffb-ac63-bf84e5844ed0","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:05.778Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"20ee8b87-9068-4905-a982-9b2236d26a69","lastModified":"2017-12-11T18:02:05.778Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Shopping Cart","path":"/cart","position":5,"route":"/cart","segment":"cart","title":"Shoppingcart","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/cart"},{"children":[],"classification":"page","contentId":"20aef43f-eb3a-4c56-ad27-97090b32188a","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:01:59.819Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"Checkout page","id":"25f7a440-e5c2-48e3-a633-5064399584a4","lastModified":"2017-12-11T18:01:59.819Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Checkout","path":"/checkout","position":6,"route":"/checkout","segment":"checkout","title":"Checkout","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/checkout"},{"children":[],"classification":"page","contentId":"8a7512fe-0743-41b7-943f-fd08aad34337","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:07.808Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"20ee8b87-9068-4905-a982-9b2236d26a70","lastModified":"2017-12-11T18:02:07.808Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Test Products","path":"/testproducts","position":7,"route":"/testproducts","segment":"testproducts","title":"TestProducts","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/testproducts"},{"children":[],"classification":"page","contentId":"dda3cf48-8a69-4d5e-a4ea-dd40110c256b","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:04.523Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"355783e1-74aa-4253-872b-c000f01bb37d","lastModified":"2017-12-11T18:02:04.523Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-layout","name":"Order History","path":"/order-history","position":8,"route":"/order-history","segment":"order-history","title":"Order History","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/order-history"},{"__contentDraftId__":"f731a138-b912-4264-9764-b5c14dc23620","children":[],"classification":"page","contentId":"a0946192-6571-44e6-a323-cff9e885ea98","contentStatus":"ready","contentTypeId":"2af1d22a-fecf-41e1-a808-7301cb37b79f","created":"2017-12-11T18:02:03.566Z","creatorId":"a9c3b516-b205-4394-aaca-a2542b8bac98","description":"","id":"0a4548c2-b75d-4e20-94d0-e5ef345c7d8f","lastModified":"2017-12-11T19:57:43.874Z","lastModifierId":"a9c3b516-b205-4394-aaca-a2542b8bac98","layoutId":"standard-page-hero-2-blocks","name":"Order Confirmation","path":"/order-confirmation","position":9,"route":"/order-confirmation","segment":"order-confirmation","title":"Order Confirmation","url":"/a960c642-bf7a-4e24-ade3-423616c3aca5/order-confirmation"}],"rev":"13-477e58ffeb7cb86f3953f138d82a38ec","routingMode":"path"};

    constructor(private _backend: HttpXhrBackend, private _inj: Injector) {
        super(_backend, _inj);
        this.configJSONSubj.next(this._configJSON);
        this.servicesConfigSubj.next(this._servicesConfig);
        this.siteConfigSubj.next(this._siteConfig);
        this.commerceConfigSubj.next({ibmCommerce: this._configJSON});
    }
}
