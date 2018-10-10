/**
 * Do not modify this file, it is auto-generated.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import {
    CategoryElement,
    LocationElement,
    RenderingContext
} from 'ibm-wch-sdk-ng';
import { KEY_ADDRESS, KEY_COORDINATES, KEY_HOURS, KEY_IDENTIFIER, KEY_NAME, KEY_PHONE_NUMBER, KEY_SERVICES, PhysicalStore, isPhysicalStore } from './../../elements/physical-store/physicalStoreType';

/*
 * @name Physical store
 * @id com.ibm.commerce.store.angular-types.physical-store
 */
export interface PhysicalStoreRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.physical-store';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Physical store';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: PhysicalStore;

    text: {
    /**
     * {
     *   "elementType": "text",
     *   "key": "identifier",
     *   "label": "Identifier",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['identifier']: string;
    /**
     * {
     *   "elementType": "text",
     *   "key": "name",
     *   "label": "Name",
     *   "minLength": 1,
     *   "required": true
     * }
    */
    ['name']: string;
    /**
     * {
     *   "elementType": "text",
     *   "key": "phoneNumber",
     *   "label": "Phone number"
     * }
    */
    ['phoneNumber']?: string;
    };

    formattedtext: {
    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "address",
     *   "label": "Address",
     *   "required": true
     * }
    */
    ['address']: string;
    /**
     * {
     *   "elementType": "formattedtext",
     *   "key": "hours",
     *   "label": "Hours"
     * }
    */
    ['hours']?: string;
    };

    location: {
    /**
     * {
     *   "elementType": "location",
     *   "key": "coordinates",
     *   "label": "Coordinates",
     *   "required": true
     * }
    */
    ['coordinates']: LocationElement;
    };

    category: {
    /**
     * {
     *   "elementType": "category",
     *   "key": "services",
     *   "label": "Services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
    */
    ['services']?: CategoryElement;
    };

}

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link PhysicalStoreRenderingContext } else false
 */
export function isPhysicalStoreRenderingContext(aContext: RenderingContext): aContext is PhysicalStoreRenderingContext {
    return !!aContext && isPhysicalStore(aContext.elements);
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link PhysicalStoreRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link PhysicalStoreRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertPhysicalStoreRenderingContext);
 */
export function assertPhysicalStoreRenderingContext(aContext: RenderingContext): PhysicalStoreRenderingContext {
    // test if the context is as expected
    if (isPhysicalStoreRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('PhysicalStoreRenderingContext');
}

/** Operator to convert a {@link RenderingContext} into a {@link PhysicalStoreRenderingContext } using a pipe.
 *
 * @example this.onRenderingContext.pipe(opPhysicalStoreRenderingContext());
 */
export const opPhysicalStoreRenderingContext = () => map<RenderingContext, PhysicalStoreRenderingContext>(assertPhysicalStoreRenderingContext);