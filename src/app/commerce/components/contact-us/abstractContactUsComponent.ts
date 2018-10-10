/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Contact Us
 * @id 0f4d2371-591b-4cca-b0e7-b6dff6e3a62f
 */
export abstract class AbstractContactUsComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "location",
     *   "label": "Location"
     * }
     */
    @RenderingContextBinding('text.location', '')
    readonly onLocation: Observable<string>;

    /*
     * @see #onLocation
     */
    @RenderingContextBinding()
    readonly location: string;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "width",
     *   "label": "Width",
     *   "required": false
     * }
     */
    @RenderingContextBinding('number.width', 0)
    readonly onWidth: Observable<number>;

    /*
     * @see #onWidth
     */
    @RenderingContextBinding()
    readonly width: number;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "height",
     *   "label": "Height"
     * }
     */
    @RenderingContextBinding('number.height', 0)
    readonly onHeight: Observable<number>;

    /*
     * @see #onHeight
     */
    @RenderingContextBinding()
    readonly height: number;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "contactDetails",
     *   "label": "Contact Details",
     *   "minimumValues": 0,
     *   "restrictTypes": [
     *     {
     *       "id": "2725e6d0-11d2-4345-95c4-1a447c874bcb"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('references.contactDetails', [])
    readonly onContactDetails: Observable<RenderingContext[]>;

    /*
     * @see #onContactDetails
     */
    @RenderingContextBinding()
    readonly contactDetails: RenderingContext[];

    protected constructor() {
        super();
    }
}
