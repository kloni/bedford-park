/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { ProductRenderingContext, assertProductRenderingContext, isProductRenderingContext } from './productRenderingContext';
import { AbstractRenderingComponent, Category, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Product
 * @id com.ibm.commerce.store.angular-types.product
 */
abstract class AbstractProductComponent extends AbstractRenderingComponent {

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
    ProductRenderingContext,
    isProductRenderingContext,
    assertProductRenderingContext,
    AbstractProductComponent
};