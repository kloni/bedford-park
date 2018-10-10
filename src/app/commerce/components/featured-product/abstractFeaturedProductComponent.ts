/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    OptionSelection,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Featured Product
 * @id com.ibm.commerce.store.angular-types.featured-product
 */
export abstract class AbstractFeaturedProductComponent extends AbstractRenderingComponent {

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
     *   "elementType": "toggle",
     *   "key": "useEspot",
     *   "label": "Use rule from precision marketing",
     *   "required": true
     * }
     */
    @RenderingContextBinding('toggle.useEspot')
    readonly onUseEspot: Observable<boolean>;

    /*
     * @see #onUseEspot
     */
    @RenderingContextBinding()
    readonly useEspot: boolean;

    /*
     * {
     *   "elementType": "text",
     *   "key": "partNumberOrEspot",
     *   "label": "Product part number or E-Marketing spot name",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.partNumberOrEspot')
    readonly onPartNumberOrEspot: Observable<string>;

    /*
     * @see #onProductName
     */
    @RenderingContextBinding()
    readonly partNumberOrEspot: string;

    protected constructor() {
        super();
    }
}
