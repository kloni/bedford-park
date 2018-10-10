/**
 * Do not modify this file, it is auto-generated.
 */
import { MultiProductGridInsertedContentElement, ProductGridInsertedContentType, isMultiProductGridInsertedContentElement } from './../product-grid-inserted-content/productGridInsertedContentType';
import { GroupElement, isMultiGroupElement, isSingleGroupElement } from 'ibm-wch-sdk-ng';

export const KEY_INSERTED = 'inserted';

/*
 * @name Product grid with content
 * @id 288785b2-6651-46db-bfde-fe8562804cd9
 */
export interface ProductGridWithContent {

    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "group",
     *   "fieldLabel": "Custom Element",
     *   "key": "inserted",
     *   "label": "Content to insert",
     *   "minimumValues": 1,
     *   "required": true,
     *   "typeRef": {
     *     "id": "7e7b2096-031b-4ad1-8886-b0be506086eb"
     *   }
     * }
    */
    ['inserted']: MultiProductGridInsertedContentElement;
}

export interface ProductGridWithContentElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: '288785b2-6651-46db-bfde-fe8562804cd9'
    };
}

export interface SingleProductGridWithContentElement extends ProductGridWithContentElement {
    value: ProductGridWithContent;
}

export interface MultiProductGridWithContentElement extends ProductGridWithContentElement {
    values: ProductGridWithContent[];
}

/**
 * Tests if the value is of type ProductGridWithContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type ProductGridWithContentElement else false
*/
export function isProductGridWithContent(aValue: any): aValue is ProductGridWithContent {
    return !!aValue
        && isMultiProductGridInsertedContentElement(aValue[KEY_INSERTED])
        ;
}

/**
 * Tests if the value is of type SingleProductGridWithContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleProductGridWithContentElement else false
*/
export function isSingleProductGridWithContentElement(aValue: any): aValue is SingleProductGridWithContentElement {
    return isSingleGroupElement(aValue) && isProductGridWithContent(aValue.value);
}

/**
 * Tests if the value is of type MultiProductGridWithContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiProductGridWithContentElement else false
*/
export function isMultiProductGridWithContentElement(aValue: any): aValue is MultiProductGridWithContentElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isProductGridWithContent);
}

/*
 * @name Product grid with content
 * @id 288785b2-6651-46db-bfde-fe8562804cd9
 */
export interface ProductGridWithContentType {

    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "group",
     *   "fieldLabel": "Custom Element",
     *   "key": "inserted",
     *   "label": "Content to insert",
     *   "minimumValues": 1,
     *   "required": true,
     *   "typeRef": {
     *     "id": "7e7b2096-031b-4ad1-8886-b0be506086eb"
     *   }
     * }
    */
    ['inserted']: ProductGridInsertedContentType;
}