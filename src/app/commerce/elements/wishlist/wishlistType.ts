/**
 * Do not modify this file, it is auto-generated.
 */
import { GroupElement, isMultiGroupElement, isSingleGroupElement } from 'ibm-wch-sdk-ng';


/*
 * @name Wishlist
 * @id com.ibm.commerce.store.angular-types.wishlist
 */
export interface Wishlist {
}

export interface WishlistElement extends GroupElement {
    /**
    * Pin the type reference to the well known ID
    */
    typeRef: {
        id: 'com.ibm.commerce.store.angular-types.wishlist'
    };
}

export interface SingleWishlistElement extends WishlistElement {
    value: Wishlist;
}

export interface MultiWishlistElement extends WishlistElement {
    values: Wishlist[];
}

/**
 * Tests if the value is of type WishlistElement
 *
 * @param aValue the value to test
 * @return true if the value if of type WishlistElement else false
*/
export function isWishlist(aValue: any): aValue is Wishlist {
    return !!aValue;
}

/**
 * Tests if the value is of type SingleWishlistElement
 *
 * @param aValue the value to test
 * @return true if the value if of type SingleWishlistElement else false
*/
export function isSingleWishlistElement(aValue: any): aValue is SingleWishlistElement {
    return isSingleGroupElement(aValue) && isWishlist(aValue.value);
}

/**
 * Tests if the value is of type MultiWishlistElement
 *
 * @param aValue the value to test
 * @return true if the value if of type MultiWishlistElement else false
*/
export function isMultiWishlistElement(aValue: any): aValue is MultiWishlistElement {
    return isMultiGroupElement(aValue) && aValue.values.every(isWishlist);
}

/*
 * @name Wishlist
 * @id com.ibm.commerce.store.angular-types.wishlist
 */
export interface WishlistType {
}