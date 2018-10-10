/**
 * Do not modify this file, it is auto-generated.
 */
import { Category } from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';
import { StoreLocatorRenderingContext, assertStoreLocatorRenderingContext, isStoreLocatorRenderingContext } from './storeLocatorRenderingContext';
import { AbstractRenderingComponent, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Store locator
 * @id com.ibm.commerce.store.angular-types.store-locator
 */
abstract class AbstractStoreLocatorComponent extends AbstractRenderingComponent {

    /**
    * Strongly typed stream of the rendering contexts
    */
    readonly onRenderingContext: Observable<RenderingContext>;

    /**
    * Strongly typed rendering context
    */
    renderingContext: RenderingContext;

    /*
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.title')
    readonly onTitle: Observable<string>;

    /*
     * @see #onTitle
     */
    @RenderingContextBinding()
    readonly title: string;

    /*
     * {
     *   "elementType": "category",
     *   "key": "availableServices",
     *   "label": "Available services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
     */
    @RenderingContextBinding('category.availableServices')
    readonly onAvailableServices: Observable<Category>;

    /*
     * @see #onAvailableServices
     */
    @RenderingContextBinding()
    readonly availableServices: Category;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    StoreLocatorRenderingContext,
    isStoreLocatorRenderingContext,
    assertStoreLocatorRenderingContext,
    AbstractStoreLocatorComponent
};