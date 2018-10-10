/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { ContentRecommendation, KEY_E_SPOT, KEY_HEADING, isContentRecommendation } from './../../elements/content-recommendation/contentRecommendationType';
import { EspotPickerPaletteElementType } from './../../elements/espot-picker-palette-element/espotPickerPaletteElementType';

/*
 * @name Content Recommendation
 * @id com.ibm.commerce.store.angular-types.content-recommendation
 * @description Displays content from a rule defined in precision marketing
 */
export interface ContentRecommendationRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.content-recommendation';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Content Recommendation';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: ContentRecommendation;

    text: {
    /**
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Title"
     * }
    */
    ['heading']?: string;
    };

    group: {
    /**
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']?: EspotPickerPaletteElementType;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link ContentRecommendationRenderingContext } else false
 */
export function isContentRecommendationRenderingContext(aContext: RenderingContext): aContext is ContentRecommendationRenderingContext {
    return !!aContext && isContentRecommendation(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link ContentRecommendationRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link ContentRecommendationRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertContentRecommendationRenderingContext);
 */
export function assertContentRecommendationRenderingContext(aContext: RenderingContext): ContentRecommendationRenderingContext {
    // test if the context is as expected
    if (isContentRecommendationRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('ContentRecommendationRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link ContentRecommendationRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opContentRecommendationRenderingContext());
 */
export const opContentRecommendationRenderingContext = () => map<RenderingContext, ContentRecommendationRenderingContext>(assertContentRecommendationRenderingContext);