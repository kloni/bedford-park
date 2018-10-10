/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    OptionSelection,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Merchandising association
 * @id com.ibm.commerce.store.angular-types.merchandising-association
 */
export abstract class AbstractMerchandisingAssociationComponent extends AbstractRenderingComponent {

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
     *   "allowMultipleValues": true,
     *   "elementType": "optionselection",
     *   "key": "associationType",
     *   "label": "Association type(s)",
     *   "minimumValues": 1,
     *   "options": [
     *     {
     *       "label": "Accessory",
     *       "selection": "ACCESSORY"
     *     },
     *     {
     *       "label": "Cross sell",
     *       "selection": "X-SELL"
     *     },
     *     {
     *       "label": "Replacement",
     *       "selection": "REPLACEMENT"
     *     },
     *     {
     *       "label": "Up sell",
     *       "selection": "UPSELL"
     *     }
     *   ],
     *   "required": true
     * }
     */
    @RenderingContextBinding('optionselections.associationType')
    readonly onAssociationType: Observable<OptionSelection[]>;

    /*
     * @see #onAssociationType
     */
    @RenderingContextBinding()
    readonly associationType: OptionSelection[];

    protected constructor() {
        super();
    }
}
