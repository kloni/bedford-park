/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Category,
    Image,
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Design page
 * @id bb79c338-1e20-4d53-9ff3-9a6970ad9ed3
 * @description Design topic uses a two column layout with options for the column widths.  Decide if you want a 75/25% split in column width or 25/75% split in column width.
 */
export abstract class AbstractDesignPageComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Topic title",
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
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "imageProfileId": "3428916c-b356-4b47-aeb2-5eb8e3494b00",
     *   "key": "leadImage",
     *   "label": "Lead image",
     *   "required": true
     * }
     */
    @RenderingContextBinding('image.leadImage')
    readonly onLeadImage: Observable<Image>;

    /*
     * @see #onLeadImage
     */
    @RenderingContextBinding()
    readonly leadImage: Image;

    /*
     * {
     *   "elementType": "text",
     *   "key": "leadImageCaption",
     *   "label": "Lead image caption"
     * }
     */
    @RenderingContextBinding('text.leadImageCaption', '')
    readonly onLeadImageCaption: Observable<string>;

    /*
     * @see #onLeadImageCaption
     */
    @RenderingContextBinding()
    readonly leadImageCaption: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "leadImageCredit",
     *   "label": "Lead image credit"
     * }
     */
    @RenderingContextBinding('text.leadImageCredit', '')
    readonly onLeadImageCredit: Observable<string>;

    /*
     * @see #onLeadImageCredit
     */
    @RenderingContextBinding()
    readonly leadImageCredit: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "author",
     *   "label": "Author name",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.author')
    readonly onAuthor: Observable<string>;

    /*
     * @see #onAuthorName
     */
    @RenderingContextBinding()
    readonly author: string;

    /*
     * {
     *   "elementType": "datetime",
     *   "helpText": "Date and time is used when ordering a list of design articles.  The time will not display in the website.",
     *   "key": "date",
     *   "label": "Date",
     *   "required": true
     * }
     */
    @RenderingContextBinding('datetime.date')
    readonly onDate: Observable<Date>;

    /*
     * @see #onDate
     */
    @RenderingContextBinding()
    readonly date: Date;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "formattedtext",
     *   "fieldLabel": "Text chunk",
     *   "helpText": "The design topic, when displayed in the website, will interleave the text chunks and images to create a fluid layout.",
     *   "key": "body",
     *   "label": "Body text",
     *   "minimumValues": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('formattedtexts.body')
    readonly onBody: Observable<string[]>;

    /*
     * @see #onBody
     */
    @RenderingContextBinding()
    readonly body: string[];

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Design article image",
     *   "key": "bodyImage",
     *   "label": "Body images",
     *   "minimumValues": 1,
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "f9e7f0b9-f57d-4d91-a257-54a64c1ff52f"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('references.bodyImage')
    readonly onBodyImage: Observable<RenderingContext[]>;

    /*
     * @see #onBodyImage
     */
    @RenderingContextBinding()
    readonly bodyImage: RenderingContext[];

    /*
     * {
     *   "elementType": "reference",
     *   "key": "authorBio",
     *   "label": "Author bio",
     *   "restrictTypes": [
     *     {
     *       "id": "b0b91aad-8a9a-4d46-9aff-e35d004f0a1f"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.authorBio')
    readonly onAuthorBio: Observable<RenderingContext>;

    /*
     * @see #onAuthorBio
     */
    @RenderingContextBinding()
    readonly authorBio: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "relatedArticles",
     *   "label": "Related articles",
     *   "restrictTypes": [
     *     {
     *       "id": "9aeeecef-85ce-4d41-a797-1ad27735d0cb"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.relatedArticles')
    readonly onRelatedArticles: Observable<RenderingContext>;

    /*
     * @see #onRelatedArticles
     */
    @RenderingContextBinding()
    readonly relatedArticles: RenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "recommendedProducts",
     *   "label": "Recommended Products",
     *   "required": false,
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.productrecommendation"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('reference.recommendedProducts')
    readonly onRecommendedProducts: Observable<RenderingContext>;

    /*
     * @see #onRecommendedProducts
     */
    @RenderingContextBinding()
    readonly recommendedProducts: RenderingContext;

    /*
     * {
     *   "elementType": "category",
     *   "key": "articleType",
     *   "label": "Article Type",
     *   "restrictedParents": [
     *     "b816e57d-f4ec-4162-9038-ec133472b95e"
     *   ]
     * }
     */
    @RenderingContextBinding('category.articleType')
    readonly onArticleType: Observable<Category>;

    /*
     * @see #onArticleType
     */
    @RenderingContextBinding()
    readonly articleType: Category;

    protected constructor() {
        super();
    }
}
