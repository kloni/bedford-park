/**
 * Do not modify this file, it is auto-generated.
 */
import { EspotPickerPaletteElementType, SingleEspotPickerPaletteElementElement, isSingleEspotPickerPaletteElementElement } from './../espot-picker-palette-element/espotPickerPaletteElementType';
import { GroupElement, SingleTextElement, isMultiGroupElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_TITLE = 'title';
export const KEY_E_SPOT = 'eSpot';

/*
 * @name Product recommendation
 * @id com.ibm.commerce.store.angular-types.productrecommendation
 * @description List of products from the catalog system generated from a rule defined in precision marketing
 */
export interface ProductRecommendation {

    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title"
     * }
    */
    ['title']?: SingleTextElement;

    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing Spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: SingleEspotPickerPaletteElementElement;
}

export interface ProductRecommendationElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.productrecommendation'
    };
}

export interface SingleProductRecommendationElement extends ProductRecommendationElement {
    value: ProductRecommendation;
}

export interface MultiProductRecommendationElement extends ProductRecommendationElement {
    values: ProductRecommendation[];
}

/**
 * Tests if the value is of type ProductRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type ProductRecommendationElement else false
*/
export function isProductRecommendation(aValue: any): aValue is ProductRecommendation {
    return !!aValue
        && (!aValue[KEY_TITLE] || isSingleTextElement(aValue[KEY_TITLE]))
        && (!aValue[KEY_E_SPOT] || isSingleEspotPickerPaletteElementElement(aValue[KEY_E_SPOT]))
        ;
}

/**
 * Tests if the value is of type SingleProductRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleProductRecommendationElement else false
*/
export function isSingleProductRecommendationElement(aValue: any): aValue is SingleProductRecommendationElement {
    return isSingleGroupElement(aValue) && isProductRecommendation(aValue.value);
}

/**
 * Tests if the value is of type MultiProductRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiProductRecommendationElement else false
*/
export function isMultiProductRecommendationElement(aValue: any): aValue is MultiProductRecommendationElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isProductRecommendation);
}

/*
 * @name Product recommendation
 * @id com.ibm.commerce.store.angular-types.productrecommendation
 * @description List of products from the catalog system generated from a rule defined in precision marketing
 */
export interface ProductRecommendationType {

    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title"
     * }
    */
    ['title']?: string;

    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing Spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: EspotPickerPaletteElementType;
}