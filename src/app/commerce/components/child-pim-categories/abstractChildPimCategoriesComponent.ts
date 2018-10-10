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
 * @name Child PIM categories
 * @id com.ibm.commerce.store.angular-types.child-pim-categories
 * @description Dynamically builds a list of child categories using the PIM hierarchy and displays the results as a list. Website user can click image in result and go to page
 */
export abstract class AbstractChildPimCategoriesComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title"
     * }
     */
    @RenderingContextBinding('text.title', '')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    protected constructor() {
        super();
    }
}