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
 * @name Child pages
 * @id c7532e99-d428-4314-9088-40f3d8b5ed37
 */
export abstract class AbstractChildPagesComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "heading",
     *   "label": "Heading"
     * }
     */
    @RenderingContextBinding('text.heading', '')
    readonly onHeading: Observable<string>;

    /*
     * @see #onHeading
     */
    @RenderingContextBinding()
    readonly heading: string;

    protected constructor() {
        super();
    }
}