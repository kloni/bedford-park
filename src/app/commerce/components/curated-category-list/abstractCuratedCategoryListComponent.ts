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
 * @name Curated category list
 * @id com.ibm.commerce.store.angular-types.curated-category-list
 * @description Hand selected collection of categories based on category identifiers
 */
export abstract class AbstractCuratedCategoryListComponent extends AbstractRenderingComponent {

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
     *   "fieldLabel": "Category identifier",
     *   "key": "categoryIdentifiers",
     *   "label": "Category identifiers",
     *   "maximumValues": 2,
     *   "minLength": 1,
     *   "minimumValues": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('texts.categoryIdentifiers')
    readonly onCategoryIdentifiers: Observable<string[]>;

    /*
     * @see #onCategoryIdentifiers
     */
    @RenderingContextBinding()
    readonly categoryIdentifiers: string[];

    protected constructor() {
        super();
    }
}