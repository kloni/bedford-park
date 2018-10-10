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
 * @name Promotion
 * @id com.ibm.commerce.store.angular-types.promotion
 */
export abstract class AbstractPromotionComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "imageProfileId": "e6e144e9-b76d-40e3-9435-329bde6a7769",
     *   "key": "backgroundImage",
     *   "label": "Background image"
     * }
     */
    @RenderingContextBinding('image.backgroundImage')
    readonly onBackgroundImage: Observable<Image>;

    /*
     * @see #onBackgroundImage
     */
    @RenderingContextBinding()
    readonly backgroundImage: Image;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "promotionText",
     *   "label": "Promotion text",
     *   "required": true
     * }
     */
    @RenderingContextBinding('formattedtext.promotionText')
    readonly onPromotionText: Observable<string>;

    /*
     * @see #onPromotionText
     */
    @RenderingContextBinding()
    readonly promotionText: string;

    /*
     * {
     *   "elementType": "link",
     *   "key": "callToActionLink",
     *   "label": "Call to action link"
     * }
     */
    @RenderingContextBinding('link.callToActionLink')
    readonly onCallToActionLink: Observable<Link>;

    /*
     * @see #onCallToActionLink
     */
    @RenderingContextBinding()
    readonly callToActionLink: Link;

    protected constructor() {
        super();
    }
}
