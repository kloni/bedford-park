/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { EspotPickerPaletteElementType } from './../../elements/espot-picker-palette-element/espotPickerPaletteElementType';
import { ProductRecommendationRenderingContext, assertProductRecommendationRenderingContext, isProductRecommendationRenderingContext } from './productRecommendationRenderingContext';
import { AbstractRenderingComponent, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Product recommendation
 * @id com.ibm.commerce.store.angular-types.productrecommendation
 * @description List of products from the catalog system generated from a rule defined in precision marketing
 */
abstract class AbstractProductRecommendationComponent extends AbstractRenderingComponent {

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
     *   "key": "title",
     *   "label": "Title"
     * }
     */
    @RenderingContextBinding('text.title', '')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    /*
     * {
     *   "elementType": "group",
     *   "key": "eSpot",
     *   "label": "E-Marketing Spot",
     *   "typeRef": {
     *     "id": "com.ibm.commerce.store.espot-picker-palette-element"
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
    ProductRecommendationRenderingContext,
    isProductRecommendationRenderingContext,
    assertProductRecommendationRenderingContext,
    AbstractProductRecommendationComponent
};