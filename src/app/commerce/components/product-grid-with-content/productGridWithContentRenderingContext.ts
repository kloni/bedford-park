/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { KEY_INSERTED_CONTENT, ProductGridWithContent, isProductGridWithContent } from './../../elements/product-grid-with-content/productGridWithContentType';

/*
 * @name Product grid with content
 * @id 288785b2-6651-46db-bfde-fe8562804cd9
 */
export interface ProductGridWithContentRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: '288785b2-6651-46db-bfde-fe8562804cd9';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Product grid with content';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: ProductGridWithContent;

    references: {
    /**
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "insertedContent",
     *   "label": "Inserted Content",
     *   "minimumValues": 0,
     *   "restrictTypes": [
     *     {
     *       "id": "7e7b2096-031b-4ad1-8886-b0be506086eb"
     *     }
     *   ]
     * }
    */
    ['insertedContent']?: RenderingContext[];
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link ProductGridWithContentRenderingContext } else false
 */
export function isProductGridWithContentRenderingContext(aContext: RenderingContext): aContext is ProductGridWithContentRenderingContext {
    return !!aContext && isProductGridWithContent(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link ProductGridWithContentRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link ProductGridWithContentRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertProductGridWithContentRenderingContext);
 */
export function assertProductGridWithContentRenderingContext(aContext: RenderingContext): ProductGridWithContentRenderingContext {
    // test if the context is as expected
    if (isProductGridWithContentRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('ProductGridWithContentRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link ProductGridWithContentRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opProductGridWithContentRenderingContext());
 */
export const opProductGridWithContentRenderingContext = () => map<RenderingContext, ProductGridWithContentRenderingContext>(assertProductGridWithContentRenderingContext);