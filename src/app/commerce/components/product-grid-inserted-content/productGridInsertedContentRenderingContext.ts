/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    SingleImageElement,
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { KEY_CONTENT, KEY_IMAGE, KEY_POSITION_AFTER, ProductGridInsertedContent, isProductGridInsertedContent } from './../../elements/product-grid-inserted-content/productGridInsertedContentType';

/*
 * @name Product Grid Inserted Content
 * @id 7e7b2096-031b-4ad1-8886-b0be506086eb
 */
export interface ProductGridInsertedContentRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: '7e7b2096-031b-4ad1-8886-b0be506086eb';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Product Grid Inserted Content';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: ProductGridInsertedContent;

    number: {
    /**
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "positionAfter",
     *   "label": "Position after",
     *   "minimum": 0,
     *   "required": true
     * }
    */
    ['positionAfter']: number;
    };

    image: {
    /**
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "key": "image",
     *   "label": "Image",
     *   "required": true
     * }
    */
    ['image']: SingleImageElement;
    };

    reference: {
    /**
     * {
     *   "elementType": "reference",
     *   "key": "content",
     *   "label": "Content",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.category-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.content-recommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productrecommendation"
     *     },
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.slideshow"
     *     }
     *   ]
     * }
    */
    ['content']?: RenderingContext;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link ProductGridInsertedContentRenderingContext } else false
 */
export function isProductGridInsertedContentRenderingContext(aContext: RenderingContext): aContext is ProductGridInsertedContentRenderingContext {
    return !!aContext && isProductGridInsertedContent(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link ProductGridInsertedContentRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link ProductGridInsertedContentRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertProductGridInsertedContentRenderingContext);
 */
export function assertProductGridInsertedContentRenderingContext(aContext: RenderingContext): ProductGridInsertedContentRenderingContext {
    // test if the context is as expected
    if (isProductGridInsertedContentRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('ProductGridInsertedContentRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link ProductGridInsertedContentRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opProductGridInsertedContentRenderingContext());
 */
export const opProductGridInsertedContentRenderingContext = () => map<RenderingContext, ProductGridInsertedContentRenderingContext>(assertProductGridInsertedContentRenderingContext);