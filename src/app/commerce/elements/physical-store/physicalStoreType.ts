/**
 * Do not modify this file, it is auto-generated.
 */
import { Category, CategoryElement, GroupElement, Location, LocationElement, SingleFormattedTextElement, SingleTextElement, isCategoryElement, isLocationElement, isMultiGroupElement, isSingleFormattedTextElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_IDENTIFIER = 'identifier';
export const KEY_NAME = 'name';
export const KEY_ADDRESS = 'address';
export const KEY_COORDINATES = 'coordinates';
export const KEY_PHONE_NUMBER = 'phoneNumber';
export const KEY_SERVICES = 'services';
export const KEY_HOURS = 'hours';

/*
 * @name Physical store
 * @id com.ibm.commerce.store.angular-types.physical-store
 */
export interface PhysicalStore {

    /**
     * {
     *   "elementType": "text",
     *   "key": "identifier",
     *   "label": "Identifier",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['identifier']: SingleTextElement;

    /**
     * {
     *   "elementType": "text",
     *   "key": "name",
     *   "label": "Name",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['name']: SingleTextElement;

    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "address",
     *   "label": "Address",
     *   "required": true
     * }
    */
    ['address']: SingleFormattedTextElement;

    /**
     * {
     *   "elementType": "location",
     *   "key": "coordinates",
     *   "label": "Coordinates",
     *   "required": true
     * }
    */
    ['coordinates']: LocationElement;

    /**
     * {
     *   "elementType": "text",
     *   "key": "phoneNumber",
     *   "label": "Phone number"
     * }
    */
    ['phoneNumber']?: SingleTextElement;

    /**
     * {
     *   "elementType": "category",
     *   "key": "services",
     *   "label": "Services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
    */
    ['services']?: CategoryElement;

    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "hours",
     *   "label": "Hours"
     * }
    */
    ['hours']?: SingleFormattedTextElement;
}

export interface PhysicalStoreElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.physical-store'
    };
}

export interface SinglePhysicalStoreElement extends PhysicalStoreElement {
    value: PhysicalStore;
}

export interface MultiPhysicalStoreElement extends PhysicalStoreElement {
    values: PhysicalStore[];
}

/**
 * Tests if the value is of type PhysicalStoreElement
 *
 * @param aValue the value to test
 * @return true if the value if of type PhysicalStoreElement else false
*/
export function isPhysicalStore(aValue: any): aValue is PhysicalStore {
    return !!aValue
        && isSingleTextElement(aValue[KEY_IDENTIFIER])
        && isSingleTextElement(aValue[KEY_NAME])
        && isSingleFormattedTextElement(aValue[KEY_ADDRESS])
        && isLocationElement(aValue[KEY_COORDINATES])
        && (!aValue[KEY_PHONE_NUMBER] || isSingleTextElement(aValue[KEY_PHONE_NUMBER]))
        && (!aValue[KEY_SERVICES] || isCategoryElement(aValue[KEY_SERVICES]))
        && (!aValue[KEY_HOURS] || isSingleFormattedTextElement(aValue[KEY_HOURS]))
        ;
}

/**
 * Tests if the value is of type SinglePhysicalStoreElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SinglePhysicalStoreElement else false
*/
export function isSinglePhysicalStoreElement(aValue: any): aValue is SinglePhysicalStoreElement {
    return isSingleGroupElement(aValue) && isPhysicalStore(aValue.value);
}

/**
 * Tests if the value is of type MultiPhysicalStoreElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiPhysicalStoreElement else false
*/
export function isMultiPhysicalStoreElement(aValue: any): aValue is MultiPhysicalStoreElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isPhysicalStore);
}

/*
 * @name Physical store
 * @id com.ibm.commerce.store.angular-types.physical-store
 */
export interface PhysicalStoreType {

    /**
     * {
     *   "elementType": "text",
     *   "key": "identifier",
     *   "label": "Identifier",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['identifier']: string;

    /**
     * {
     *   "elementType": "text",
     *   "key": "name",
     *   "label": "Name",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['name']: string;

    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "address",
     *   "label": "Address",
     *   "required": true
     * }
    */
    ['address']: string;

    /**
     * {
     *   "elementType": "location",
     *   "key": "coordinates",
     *   "label": "Coordinates",
     *   "required": true
     * }
    */
    ['coordinates']: Location;

    /**
     * {
     *   "elementType": "text",
     *   "key": "phoneNumber",
     *   "label": "Phone number"
     * }
    */
    ['phoneNumber']?: string;

    /**
     * {
     *   "elementType": "category",
     *   "key": "services",
     *   "label": "Services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
    */
    ['services']?: Category;

    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "hours",
     *   "label": "Hours"
     * }
    */
    ['hours']?: string;
}