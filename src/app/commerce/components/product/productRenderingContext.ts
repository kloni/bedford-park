/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    CategoryElement,
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { KEY_AVAILABLE_SERVICES, Product, isProduct } from './../../elements/product/productType';

/*
 * @name Product
 * @id com.ibm.commerce.store.angular-types.product
 */
export interface ProductRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.product';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Product';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: Product;

    category: {
    /**
     * {
     *   "elementType": "category",
     *   "key": "availableServices",
     *   "label": "Available services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
    */
    ['availableServices']?: CategoryElement;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link ProductRenderingContext } else false
 */
export function isProductRenderingContext(aContext: RenderingContext): aContext is ProductRenderingContext {
    return !!aContext && isProduct(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link ProductRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link ProductRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertProductRenderingContext);
 */
export function assertProductRenderingContext(aContext: RenderingContext): ProductRenderingContext {
    // test if the context is as expected
    if (isProductRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('ProductRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link ProductRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opProductRenderingContext());
 */
export const opProductRenderingContext = () => map<RenderingContext, ProductRenderingContext>(assertProductRenderingContext);