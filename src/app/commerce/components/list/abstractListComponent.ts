/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Link,
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name List
 * @id 9aeeecef-85ce-4d41-a797-1ad27735d0cb
 * @description Use this to create curated lists of content to feature throughout your website. In Oslo we use it to create the Editor's Choice list which show up on the design.
 */
export abstract class AbstractListComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "heading",
     *   "label": "List title"
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
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "List item",
     *   "key": "items",
     *   "label": "List items",
     *   "minimumValues": 1,
     *   "required": true,
     *   "restrictTypes": []
     * }
     */
    @RenderingContextBinding('references.items')
    readonly onItems: Observable<RenderingContext[]>;

    /*
     * @see #onItems
     */
    @RenderingContextBinding()
    readonly items: RenderingContext[];

    /*
     * {
     *   "elementType": "link",
     *   "fieldLabel": "Link",
     *   "key": "viewAllLink",
     *   "label": "View all link"
     * }
     */
    @RenderingContextBinding('link.viewAllLink')
    readonly onViewAllLink: Observable<Link>;

    /*
     * @see #onViewAllLink
     */
    @RenderingContextBinding()
    readonly viewAllLink: Link;

    protected constructor() {
        super();
    }
}
