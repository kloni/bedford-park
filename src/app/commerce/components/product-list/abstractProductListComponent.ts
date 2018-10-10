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
 * @name Product list
 * @id com.ibm.commerce.store.angular-types.productlist
 * @description Uses a two column layout with a 25/75% split in column width of Filters and Products respectively. Second products column is then split into 3 columns.
 */
export abstract class AbstractProductListComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Top content section",
     *   "key": "topContentSection",
     *   "label": "Top content section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.topContentSection', [])
    readonly onTopContentSection: Observable<RenderingContext[]>;

    /*
     * @see #onTopContentSection
     */
    @RenderingContextBinding()
    readonly topContentSection: RenderingContext[];

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Left navigation section",
     *   "key": "leftNavigationSection",
     *   "label": "Left navigation section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.leftNavigationSection', [])
    readonly onLeftNavigationSection: Observable<RenderingContext[]>;

    /*
     * @see #onLeftNavigationSection
     */
    @RenderingContextBinding()
    readonly leftNavigationSection: RenderingContext[];

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Right content section",
     *   "key": "rightContentSection",
     *   "label": "Right content section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.rightContentSection', [])
    readonly onRightContentSection: Observable<RenderingContext[]>;

    /*
     * @see #onRightContentSection
     */
    @RenderingContextBinding()
    readonly rightContentSection: RenderingContext[];

    protected constructor() {
        super();
    }
}