import { browser } from 'protractor';
import { StoreFront } from '../../pageobjects/StoreFront.po';
import { Banner } from '../../pageobjects/banner/Banner.po';
import { LoginPage } from '../../pageobjects/page/LoginPage.po';
import { RegistrationPage } from '../../pageobjects/page/RegistrationPage.po';
import { ShoppingCartPage } from '../../pageobjects/page/ShoppingCartPage.po';
import { ProductPage } from '../../pageobjects/page/ProductPage.po';
import { StockholmCatalog, Sku, StockholmProduct } from '../app/data/structures/StockholmCatalog';
import { ProductListingPage } from '../../pageobjects/page/ProductListingPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("ShoppingCartAsRegisteredUser.e2e");
/**
 * ShoppingCart Page As Registered User
 */
describe('User views Shopping cart as a registered user', () => {
	var dataFile = require('./data/ShoppingCartAsRegisteredUser.json');
	const CATALOG: StockholmCatalog = require('./data/StockholmProducts.json');
	var date = new Date();
	var timeStamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDay().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getMilliseconds().toString();
	let storeFront: StoreFront;
	let banner: Banner;

	beforeAll(function () {
		storeFront = new StoreFront();

		banner = storeFront.banner().signOutIfSignedIn();
		let register: RegistrationPage = banner.clickSignIn(RegistrationPage);
		console.log("creating user: " + timeStamp + dataFile.user01.login);

		//create user
        register.typeFirstName(dataFile.user01.firstName).typeLastName(dataFile.user01.lastName + timeStamp).typeEmail(timeStamp + dataFile.user01.login).typePassword(dataFile.user01.password).typeVerifyPassword(dataFile.user01.password).clickRegister();
        banner.signInNotDisplayed();
        banner.myAccountDisplayed();
	});


	beforeEach(function () {
        banner.signOutIfSignedIn();
        banner.signInDisplayed();
        banner.signInDisplayed().then(signedIn => {
            if(!signedIn){
                banner.signOutIfSignedIn();
                banner.signInDisplayed();
            }
        })
		let login: LoginPage = banner.clickSignIn(LoginPage);

        login.typeUserName(timeStamp + dataFile.user01.login).typePassword(dataFile.user01.password).clickLogin();
        banner.signInNotDisplayed();
        banner.myAccountDisplayed();
	});

	afterEach(function () {
        banner.cartDisplayed();
		let shoppingCart: ShoppingCartPage = banner.clickShopCart();
		shoppingCart.waitForPossibleProductLoaded();

		browser.wait(function () {
			return shoppingCart.removeAllItems();
		});
	})

	it('to view the cart applies promotion code: test01', () => {
		console.log('to view the cart applies promotion code: test01');
        var testData = dataFile.test01;
        let category = CATALOG.Bath.Accessories;
		let product1: StockholmProduct = CATALOG.Bath.Accessories["Bender Toothbrush Holder"].productInfo;
		let sku1: Sku = CATALOG.Bath.Accessories["Bender Toothbrush Holder"]["BR-ACCE-0002-0001"];

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded

		//WHEN user navigates to products page and adds a product to their cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);

		pdp.addToCart(1);
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//AND
		//THEN expected product is in cart with correct details
		var originalDiscountAmmount: number;
		var productName = product1.name;
		var productSKU = "SKU: " + sku1.sku;
		var productPrice = "$" + sku1.priceOffering.toFixed(2);

		shoppingCartPage.getProductNameAtIndex(0).then(name => {
			expect(name).toEqual(productName);
		});
		shoppingCartPage.getProductSKUAtIndex(0).then(sku => {
			expect(sku).toEqual(productSKU);
		});
		shoppingCartPage.getProductPriceAtIndex(0).then(price => {
			expect(price).toEqual(productPrice);
		});
		shoppingCartPage.getProductQuantityAtIndex(0).then(quantity => {
			expect(quantity).toEqual(1);
		});

		//AND
		//THEN the correct discount is shown after promotion is applied and removed
		shoppingCartPage.getDiscount().then(discount => {
			originalDiscountAmmount = discount;
			shoppingCartPage.typePromotionCode(testData.promotionCode);
			shoppingCartPage.clickApplyPromotion();


			browser.wait(() => {
				return shoppingCartPage.getDiscount().then(discount => {
					return discount !== originalDiscountAmmount;
				});
			}, 10000, "Warning, discount did not update as expected within 10000ms").then(null, function (error) {
				console.log("discount still value of " + originalDiscountAmmount + " : " + error);
				return false;
			});;

			shoppingCartPage.getDiscount().then(discount => {
				expect(discount).toBe(testData.expectedDiscount, " discount amount not correct.");
				expect(discount).not.toBe(originalDiscountAmmount, "original discount amount the same as new discount amount, something may be wrong with promotion priority");
			});

			//AND
			//THEN validate total with promotion
			shoppingCartPage.getTotal().then(total => {
				console.log("Total price with promotion: " + total);
				expect(total).toBe(testData.expectedTotalWithPromo);
			});

			shoppingCartPage.clickRemovePromotion();
			browser.wait(() => {
				return shoppingCartPage.getDiscount().then(discount => {
					return discount === originalDiscountAmmount;
				});
			}, 10000, "Warning, discount did not update as expected within 10000ms").then(null, function (error) {
				console.log("discount still value of " + originalDiscountAmmount + " : " + error);
				return false;
			});;

			shoppingCartPage.getDiscount().then(discount => {
				expect(discount).toBe(originalDiscountAmmount, " discount has not returned to original after removing promotion");
			});

			//AND
			//THEN validate total without promotoin
			shoppingCartPage.getTotal().then(total => {
				console.log("Total price without promotion: " + total);
				expect(total).toBe(testData.expectedTotalWithoutPromo);
			});
		});

	});

	it('to have multiple products in cart and update quantity: test02', () => {
		console.log("to have multiple products in cart and update quantity: test02");
        var testData = dataFile.test02;
        var category = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded
		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);
        pdp.addToCart(1);

        banner.openMenu();
        var plp = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp = plp.clickProductAtIndex(0);
		pdp.addToCart(1);

		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//AND
		//WHEN user navigates to shopcart there are two products in the cart
		shoppingCartPage = banner.clickShopCart();
		new ShoppingCartPage(2);

		//THEN there are 2 products in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(2, " shopcart does not have correct number of products loaded");
		});

		//AND
		//THEN the subtotal and total amounts are adjusted correctly after quantity is changed
		shoppingCartPage.getSubtotal().then(subTotal => {
			console.log("Subtotal before quantity change: " + subTotal);
			expect(subTotal).toBe(testData.expectedSubtotal, " subtotal");
		});
		shoppingCartPage.getDiscount().then(discount => {
			console.log("Discount before quantity change: " + discount);
			expect(discount).toBe(testData.expectedDiscount, " discount");
		});
		shoppingCartPage.getTotal().then(total => {
			console.log("Total before quantity change: " + total);
			expect(total).toBe(testData.expectedTotal, " total");
		});

		//WHEN user changes product quantity of one product to 2 and waits for subtotal to update
		shoppingCartPage.typeProductQuantity(1, "2").waitForDiscountToEqual(testData.expectedDiscount2);

		//THEN the subtotal and total amounts are adjusted correctly after quantity is changed
		shoppingCartPage.getSubtotal().then(subTotal => {
			console.log("Subtotal after quantity change: " + subTotal);
			expect(subTotal).toBe(testData.expectedSubtotal2, " subtotal");
		});
		shoppingCartPage.getDiscount().then(discount => {
			console.log("Discount after quantity change: " + discount);
			expect(discount).toBe(testData.expectedDiscount2, " discount");
		});
		shoppingCartPage.getTotal().then(total => {
			console.log("Total after quantity change: " + total);
			expect(total).toBe(testData.expectedTotal2, " total");
		});

	});

	it('to remove an item from shopping cart: test03', () => {
        console.log('to remove an item from shopping cart: test03');
        let category = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded
		//WHEN user navigates to each products page and adds products to their cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(0);
        pdp.addToCart(1);

        megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);
        pdp.addToCart(1);

        megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(2);
        pdp.addToCart(1);

		//WHEN USER NAVIGATES TO SHOPCART
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there are 2 products in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(3, " shopcart does not have correct number of products loaded");
		});

		//remove product one by one and verify item count in cart is updated correctly
		//WHEN user removes a product
		shoppingCartPage.removeItem(0);

		//THEN there are 2 products left in cart
		shoppingCartPage.waitForAllProductsLoaded(2).then(loaded => {
			expect(loaded).toBe(true, "cart does not have " + (2).toString() + " products")
		});

		//WHEN user removes a product
		shoppingCartPage.removeItem(0);

		//THEN there are 1 products left in cart
		shoppingCartPage.waitForAllProductsLoaded(1).then(loaded => {
			expect(loaded).toBe(true, "cart does not have " + (1).toString() + " products")
		});

		//WHEN user removes final product
		shoppingCartPage.removeItem(0);

		//THEN there are 0 products left in cart
		shoppingCartPage.waitForAllProductsLoaded(0).then(loaded => {
			expect(loaded).toBe(true, "cart does not have " + (0).toString() + " products")
		});

	});

	it('to apply an invalid promotion code: test04', () => {
		console.log('to apply an invalid promotion code: test04');
        var testData = dataFile.test04;
        let category  = CATALOG.Bath.Accessories;
		let productInfo1: StockholmProduct = CATALOG.Bath.Accessories["Makeup Mirror"].productInfo;
		let sku1: Sku = CATALOG.Bath.Accessories["Makeup Mirror"]["BR-ACCE-0001-0001"];

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded

		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(0);
        pdp.addToCart(1);

		//AND
		//WHEN user navigates to shopcart
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//WHEN user types and applies an an invalid promotion code
		shoppingCartPage.typePromotionCode(testData.promotionCode).clickApplyPromotion();

		//THEN invalid promotion code error message is displayed
		shoppingCartPage.verifyInvalidPromotionCodeDisplayed(dataFile.errorMessages.invalidPromotionCode);

		//WHEN user clears promotion code
		shoppingCartPage.clearPromotionCode();

		//THEN invalid promotion code error message is not displayed
		shoppingCartPage.verifyInvalidPromotionCodeNotDisplayed();
	});

	it('to update a product quantity to an invalid value: test05', () => {
		console.log('to update a product quantity to an invalid value: test05');
        var testData = dataFile.test05;
        let category  = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded

		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(0);
        pdp.addToCart(1);

		//AND
		//WHEN user navigates to shopcart
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//WHEN user changes product quantity from 0 to 2
		shoppingCartPage.typeProductQuantity(0, "2");

		//THEN product quantity is 2
		shoppingCartPage.getProductQuantity(0).then(productQuantity => {
			expect(productQuantity).toBe(2, "product quantity");
		});

		//WHEN user types invalid product quantity
		shoppingCartPage.typeProductQuantity(0, "a");

		//THEN product quantity remains unchanged at 2
		shoppingCartPage.getProductQuantity(0).then(productQuantity => {
			expect(productQuantity).toBe(2, "product quantity");
		});
	});

	it('to attempt to proceed with empty shopping cart: test06', () => {
		console.log('to attempt to proceed with empty shopping cart: test06');
		var testData = dataFile.test06;
        let category  = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded

		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);
		pdp.addToCart(1);

		//AND
		//WHEN user navigates to shopcart
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//AMD
		//THEN checkout button is displayed
		shoppingCartPage.verifyCheckoutButtonDisplayed();

		//WHEN user removes items
		shoppingCartPage.removeItem(0);

		//THEN there are zero products in shopcart
		shoppingCartPage.waitForAllProductsLoaded(0);

		//AND
		//THEN checkout button not displayed
		shoppingCartPage.verifyCheckoutButtonNotDisplayed();

	});

	it('to get quote for shipping: test07', () => {
		console.log('to get quote for shipping: test07');
        var testData = dataFile.test07;
        let category  = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded

		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);
        pdp.addToCart(1);

		//AND
		//WHEN user navigates to shopcart
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//WHEN user enters united states and valid us zip code andclicks get shipping quote
		shoppingCartPage.typeZipCode(testData.zipCode, testData.shippingCountry).clickGetShippingQuote();

		//THEN the shipping charge is expected to be amount
		shoppingCartPage.getShipping().then(shipping => {
			expect(shipping).toBe(testData.shippingBase, " Shipping charge.");
		});

		//WHEN user changes quantity from 1 to 2
		shoppingCartPage.typeProductQuantity(0, "2");

		//THEN quantity is updated
		shoppingCartPage.getProductQuantity(0).then(productQuantity => {
			expect(productQuantity).toBe(2, "product quantity");
		});

		//WHEN user waits for calculator to run
		shoppingCartPage.waitForDiscountToEqual(testData.discount);

		//AND
		//THEN shipping charge is updated for additional item
		shoppingCartPage.getShipping().then(shipping => {
			console.log("shipping charge after change: " + shipping);
			expect(shipping.toFixed(2)).toBe((testData.shippingBase + testData.shippingAdditional).toFixed(2), " Shipping charge after quantity update.");
		});
	});

	it('to update zipcode to an invalid value: test08', () => {
		console.log('to update zipcode to an invalid value: test08');
		var testData = dataFile.test08;
        let category  = CATALOG.Bath.Accessories;

		//GIVEN a user is logged in and has an empty shopping cart and the homepage is loaded
		//WHEN user navigates to products page and adds product to cart
        var megaMenu = banner.openMenu();
        var plp: ProductListingPage = megaMenu.navigateToPLP(category.subCategoryName, 3);
        var pdp: ProductPage = plp.clickProductAtIndex(1);
        pdp.addToCart(1);

		//AND
		//WHEN user navigates to shopcart
		var shoppingCartPage: ShoppingCartPage = pdp.clickViewCart();

		//THEN there is 1 product in Cart
		shoppingCartPage.getNumberOfProductsLoaded().then(products => {
			expect(products).toBe(1, " shopcart does not have correct number of products loaded");
		});

		//WHEN user types invalid zip code and check for error
		shoppingCartPage.typeZipCode(testData.invalidZipCode, testData.shippingCountry);
		shoppingCartPage.verifyInvalidZipCodeDisplayed(dataFile.errorMessages.invalidZipCode);

		//AND
		//WHEN user clear zipcode and check that error is not longer displayed
		shoppingCartPage.clearZipCode();

		//THEN the invalid zip code message not displayed
		shoppingCartPage.verifyInvalidZipCodeNotDisplayed();
	});

	xit('to navigate to a product from shopping cart: test08', () => {
		var testData = dataFile.test1

		//add a product to cart

		//go to shopping cart

		//Click on a product link

		//Vadliate the current page is product page

		//Go to shopping cart

		//Click on producrt image

		//Validaet the current page is product page

	});

	xit('to select paypal payment method: test09', () => {
		var testData = dataFile.test1

		//add a product to cart

		//go to shopping cart

		//Click on Paypal link

	});

	xit('to select apple pay payment method: test10', () => {
		var testData = dataFile.test1

		//add a product to cart

		//go to shopping cart

		//Click on Apple pay link

	});
});