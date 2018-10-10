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
 * @name Title
 * @id com.ibm.commerce.store.angular-types.title
 * @author wch user5
 */
export abstract class AbstractTitleComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "Title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.Title')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    protected constructor() {
        super();
    }
}
