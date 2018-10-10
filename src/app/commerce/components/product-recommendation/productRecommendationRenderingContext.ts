/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { EspotPickerPaletteElementType } from './../../elements/espot-picker-palette-element/espotPickerPaletteElementType';
import { KEY_E_SPOT, KEY_TITLE, ProductRecommendation, isProductRecommendation } from './../../elements/product-recommendation/productRecommendationType';

/*
 * @name Product recommendation
 * @id com.ibm.commerce.store.angular-types.productrecommendation
 * @description List of products from the catalog system generated from a rule defined in precision marketing
 */
export interface ProductRecommendationRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.productrecommendation';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Product recommendation';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: ProductRecommendation;

    text: {
    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title"
     * }
    */
    ['title']?: string;
    };

    group: {
    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing Spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: EspotPickerPaletteElementType;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link ProductRecommendationRenderingContext } else false
 */
export function isProductRecommendationRenderingContext(aContext: RenderingContext): aContext is ProductRecommendationRenderingContext {
    return !!aContext && isProductRecommendation(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link ProductRecommendationRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link ProductRecommendationRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertProductRecommendationRenderingContext);
 */
export function assertProductRecommendationRenderingContext(aContext: RenderingContext): ProductRecommendationRenderingContext {
    // test if the context is as expected
    if (isProductRecommendationRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('ProductRecommendationRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link ProductRecommendationRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opProductRecommendationRenderingContext());
 */
export const opProductRecommendationRenderingContext = () => map<RenderingContext, ProductRecommendationRenderingContext>(assertProductRecommendationRenderingContext);