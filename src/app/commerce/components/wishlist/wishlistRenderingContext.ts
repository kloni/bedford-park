/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { Wishlist, isWishlist } from './../../elements/wishlist/wishlistType';

/*
 * @name Wishlist
 * @id com.ibm.commerce.store.angular-types.wishlist
 */
export interface WishlistRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.wishlist';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Wishlist';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: Wishlist;

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link WishlistRenderingContext } else false
 */
export function isWishlistRenderingContext(aContext: RenderingContext): aContext is WishlistRenderingContext {
    return !!aContext && isWishlist(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link WishlistRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link WishlistRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertWishlistRenderingContext);
 */
export function assertWishlistRenderingContext(aContext: RenderingContext): WishlistRenderingContext {
    // test if the context is as expected
    if (isWishlistRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('WishlistRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link WishlistRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opWishlistRenderingContext());
 */
export const opWishlistRenderingContext = () => map<RenderingContext, WishlistRenderingContext>(assertWishlistRenderingContext);