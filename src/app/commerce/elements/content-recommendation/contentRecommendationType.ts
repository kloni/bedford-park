/**
 * Do not modify this file, it is auto-generated.
 */
import { EspotPickerPaletteElementType, SingleEspotPickerPaletteElementElement, isSingleEspotPickerPaletteElementElement } from './../espot-picker-palette-element/espotPickerPaletteElementType';
import { GroupElement, SingleTextElement, isMultiGroupElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_HEADING = 'heading';
export const KEY_E_SPOT = 'eSpot';

/*
 * @name Content Recommendation
 * @id com.ibm.commerce.store.angular-types.content-recommendation
 * @description Displays content from a rule defined in precision marketing
 */
export interface ContentRecommendation {

    /**
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Title"
     * }
    */
    ['heading']?: SingleTextElement;

    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: SingleEspotPickerPaletteElementElement;
}

export interface ContentRecommendationElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.content-recommendation'
    };
}

export interface SingleContentRecommendationElement extends ContentRecommendationElement {
    value: ContentRecommendation;
}

export interface MultiContentRecommendationElement extends ContentRecommendationElement {
    values: ContentRecommendation[];
}

/**
 * Tests if the value is of type ContentRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type ContentRecommendationElement else false
*/
export function isContentRecommendation(aValue: any): aValue is ContentRecommendation {
    return !!aValue
        && (!aValue[KEY_HEADING] || isSingleTextElement(aValue[KEY_HEADING]))
        && (!aValue[KEY_E_SPOT] || isSingleEspotPickerPaletteElementElement(aValue[KEY_E_SPOT]))
        ;
}

/**
 * Tests if the value is of type SingleContentRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleContentRecommendationElement else false
*/
export function isSingleContentRecommendationElement(aValue: any): aValue is SingleContentRecommendationElement {
    return isSingleGroupElement(aValue) && isContentRecommendation(aValue.value);
}

/**
 * Tests if the value is of type MultiContentRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiContentRecommendationElement else false
*/
export function isMultiContentRecommendationElement(aValue: any): aValue is MultiContentRecommendationElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isContentRecommendation);
}

/*
 * @name Content Recommendation
 * @id com.ibm.commerce.store.angular-types.content-recommendation
 * @description Displays content from a rule defined in precision marketing
 */
export interface ContentRecommendationType {

    /**
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Title"
     * }
    */
    ['heading']?: string;

    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: EspotPickerPaletteElementType;
}