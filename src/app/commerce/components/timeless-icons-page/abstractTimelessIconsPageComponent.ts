/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Image,
    RenderingContext,
    RenderingContextBinding,
    isImageElement,
    isReferenceElement,
    isTextElement,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';


/*
 * @name Timeless icons page
 * @id fce5897f-ee8e-4dfc-a150-a828e873d30a
 * @description Highlights disparate products across different catalog categories into a listing of products. Products are related be editorial theme
 */
abstract class AbstractTimelessIconsPageComponent extends AbstractRenderingComponent {
    /*
     * {
     *   "elementType": "reference",
     *   "key": "hero",
     *   "label": "Hero",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.hero"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.hero')
    readonly onHero: Observable<RenderingContext>;

    /*
     * @see #onHero
     */
    @RenderingContextBinding()
    readonly hero: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "collectionComponent",
     *   "label": "Collection component"
     * }
     */
    @RenderingContextBinding('reference.collectionComponent')
    readonly onCollectionComponent: Observable<RenderingContext>;

    /*
     * @see #onCollectionComponent
     */
    @RenderingContextBinding()
    readonly collectionComponent: RenderingContext;

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "key": "cardImage",
     *   "label": "Card image"
     * }
     */
    @RenderingContextBinding('image.cardImage')
    readonly onCardImage: Observable<Image>;

    /*
     * @see #onCardImage
     */
    @RenderingContextBinding()
    readonly cardImage: Image;

    /*
     * {
     *   "elementType": "text",
     *   "key": "cardTitle",
     *   "label": "Card image caption"
     * }
     */
    @RenderingContextBinding('text.cardTitle', '')
    readonly onCardTitle: Observable<string>;

    /*
     * @see #onCardTitle
     */
    @RenderingContextBinding()
    readonly cardTitle: string;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    AbstractTimelessIconsPageComponent
};
