/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { PhysicalStoreRenderingContext, assertPhysicalStoreRenderingContext, isPhysicalStoreRenderingContext } from './physicalStoreRenderingContext';
import { AbstractRenderingComponent, Category, Location, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Physical store
 * @id com.ibm.commerce.store.angular-types.physical-store
 */
abstract class AbstractPhysicalStoreComponent extends AbstractRenderingComponent {

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
     *   "key": "identifier",
     *   "label": "Identifier",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.identifier')
    readonly onIdentifier: Observable<string>;

    /*
     * @see #onIdentifier
     */
    @RenderingContextBinding()
    readonly identifier: string;

    /*
     * {
     *   "elementType": "text",
     *   "key": "name",
     *   "label": "Name",
     *   "minLength": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('text.name')
    readonly onName: Observable<string>;

    /*
     * @see #onName
     */
    @RenderingContextBinding()
    readonly name: string;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "address",
     *   "label": "Address",
     *   "required": true
     * }
     */
    @RenderingContextBinding('formattedtext.address')
    readonly onAddress: Observable<string>;

    /*
     * @see #onAddress
     */
    @RenderingContextBinding()
    readonly address: string;

    /*
     * {
     *   "elementType": "location",
     *   "key": "coordinates",
     *   "label": "Coordinates",
     *   "required": true
     * }
     */
    @RenderingContextBinding('location.coordinates')
    readonly onCoordinates: Observable<Location>;

    /*
     * @see #onCoordinates
     */
    @RenderingContextBinding()
    readonly coordinates: Location;

    /*
     * {
     *   "elementType": "text",
     *   "key": "phoneNumber",
     *   "label": "Phone number"
     * }
     */
    @RenderingContextBinding('text.phoneNumber', '')
    readonly onPhoneNumber: Observable<string>;

    /*
     * @see #onPhoneNumber
     */
    @RenderingContextBinding()
    readonly phoneNumber: string;

    /*
     * {
     *   "elementType": "category",
     *   "key": "services",
     *   "label": "Services",
     *   "restrictedParents": [
     *     "abb4da2e-858e-43ed-b8aa-1a42b3d5b0dd"
     *   ]
     * }
     */
    @RenderingContextBinding('category.services')
    readonly onServices: Observable<Category>;

    /*
     * @see #onServices
     */
    @RenderingContextBinding()
    readonly services: Category;

    /*
     * {
     *   "elementType": "formattedtext",
     *   "key": "hours",
     *   "label": "Hours"
     * }
     */
    @RenderingContextBinding('formattedtext.hours', '')
    readonly onHours: Observable<string>;

    /*
     * @see #onHours
     */
    @RenderingContextBinding()
    readonly hours: string;

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    PhysicalStoreRenderingContext,
    isPhysicalStoreRenderingContext,
    assertPhysicalStoreRenderingContext,
    AbstractPhysicalStoreComponent
};