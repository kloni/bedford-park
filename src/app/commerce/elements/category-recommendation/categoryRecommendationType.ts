/**
 * Do not modify this file, it is auto-generated.
 */
import { EspotPickerPaletteElementType, SingleEspotPickerPaletteElementElement, isSingleEspotPickerPaletteElementElement } from './../espot-picker-palette-element/espotPickerPaletteElementType';
import { GroupElement, SingleTextElement, isMultiGroupElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_TITLE = 'title';
export const KEY_E_SPOT = 'eSpot';

/*
 * @name Category recommendation
 * @id com.ibm.commerce.store.angular-types.category-recommendation
 * @description List of categories from the catalog system generated from a rule defined in precision marketing
 */
export interface CategoryRecommendation {

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
     *   "label": "E-Marketing spot",
     *   "required": true,
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']: SingleEspotPickerPaletteElementElement;
}

export interface CategoryRecommendationElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.category-recommendation'
    };
}

export interface SingleCategoryRecommendationElement extends CategoryRecommendationElement {
    value: CategoryRecommendation;
}

export interface MultiCategoryRecommendationElement extends CategoryRecommendationElement {
    values: CategoryRecommendation[];
}

/**
 * Tests if the value is of type CategoryRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type CategoryRecommendationElement else false
*/
export function isCategoryRecommendation(aValue: any): aValue is CategoryRecommendation {
    return !!aValue
        && (!aValue[KEY_TITLE] || isSingleTextElement(aValue[KEY_TITLE]))
        && isSingleEspotPickerPaletteElementElement(aValue[KEY_E_SPOT])
        ;
}

/**
 * Tests if the value is of type SingleCategoryRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleCategoryRecommendationElement else false
*/
export function isSingleCategoryRecommendationElement(aValue: any): aValue is SingleCategoryRecommendationElement {
    return isSingleGroupElement(aValue) && isCategoryRecommendation(aValue.value);
}

/**
 * Tests if the value is of type MultiCategoryRecommendationElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiCategoryRecommendationElement else false
*/
export function isMultiCategoryRecommendationElement(aValue: any): aValue is MultiCategoryRecommendationElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isCategoryRecommendation);
}

/*
 * @name Category recommendation
 * @id com.ibm.commerce.store.angular-types.category-recommendation
 * @description List of categories from the catalog system generated from a rule defined in precision marketing
 */
export interface CategoryRecommendationType {

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
     *   "label": "E-Marketing spot",
     *   "required": true,
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']: EspotPickerPaletteElementType;
}