/*
 * Do not modify this file, it will be auto-generated.
 */
import {
    OptionSelection,
    RenderingContext,
    RenderingContextBinding,
    AbstractRenderingComponent
} from 'ibm-wch-sdk-ng';
import {
    Observable
} from 'rxjs/Observable';

/*
 * @name Slideshow
 * @id com.ibm.commerce.store.angular-types.slideshow
 * @description Used to feature content throughout the website on the home page
 */
export abstract class AbstractSlideshowComponent extends AbstractRenderingComponent {

    /*
     * {
     *   "allowMultipleValues": true,
     *   "elementType": "reference",
     *   "fieldLabel": "Content item",
     *   "key": "slides",
     *   "label": "Slides",
     *   "minimumValues": 1,
     *   "required": true,
     *   "restrictTypes": [
     *     {
     *       "id": "com.ibm.commerce.store.angular-types.slide"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('references.slides')
    readonly onSlides: Observable<RenderingContext[]>;

    /*
     * @see #onSlides
     */
    @RenderingContextBinding()
    readonly slides: RenderingContext[];

    /*
     * {
     *   "elementType": "toggle",
     *   "key": "autoPlay",
     *   "label": "Auto Play"
     * }
     */
    @RenderingContextBinding('toggle.autoPlay', false)
    readonly onAutoPlay: Observable<boolean>;

    /*
     * @see #onAutoPlay
     */
    @RenderingContextBinding()
    readonly autoPlay: boolean;

    /*
     * {
     *   "elementType": "optionselection",
     *   "key": "slideTransitionStyle",
     *   "label": "Slide transition (style)",
     *   "options": [
     *     {
     *       "label": "ease",
     *       "selection": "ease"
     *     },
     *     {
     *       "label": "linear",
     *       "selection": "linear"
     *     },
     *     {
     *       "label": "ease-in",
     *       "selection": "ease-in"
     *     },
     *     {
     *       "label": "ease-out",
     *       "selection": "ease-out"
     *     },
     *     {
     *       "label": "ease-in-out",
     *       "selection": "ease-in-out"
     *     }
     *   ]
     * }
     */
    @RenderingContextBinding('optionselection.slideTransitionStyle')
    readonly onSlideTransitionStyle: Observable<OptionSelection>;

    /*
     * @see #onSlideTransitionStyle
     */
    @RenderingContextBinding()
    readonly slideTransitionStyle: OptionSelection;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "transitionSpeed",
     *   "label": "Transition speed",
     *   "minimum": 0
     * }
     */
    @RenderingContextBinding('number.transitionSpeed', 0)
    readonly onTransitionSpeed: Observable<number>;

    /*
     * @see #onTransitionSpeed
     */
    @RenderingContextBinding()
    readonly transitionSpeed: number;

    /*
     * {
     *   "elementType": "number",
     *   "fieldType": "integer",
     *   "key": "slideDurationSeconds",
     *   "label": "Slide duration (seconds)",
     *   "minimum": 0,
     *   "required": false
     * }
     */
    @RenderingContextBinding('number.slideDurationSeconds', 0)
    readonly onSlideDurationSeconds: Observable<number>;

    /*
     * @see #onSlideDurationSeconds
     */
    @RenderingContextBinding()
    readonly slideDurationSeconds: number;

    /*
     * {
     *   "elementType": "toggle",
     *   "key": "pagingIndicator",
     *   "label": "Paging indicator"
     * }
     */
    @RenderingContextBinding('toggle.pagingIndicator', false)
    readonly onPagingIndicator: Observable<boolean>;

    /*
     * @see #onPagingIndicator
     */
    @RenderingContextBinding()
    readonly pagingIndicator: boolean;

    /*
     * {
     *   "elementType": "toggle",
     *   "key": "pagingControl",
     *   "label": "Paging control"
     * }
     */
    @RenderingContextBinding('toggle.pagingControl', false)
    readonly onPagingControl: Observable<boolean>;

    /*
     * @see #onPagingControl
     */
    @RenderingContextBinding()
    readonly pagingControl: boolean;

    /*
     * {
     *   "elementType": "toggle",
     *   "key": "fade",
     *   "label": "Fade"
     * }
     */
    @RenderingContextBinding('toggle.fade', false)
    readonly onFade: Observable<boolean>;

    /*
     * @see #onFade
     */
    @RenderingContextBinding()
    readonly fade: boolean;

    protected constructor() {
        super();
    }
}
