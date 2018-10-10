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
 * @name Breadcrumb
 * @id com.ibm.commerce.store.angular-types.breadcrumb
 */
export abstract class AbstractBreadcrumbComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "toggle",
     *   "key": "longestPossiblePath",
     *   "label": "longest possible path",
     *   "required": true
     * }
     */
    @RenderingContextBinding('toggle.longestPossiblePath')
    readonly onLongestPossiblePath: Observable<boolean>;

    /*
     * @see #onLongestPossiblePath
     */
    @RenderingContextBinding()
    readonly longestPossiblePath: boolean;

    protected constructor() {
        super();
    }
}
