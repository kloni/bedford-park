/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    Image,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Author profile
 * @id b0b91aad-8a9a-4d46-9aff-e35d004f0a1f
 */
export abstract class AbstractAuthorProfileComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "fieldLabel": "Text",
     *   "key": "name",
     *   "label": "Name"
     * }
     */
    @RenderingContextBinding('text.name', '')
    readonly onName: Observable<string>;

    /*
     * @see #onName
     */
    @RenderingContextBinding()
    readonly name: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "place",
     *   "label": "Place"
     * }
     */
    @RenderingContextBinding('text.place', '')
    readonly onPlace: Observable<string>;

    /*
     * @see #onPlace
     */
    @RenderingContextBinding()
    readonly place: string;

    /*
     * {
     *   "acceptType": [
     *     "jpg",
     *     "jpeg",
     *     "png",
     *     "gif"
     *   ],
     *   "elementType": "image",
     *   "fieldLabel": "Image",
     *   "imageProfileId": "046c7734-3fca-4e0b-9233-d5208e767654",
     *   "key": "profilePicture",
     *   "label": "Profile picture"
     * }
     */
    @RenderingContextBinding('image.profilePicture')
    readonly onProfilePicture: Observable<Image>;

    /*
     * @see #onProfilePicture
     */
    @RenderingContextBinding()
    readonly profilePicture: Image;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "fieldLabel": "Formatted Text",
     *   "key": "shortBio",
     *   "label": "Short bio"
     * }
     */
    @RenderingContextBinding('formattedtext.shortBio', '')
    readonly onShortBio: Observable<string>;

    /*
     * @see #onShortBio
     */
    @RenderingContextBinding()
    readonly shortBio: string;

    protected constructor() {
        super();
    }
}
