/**
 * Do not modify this file, it is auto-generated.
 */
import {
    Observable
} from 'rxjs/Observable';
import { ProductGridWithContentRenderingContext, assertProductGridWithContentRenderingContext, isProductGridWithContentRenderingContext } from './productGridWithContentRenderingContext';
import { AbstractRenderingComponent, RenderingContext, RenderingContextBinding } from 'ibm-wch-sdk-ng';

/*
 * @name Product grid with content
 * @id 288785b2-6651-46db-bfde-fe8562804cd9
 */
abstract class AbstractProductGridWithContentComponent extends AbstractRenderingComponent {

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
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "insertedContent",
     *   "label": "Inserted Content",
     *   "minimumValues": 0,
     *   "restrictTypes": [
     *     {
     *       "id": "7e7b2096-031b-4ad1-8886-b0be506086eb"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('references.insertedContent', [])
    readonly onInsertedContent: Observable<RenderingContext[]>;

    /*
     * @see #onInsertedContent
     */
    @RenderingContextBinding()
    readonly insertedContent: RenderingContext[];

    protected constructor() {
        super();
    }
}

/**
* 18acd1c9-888e-4c44-bd2c-a38c5a62bf45
*/
export {
    ProductGridWithContentRenderingContext,
    isProductGridWithContentRenderingContext,
    assertProductGridWithContentRenderingContext,
    AbstractProductGridWithContentComponent
};