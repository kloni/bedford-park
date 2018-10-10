/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Product filter
 * @id com.ibm.commerce.store.angular-types.productfilter
 */
export abstract class AbstractProductFilterComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "categoryLimit",
     *   "label": "Category Facet Limit"
     * }
     */
    @RenderingContextBinding('text.categoryLimit', '')
    readonly onCategoryLimit: Observable<string>;

    /*
     * @see #onCategoryLimit
     */
    @RenderingContextBinding()
    readonly categoryLimit: string;

    protected constructor() {
        super();
    }
}