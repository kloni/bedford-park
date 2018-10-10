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
 * @name Contact Info
 * @id 2725e6d0-11d2-4345-95c4-1a447c874bcb
 */
export abstract class AbstractContactInfoComponent extends AbstractRenderingComponent {

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
     *   "elementType": "formattedtext",
     *   "key": "details",
     *   "label": "Details"
     * }
     */
    @RenderingContextBinding('formattedtext.details', '')
    readonly onDetails: Observable<string>;

    /*
     * @see #onDetails
     */
    @RenderingContextBinding()
    readonly details: string;

    /*
     * {
     *   "elementType": "image",
     *   "key": "icon",
     *   "label": "Icon"
     * }
     */
    @RenderingContextBinding('image.icon')
    readonly onIcon: Observable<Image>;

    /*
     * @see #onIcon
     */
    @RenderingContextBinding()
    readonly icon: Image;

    protected constructor() {
        super();
    }
}
