/**
 * Do not modify this file, it is auto-generated.
 */
import {
    RenderingContext,
    RenderingContextBinding,
    isReferenceElement,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';
import {
    CommerceProductPageRenderingContext
} from './commerceProductPageRenderingContext';

/** Validates that the context is indeed of the desired type
 *
 * @param aContext instance of the {@link RenderingContext} to check
 * @return true if the context is a {@link CommerceProductPageRenderingContext } else false
 */
function isCommerceProductPageRenderingContext(aContext: RenderingContext): aContext is CommerceProductPageRenderingContext {
    // cache access to the elements
    const el = aContext ? aContext.elements || [] : [];
    return !!aContext
        && (!el['topMarketingSection'] || isReferenceElement(el['topMarketingSection']))
            && isReferenceElement(el['Commercedatasection'])
            && (!el['bottomMarketingSection'] || isReferenceElement(el['bottomMarketingSection']))
    ;
}

/** Provides a type assertion that can be used to validate and convert a generic {@link RenderingContext}
 * info a {@link CommerceProductPageRenderingContext }
 *
 * @param aContext instance of the rendering context to check
 * @return the {@link CommerceProductPageRenderingContext } version of the {@link RenderingContext} or an exception
 *
 * @example this.onRenderingContext.map(assertCommerceProductPageRenderingContext);
 */
function assertCommerceProductPageRenderingContext(aContext: RenderingContext): CommerceProductPageRenderingContext {
    // test if the context is as expected
    if (isCommerceProductPageRenderingContext(aContext)) {
        return aContext;
    }
    // type failure
    throw new TypeError('CommerceProductPageRenderingContext');
}

/*
 * @name Commerce product page
 * @id com.ibm.commerce.store.angular-types.commerceproductpagetype
 */
abstract class AbstractCommerceProductPageComponent extends AbstractRenderingComponent {

    /**
    * Strongly typed stream of the rendering contexts
    */
    readonly onRenderingContext: Observable<CommerceProductPageRenderingContext>;

    /**
    * Strongly typed rendering context
    */
    renderingContext: CommerceProductPageRenderingContext;

    /*
     * {
     *   "elementType": "reference",
     *   "key": "topMarketingSection",
     *   "label": "Top marketing section"
     * }
     */
    @RenderingContextBinding('reference.topMarketingSection')
    readonly onTopMarketingSection: Observable<RenderingContext>;

    /*
     * @see #onTopMarketingSection
     */
    @RenderingContextBinding()
    readonly topMarketingSection: RenderingContext;

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "Commercedatasection",
     *   "label": "Commerce Data section",
     *   "minimumValues": 1,
     *   "required": true
     * }
     */
    @RenderingContextBinding('references.Commercedatasection')
    readonly onCommercedatasection: Observable<RenderingContext[]>;

    /*
     * @see #onCommercedatasection
     */
    @RenderingContextBinding()
    readonly commercedatasection: RenderingContext[];

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "bottomMarketingSection",
     *   "label": "Bottom marketing section",
     *   "minimumValues": 0
     * }
     */
    @RenderingContextBinding('references.bottomMarketingSection', [])
    readonly onBottomMarketingSection: Observable<RenderingContext[]>;

    /*
     * @see #onBottomMarketingSection
     */
    @RenderingContextBinding()
    readonly bottomMarketingSection: RenderingContext[];

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    CommerceProductPageRenderingContext,
    isCommerceProductPageRenderingContext,
    assertCommerceProductPageRenderingContext,
    AbstractCommerceProductPageComponent
};