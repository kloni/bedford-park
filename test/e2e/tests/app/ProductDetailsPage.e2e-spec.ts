import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { browser } from 'protractor';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { ProductRecommended } from '../../pageobjects/widget/ProductRecommended.po';

import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("ProductDetailsPage.e2e");

/**
* Product Details Page as Registered User
*
*/

describe('User views product details page in Stockholm store as a registered user', () => {

    var dataFile = require('./data/ProductDetailsPage.json');
    const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
    var storeFront: StoreFront;
    var banner : Banner;

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    beforeEach(function () {
        storeFront = new StoreFront();
        banner = storeFront.banner();
    });

    it('to successfully navigate to product details page from home page: test01', () => {

        console.log('to successfully navigate to product details page from home page: test01');
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Stonehenge Large Elegant Wardrobe"]["BD-DRSS-0004-0001"];
        let attributes: string[] = Object.keys(product1.descriptiveAttributes);

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(3);

        //THEN the product page is loaded correctly with correct product name, short description, and price
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        pdp.getShortDescription().then(result => {
            expect(result).toBe(product1.shortDescription);
        });

        pdp.getProductOfferPrice().then(result => {
            expect(result).toBe("$" + numberWithCommas(sku1.priceOffering));
        });

        //AND
        //THEN quantity selector loaded correctly
        pdp.getProductQuantity().then(result => {
            expect(result).toBe("1");
        });

        //AND
        //THEN inventory availability loaded correctly
        pdp.getInventoryAvailability(0).then(result => {
            expect(result).toBe("In Stock");
        });

        //AND
        //THEN long description loaded correctly
        pdp.getLongDescription().then(result => {
            expect(result).toBe(product1.longDescription);
        });

        //AND
        //THEN product details loaded correctly with correct info
        attributes.forEach(attribute => {
            pdp.getProductDetails(0, attribute).then(result => {
                expect(result).toBe(product1.descriptiveAttributes[attribute].value);
            });
        });
    })

    it('to select different attributes and validate page being updated: test02', () => {

        console.log('to select different attributes and validate page being updated: test02');

        //navigate to product details page by using a product recommendation widget(ie. on home page)
        //GIVEN the homepage is loaded
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0003"];
        let attributes: string[] = Object.keys(product1.descriptiveAttributes);

        let baseProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"];
        let allSkus: string[] = Object.keys(baseProduct);
        allSkus.shift();
        //remove productinfo
        console.log(allSkus);

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var pdp: ProductPage = plp.clickProductAtIndex(2);

        allSkus.forEach(skuIdentifier => {
            let sku: Sku = baseProduct[skuIdentifier];
            console.log("foreacheachsku: " + skuIdentifier);
            let definingAttributes = Object.keys(baseProduct[skuIdentifier].attributes);
            definingAttributes.forEach(attribute => {
                pdp.clickTextAttribute(baseProduct[skuIdentifier].attributes[attribute].replace(/\s/g, ""));

                //offering price should update to correct price
                pdp.getProductOfferPrice().then(result => {
                    expect(result).toBe("$" + numberWithCommas(sku.priceOffering));
                    console.log(sku.imageFull + "TODO ENABLE GET PRODUCTIMAGE<-------------------image full for " + sku.sku);
                });

                //THEN thumbnail should be updated corresponding to chosen color
                // pdp.getProductImage().then(result => {
                //     expect(result).toContain("blue");
                // });
            });
        });

        //AND
        // WHEN selecting the specific sku and adding to cart
        pdp.selectAttributes(sku1);

        //SKU changed
        pdp.waitForSKUToBeUpdated(sku1.sku);
        pdp.getSKU().then(skuNumber => {
            expect(skuNumber).toEqual('SKU: ' + sku1.sku);
        });
        pdp.addToCart(1);

        //THEN confirmation should pop up with option to view cart
        pdp.getConfirmationModal().then(confirmation => {
            expect(confirmation).toContain("Item was added to the cart");
        });

        //browser.sleep(1000);//TODO: REMOVE WHEN HAVE A WORKAROUND FOR WCH-RESPONSIVE-MENU possibly solved with using id for cart_link?
        /* inconsistent error without the sleep, responsive menu gives some problems with how it reloads
        Failed: unknown error: Element <a>...</a> is not clickable at point (0, 0). Other element would receive the click: <div class="wch-responsive-menu ">...</div>
        (Session info: chrome=64.0.3282.186)
        (Driver info: chromedriver=2.36.540470 (e522d04694c7ebea4ba8821272dbef4f9b818c91),platform=Windows NT 10.0.16299 x86_64)
        */

        //WHEN view cart is clicked
        let shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);

        //THEN check the product exists, with the correct color and size
        shoppingCartPage.getProductNameAtIndex(0).then(result => {
            expect(result).toBe(product1.name);
        });

        shoppingCartPage.getProductQuantityAtIndex(0).then(quantity => {
            expect(quantity).toEqual(1);
        });


        shoppingCartPage.getProductSKUAtIndex(0).then(sku => {
            expect(sku).toContain(sku1.sku);
        });

        //clean up this test case
        shoppingCartPage.removeAllItems();

    })

    it('to view different views of the product using image carousel: test03', () => {

        console.log('to view different views of the product using image carousel: test03');
        let category = CATALOG.LivingRoom.LivingRoomFurniture;
        let product1: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"].productInfo;
        let sku1: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0001"];
        let attributes: string[] = Object.keys(product1.descriptiveAttributes);


        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
        plp.goToPage('3');
        new ProductListingPage(12);
        var pdp: ProductPage = plp.clickProductAtIndex(1);

        // sku1.slideImages.forEach(image => {
        //     pdp.getProductCarouselImage(0).then(result => {
        //         expect(result).toContain(image);
        //         console.log("but really should have checked for + " + image);
        //     });
        //     //WHEN different view is selected from thumbnail carousel
        //     pdp.clickProductImageForward();
        // });
        //WHEN different view is selected from thumbnail carousel
        // pdp.clickProductImageForward();

        //THEN thumbnail selected should reflect what was chosen from carousel
        // pdp.getProductCarouselImage(0).then(result => {
        //     expect(result).toContain("szyszko");
        // });
        //TODO: IMPLEMENT CHECK FOR THE ACTUALLY DISPLAYED IMAGE WHEN WE CLICK FORWARD AND BACK
        let count = 0;
        sku1.slideImages.forEach(image => {
            pdp.getProductCarouselImage(count).then(result => {
                expect(result).toContain(image);
                console.log(result + " but really should have checked for + " + image);
            });
            count++;
        });


        //WHEN view is reverted
        // pdp.clickProductImageBackward();
        // sku1.slideImages.reverse().forEach(image => {
        //     pdp.getProductCarouselImage(0).then(result => {
        //         expect(result).toContain("szyszko");
        //         console.log("but really should have checked for + " + image);
        //     });
        //     //WHEN different view is selected from thumbnail carousel
        //     pdp.clickProductImageBackward();
        // });

        // //THEN thumbnail should reflect original thumbnail of product
        // pdp.getProductCarouselImage(1).then(result => {
        //     expect(result).toContain("szyszko");
        // });


    })

    it('to add product to cart and verify cart has correct quantity: test04', () => {

        console.log('to add product to cart and verify cart has correct quantity: test04');
        let category = CATALOG.LivingRoom.LivingRoomFurniture;
        let product1: StockholmProduct = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"].productInfo;
        let sku1: Sku = CATALOG.LivingRoom.LivingRoomFurniture["Nordic Loveseat"]["LR-FUCH-0005-0005"];

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 12);
        plp.goToPage('3');
        new ProductListingPage(12);
        var pdp: ProductPage = plp.clickProductAtIndex(1);

        //THEN the product page is loaded correctly with correct product name
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //select attributes for sku
        pdp.selectAttributes(sku1);

        //WHEN quantity is increased to 10
        let i: number = 0;//counter for loop
        for (i = 0; i < 9; i++) {
            pdp.clickQuantityIncrement();
        }

        //THEN check quantity is 10
        pdp.getProductQuantity().then(quantity => {
            expect(quantity).toBe("10");
        });

        //WHEN add to cart is clicked
        pdp.addToCart(1);

        //THEN confirmation should pop up with option to view cart
        pdp.getConfirmationModal().then(confirmation => {
            console.log("CONFIRMATION", confirmation);
            expect(confirmation).toContain("Item was added to the cart");
        });

        //WHEN view cart is clicked
        let shoppingCartPage: ShoppingCartPage = pdp.clickViewCart(1);
        browser.sleep(5000);

        //THEN number of items in cart should be 1
        shoppingCartPage.getNumberOfProductsLoaded().then(num => {
            expect(num).toBe(1);
        });

        //AND
        //THEN check the product has the correct name
        shoppingCartPage.getProductNameAtIndex(0).then(result => {
            expect(result).toBe(product1.name);
        });

        //AND
        //THEN product has the correct sku
        shoppingCartPage.getProductSKUAtIndex(0).then(sku => {
            expect(sku).toContain(sku1.sku);
        });

        //AND
        //THEN product in cart should have quantity of 10
        shoppingCartPage.getProductQuantityAtIndex(0).then(quantity => {

            expect(quantity).toBe(10);
        });
    })

    //TODO: no product that has this
    xit('to see both display and offer price: test05', () => {

        console.log('to see both display and offer price: test05');
        let productData = dataFile.products;
        let testData = dataFile.test05;

        //WHEN product details page is loaded

        storeFront = new StoreFront();

        let pRecommended: ProductRecommended = new ProductRecommended();

        pRecommended.isDisplayed().then(result => {

            expect(result).toBe(true);
        });

        //WHEN user scrolls right
        pRecommended.clickCarouselNext(1);

        //THEN product 5 is displayed and have correct name
        //PRODUCT5
        pRecommended = new ProductRecommended(5);
        pRecommended.isDisplayed().then(result => {
            expect(result).toBe(true);
        });

        //WHEN user navigates to product details page via product recommendation widget
        let pdp: ProductPage = pRecommended.clickOnImage();

        //THEN the product page is loaded correctly with correct product name
        pdp.getProductName().then(result => {
            expect(result).toBe(productData[1].productName);
        });

        //THEN display price is displayed
        pdp.getProductDisplayPrice().then(displayPrice => {
            expect(displayPrice).toBe(productData[1].displayPrice);
        });

        //AND

        //THEN offer price is displayed
        pdp.getProductOfferPrice().then(offerPrice => {
            expect(offerPrice).toBe(productData[1].productPrice);
        });

    })

    xit('to check if a product is out of stock: test06', () => {

        //GIVEN product details page is loaded, have to have a product or two that are out of stock permanently

        //WHEN product has no inventory

        //THEN product details page should show inventory status 'out of stock'

        //WHEN add to cart is clicked

        //THEN should be some kind of error or should not allow shopper click add to cart(greyed out)

    })


    xit('to Open the attached file: test07', () => {

        console.log('to Open the attached file: test07');
        let testData = dataFile;

        //WHEN navigate to home page
        let storeFront = new StoreFront();

        //THEN product recommendation widget is shown
        let pRecommended: ProductRecommended = new ProductRecommended(0);

        pRecommended.isDisplayed().then(result => {

            expect(result).toBe(true);
        });

        pRecommended = new ProductRecommended(2);

        //WHEN click on first product which is furniture
        let productPage: ProductPage = pRecommended.clickOnImage();

        //THEN the product page is loaded correctly with correct product name
        productPage.getProductName().then(result => {
            expect(result).toBe(testData.test07.productName);
        });


        //click the attached file to open it
        productPage.clickProductAttachment(0);

        browser.getCurrentUrl().then(url => {

            expect(url).toContain(testData.test07.attachmentURL);

        })

    });

    it('to view a product that only has one color and size: test08', () => {
        console.log('to view a product that only has one color and size: test08');
        let category = CATALOG.Bath.Accessories;
        let product1: StockholmProduct = CATALOG.Bath.Accessories["Makeup Mirror"].productInfo;
        let sku1: Sku = CATALOG.Bath.Accessories["Makeup Mirror"]["BR-ACCE-0001-0001"];

        //WHEN user navigates to products page
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(0);

        //THEN the product page is loaded correctly with correct product name
        pdp.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //verify the color and size selection is not present
        pdp.getAttributeCount().then(count => {
            expect(count).toBe(1);
        });
        pdp.selectAttributes(sku1);
        pdp.getCssValue(dataFile.css.attr,sku1.attributes[0]).then(css => {
            expect(css).toEqual(undefined);
        });

    });

    it('to view a promotion for furniture products: test09', () => {
        console.log('to view a promotion for furniture products: test09');
        let testData = dataFile;
        let category = CATALOG.Bedroom.Dressers;
        let product1: StockholmProduct = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"].productInfo;
        let sku1: Sku = CATALOG.Bedroom.Dressers["Style Home Intree Chest of Drawers"]["BD-DRSS-0003-0003"];

        //THEN product recommendation widget is shown
        banner = storeFront.banner();
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 4);
        var productPage: ProductPage = plp.clickProductAtIndex(2);

        //THEN the product page is loaded correctly with correct product name
        productPage.getProductName().then(result => {
            expect(result).toBe(product1.name);
        });

        //THEN furniture promotion is displayed
        productPage.getProductPromotion().then(promo => {
            console.info("PROMO: ", promo);
            expect(promo).toBe(testData.test09.promotion);
        })

    });

    //TODO: not implemented
    xit('to share link of product details page: test10', () => {

        console.log('to share link of product details page: test10');
        let testData = dataFile;

        //THEN product recommendation widget is shown
        let pRecommended: ProductRecommended = new ProductRecommended(0);

        pRecommended.isDisplayed().then(result => {

            expect(result).toBe(true);
        });

        pRecommended = new ProductRecommended(0);

        //WHEN click on first product
        let productPage: ProductPage = pRecommended.clickOnImage();

        //THEN the product page is loaded correctly with correct product name
        productPage.getProductName().then(result => {
            expect(result).toBe(testData.products[0].productName);
        });

        //WHEN share link is clicked on

        productPage.clickShareLink();

        //THEN this is a TODO once this functionality is added in future

    });
})