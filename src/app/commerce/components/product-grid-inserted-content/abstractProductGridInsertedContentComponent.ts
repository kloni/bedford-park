/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { ProductGridInsertedContentRenderingContext, assertProductGridInsertedContentRenderingContext, isProductGridInsertedContentRenderingContext } from './productGridInsertedContentRenderingContext';
import { AbstractRenderingComponent, Image, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Product Grid Inserted Content
 * @id 7e7b2096-031b-4ad1-8886-b0be506086eb
 */
abstract class AbstractProductGridInsertedContentComponent extends AbstractRenderingComponent {

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
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "positionAfter",
     *   "label": "Position after",
     *   "minimum": 0,
     *   "required": true
     * }
     */
    @RenderingContextBinding('number.positionAfter')
    readonly onPositionAfter: Observable<number>;

    /*
     * @see #onPositionAfter
     */
    @RenderingContextBinding()
    readonly positionAfter: number;

    /*
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
    @RenderingContextBinding('image.image')
    readonly onImage: Observable<Image>;

    /*
     * @see #onImage
     */
    @RenderingContextBinding()
    readonly image: Image;

    /*
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
    @RenderingContextBinding('reference.content')
    readonly onContent: Observable<RenderingContext>;

    /*
     * @see #onContent
     */
    @RenderingContextBinding()
    readonly content: RenderingContext;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    ProductGridInsertedContentRenderingContext,
    isProductGridInsertedContentRenderingContext,
    assertProductGridInsertedContentRenderingContext,
    AbstractProductGridInsertedContentComponent
};