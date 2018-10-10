import { BaseTest } from '../../pageobjects/base/BaseTest.po';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { SlideShow } from '../../pageobjects/widget/SlideShow.po';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';
import { CategoryPage } from '../../pageobjects/page/CategoryPage.po';
import { StockholmCatalog } from '../app/data/structures/StockholmCatalog';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("Page Override");


describe('User views Dynamic Override Page', () => {
    const CATALOG : StockholmCatalog = require('./data/StockholmProducts.json');
    const STOREFRONT : StoreFront = new StoreFront();
    const BANNER : Banner = STOREFRONT.banner();

    beforeAll(function () {
        let base = new BaseTest();
    });

    beforeEach(function () {
    });

    it('test01: verify category override page contains expected components', () => {
        console.log('test01: verify override page contains expected components');
        let category = CATALOG.LivingRoom;

        //WHEN user navigates to Living Room category page
        let megaMenu = BANNER.openMenu();
        megaMenu.navigateToCategoryPage(category.categoryName);

        //AND
        //WHEN waits for category page, slide show and recommended carousel loads
        let categoryPage : CategoryPage = new CategoryPage();
        let slideShow : SlideShow = new SlideShow(true);
        let pRecommended: ProductRecommended = new ProductRecommended(0);

        //THEN the slide show is displayed
        slideShow.isDisplayed().then(isDisplayed=>{
            expect(isDisplayed).toBe(true, " Expected slide show to be displayed.");
        });

        //AND
        //THEN the recommended carousel is displayed
        pRecommended.isDisplayed().then(isDisplayed=>{
            expect(isDisplayed).toBe(true, " Expected product recommendations from carousel to be displayed.");
        });

        //THEN individual article container(s) are present
        categoryPage.isArticleContainerPresent().then(isPresent =>{
            expect(isPresent).toBe(true, " Expected individual article container(s) to be present on page");
        });
    });

    it('test02: verify category non-override page DOES NOT contain override components', () => {
        console.log('test02: verify non-override page DOES NOT contain override components');
        let category = CATALOG.Bath;

        //WHEN user navigates to Living Room category page
        let megaMenu = BANNER.openMenu();
        megaMenu.navigateToCategoryPage(category.categoryName);

        //AND
        //WHEN waits for category page, slide show and recommended carousel loads
        let categoryPage : CategoryPage = new CategoryPage()
        let slideShow : SlideShow = new SlideShow(false);
        let pRecommended: ProductRecommended = new ProductRecommended(0, false);

        //THEN the slide show is NOT displayed, wait 5000ms
        slideShow.isDisplayed(5000).then(isDisplayed=>{
            expect(isDisplayed).toBe(false, " Expected slide show to NOT be displayed.");
        });

        //AND
        //THEN the recommended carousel is NOT displayed
        pRecommended.isDisplayed().then(isDisplayed=>{
            expect(isDisplayed).toBe(false, " Expected product recommendations from carousel to NOT be displayed.");
        });
    });

    it('test03: verify product override page contains expected image layout', () => {
        console.log('test03: verify product override page contains expected image layout');

        let category = CATALOG.LivingRoom;
        let product = CATALOG.LivingRoom.LivingRoomFurniture["Modern Armchair"];
        //TODO: use product for navigation instead of plp index?

        //WHEN user goes to a product page that has page override
        let megaMenu = BANNER.openMenu();
        let plp: ProductListingPage = megaMenu.navigateToPLP(category.LivingRoomFurniture.subCategoryName, 12);
        plp.goToNextPage();
        new ProductListingPage(12);
        var pdp: ProductPage = plp.clickProductAtIndex(9);

        //THEN individual product images are present
        pdp.isIndividualProductImagesPresent().then(isPresent =>{
            expect(isPresent).toBe(true, " Expected individual product image(s) to be present on page");
        });
    });

    it('test04: verify product override page contains expected image layout', () => {
        console.log('test04: verify product override page contains expected image layout');

        let category = CATALOG.LivingRoom;
        let product = CATALOG.LivingRoom.LivingRoomFurniture["Casual Sofa"]; //todo: use product for navigation instead of plp index?

        //WHEN user goes to a product page that does NOT have an override
        let megaMenu = BANNER.openMenu();
        let plp: ProductListingPage = megaMenu.navigateToPLP(category.LivingRoomFurniture.subCategoryName, 12);
        let pdp: ProductPage = plp.clickProductAtIndex(11); //todo: use product for navigation instead of plp index?

        //THEN individual product images are not present
        pdp.isIndividualProductImagesPresent().then(isPresent =>{
          expect(isPresent).toBe(false, " Expected individual product image(s) to NOT be present on page");
        });
    });
});

