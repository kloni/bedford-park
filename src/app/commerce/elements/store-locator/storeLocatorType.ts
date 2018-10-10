/**
 * Do not modify this file, it is auto-generated.
 */
import { Category, CategoryElement, GroupElement, SingleTextElement, isCategoryElement, isMultiGroupElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_TITLE = 'title';
export const KEY_AVAILABLE_SERVICES = 'availableServices';

/*
 * @name Store locator
 * @id com.ibm.commerce.store.angular-types.store-locator
 */
export interface StoreLocator {

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

export interface StoreLocatorElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.store-locator'
    };
}

export interface SingleStoreLocatorElement extends StoreLocatorElement {
    value: StoreLocator;
}

export interface MultiStoreLocatorElement extends StoreLocatorElement {
    values: StoreLocator[];
}

/**
 * Tests if the value is of type StoreLocatorElement
 *
 * @param aValue the value to test
 * @return true if the value if of type StoreLocatorElement else false
*/
export function isStoreLocator(aValue: any): aValue is StoreLocator {
    return !!aValue
        && isSingleTextElement(aValue[KEY_TITLE])
        && (!aValue[KEY_AVAILABLE_SERVICES] || isCategoryElement(aValue[KEY_AVAILABLE_SERVICES]))
        ;
}

/**
 * Tests if the value is of type SingleStoreLocatorElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleStoreLocatorElement else false
*/
export function isSingleStoreLocatorElement(aValue: any): aValue is SingleStoreLocatorElement {
    return isSingleGroupElement(aValue) && isStoreLocator(aValue.value);
}

/**
 * Tests if the value is of type MultiStoreLocatorElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiStoreLocatorElement else false
*/
export function isMultiStoreLocatorElement(aValue: any): aValue is MultiStoreLocatorElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isStoreLocator);
}

/*
 * @name Store locator
 * @id com.ibm.commerce.store.angular-types.store-locator
 */
export interface StoreLocatorType {

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