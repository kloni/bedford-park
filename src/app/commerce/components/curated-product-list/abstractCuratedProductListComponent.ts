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
 * @name Curated product list
 * @id com.ibm.commerce.store.angular-types.curated-product-list
 */
export abstract class AbstractCuratedProductListComponent extends AbstractRenderingComponent {

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
     *   "allowMultipleValues": true,
     *   "elementType": "text",
     *   "fieldLabel": "Part number",
     *   "key": "productName",
     *   "label": "Part number(s)",
     *   "minLength": 1,
     *   "minimumValues": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('texts.productName')
    readonly onProductName: Observable<string[]>;

    /*
     * @see #onProductName
     */
    @RenderingContextBinding()
    readonly productName: string[];

    protected constructor() {
        super();
    }
}
