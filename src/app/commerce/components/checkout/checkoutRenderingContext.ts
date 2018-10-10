/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    CategoryElement,
    SingleImageElement,
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Checkout, KEY_AVAILABLE_SERVICES, KEY_CREDIT_CARD_IMAGE, KEY_ENABLE_PROMOTION_CODE, KEY_TITLE, isCheckout } from './../../elements/checkout/checkoutType';

/*
 * @name Checkout
 * @id com.ibm.commerce.store.angular-types.checkout
 */
export interface CheckoutRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.checkout';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Checkout';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: Checkout;

    toggle: {
    /**
     * {
     *   "elementType": "toggle",
     *   "key": "enablePromotionCode",
     *   "label": "Enable promotion code"
     * }
    */
    ['enablePromotionCode']?: boolean;
    };

    image: {
    /**
     * {
     *   "elementType": "image",
     *   "key": "creditCardImage",
     *   "label": "credit card"
     * }
    */
    ['creditCardImage']?: SingleImageElement;
    };

    text: {
    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['title']: string;
    };

    category: {
    /**
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
    ['availableServices']?: CategoryElement;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link CheckoutRenderingContext } else false
 */
export function isCheckoutRenderingContext(aContext: RenderingContext): aContext is CheckoutRenderingContext {
    return !!aContext && isCheckout(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link CheckoutRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link CheckoutRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertCheckoutRenderingContext);
 */
export function assertCheckoutRenderingContext(aContext: RenderingContext): CheckoutRenderingContext {
    // test if the context is as expected
    if (isCheckoutRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('CheckoutRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link CheckoutRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opCheckoutRenderingContext());
 */
export const opCheckoutRenderingContext = () => map<RenderingContext, CheckoutRenderingContext>(assertCheckoutRenderingContext);