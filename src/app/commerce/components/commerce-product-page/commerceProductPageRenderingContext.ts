/**
 * Do not modify this file, it is auto-generated.
 */
import {
    MultiReferenceElement,
    SingleReferenceElement,
    RenderingContext
} from 'ibm-wch-sdk-ng';

export const KEY_TOP_MARKETING_SECTION = 'topMarketingSection';
export const KEY_COMMERCEDATASECTION = 'Commercedatasection';
export const KEY_BOTTOM_MARKETING_SECTION = 'bottomMarketingSection';

/*
 * @name Commerce product page
 * @id com.ibm.commerce.store.angular-types.commerceproductpagetype
 */
export interface CommerceProductPageRenderingContext extends RenderingContext {

    /*
     * The ID of the content type this item belongs to.
     */
    typeId: 'com.ibm.commerce.store.angular-types.commerceproductpagetype';

    /*
     * this is the link to the content type document this content is based on.
     */
    type: 'Commerce product page';

    /*
     * The classification defines the document type. For content items, all documents are classified as \"content\".
     */
    classification: 'content';

    /*
     * Defined by the type and capture in the schema given by the type,
     *  in a real content, this property will be filled with more information.
     */
    elements: {
        /**
         * {
     *   "elementType": "reference",
     *   "key": "topMarketingSection",
     *   "label": "Top marketing section"
     * }
        */
        ['topMarketingSection']?: SingleReferenceElement;
        /**
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
        ['Commercedatasection']: MultiReferenceElement;
        /**
         * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "bottomMarketingSection",
     *   "label": "Bottom marketing section",
     *   "minimumValues": 0
     * }
        */
        ['bottomMarketingSection']?: MultiReferenceElement;
    };

    reference: {
        /**
         * {
     *   "elementType": "reference",
     *   "key": "topMarketingSection",
     *   "label": "Top marketing section"
     * }
        */
        ['topMarketingSection']?: RenderingContext;
    };

    references: {
        /**
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
        ['Commercedatasection']: RenderingContext[];
        /**
         * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "bottomMarketingSection",
     *   "label": "Bottom marketing section",
     *   "minimumValues": 0
     * }
        */
        ['bottomMarketingSection']?: RenderingContext[];
    };

}