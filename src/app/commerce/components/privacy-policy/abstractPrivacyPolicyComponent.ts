/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Privacy Policy
 * @id com.ibm.commerce.store.angular-types.privacy-policy
 */
export abstract class AbstractPrivacyPolicyComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "reference",
     *   "key": "heroBanner",
     *   "label": "Hero banner",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.hero"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.heroBanner')
    readonly onHeroBanner: Observable<RenderingContext>;

    /*
     * @see #onHeroBanner
     */
    @RenderingContextBinding()
    readonly heroBanner: RenderingContext;

    /*
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title"
     * }
     */
    @RenderingContextBinding('text.title', '')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "confirmationLabel",
     *   "label": "Confirmation button label"
     * }
     */
    @RenderingContextBinding('text.confirmationLabel', '')
    readonly onConfirmationLabel: Observable<string>;

    /*
     * @see #onConfirmationLabel
     */
    @RenderingContextBinding()
    readonly confirmationLabel: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "cancelLabel",
     *   "label": "Cancel button label"
     * }
     */
    @RenderingContextBinding('text.cancelLabel', '')
    readonly onCancelLabel: Observable<string>;

    /*
     * @see #onCancelLabel
     */
    @RenderingContextBinding()
    readonly cancelLabel: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "updateLabel",
     *   "label": "Update button label"
     * }
     */
    @RenderingContextBinding('text.updateLabel', '')
    readonly onUpdateLabel: Observable<string>;

    /*
     * @see #onUpdateLabel
     */
    @RenderingContextBinding()
    readonly updateLabel: string;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "personalInformationHeading",
     *   "label": "Personal information heading",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "2b289ecc-5c98-4a9b-b591-f288e8a1394a"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.personalInformationHeading')
    readonly onPersonalInformationHeading: Observable<RenderingContext>;

    /*
     * @see #onPersonalInformationHeading
     */
    @RenderingContextBinding()
    readonly personalInformationHeading: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "personalInformation",
     *   "label": "Personal information",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "02f73c77-3c1f-48ec-98d0-3470193270e0"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.personalInformation')
    readonly onPersonalInformation: Observable<RenderingContext>;

    /*
     * @see #onPersonalInformation
     */
    @RenderingContextBinding()
    readonly personalInformation: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "marketingBehaviorTrackingHeading",
     *   "label": "Marketing behavior tracking heading",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "2b289ecc-5c98-4a9b-b591-f288e8a1394a"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.marketingBehaviorTrackingHeading')
    readonly onMarketingBehaviorTrackingHeading: Observable<RenderingContext>;

    /*
     * @see #onMarketingBehaviorTrackingHeading
     */
    @RenderingContextBinding()
    readonly marketingBehaviorTrackingHeading: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "marketingBehaviorTracking",
     *   "label": "Marketing behavior tracking",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "02f73c77-3c1f-48ec-98d0-3470193270e0"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.marketingBehaviorTracking')
    readonly onMarketingBehaviorTracking: Observable<RenderingContext>;

    /*
     * @see #onMarketingBehaviorTracking
     */
    @RenderingContextBinding()
    readonly marketingBehaviorTracking: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "digitalAnalyticsHeading",
     *   "label": "Digital analytics heading",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "2b289ecc-5c98-4a9b-b591-f288e8a1394a"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.digitalAnalyticsHeading')
    readonly onDigitalAnalyticsHeading: Observable<RenderingContext>;

    /*
     * @see #onDigitalAnalyticsHeading
     */
    @RenderingContextBinding()
    readonly digitalAnalyticsHeading: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "digitalAnalytics",
     *   "label": "Digital analytics",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "02f73c77-3c1f-48ec-98d0-3470193270e0"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.digitalAnalytics')
    readonly onDigitalAnalytics: Observable<RenderingContext>;

    /*
     * @see #onDigitalAnalytics
     */
    @RenderingContextBinding()
    readonly digitalAnalytics: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "digitalAnalyticsOptionLabel",
     *   "label": "Digital analytics option label",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "7b889923-c9d8-499b-aef8-71be1c31382d"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.digitalAnalyticsOptionLabel')
    readonly onDigitalAnalyticsOptionLabel: Observable<RenderingContext>;

    /*
     * @see #onDigitalAnalyticsOptionLabel
     */
    @RenderingContextBinding()
    readonly digitalAnalyticsOptionLabel: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "digitalAnalyticsAnonymousOptionLabel",
     *   "label": "Digital analytics anonymous option label",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "02f73c77-3c1f-48ec-98d0-3470193270e0"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.digitalAnalyticsAnonymousOptionLabel')
    readonly onDigitalAnalyticsAnonymousOptionLabel: Observable<RenderingContext>;

    /*
     * @see #onDigitalAnalyticsAnonymousOptionLabel
     */
    @RenderingContextBinding()
    readonly digitalAnalyticsAnonymousOptionLabel: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "marketingBehaviorTrackingOptionLabel",
     *   "label": "Marketing behavior tracking option label",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "3c394f5e-fbd3-4307-ab66-295e511fb9f9"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.marketingBehaviorTrackingOptionLabel')
    readonly onMarketingBehaviorTrackingOptionLabel: Observable<RenderingContext>;

    /*
     * @see #onMarketingBehaviorTrackingOptionLabel
     */
    @RenderingContextBinding()
    readonly marketingBehaviorTrackingOptionLabel: RenderingContext;

    protected constructor() {
      super();
    }
}
