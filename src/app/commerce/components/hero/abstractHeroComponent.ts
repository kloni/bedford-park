/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Image,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Hero
 * @id com.ibm.commerce.store.angular-types.hero
 */
export abstract class AbstractHeroComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "required": false
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
     *   "elementType": "formattedtext",
     *   "key": "descriptiveText",
     *   "label": "Descriptive text"
     * }
     */
    @RenderingContextBinding('formattedtext.descriptiveText', '')
    readonly onDescriptiveText: Observable<string>;

    /*
     * @see #onDescriptiveText
     */
    @RenderingContextBinding()
    readonly descriptiveText: string;

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "imageProfileId": "00ebadb4-b599-47f5-a233-d5e6e055dd06",
     *   "key": "backgroundImage",
     *   "label": "Background image",
     *   "required": true
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
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "imageProfileId": "424c6387-ecaf-4e7d-a1f5-d8cded716a93",
     *   "key": "foregroundImage",
     *   "label": "Foreground image"
     * }
     */
    @RenderingContextBinding('image.foregroundImage')
    readonly onForegroundImage: Observable<Image>;

    /*
     * @see #onForegroundImage
     */
    @RenderingContextBinding()
    readonly foregroundImage: Image;

    protected constructor() {
        super();
    }
}
