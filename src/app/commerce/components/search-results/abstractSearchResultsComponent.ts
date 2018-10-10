/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Category,
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Search Results
 * @id a2af5a72-af88-4d85-af10-b3972c27c095
 */
export abstract class AbstractSearchResultsComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "reference",
     *   "key": "filter",
     *   "label": "Filter",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productfilter"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.filter')
    readonly onFilter: Observable<RenderingContext>;

    /*
     * @see #onFilter
     */
    @RenderingContextBinding()
    readonly filter: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "productGrid",
     *   "label": "Product Grid",
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productgrid"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.productGrid')
    readonly onProductGrid: Observable<RenderingContext>;

    /*
     * @see #onProductGrid
     */
    @RenderingContextBinding()
    readonly productGrid: RenderingContext;

    /*
     * {
     *   "elementType": "category",
     *   "helpText": "Display article types that will be filtered in the accrodion",
     *   "key": "articleType",
     *   "label": "Article Type",
     *   "required": true,
     *   "restrictedParents": [
     *     "b816e57d-f4ec-4162-9038-ec133472b95e"
     *   ]
     * }
     */
    @RenderingContextBinding('category.articleType')
    readonly onArticleType: Observable<Category>;

    /*
     * @see #onArticleType
     */
    @RenderingContextBinding()
    readonly articleType: Category;

    protected constructor() {
        super();
    }
}