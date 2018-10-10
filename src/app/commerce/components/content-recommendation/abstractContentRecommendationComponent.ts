/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { EspotPickerPaletteElementType } from './../../elements/espot-picker-palette-element/espotPickerPaletteElementType';
import { ContentRecommendationRenderingContext, assertContentRecommendationRenderingContext, isContentRecommendationRenderingContext } from './contentRecommendationRenderingContext';
import { AbstractRenderingComponent, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Content Recommendation
 * @id com.ibm.commerce.store.angular-types.content-recommendation
 * @description Displays content from a rule defined in precision marketing
 */
abstract class AbstractContentRecommendationComponent extends AbstractRenderingComponent {

    /**
    * Strongly typed stream of the rendering contexts
    */
    readonly onRenderingContext: Observable<RenderingContext>;

    /**
    * Strongly typed rendering context
    */
    renderingContext: RenderingContext;

    /*
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Title"
     * }
     */
    @RenderingContextBinding('text.heading', '')
    readonly onHeading: Observable<string>;

    /*
     * @see #onHeading
     */
    @RenderingContextBinding()
    readonly heading: string;

    /*
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.type.espot-picker-palette-element"
     *   }
     * }
     */
    @RenderingContextBinding('group.eSpot')
    readonly onESpot: Observable<EspotPickerPaletteElementType>;

    /*
     * @see #onESpot
     */
    @RenderingContextBinding()
    readonly eSpot: EspotPickerPaletteElementType;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    ContentRecommendationRenderingContext,
    isContentRecommendationRenderingContext,
    assertContentRecommendationRenderingContext,
    AbstractContentRecommendationComponent
};