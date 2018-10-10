/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Company page
 * @id fa65a34c-fa4f-4e22-93ac-535a1f052b79
 */
export abstract class AbstractCompanyPageComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.title')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "heroBanner",
     *   "label": "Hero banner",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.hero"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.heroBanner')
    readonly onHeroBanner: Observable<RenderingContext>;

    /*
     * @see #onHeroBanner
     */
    @RenderingContextBinding()
    readonly heroBanner: RenderingContext;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "bodyText",
     *   "label": "Body text"
     * }
     */
    @RenderingContextBinding('formattedtext.bodyText', '')
    readonly onBodyText: Observable<string>;

    /*
     * @see #onBodyText
     */
    @RenderingContextBinding()
    readonly bodyText: string;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "section",
     *   "label": "Section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.section', [])
    readonly onSection: Observable<RenderingContext[]>;

    /*
     * @see #onSection
     */
    @RenderingContextBinding()
    readonly section: RenderingContext[];

    protected constructor() {
        super();
    }
}
