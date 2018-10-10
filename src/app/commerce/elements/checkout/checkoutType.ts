/**
 * Do not modify this file, it is auto-generated.
 */
import { Category, CategoryElement, GroupElement, Image, SingleImageElement, SingleTextElement, SingleToggleElement, isCategoryElement, isMultiGroupElement, isSingleGroupElement, isSingleImageElement, isSingleTextElement, isSingleToggleElement } from 'ibm-wch-sdk-ng';

export const KEY_ENABLE_PROMOTION_CODE = 'enablePromotionCode';
export const KEY_CREDIT_CARD_IMAGE = 'creditCardImage';
export const KEY_TITLE = 'title';
export const KEY_AVAILABLE_SERVICES = 'availableServices';

/*
 * @name Checkout
 * @id com.ibm.commerce.store.angular-types.checkout
 */
export interface Checkout {

    /**
     * {
     *   "elementType": "toggle",
     *   "key": "enablePromotionCode",
     *   "label": "Enable promotion code"
     * }
    */
    ['enablePromotionCode']?: SingleToggleElement;

    /**
     * {
     *   "elementType": "image",
     *   "key": "creditCardImage",
     *   "label": "credit card"
     * }
    */
    ['creditCardImage']?: SingleImageElement;

    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['title']: SingleTextElement;

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
}

export interface CheckoutElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.checkout'
    };
}

export interface SingleCheckoutElement extends CheckoutElement {
    value: Checkout;
}

export interface MultiCheckoutElement extends CheckoutElement {
    values: Checkout[];
}

/**
 * Tests if the value is of type CheckoutElement
 *
 * @param aValue the value to test
 * @return true if the value if of type CheckoutElement else false
*/
export function isCheckout(aValue: any): aValue is Checkout {
    return !!aValue
        && (!aValue[KEY_ENABLE_PROMOTION_CODE] || isSingleToggleElement(aValue[KEY_ENABLE_PROMOTION_CODE]))
        && (!aValue[KEY_CREDIT_CARD_IMAGE] || isSingleImageElement(aValue[KEY_CREDIT_CARD_IMAGE]))
        && isSingleTextElement(aValue[KEY_TITLE])
        && (!aValue[KEY_AVAILABLE_SERVICES] || isCategoryElement(aValue[KEY_AVAILABLE_SERVICES]))
        ;
}

/**
 * Tests if the value is of type SingleCheckoutElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleCheckoutElement else false
*/
export function isSingleCheckoutElement(aValue: any): aValue is SingleCheckoutElement {
    return isSingleGroupElement(aValue) && isCheckout(aValue.value);
}

/**
 * Tests if the value is of type MultiCheckoutElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiCheckoutElement else false
*/
export function isMultiCheckoutElement(aValue: any): aValue is MultiCheckoutElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isCheckout);
}

/*
 * @name Checkout
 * @id com.ibm.commerce.store.angular-types.checkout
 */
export interface CheckoutType {

    /**
     * {
     *   "elementType": "toggle",
     *   "key": "enablePromotionCode",
     *   "label": "Enable promotion code"
     * }
    */
    ['enablePromotionCode']?: boolean;

    /**
     * {
     *   "elementType": "image",
     *   "key": "creditCardImage",
     *   "label": "credit card"
     * }
    */
    ['creditCardImage']?: Image;

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
    ['availableServices']?: Category;
}