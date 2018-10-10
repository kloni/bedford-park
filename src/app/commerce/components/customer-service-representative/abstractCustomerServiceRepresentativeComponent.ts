/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { CustomerServiceRepresentativeRenderingContext, assertCustomerServiceRepresentativeRenderingContext, isCustomerServiceRepresentativeRenderingContext } from './customerServiceRepresentativeRenderingContext';
import { AbstractRenderingComponent, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Customer service representative
 * @id com.ibm.commerce.store.angular-types.csr
 * @description Perform tasks as a customer service representative (CSR)
 */
abstract class AbstractCustomerServiceRepresentativeComponent extends AbstractRenderingComponent {

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

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    CustomerServiceRepresentativeRenderingContext,
    isCustomerServiceRepresentativeRenderingContext,
    assertCustomerServiceRepresentativeRenderingContext,
    AbstractCustomerServiceRepresentativeComponent
};