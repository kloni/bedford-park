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
 * @name Shared formatted text
 * @id 02f73c77-3c1f-48ec-98d0-3470193270e0
 */
export abstract class AbstractSharedFormattedTextComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "formattedText",
     *   "label": "Formatted text",
     *   "required": true
     * }
     */
    @RenderingContextBinding('formattedtext.formattedText')
    readonly onFormattedText: Observable<string>;

    /*
     * @see #onFormattedText
     */
    @RenderingContextBinding()
    readonly formattedText: string;

    protected constructor() {
        super();
    }
}