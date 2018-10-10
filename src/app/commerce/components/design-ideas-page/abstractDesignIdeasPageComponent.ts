/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Image,
    RenderingContext,
    RenderingContextBinding,
    isFormattedTextElement,
    isImageElement,
    isReferenceElement,
    isTextElement,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';


/*
 * @name Design ideas page
 * @id 10562aef-b162-4d2b-8d1b-3a9182218eb8
 * @description Highlights disparate products across different catalog categories into a listing of products. Products are related be editorial theme
 */
abstract class AbstractDesignIdeasPageComponent extends AbstractRenderingComponent {

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
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.heading')
    readonly onHeading: Observable<string>;

    /*
     * @see #onHeading
     */
    @RenderingContextBinding()
    readonly heading: string;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "formattedtext",
     *   "fieldLabel": "Text chunk",
     *   "key": "body",
     *   "label": "Body text",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('formattedtexts.body', [])
    readonly onBody: Observable<string[]>;

    /*
     * @see #onBody
     */
    @RenderingContextBinding()
    readonly body: string[];

    /*
     * {
     *   "elementType": "reference",
     *   "key": "designerProfile",
     *   "label": "Designer profile",
     *   "restrictTypes": [
     *     {
     *       "id": "b0b91aad-8a9a-4d46-9aff-e35d004f0a1f"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.designerProfile')
    readonly onDesignerProfile: Observable<RenderingContext>;

    /*
     * @see #onDesignerProfile
     */
    @RenderingContextBinding()
    readonly designerProfile: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "fromTheArrangement",
     *   "label": "From the arrangement",
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.curated-category-list"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.fromTheArrangement')
    readonly onFromTheArrangement: Observable<RenderingContext>;

    /*
     * @see #onFromTheArrangement
     */
    @RenderingContextBinding()
    readonly fromTheArrangement: RenderingContext;

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
    AbstractDesignIdeasPageComponent
};
