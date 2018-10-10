/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Link,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Shoppingcart
 * @id com.ibm.commerce.store.angular-types.shoppingcart
 */
export abstract class AbstractShoppingcartComponent extends AbstractRenderingComponent {

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
     *   "elementType": "toggle",
     *   "key": "enablePromotionCode",
     *   "label": "Enable promotion code"
     * }
     */
    @RenderingContextBinding('toggle.enablePromotionCode', false)
    readonly onEnablePromotionCode: Observable<boolean>;

    /*
     * @see #onEnablePromotionCode
     */
    @RenderingContextBinding()
    readonly enablePromotionCode: boolean;

    protected constructor() {
        super();
    }
}
