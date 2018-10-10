/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { KEY_TITLE, StoreLocator, isStoreLocator } from './../../elements/store-locator/storeLocatorType';

/*
 * @name Store locator
 * @id com.ibm.commerce.store.angular-types.store-locator
 */
export interface StoreLocatorRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.store-locator';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Store locator';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: StoreLocator;

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
 * @return true if the context is a {@link StoreLocatorRenderingContext } else false
 */
export function isStoreLocatorRenderingContext(aContext: RenderingContext): aContext is StoreLocatorRenderingContext {
    return !!aContext && isStoreLocator(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link StoreLocatorRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link StoreLocatorRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertStoreLocatorRenderingContext);
 */
export function assertStoreLocatorRenderingContext(aContext: RenderingContext): StoreLocatorRenderingContext {
    // test if the context is as expected
    if (isStoreLocatorRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('StoreLocatorRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link StoreLocatorRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opStoreLocatorRenderingContext());
 */
export const opStoreLocatorRenderingContext = () => map<RenderingContext, StoreLocatorRenderingContext>(assertStoreLocatorRenderingContext);