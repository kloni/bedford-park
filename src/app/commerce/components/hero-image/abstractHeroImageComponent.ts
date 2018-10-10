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
 * @name Hero image
 * @id aca5ee5c-a89b-4cf8-aa62-e43a77674663
 */
export abstract class AbstractHeroImageComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "fieldLabel": "Image",
     *   "imageProfileId": "763cc433-46d8-4a1e-9155-878ae8cf4dbc",
     *   "key": "image",
     *   "label": "Background image"
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
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "text",
     *   "label": "Headline text"
     * }
     */
    @RenderingContextBinding('text.text', '')
    readonly onText: Observable<string>;

    /*
     * @see #onText
     */
    @RenderingContextBinding()
    readonly text: string;

    /*
     * {
     *   "elementType": "link",
     *   "fieldLabel": "Link",
     *   "key": "link",
     *   "label": "Call to action link"
     * }
     */
    @RenderingContextBinding('link.link')
    readonly onLink: Observable<Link>;

    /*
     * @see #onLink
     */
    @RenderingContextBinding()
    readonly link: Link;

    protected constructor() {
        super();
    }
}
