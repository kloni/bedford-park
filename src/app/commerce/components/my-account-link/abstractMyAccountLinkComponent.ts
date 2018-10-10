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
 * @name My Account link
 * @id com.ibm.commerce.store.angular-types.myaccountlink
 */
export abstract class AbstractMyAccountLinkComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "name",
     *   "label": "Name",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.name')
    readonly onName: Observable<string>;

    /*
     * @see #onName
     */
    @RenderingContextBinding()
    readonly name: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "description",
     *   "label": "Description"
     * }
     */
    @RenderingContextBinding('text.description', '')
    readonly onDescription: Observable<string>;

    /*
     * @see #onDescription
     */
    @RenderingContextBinding()
    readonly description: string;

    /*
     * {
     *   "elementType": "link",
     *   "key": "linkUrl",
     *   "label": "Call to action link",
     *   "required": true
     * }
     */
    @RenderingContextBinding('link.linkUrl')
    readonly onLinkUrl: Observable<Link>;

    /*
     * @see #onLinkUrl
     */
    @RenderingContextBinding()
    readonly linkUrl: Link;

    /*
     * {
     *   "elementType": "image",
     *   "key": "image",
     *   "label": "Image",
     *   "required": true
     * }
     */
    @RenderingContextBinding('image.image')
    readonly onImage: Observable<Image>;

    /*
     * @see #onImage
     */
    @RenderingContextBinding()
    readonly image: Image;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "displaySequence",
     *   "label": "Display sequence",
     *   "required": true
     * }
     */
    @RenderingContextBinding('number.displaySequence')
    readonly onDisplaySequence: Observable<number>;

    /*
     * @see #onDisplaySequence
     */
    @RenderingContextBinding()
    readonly displaySequence: number;

    protected constructor() {
        super();
    }
}