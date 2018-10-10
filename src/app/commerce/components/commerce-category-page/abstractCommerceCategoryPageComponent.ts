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
 * @name Commerce category page
 * @id com.ibm.commerce.store.angular-types.commerce-category-page
 * @description One column page
 */
export abstract class AbstractCommerceCategoryPageComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Hero",
     *   "helpText": "Add content, such as a hero banner, that you want to display at the top of your page.",
     *   "key": "hero",
     *   "label": "Hero",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.hero', [])
    readonly onHero: Observable<RenderingContext[]>;

    /*
     * @see #onHero
     */
    @RenderingContextBinding()
    readonly hero: RenderingContext[];

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content section",
     *   "helpText": "Add more related body content, lists, or images.",
     *   "key": "contentSection",
     *   "label": "Content section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.contentSection', [])
    readonly onContentSection: Observable<RenderingContext[]>;

    /*
     * @see #onContentSection
     */
    @RenderingContextBinding()
    readonly contentSection: RenderingContext[];

    protected constructor() {
        super();
    }
}