/**
 * Do not modify this file, it is auto-generated.
 */
import { Category, GroupElement, isMultiGroupElement, isSingleGroupElement, isCategoryElement, CategoryElement } from 'ibm-wch-sdk-ng';

export const KEY_AVAILABLE_SERVICES = 'availableServices';

/*
 * @name Product
 * @id com.ibm.commerce.store.angular-types.product
 */
export interface Product {

    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "category",
     *   "key": "availableServices",
     *   "label": "Available services",
     *   "minimumValues": 0,
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
    */
    ['availableServices']?: CategoryElement;
}

export interface ProductElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.product'
    };
}

export interface SingleProductElement extends ProductElement {
    value: Product;
}

export interface MultiProductElement extends ProductElement {
    values: Product[];
}

/**
 * Tests if the value is of type ProductElement
 *
 * @param aValue the value to test
 * @return true if the value if of type ProductElement else false
*/
export function isProduct(aValue: any): aValue is Product {
    return !!aValue
        && (!aValue[KEY_AVAILABLE_SERVICES] || isCategoryElement(aValue[KEY_AVAILABLE_SERVICES]))
        ;
}

/**
 * Tests if the value is of type SingleProductElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleProductElement else false
*/
export function isSingleProductElement(aValue: any): aValue is SingleProductElement {
    return isSingleGroupElement(aValue) && isProduct(aValue.value);
}

/**
 * Tests if the value is of type MultiProductElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiProductElement else false
*/
export function isMultiProductElement(aValue: any): aValue is MultiProductElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isProduct);
}

/*
 * @name Product
 * @id com.ibm.commerce.store.angular-types.product
 */
export interface ProductType {

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