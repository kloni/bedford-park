/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Category,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Content by tag
 * @id com.ibm.commerce.store.angular-types.content-by-tag
 */
export abstract class AbstractContentByTagComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "category",
     *   "key": "contentType",
     *   "label": "Content type",
     *   "required": true,
     *   "restrictedParents": [
     *     "b83bb9c6-2ecd-44b1-87ae-a214a768afb6"
     *   ]
     * }
     */
    @RenderingContextBinding('category.contentType')
    readonly onContentType: Observable<Category>;

    /*
     * @see #onContentType
     */
    @RenderingContextBinding()
    readonly contentType: Category;

    /*
     * {
     *   "elementType": "category",
     *   "key": "sortOrder",
     *   "label": "Display order",
     *   "restrictedParents": [
     *     "52265429-9349-49fe-b35d-f7b71493190e"
     *   ]
     * }
     */
    @RenderingContextBinding('category.sortOrder')
    readonly onSortOrder: Observable<Category>;

    /*
     * @see #onSortOrder
     */
    @RenderingContextBinding()
    readonly sortOrder: Category;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "maxContents",
     *   "label": "Maximum number of contents"
     * }
     */
    @RenderingContextBinding('number.maxContents', 0)
    readonly onMaxContents: Observable<number>;

    /*
     * @see #onMaxContents
     */
    @RenderingContextBinding()
    readonly maxContents: number;

    protected constructor() {
        super();
    }
}