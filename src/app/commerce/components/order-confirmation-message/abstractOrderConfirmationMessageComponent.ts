/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Image,
    Link,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Order Confirmation Message
 * @id com.ibm.commerce.store.angular-types.orderconfirmationmessage
 */
export abstract class AbstractOrderConfirmationMessageComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "gratitudeMessage",
     *   "label": "Gratitude Message",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.gratitudeMessage')
    readonly onGratitudeMessage: Observable<string>;

    /*
     * @see #onGratitudeMessage
     */
    @RenderingContextBinding()
    readonly gratitudeMessage: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "confirmationEmailLabel",
     *   "label": "Confirmation Email Label",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.confirmationEmailLabel')
    readonly onConfirmationEmailLabel: Observable<string>;

    /*
     * @see #onConfirmationEmailLabel
     */
    @RenderingContextBinding()
    readonly confirmationEmailLabel: string;

    /*
     * {
     *   "elementType": "image",
     *   "key": "confirmationImage",
     *   "label": "Confirmation Image",
     *   "required": false
     * }
     */
    @RenderingContextBinding('image.confirmationImage')
    readonly onConfirmationImage: Observable<Image>;

    /*
     * @see #onConfirmationImage
     */
    @RenderingContextBinding()
    readonly confirmationImage: Image;

    /*
     * {
     *   "elementType": "text",
     *   "key": "orderNumberLabel",
     *   "label": "Order Number Label",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.orderNumberLabel')
    readonly onOrderNumberLabel: Observable<string>;

    /*
     * @see #onOrderNumberLabel
     */
    @RenderingContextBinding()
    readonly orderNumberLabel: string;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "messageOfTheDay",
     *   "label": "Message Of the Day"
     * }
     */
    @RenderingContextBinding('formattedtext.messageOfTheDay', '')
    readonly onMessageOfTheDay: Observable<string>;

    /*
     * @see #onMessageOfTheDay
     */
    @RenderingContextBinding()
    readonly messageOfTheDay: string;

    /*
     * {
     *   "elementType": "link",
     *   "key": "redirectLinkToHome",
     *   "label": "Redirect Link To Home",
     *   "required": true
     * }
     */
    @RenderingContextBinding('link.redirectLinkToHome')
    readonly onRedirectLinkToHome: Observable<Link>;

    /*
     * @see #onRedirectLinkToHome
     */
    @RenderingContextBinding()
    readonly redirectLinkToHome: Link;

    protected constructor() {
        super();
    }
}
