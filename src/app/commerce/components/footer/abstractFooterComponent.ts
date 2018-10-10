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
 * @name Footer
 * @id cbde3c3b-d03f-484b-8aa2-0c35227db10c
 * @description Customize elements of the footer that shows up on website pages.
 */
export abstract class AbstractFooterComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif",
     *     "svg"
     *   ],
     *   "elementType": "image",
     *   "fieldLabel": "Image",
     *   "key": "Logo",
     *   "label": "Website logo",
     *   "required": true
     * }
     */
    @RenderingContextBinding('image.Logo')
    readonly onLogo: Observable<Image>;

    /*
     * @see #onLogo
     */
    @RenderingContextBinding()
    readonly logo: Image;

    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "copyright",
     *   "label": "Copyright"
     * }
     */
    @RenderingContextBinding('text.copyright', '')
    readonly onCopyright: Observable<string>;

    /*
     * @see #onCopyright
     */
    @RenderingContextBinding()
    readonly copyright: string;


    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "customerServiceLabel",
     *   "label": "Customer service label"
     * }
     */
    @RenderingContextBinding('text.customerServiceLabel', '')
    readonly onCustomerServiceLabel: Observable<string>;

    /*
     * @see #onCustomerServiceLabel
     */
    @RenderingContextBinding()
    readonly customerServiceLabel: string;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "link",
     *   "fieldLabel": "Link",
     *   "key": "customerServiceLinks",
     *   "label": "Customer service links",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('links.customerServiceLinks', [])
    readonly onCustomerServiceLinks: Observable<Link[]>;

    /*
     * @see #onCustomerServiceLinks
     */
    @RenderingContextBinding()
    readonly customerServiceLinks: Link[];


    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "companyLinksLabel",
     *   "label": "Company links label"
     * }
     */
    @RenderingContextBinding('text.companyLinksLabel', '')
    readonly onCompanyLinksLabel: Observable<string>;

    /*
     * @see #onCustomerServiceLabel
     */
    @RenderingContextBinding()
    readonly companyLinksLabel: string;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "link",
     *   "fieldLabel": "Link",
     *   "key": "companyLinks",
     *   "label": "Company links",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('links.companyLinks', [])
    readonly onCompanyLinks: Observable<Link[]>;

    /*
     * @see #onCompanyLinks
     */
    @RenderingContextBinding()
    readonly companyLinks: Link[];


    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "followUsLabel",
     *   "label": "Follow us label"
     * }
     */
    @RenderingContextBinding('text.followUsLabel', '')
    readonly onFollowUsLabel: Observable<string>;

    /*
     * @see #onCustomerServiceLabel
     */
    @RenderingContextBinding()
    readonly followUsLabel: string;

    protected constructor() {
        super();
    }
}
