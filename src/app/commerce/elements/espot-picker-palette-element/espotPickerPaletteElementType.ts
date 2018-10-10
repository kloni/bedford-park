/**
 * Do not modify this file, it is auto-generated.
 */
import { GroupElement, MultiTextElement, SingleTextElement, isMultiGroupElement, isMultiTextElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_SELECTION = 'selection';
export const KEY_TYPE = 'type';

/*
 * @name Espot Picker Palette Element
 * @id com.ibm.commerce.store.type.espot-picker-palette-element
 */
export interface EspotPickerPaletteElement {

    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "text",
     *   "key": "selection",
     *   "label": "Selection"
     * }
    */
    ['selection']?: MultiTextElement;

    /**
     * {
     *   "elementType": "text",
     *   "key": "type",
     *   "label": "Type"
     * }
    */
    ['type']?: SingleTextElement;
}

export interface EspotPickerPaletteElementElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.type.espot-picker-palette-element'
    };
}

export interface SingleEspotPickerPaletteElementElement extends EspotPickerPaletteElementElement {
    value: EspotPickerPaletteElement;
}

export interface MultiEspotPickerPaletteElementElement extends EspotPickerPaletteElementElement {
    values: EspotPickerPaletteElement[];
}

/**
 * Tests if the value is of type EspotPickerPaletteElementElement
 *
 * @param aValue the value to test
 * @return true if the value if of type EspotPickerPaletteElementElement else false
*/
export function isEspotPickerPaletteElement(aValue: any): aValue is EspotPickerPaletteElement {
    return !!aValue
        && (!aValue[KEY_SELECTION] || isMultiTextElement(aValue[KEY_SELECTION]))
        && (!aValue[KEY_TYPE] || isSingleTextElement(aValue[KEY_TYPE]))
        ;
}

/**
 * Tests if the value is of type SingleEspotPickerPaletteElementElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleEspotPickerPaletteElementElement else false
*/
export function isSingleEspotPickerPaletteElementElement(aValue: any): aValue is SingleEspotPickerPaletteElementElement {
    return isSingleGroupElement(aValue) && isEspotPickerPaletteElement(aValue.value);
}

/**
 * Tests if the value is of type MultiEspotPickerPaletteElementElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiEspotPickerPaletteElementElement else false
*/
export function isMultiEspotPickerPaletteElementElement(aValue: any): aValue is MultiEspotPickerPaletteElementElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isEspotPickerPaletteElement);
}

/*
 * @name Espot Picker Palette Element
 * @id com.ibm.commerce.store.type.espot-picker-palette-element
 */
export interface EspotPickerPaletteElementType {

    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "text",
     *   "key": "selection",
     *   "label": "Selection"
     * }
    */
    ['selection']?: string;

    /**
     * {
     *   "elementType": "text",
     *   "key": "type",
     *   "label": "Type"
     * }
    */
    ['type']?: string;
}