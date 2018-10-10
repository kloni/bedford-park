/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { CustomerServiceRepresentative, KEY_TITLE, isCustomerServiceRepresentative } from './../../elements/customer-service-representative/customerServiceRepresentativeType';

/*
 * @name Customer service representative
 * @id com.ibm.commerce.store.angular-types.csr
 * @description Perform tasks as a customer service representative (CSR)
 */
export interface CustomerServiceRepresentativeRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.csr';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Customer service representative';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: CustomerServiceRepresentative;

    text: {
    /**
     * {
     *   "elementType": "text",
     *   "key": "title",
     *   "label": "Title",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['title']: string;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link CustomerServiceRepresentativeRenderingContext } else false
 */
export function isCustomerServiceRepresentativeRenderingContext(aContext: RenderingContext): aContext is CustomerServiceRepresentativeRenderingContext {
    return !!aContext && isCustomerServiceRepresentative(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link CustomerServiceRepresentativeRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link CustomerServiceRepresentativeRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertCustomerServiceRepresentativeRenderingContext);
 */
export function assertCustomerServiceRepresentativeRenderingContext(aContext: RenderingContext): CustomerServiceRepresentativeRenderingContext {
    // test if the context is as expected
    if (isCustomerServiceRepresentativeRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('CustomerServiceRepresentativeRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link CustomerServiceRepresentativeRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opCustomerServiceRepresentativeRenderingContext());
 */
export const opCustomerServiceRepresentativeRenderingContext = () => map<RenderingContext, CustomerServiceRepresentativeRenderingContext>(assertCustomerServiceRepresentativeRenderingContext);