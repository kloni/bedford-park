import { Banner } from '../../pageobjects/banner/Banner.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';
import { Breadcrumb } from '../../pageobjects/banner/Breadcrumb.po';

import { StockholmCatalog } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Category Page");


describe('User views Category Page', () => {

    const TESTDATA = require('./data/CategoryPage.json');
    const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
    var storeFront: StoreFront;
    var banner: Banner;

    beforeAll(function () {
    });

    beforeEach(function () {
        storeFront = new StoreFront();
        banner = storeFront.banner();
    });

    it('test01: navigate from parent category to child category', () => {
        console.log('test01: navigate from parent category to child category');
        let category = CATALOG.LivingRoom;
        let subcategories : string[] = Object.keys(category);
        subcategories.shift(); //remove categoryName

        console.log("subcategories from " + category.categoryName + " :" + subcategories);

        //go to category page
        var megaMenu = banner.openMenu();
        var categoryPage: CategoryPage = megaMenu.navigateToCategoryPage(category.categoryName);
        categoryPage = new CategoryPage(0, 3);

        //verify the correct subcategories are displayed
        let count : number = 0;
        subcategories.forEach(subcategory =>{
            categoryPage.getChildCategoryName(count).then(result => {
                console.log(subcategory + "<----subcategory TODO: remove");
                expect(result).toBe(category[subcategory].subCategoryName, " for subcategory name");
            });
            count++;
        });

        // click on second cateogory
        let selectedSubcategory = categoryPage.clickChildCategoryName(2);
        new ProductListingPage();
        let breadcrumb : Breadcrumb = new Breadcrumb(2);

        //verify breadcrumb contains category
        breadcrumb.getBreadcrumbText(0).then(result => {
            console.log("breadcrumb 0 :" + result);
            expect(result).toBe(category.categoryName);
        });

        //verify 2nd breadcrumb contains subcategory
        breadcrumb.getBreadcrumbText(1).then(result => {
            console.log("breadcrumb 1 : " + result);
            expect(result).toBe(category[subcategories[2]].subCategoryName);
        });
    });


    //TODO: perhaps use plp to go a third level for 3xbreadcrumb
    it('test02: to Navigate to subcategory page and use breadcrumb to go back', () => {
        console.log('test02: to Navigate to subcategory page and use breadcrumb to go back');
        let category = CATALOG.Bath;
        //let subCategory = category.Accessories;
        // let product1 : StockholmProduct = category.Accessories
        let subcategories : string[] = Object.keys(category);
        subcategories.shift(); //remove category name
        let products : string[] = Object.keys(category);
        let targetSubcategoryIndex : number = 2; //index of subcategory used for navigation
        let targetProductIndex : number = 1;    //index of product

        console.log("Category: " + category.categoryName + " and navigate to subcategory: " + category[subcategories[targetSubcategoryIndex]] + "and select product ");

        //navigate to Bath category
        //go to category page
        var megaMenu = banner.openMenu();
        var categoryPage: CategoryPage = megaMenu.navigateToCategoryPage(category.categoryName);
        categoryPage = new CategoryPage(0, 3);

        //click subcategory
        categoryPage = categoryPage.clickChildCategoryName(targetSubcategoryIndex);

        // //click product
        // categoryPage = categoryPage.clickChildCategoryName(targetProductIndex);

        let breadcrumb : Breadcrumb = new Breadcrumb(2);

        //verify breadcrumb says "Apparel Women Dresses"
        breadcrumb.getBreadcrumbText(0).then(result => {
            expect(result).toBe(category.categoryName);
        })
        breadcrumb.getBreadcrumbText(1).then(result => {
            expect(result).toBe(subcategories[targetSubcategoryIndex]);
        })

        // categoryPage.getBreadcrumbText(2).then(result => {
        //     expect(result).toBe(products[targetProductIndex]);
        // })

        //click on category crumb
        categoryPage = categoryPage.clickBreadcrumb(0);

        //view the apparel category page
        categoryPage.getCategoryName().then(result => {
            expect(result).toBe("All " + category.categoryName );
        });
    });

    it('test03: directly hitting a category page via URL should show breadcrumb', () => {
        console.log('test03: directly hitting a category page via URL should show breadcrumb');
        let category = CATALOG.Bath
        let subCategory = category.Accessories;

        //navigate to Bath category
        var megaMenu = banner.openMenu();
        var categoryPage: ProductListingPage = megaMenu.navigateToPLP(subCategory.subCategoryName, 3);
        let breadcrumb : Breadcrumb = new Breadcrumb(2);

        //verify breadcrumb is showing longest default path
        breadcrumb.getBreadcrumbText(0).then(result => {
            expect(result).toBe("Bath");
        });

        breadcrumb.getBreadcrumbText(1).then(result => {
            expect(result).toBe("Accessories");
        });


    });

    it('test05: department pages should not have breadcrumb', () => {

        console.log('test05: department pages should not have breadcrumb');
        let category = CATALOG.Bath;

        //go to category page
        //navigate to Bath category
        var megaMenu = banner.openMenu();
        var categoryPage: CategoryPage = megaMenu.navigateToCategoryPage(category.categoryName);
        categoryPage = new CategoryPage(0, 3);

        //verify that dept page should not have breadcrumb
        categoryPage.getBreadcrumbText(0).then(result => {
            expect(result).toBe('');
        });

    });

    it('test06: Category Apparel page should have content by tag', () => {
        console.log('test06: Category Apparel page should have content by tag');
        let category = CATALOG.Bath;

        //navigate to Bath category
        var megaMenu = banner.openMenu();
        var categoryPage: CategoryPage = megaMenu.navigateToCategoryPage(category.categoryName);
        categoryPage = new CategoryPage(0, 3);

        //verify that apparel page should have content by tag
        categoryPage.getContenByTag(category.categoryName).then(result => {
            expect(result).toBeTruthy();
        });

    });
});

