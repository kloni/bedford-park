/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { CheckoutRenderingContext, assertCheckoutRenderingContext, isCheckoutRenderingContext } from './checkoutRenderingContext';
import { AbstractRenderingComponent, Category, Image, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Checkout
 * @id com.ibm.commerce.store.angular-types.checkout
 */
abstract class AbstractCheckoutComponent extends AbstractRenderingComponent {

    /**
    * Strongly typed stream of the rendering contexts
    */
    readonly onRenderingContext: Observable<RenderingContext>;

    /**
    * Strongly typed rendering context
    */
    renderingContext: RenderingContext;

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

    /*
     * {
     *   "elementType": "image",
     *   "key": "creditCardImage",
     *   "label": "credit card"
     * }
     */
    @RenderingContextBinding('image.creditCardImage')
    readonly onCreditCardImage: Observable<Image>;

    /*
     * @see #onCreditCardImage
     */
    @RenderingContextBinding()
    readonly creditCardImage: Image;

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
     *   "allowMultipleValues": false,
     *   "elementType": "category",
     *   "key": "availableServices",
     *   "label": "Available services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
     */
    @RenderingContextBinding('category.availableServices')
    readonly onAvailableServices: Observable<Category>;

    /*
     * @see #onAvailableServices
     */
    @RenderingContextBinding()
    readonly availableServices: Category;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    CheckoutRenderingContext,
    isCheckoutRenderingContext,
    assertCheckoutRenderingContext,
    AbstractCheckoutComponent
};