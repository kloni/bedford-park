
/*******************************************************************************
 * Constants.ts
 *
 * Copyright IBM Corp. 2017, 2018
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

export class Constants {

    // static readonly DOMAIN_NAME = 'your-domain-name.com';
    // static readonly CONTENT_HUB_ID = '0000000-0000-0000-0000-000000000000';

    static readonly PROTOCOL = 'https:';
    static readonly apiUrl = `${Constants.PROTOCOL}//${Constants['DOMAIN_NAME']}/api/${Constants['CONTENT_HUB_ID']}`;
    static readonly deliveryUrl = `${Constants.PROTOCOL}//${Constants['DOMAIN_NAME']}/${Constants['CONTENT_HUB_ID']}`;

    /**
     * currently we only support one site in WCH
     */
    static readonly SITE_ID = 'default';

    static readonly FOOTER_CONFIG = 'footerConfig';
    static readonly HEADER_CONFIG = 'headerConfig';

    /*Layout modes */
    static readonly DETAIL = 'default';
    static readonly SUMMARY = 'Summary';

    /* Sort order */
    static readonly ALPHABETICAL_ASCENDING = 'Alphabetical ascending';
    static readonly ALPHABETICAL_DESCENDING = 'Alphabetical descending';
    static readonly LATEST_FIRST = 'By date descending';
    static readonly OLDEST_FIRST = 'By date ascending';
    static readonly DISPLAY_SEQUENCE = 'By display sequence';

    /* Default field for sorting.  This assumes all dynamic list types contain these field */
    static readonly ALPHABETICAL_FIELD = 'heading';
    static readonly DATE_FIELD = 'date';
    static readonly DISPLAY_SEQUENCE_FIELD = 'displaySequence';

    /* Filter date */
    static readonly FUTURE_DATES = 'Future dates (Events)';
    static readonly LAST_30_DAYS = 'Published last 30 days';
    static readonly LAST_7_DAYS = 'Published last 7 days';

    /* Dynamic list types */
    static readonly EVENTS = 'Event';

    /* Sort field type */
    static readonly DATETIME = 'datetime';

    static readonly homePageIdentifier: string = 'Home';
    static readonly signInPageIdentifier: string = 'Sign-in';
    static readonly checkoutPageIdentifier: string = 'Checkout';
    static readonly addressBookPageIdentifier: string = 'Address Book';
    static readonly myAccountPageIdentifier: string = 'My Account';
    static readonly shoppingCartPageIdentifier: string = 'Shopping cart';
    static readonly orderConfirmationPageIdentifier: string = 'Order Confirmation';
    static readonly orderHistoryPageIdentifier: string = 'Order history';
    static readonly commerceCategoryPageIdentifier: string = 'Category Default Page';
    static readonly productDetailPageIdentifier: string = 'Product Default Page';
    static readonly productListingPageIdentifier: string = 'Category Products Default Page';
    static readonly searchResultsPageIdentifier: string = 'Search Results';
    static readonly orderDetailsPageIdentifier: string = 'Order Details';
    static readonly designPageIdentifier: string = 'Design Topics';
    static readonly customerServiceIdentifier: string = "Customer Service";
    static readonly wishListPageIdentifier: string = 'Wish List';
    static readonly storeLocatorPageIdentifier: string = 'Store Locator';

    /* Page types that will be searched in the search results */
    static readonly PAGE_TYPES_SEARCHED = ['Design Page'];

    /* path for search results page */
    static readonly SEARCH_RESULTS_PAGE_PATH = '/search-results';

    /** page not found "path" */
    static readonly PAGE_NOT_FOUND_PATH = '/page-not-found';

    static readonly authGuardPages: string[] = [
        Constants.addressBookPageIdentifier,
        Constants.myAccountPageIdentifier,
        Constants.orderHistoryPageIdentifier,
        Constants.orderDetailsPageIdentifier,
        Constants.wishListPageIdentifier
    ];
    static readonly pageviewEventGuardExclusionList: Set<string> = new Set<string>( [
        Constants.searchResultsPageIdentifier,
        Constants.checkoutPageIdentifier,
        Constants.myAccountPageIdentifier,
        Constants.addressBookPageIdentifier,
        Constants.orderConfirmationPageIdentifier,
        Constants.shoppingCartPageIdentifier,
        Constants.signInPageIdentifier
    ] );

    static readonly DA_PAGE_TYPE = {
        Productdetail: 'wcs-productdetail',
        Cart: 'wcs-cart',
        Registration: 'wcs-registration',
        Order: 'wcs-order',
        Element: 'wcs-element',
        ConversionEvent: 'wcs-conversionevent',
        StandardPage: 'wcs-standardpage'
    };

    /**
     * GDPR
     * static fields for privacy page, marketing consent and digital analytics consents.
     */
    static readonly PRIVACY_ESPOTNAME: string = 'PrivacyPolicyPageCenter_Content';
    static readonly FEATURE_CONSENT_OPTIONS: string = 'ConsentOptions';
    static readonly FEATURE_SESSION: string = 'Session';
    static readonly FEATURE_MARKETING_CONSENT: string = 'MarketingConsent';
    static readonly FEATURE_DA_CONSENT: string = 'DAConsent';
    static readonly CONSENT_ACCEPT = '1';
    static readonly CONSENT_REJECT = '0';
    static readonly DA_CONSENT_ACCEPT = '10';
    static readonly DA_CONSENT_ACCEPT_ANONYMOUSLY = '11';
    static readonly PERMANENT_STORE_DAYS = 30;
    static readonly PRIVACY_NOTICE_VERSION = 'privacyNoticeVersion';
    static readonly MARKETING_TRACKING_CONSENT = 'marketingTrackingConsent';
    static readonly DIGITAL_ANALYTICS_CONSENT = 'digitalAnalyticsConsent';
    static readonly GDPR_CONTEXT_ATTRIBUTES: string[] = [
        Constants.PRIVACY_NOTICE_VERSION,
        Constants.MARKETING_TRACKING_CONSENT,
        Constants.DIGITAL_ANALYTICS_CONSENT
    ];
    static readonly HEADER_WC_MARKETINGTRACKINGCONSENTS = 'WC_MarketingTrackingConsents';

    static readonly CSR_ONLY = "CSR Only";
    static readonly REG_ONLY = "Registered Users Only";
    static readonly AUTH_REDIRECT_URL = 'redirectUrl';

    /**
     * secure prefix
     */
    static readonly SECURE_PATHS: string[] = ['/checkout'];
    static readonly SECURE_BASE_HREF_PART: string = '/checkout';

    /**
     * Temporary variable indicates whether custom host Akamai routing is enabled or not.
     */
    static readonly PROD_PROXY_ENABLED = false;
}


