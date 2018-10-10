/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Shared text
 * @id 2b289ecc-5c98-4a9b-b591-f288e8a1394a
 */
export abstract class AbstractSharedTextComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "text",
     *   "label": "Text",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.text')
    readonly onText: Observable<string>;

    /*
     * @see #onText
     */
    @RenderingContextBinding()
    readonly text: string;

    protected constructor() {
        super();
    }
}