/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { CategoryRecommendation, KEY_E_SPOT, KEY_TITLE, isCategoryRecommendation } from './../../elements/category-recommendation/categoryRecommendationType';
import { EspotPickerPaletteElementType } from './../../elements/espot-picker-palette-element/espotPickerPaletteElementType';

/*
 * @name Category recommendation
 * @id com.ibm.commerce.store.angular-types.category-recommendation
 * @description List of categories from the catalog system generated from a rule defined in precision marketing
 */
export interface CategoryRecommendationRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.category-recommendation';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Category recommendation';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: CategoryRecommendation;

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
     *   "label": "E-Marketing spot",
     *   "required": true,
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
    */
    ['eSpot']: EspotPickerPaletteElementType;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link CategoryRecommendationRenderingContext } else false
 */
export function isCategoryRecommendationRenderingContext(aContext: RenderingContext): aContext is CategoryRecommendationRenderingContext {
    return !!aContext && isCategoryRecommendation(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link CategoryRecommendationRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link CategoryRecommendationRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertCategoryRecommendationRenderingContext);
 */
export function assertCategoryRecommendationRenderingContext(aContext: RenderingContext): CategoryRecommendationRenderingContext {
    // test if the context is as expected
    if (isCategoryRecommendationRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('CategoryRecommendationRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link CategoryRecommendationRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opCategoryRecommendationRenderingContext());
 */
export const opCategoryRecommendationRenderingContext = () => map<RenderingContext, CategoryRecommendationRenderingContext>(assertCategoryRecommendationRenderingContext);