/**
 * Do not modify this file, it is auto-generated.
 */
import { GroupElement, SingleTextElement, isMultiGroupElement, isSingleGroupElement, isSingleTextElement } from 'ibm-wch-sdk-ng';

export const KEY_TITLE = 'title';

/*
 * @name Customer service representative
 * @id com.ibm.commerce.store.angular-types.csr
 * @description Perform tasks as a customer service representative (CSR)
 */
export interface CustomerServiceRepresentative {

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
}

export interface CustomerServiceRepresentativeElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.csr'
    };
}

export interface SingleCustomerServiceRepresentativeElement extends CustomerServiceRepresentativeElement {
    value: CustomerServiceRepresentative;
}

export interface MultiCustomerServiceRepresentativeElement extends CustomerServiceRepresentativeElement {
    values: CustomerServiceRepresentative[];
}

/**
 * Tests if the value is of type CustomerServiceRepresentativeElement
 *
 * @param aValue the value to test
 * @return true if the value if of type CustomerServiceRepresentativeElement else false
*/
export function isCustomerServiceRepresentative(aValue: any): aValue is CustomerServiceRepresentative {
    return !!aValue
        && isSingleTextElement(aValue[KEY_TITLE])
        ;
}

/**
 * Tests if the value is of type SingleCustomerServiceRepresentativeElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleCustomerServiceRepresentativeElement else false
*/
export function isSingleCustomerServiceRepresentativeElement(aValue: any): aValue is SingleCustomerServiceRepresentativeElement {
    return isSingleGroupElement(aValue) && isCustomerServiceRepresentative(aValue.value);
}

/**
 * Tests if the value is of type MultiCustomerServiceRepresentativeElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiCustomerServiceRepresentativeElement else false
*/
export function isMultiCustomerServiceRepresentativeElement(aValue: any): aValue is MultiCustomerServiceRepresentativeElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isCustomerServiceRepresentative);
}

/*
 * @name Customer service representative
 * @id com.ibm.commerce.store.angular-types.csr
 * @description Perform tasks as a customer service representative (CSR)
 */
export interface CustomerServiceRepresentativeType {

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
}