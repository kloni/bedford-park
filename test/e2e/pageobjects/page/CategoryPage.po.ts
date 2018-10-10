import { BaseTest } from '../base/BaseTest.po';
import { by, element, protractor, ElementFinder, browser } from 'protractor';
import { ErrorPage } from './ErrorPage.po';
import { promise } from 'selenium-webdriver';

var log4js = require( "log4js" );
var log = log4js.getLogger( "CategoryPage" );

export const CategoryPageObjs = {
    categoryName: element.all( by.css( "[id^=childPimCategories_h2_]" ) ).first(),
    childCategoryName: element.all( by.css( "[id^=categoryCard_h3_1_]" ) ),
    breadcrumbs: element.all( by.css( "[id^=breadcrumb_a_4_]" ) ),
    itemContainers: element.all( by.tagName( "commerce-dummy-item-container" ) ),
    breadcrumbList: element.all( by.css( "[id^=breadcrumb_li_3]" ) ),
    articleContainers: element.all( by.css( "[id^=gallery_wch_" ) ),
};

export class CategoryPage extends BaseTest {

    constructor(count : number = 0, childCategoryCount : number =0 ) {
        super();
        this.waitForElementDisplayed( CategoryPageObjs.categoryName );
        this.waitForElementDisplayed(CategoryPageObjs.childCategoryName.first());
        this.waitForStableHeight(CategoryPageObjs.childCategoryName.last());
        browser.wait(()=>{
            return CategoryPageObjs.childCategoryName.getWebElements().then(elements => {
                elements.forEach(element=>{
                    element.getText().then(text=>{
                        console.log("Category loaded : " +  text);
                    });
                });
                return true;
            });
        }, 2000);
        this.waitForCountToBeUpdated(CategoryPageObjs.breadcrumbList,count);
        this.waitForCountToBeUpdated(CategoryPageObjs.childCategoryName,childCategoryCount);
    }

    getCategoryName(): Promise<string> {
        return new Promise<string>( ( resolve, reject ) => {
            CategoryPageObjs.categoryName.getText().then( productName => {
                console.log( 'categoryName:', productName );
                resolve( productName );
            } );
        } );
    }

    getChildCategoryName( index: number ) {
        return new Promise<string>( ( resolve, reject ) => {
            CategoryPageObjs.childCategoryName.get( index ).getText().then( child => {
                console.log( 'Child Category Name:', child );
                resolve( child );
            } )
        } );

    }

    clickChildCategoryName( index: number ): CategoryPage {
        browser.sleep(5000);
        this.waitForStableHeight(CategoryPageObjs.childCategoryName.get( index ));
        CategoryPageObjs.childCategoryName.get( index ).click().then( function () {
            console.log( "Clicked on child category name" );

        } )

        return new CategoryPage();
    }

    getBreadcrumbText( index: number ): Promise<string> {
        return new Promise<string>( ( resolve, reject ) => {
            CategoryPageObjs.breadcrumbs.get( index ).getText().then( result => {
                console.log( "Breadcrumb return for index " + index + " : " + result );
                resolve( result );
            } ).catch( function ( err ) {
                console.info( "NO BREADCRUMB TRAIL" );
                resolve("");
            } );
        } );
    }

    clickBreadcrumb( index: number ): CategoryPage {
        CategoryPageObjs.breadcrumbs.get( index ).click().then( function () {
            console.log( "Clicked on breadcrumb" );
        } )
        return new CategoryPage();
    }

    //returns category page
    navigateCategoryPage( urlParam = "" ): CategoryPage {
        if ( urlParam != "" ) {
            urlParam = "?categoryIdentifier=" + urlParam;
        }
        this.navigateTo( "/category" + urlParam );
        return new CategoryPage();
    }

    //returns error page
    attemptToNavigateCategoryPage( urlParam = "" ): ErrorPage {
        if ( urlParam != "" ) {
            urlParam = "?categoryIdentifier=" + urlParam;
        }
        this.navigateTo( "/category" + urlParam );
        return new ErrorPage();
    }

    goToCategory( catName: string, nItems: number ): CategoryPage {
        let targetElement: ElementFinder = element.all( by.cssContainingText( "[href]", catName ) ).first();
        this.waitForElementPresent( targetElement );
        this.waitForElementDisplayed( targetElement );
        browser.sleep( 500 );//todo, remove once we have proper site navigation
        targetElement.click().then( () => {
            console.log( "Clicked on category : " + catName );
        } );
        this.waitForCountToBeUpdated( CategoryPageObjs.itemContainers, nItems );
        return this;
    }

    goToItem( catName: string, nItems: number ): CategoryPage {
        let targetElement: ElementFinder = element.all( by.cssContainingText( "[href]", catName ) ).first();
        this.waitForElementPresent( targetElement );
        this.waitForElementDisplayed( targetElement );
        browser.sleep( 500 );//todo, remove once we have proper site navigation
        targetElement.click().then( () => {
            console.log( "Clicked on category : " + catName );
        } );
        this.waitForCountToBeUpdated( CategoryPageObjs.itemContainers, nItems );
        return this;
    }

    getContenByTag( catName: string ): Promise<boolean> {
        let targetElement: ElementFinder = element.all( by.css( "div[id^=contentByTag]" ) ).first();
        this.waitForElementDisplayed(targetElement);
        return new Promise<boolean>( ( resolve, reject ) => {
                browser.debugger();
                targetElement.isPresent().then(r => {
                    console.log("content by tag present " + r);
                    resolve(r);
                });
        } );
    }

    isArticleContainerPresent() : Promise<boolean>{
        return new Promise<boolean>((resolve, reject) =>{
            CategoryPageObjs.articleContainers.count().then(count =>{
                if(count > 0){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            });
        })
    }

}
