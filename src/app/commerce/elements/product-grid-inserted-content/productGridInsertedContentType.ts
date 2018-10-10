/**
 * Do not modify this file, it is auto-generated.
 */
import { GroupElement, Image, RenderingContext, SingleImageElement, SingleNumberElement, SingleReferenceElement, isMultiGroupElement, isSingleGroupElement, isSingleImageElement, isSingleNumberElement, isSingleReferenceElement } from 'ibm-wch-sdk-ng';

export const KEY_POSITION_AFTER = 'positionAfter';
export const KEY_IMAGE = 'image';
export const KEY_CONTENT = 'content';

/*
 * @name Product Grid Inserted Content
 * @id 7e7b2096-031b-4ad1-8886-b0be506086eb
 */
export interface ProductGridInsertedContent {

    /**
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "positionAfter",
     *   "label": "Position after",
     *   "minimum": 0,
     *   "required": true
     * }
    */
    ['positionAfter']: SingleNumberElement;

    /**
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "key": "image",
     *   "label": "Image",
     *   "required": true
     * }
    */
    ['image']: SingleImageElement;

    /**
     * {
     *   "elementType": "reference",
     *   "key": "content",
     *   "label": "Content",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.category-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.content-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productrecommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.slideshow"
     *     }
     *   ]
     * }
    */
    ['content']?: SingleReferenceElement;
}

export interface ProductGridInsertedContentElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: '7e7b2096-031b-4ad1-8886-b0be506086eb'
    };
}

export interface SingleProductGridInsertedContentElement extends ProductGridInsertedContentElement {
    value: ProductGridInsertedContent;
}

export interface MultiProductGridInsertedContentElement extends ProductGridInsertedContentElement {
    values: ProductGridInsertedContent[];
}

/**
 * Tests if the value is of type ProductGridInsertedContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type ProductGridInsertedContentElement else false
*/
export function isProductGridInsertedContent(aValue: any): aValue is ProductGridInsertedContent {
    return !!aValue
        && isSingleNumberElement(aValue[KEY_POSITION_AFTER])
        && isSingleImageElement(aValue[KEY_IMAGE])
        && (!aValue[KEY_CONTENT] || isSingleReferenceElement(aValue[KEY_CONTENT]))
        ;
}

/**
 * Tests if the value is of type SingleProductGridInsertedContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleProductGridInsertedContentElement else false
*/
export function isSingleProductGridInsertedContentElement(aValue: any): aValue is SingleProductGridInsertedContentElement {
    return isSingleGroupElement(aValue) && isProductGridInsertedContent(aValue.value);
}

/**
 * Tests if the value is of type MultiProductGridInsertedContentElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiProductGridInsertedContentElement else false
*/
export function isMultiProductGridInsertedContentElement(aValue: any): aValue is MultiProductGridInsertedContentElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isProductGridInsertedContent);
}

/*
 * @name Product Grid Inserted Content
 * @id 7e7b2096-031b-4ad1-8886-b0be506086eb
 */
export interface ProductGridInsertedContentType {

    /**
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "positionAfter",
     *   "label": "Position after",
     *   "minimum": 0,
     *   "required": true
     * }
    */
    ['positionAfter']: number;

    /**
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "key": "image",
     *   "label": "Image",
     *   "required": true
     * }
    */
    ['image']: Image;

    /**
     * {
     *   "elementType": "reference",
     *   "key": "content",
     *   "label": "Content",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.category-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.content-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productrecommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.slideshow"
     *     }
     *   ]
     * }
    */
    ['content']?: RenderingContext;
}