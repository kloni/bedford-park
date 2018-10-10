/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
export const CommerceEnvironment = {
    searchUseMocks: false,
    transactionUseMocks: false,
    pageSize: 25,
    orderCommentpageSize: 15,
    csrSearchMax: 20,
    errors: {
        genericUserError: "USR.CWXFR0130E",
        expiredActivityTokenError: "CWXBB1011E",
        invalidCookieErrorKey: "_ERR_INVALID_COOKIE",
        invalidCookieErrorCode: "CMN1039E",
        sessionTimeoutError: "sessionTimeout",
        sessionInvalidError: "sessionInvalid",
        accountLockoutError: "2490",
        cartLocked: "_ERR_ORDER_IS_LOCKED"
    },
    defaultLoggerOptions: {
        "level": 2,
        "store": false
    },
    defaultContextPaths: {
        "transaction": "/wcs/resources",
        "search": "/search/resources"
    },
    previewContextPaths:{
        "transaction": "/wcs/resources",
        "search": "/search/previewresources"
    },
    order: {
        orderStatus: {
            I: "Submitted",
            M: "Order received and ready for processing",
            C: "Payment approved",
            S: "Order shipped",
            W: "Pending approval",
            N: "Approval denied",
            B: "Back ordered",
            R: "Inventory fulfilled",
            D: "Order completed",
            L: "Insufficient inventory",
            A: "Payment authorization requires review",
            F: "Order transferred to fulfillment",
            G: "Order processing",
            K: "Return associated",
            V: "Partially shipped",
            X: "Order canceled",
            E: "Currently edited by the store",
            T: "Currently locked by the store",
            InActive: "InActive",
            Active: "Active",
            Expired: "Expired",
            Cancelled: "Cancelled",
            Completed: "Completed",
            Suspended: "Suspended",
            PendingCancel: "PendingCancel"
        },
        orderItemInventoryStatus:{
            'available': 'Available',
            'allocated': 'Allocated',
            'backordered': 'Backordered'
        },
        validOrderStatusForCancel: ["A", "B", "C", "E", "I", "L", "M", "N", "P", "W"],
        types: {
            history: "History",
            recurring: "RecurringOrder",
            subscription: "All"
        },
        typeDisplay: {
            History: "Order History",
            RecurringOrder: "Recurring Orders",
            All: "Subscriptions"
        },
        freq: {
            onceOnly: "OnceOnly",
            everyHour: "EveryHour",
            everyDay: "EveryDay",
            everyWeek: "EveryWeek",
            everyMonth: "EveryMonth",
            everyYear: "EveryYear",
            everyXHours: "EveryXHours",
            everyXDays: "EveryXDays",
            everyXWeeks: "EveryXWeeks",
            everyXMonths: "EveryXMonths",
            everyXYears: "EveryXYears"
        },
        uom: {
            hour: "HUR",
            day: "DAY",
            week: "WEE",
            month: "MON",
            year: "ANN"
        },
        msgKeys: {
            infoNA: "InfoNA",
            subscrAllFuture: "SubscrAllFuture",
            subscrAllFutureExcCurrent: "SubscrAllFutureExcCurrent",
            recurOrderAllFuture: "RecurOrderAllFuture",
            recurOrderAllFutureExcCurrent: "RecurOrderAllFutureExcCurrent",
            subscrCancelSubmitted: "SubscrCancelSubmitted",
            subscrCancelled: "SubscrCancelled",
            recurOrderCancelSubmitted: "RecurOrderCancelSubmitted",
            recurOrderCancelled: "RecurOrderCancelled"
        },
        orderItemParams: [
            "comment",
            "productId",
            "quantity",
            "orderItemId",
            "contractId",
            "partNumber"
        ],
        calculationUsage : "-1,-2,-5,-6,-7",
        calculateOrder: "1"
    },
    shopOnBehalfSessionEstablished: false,
    address: {
        types: ["Shipping", "Billing", "ShippingAndBilling"],
        reqAttrs: ["nickName", "firstName", "lastName", "city", "state", "country", "email1", "phone1", "addressLine", "addressType", "zipCode"],
        defaults: {
            addressLine: ["", "", ""],
            addressType: "ShippingAndBilling",
            country: ""
        },
        type: {
            shipping: "Shipping",
            billing: "Billing",
            shippingAndBilling: "ShippingAndBilling"
        }
    },
    confSupportedCurrencies: "com.ibm.commerce.foundation.supportedCurrencies",
    confSupportedLanguages: "com.ibm.commerce.foundation.supportedLanguages",
    confDefaultLanguage: "com.ibm.commerce.foundation.defaultLanguage",
    defaultLang: "en_US",
    personalInfo: {
        reqAttrs: ["firstName", "lastName", "city", "state", "country", "zipCode", "addressLine", "address1", "address2", "email1", "phone1"],
        defaults: {
            addressLine: ["", "", ""],
            country: "US"
        },
        genderList: [{ name: "Male", value: "M" }, { name: "Female", value: "F" }]
    },
    eSpotTypeStoreFeature: "STOREFEATURE",
    productSkeleton: {
        id: "",
        type: "Product",
        layouts: { default: { template: "", templateType: "angular" } },
        typeId: "com.ibm.commerce.store.angular-types.product",
        selectedLayouts: [ { layout: { id: "" } } ],
        productInternal: "",
        productDesc: {},
        eSpotInternal: {},
        eSpotDescInternal: {}
    },
    productImageSkeleton: {
        id: "",
        type: "Product Details Image",
        layouts: { default: { template: "", templateType: "angular" } },
        typeId: "com.ibm.commerce.store.angular-types.product-details-image",
        selectedLayouts: [ { layout: { id: "" } } ],
        images: { thumb: "", full: "" }
    },
    categorySkeleton: {
        id: "",
        type: "Child PIM categories",
        layouts: { default: { template: "", templateType: "angular" } },
        typeId: "com.ibm.commerce.store.angular-types.child-pim-categories",
        selectedLayouts: [ { layout: { id: "" } } ],
        categoryInternal: {},
        eSpotInternal: {},
        eSpotDescInternal: {}
    },
    fullRegSkeleton: {
        id: "",
        type: "Registration",
        layouts:{default:{name:"registrationLayout",template:"registration-layout",templateType:"angular"}},
        typeId: "com.ibm.commerce.store.angular-types.registration",
        csr: {},
        selectedLayouts: [ { layout: { id: "registration-layout" } } ],
    },
    listSettings: {
        pageSize: 12,
        defaultSortOptions: [
            { key: 'SN_NO_SORT', value: '', translationKey: 'CommerceEnvironment.listSettings.relevance' },
            { key: 'SN_SORT_BY_BRANDS', value: '1', translationKey: 'CommerceEnvironment.listSettings.brands' },
            { key: 'SN_SORT_BY_NAME', value: '2', translationKey: 'CommerceEnvironment.listSettings.name' }
        ],
        priceSortOptions: [
            { key: 'SN_SORT_LOW_TO_HIGH', value: '3', translationKey: 'CommerceEnvironment.listSettings.priceLowToHigh' },
            { key: 'SN_SORT_HIGH_TO_LOW', value: '4', translationKey: 'CommerceEnvironment.listSettings.priceHighToLow' }
        ]
    },
    recommendationCarouselConfig: {
        'slidesToShow': 4,
        'slidesToScroll': 4,
        'dots': false,
        'arrows': true,
        'infinite': false,
        'responsive': [
            {
                'breakpoint': 1250,
                'settings': {
                    'slidesToShow': 3,
                    'slidesToScroll': 3,
                    'infinite': false
                }
            },{
                'breakpoint': 700,
                'settings': {
                    'slidesToShow': 2,
                    'slidesToScroll': 2,
                    'infinite': false
                }
            },{
                'breakpoint': 400,
                'settings': {
                    'slidesToShow': 1,
                    'slidesToScroll': 1,
                    'infinite': false
                }
            }
        ]
    },
    featureCardImageRight:"FEATURE_CARD_IMAGE_RIGHT",
    analytics: {
        "orderItemAttrFacetAnalytics": "facetAnalytics",
        "orderItemAttrParentCategory": "parentCategory",
        "productSearchSuccessfulPageName": "Product Search Successful:", // need colon after for pageNumber
        "productSearchUnsuccessfulPageName": "Product Search Unsuccessful",
        "articleSearchSuccessfulPageName": "Article Search Successful", // no need for colon, article doesn't have pagination
        "articleSearchUnsuccessfulPageName": "Article Search Unsuccessful",
        "searchCategoryId": "Search Results",
        "searchFacetFilterName": "Article Type",
        "facetAnalyticsKey": {
            "price": "Price",
            "category": "Category"
        }
    },
    checkoutAddressSection: 'Checkout Address',
    checkoutShippingSection: 'Checkout Shipping and Payment',
    checkoutSummarySection: 'Checkout Summary',
    orderServiceQueryFindOrderPromotions: 'findOrderPromotions',
    digitalAnalyticsFeatureName: 'Analytics',
    VATFeatureName: 'ProductTotalWithVAT'
};
