/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { WishlistRenderingContext, assertWishlistRenderingContext, isWishlistRenderingContext } from './wishlistRenderingContext';
import { AbstractRenderingComponent, RenderingContext } from 'ibm-wch-sdk-ng';

/*
 * @name Wishlist
 * @id com.ibm.commerce.store.angular-types.wishlist
 */
abstract class AbstractWishlistComponent extends AbstractRenderingComponent {

    /**
    * Strongly typed stream of the rendering contexts
    */
    readonly onRenderingContext: Observable<RenderingContext>;

    /**
    * Strongly typed rendering context
    */
    renderingContext: RenderingContext;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    WishlistRenderingContext,
    isWishlistRenderingContext,
    assertWishlistRenderingContext,
    AbstractWishlistComponent
};