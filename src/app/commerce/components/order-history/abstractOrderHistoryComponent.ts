/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    AbstractRenderingComponent,RenderingContextBinding
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Order History
 * @id be47fe91-a25a-4892-8abf-b47cda70b89b
 * @author Adam.iem
 */
export abstract class AbstractOrderHistoryComponent extends AbstractRenderingComponent {

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

    protected constructor() {
        super();
    }
}
