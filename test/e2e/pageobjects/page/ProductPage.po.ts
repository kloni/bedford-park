import { BaseTest } from '../base/BaseTest.po';
import { by, element, browser } from 'protractor';
import { ShoppingCartPage } from './ShoppingCartPage.po';
import { Sku} from '../../tests/app/data/structures/StockholmCatalog';
import { WishListPage } from './WishListPage.po';
import { NewWishListDialog } from '../dialog/NewWishListDialog.po';
import { SignInModal } from '../dialog/SignInModal.po';
import { StoreLocatorPage } from '../page/StoreLocatorPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("ProductPage");

export const ProductDetailPageObjs = {

    productName: element.all(by.css("[id^=product_name_]")).first(),
    shortDescription: element.all(by.css("[id^=product_shortdescription_]")).first(),
    productDisplayPrice: element.all(by.className("displayPrice")).first(),
    productOfferPrice: element.all(by.css("[id^=product_offer_price_]")).first(),
    productQuantity: element.all(by.css("[id^=product_quantity_input_]")).first(),
    productQuantityIncrement: element.all(by.css("[id^=product_quantity_add_]")).first(),
    productQuantityDecrement: element.all(by.css("[id^=product_quantity_subtract_]")).first(),
    inventoryAvailability: element.all(by.css("[id^=product_availability_inStock_")),
    addToCart: element.all(by.css("[id^=product_add_to_cart_]")).first(),
    addToCartConfirmation: element.all(by.css("[id^=confirmationModal_]")).first(),
    viewCart: element.all(by.css("[id^=cart_link_")).first(),
    productImage: element.all(by.css("[id^=product_img_full_]")).first(),
    productImages: element.all(by.css("[id^=product_img_full_]")),
    productCarouselImage: element.all(by.className('product-details-slide-image')),
    productImageForwardArrow: element(by.className('slick-next')),
    productImageBackwardArrow: element(by.className('slick-prev')),
    productColor: element.all(by.css("[id^=swatch_color_img_]")),
    productSize: element.all(by.css("[id^=swatch_size_img_]")),
    productColorActive: element.all(by.className("swatch-active")).first(),
    shareLink: element.all(by.css("[id^=product_sharelink_]")).first(),
    facebookLink: element.all(by.css("[id^=product_facebook_]")).first(),
    twitterLink: element.all(by.css("[id^=product_twitter_]")).first(),
    longDescription: element.all(by.css("[id^=product_longdescription_]")).first(),
    promotion: element.all(by.css("[id^=product_advertisement_]")).first(),
    productAttachment: element.all(by.css("[id^=attachment_link_]")),
    attributeLabel: element.all(by.css(".attr-label")),
    sku: element.all(by.css("[id^=product_sku_]")),
    VATTax: element.all(by.css("[id^=product_price_vat_]")).first(),

    addToWishList: element.all(by.css("[id^=product_add_to_wishlist_]")).first(),
    wishListDropdown: element.all(by.css("[id^=wishList_dropDown]")).first(),
    wishListConfirmationModal: element.all(by.css("[id^=confirmModal_wishlist_]")).first(),
    wishListConfirmation: element.all(by.css("[id^=confirmModal_wishlist_confirmMsg_]")).first(),
    viewWishListLink: element.all(by.css("[id^=confirmModal_wishlist_viewWishList_]")).first(),
    createNewWishListButton: element.all(by.css("[id^=wishList_dropDown_createNew_]")).first(),

    //customer service
    lockedCartModal : element.all(by.css("[id^=pdpModalError_")).first(),
    lockedCartModals : element.all(by.css("[id^=pdpModalError_")),

    //Store locator
    changeStore : element.all(by.css("[id^=product_availability_store_selector_]")).first(),
    storeLocatorModal : element.all(by.css("[id^=storeLocator_modal_]")).first(),
    storeModalCloseButton : element.all(by.css("[id^=storeLocator_modal_close_]")).first(),
};

export class ProductPage extends BaseTest {

    constructor(productName :string = undefined) {
        super();
        this.waitForElementDisplayed(ProductDetailPageObjs.productName);
        this.waitForElementDisplayed(ProductDetailPageObjs.productOfferPrice);
        this.waitForElementDisplayed(ProductDetailPageObjs.addToCart);
        this.waitForElementEnabled(ProductDetailPageObjs.addToCart);
        this.waitForStableHeight(ProductDetailPageObjs.addToCart);
        if(productName!=undefined){
            this.waitForProductNameToBe(productName);
        }
        browser.sleep(1000);    //TODO: need proper check or defect, because add to cart does not function after directly navigating
    }

    productNameExists(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            ProductDetailPageObjs.productName.getText().then(productName => {
                if(productName.length > 0){
                    resolve(true);
                }else{
                    resolve(false);
                }
            })
        });
    }

    getProductName() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productName.getText().then(productName => {
                console.log('productName:', productName);
                resolve(productName);
            })
        });
    }

    waitForProductNameToBe(productName:string){
        this.waitForTextToBeUpdatedToContain(ProductDetailPageObjs.productName, productName);
    }

    getShortDescription() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.shortDescription.getText().then(shortDesc => {
                console.log('short Description:', shortDesc);
                resolve(shortDesc);
            })
        });
    }

    getProductOfferPrice() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productOfferPrice.getText().then(price => {
                console.log('Offer Price:', price);
                resolve(price);
            })
        });
    }

    getProductDisplayPrice() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productDisplayPrice.getText().then(price => {
                console.log('Display Price:', price);
                resolve(price);
            })
        });
    }

    getProductQuantity() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productQuantity.getAttribute('value').then(quantity => {
                console.log('Quantity:', quantity);
                resolve(quantity);
            })
        });
    }

    getProductPromotion() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.promotion.getText().then(promo => {
                console.log('Promotion:', promo);
                resolve(promo);
            })
        });
    }

    clickQuantityIncrement(): ProductPage {

        ProductDetailPageObjs.productQuantityIncrement.click();
        return this;

    }

    clickQuantityDecrement(): ProductPage {

        ProductDetailPageObjs.productQuantityDecrement.click();
        return this;

    }

    clickProductImageForward(): ProductPage {
        ProductDetailPageObjs.productImageForwardArrow.click();
        console.log("image forward arrow is clicked");
        return this;
    }

    clickProductImageBackward(): ProductPage {
        ProductDetailPageObjs.productImageBackwardArrow.click();
        console.log("image backward arrow is clicked");
        return this;
    }

    clickProductAttachment(index: number): ProductPage {
        ProductDetailPageObjs.productAttachment.get(index).click();
        console.log("Attachment is clicked at index: ", index);
        return this;
    }

    getInventoryAvailability(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.inventoryAvailability.get(index).getText().then(text => {
                console.log('Inventory Availability:', text);
                resolve(text);
            });
        });
    }

    addToCart(quantity: number): ProductPage {
        ProductDetailPageObjs.addToCart.click().then(function () {
            console.log("Click on add to cart button");
        });
        this.waitForElementDisplayed(ProductDetailPageObjs.addToCartConfirmation);
        return this;
    }

    getConfirmationModal() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.addToCartConfirmation.getText().then(text => {
                console.log('Added to cart confirmation: ', text);
                resolve(text);
            })
        });
    }

    confirmationModalDisplayed() {
        return this.waitForElementPresent(ProductDetailPageObjs.addToCartConfirmation, 5000);
    }

    clickTextAttribute(attribute: string): ProductPage {
        element.all(by.css("[id^=" + attribute + "_]")).first().click().then(()=>{
            console.log("Clicked on attribute: " + attribute);
        });
        return this;
    }

    clickViewCart(nProducts: number = -1): ShoppingCartPage {
        ProductDetailPageObjs.viewCart.click().then(function () {
            console.log("Clicked on View Cart link and expected number of products: " + nProducts);
        });
        return new ShoppingCartPage(nProducts);
    }
    getProductImage() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productImage.getAttribute('src').then(src => {
                console.log('IMAGE SRC:', src);
                resolve(src);
            })
        });
    }

    //TODO to make test03 check what is displayed
    getImageDisplayed() {
        //this.waitForElementNotDisplayed

    }

    //TODO to make test03 check what is not displayed
    getImageNotDisplayed() {
        //this.waitForElementNotDisplayed

    }

    getProductCarouselImage(index: number) {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.productCarouselImage.get(index).getAttribute('src').then(src => {
                console.log('IMAGE Carousel SRC:', src);
                resolve(src);
            })
        });
    }

    /**
     * Function checks if override sample images are present on the products page
     * @returns true when atleast one product image is present that is used with id from product overrides page
     */
    isIndividualProductImagesPresent() : Promise<boolean>{
        return new Promise<boolean>((resolve, reject) =>{
            ProductDetailPageObjs.productImages.count().then(count =>{
                if(count > 0){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            });
        })
    }

    getAttributeCount(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            ProductDetailPageObjs.attributeLabel.count().then(count => {
                resolve(count);
            })
        });
    }

    clickShareLink() {

        ProductDetailPageObjs.shareLink.click().then(function () {
            console.log("Click on share link button");
        });
        //TODO pop up to copy link should be returned(this code is not ready yet)
        //return new {insert here...}
    }

    clickFacebookLink() {

        ProductDetailPageObjs.facebookLink.click().then(function () {
            console.log("Click on facebook link button");
        });
        //TODO redirect to facebook? (this code is not ready yet)
        //return new {insert here...}
    }

    clickTwitterLink() {

        ProductDetailPageObjs.twitterLink.click().then(function () {
            console.log("Click on twitter link button");
        });
        //TODO redirect to twitter? (this code is not ready yet)
        //return new {insert here...}
    }

    getLongDescription() {
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.longDescription.getText().then(lDesc => {
                console.log('LONG DESC:', lDesc);
                resolve(lDesc);
            })
        });
    }

    getProductDetails(index: number, valueAppend:string) {
        return new Promise<string>((resolve, reject) => {
            let productDetails = element.all(by.css("[id^=product_attribute_value_" + valueAppend + "]"));
            productDetails.get(index).getText().then(details => {
                console.log('PRODUCT DETAILS:', details);
                resolve(details);
            })
        });
    }

    selectAttributes(sku: Sku): ProductPage {
        let definingAttributes = Object.keys(sku.attributes);
        definingAttributes.forEach(attribute => {
            console.log("selecting  " + attribute +  " : " + sku.attributes[attribute]);
            console.log('selector:', "[id^='" + sku.attributes[attribute] + "_']");
            element.all(by.css("[id^='" + sku.attributes[attribute] + "_']")).first().click();
        });
        return this;
    }

    getSwatchCSSByIndex(cssProperty: string, attribute:string) : Promise<string>{
        return new Promise<string>((resolve, reject) => {
            return this.getCssValue(cssProperty, element.all(by.css("[id^='" + attribute + "_']")).first());
        });
    }

    getSKU():Promise<string>{
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.sku.first().getText().then(skuNumber => {
                resolve(skuNumber);
            });
        });
    }
    waitForSKUToBeUpdated(skuNumber: string):ProductPage{
        this.waitForTextToBeUpdated(ProductDetailPageObjs.sku.first(), skuNumber);
        return this;
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(ProductDetailPageObjs.VATTax);
    }

    /**Wish List methods */
    addToWishList(): ProductPage {
        ProductDetailPageObjs.addToWishList.click().then(function () {
            console.log("Click on add to WishList button");
        });
        this.waitForElementDisplayed(ProductDetailPageObjs.wishListConfirmationModal);
        return this;
    }

    addToWishListAsAGust(): SignInModal {
        ProductDetailPageObjs.addToWishList.click().then(function () {
            console.log("Click on add to WishList button as a guest");
        });
        return new SignInModal();
    }

    wishListDropdownDisplayed(): Promise<boolean> {
        return this.waitForElementDisplayed(ProductDetailPageObjs.wishListDropdown);
    }

    selectWishList(wishListName: string  = 'Default Wishlist'): ProductPage{
        element.all(by.css("[id^=wishList_dropDown]")).first().all(by.cssContainingText("[id^=wishList_dropDown_a_10_]", wishListName)).first().click().then(function () {
            console.log("Click on wish list with text: ", wishListName);
        });
        this.waitForElementDisplayed(ProductDetailPageObjs.wishListConfirmationModal, 4000);
        this.waitForStableHeight(ProductDetailPageObjs.wishListConfirmation);
        this.waitForStableHeight(ProductDetailPageObjs.viewWishListLink);
        return this;
    }


    getWishListConfirmationModal(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.wishListConfirmation.getText().then(text => {
                console.log('Added to wishlist confirmation: ', text);
                resolve(text);
            })
        });
    }

    viewWishList(): WishListPage{
        ProductDetailPageObjs.viewWishListLink.click();
        return new WishListPage();
    }

    creaetNewWishList(): NewWishListDialog{
        ProductDetailPageObjs.createNewWishListButton.click();
        return new NewWishListDialog();
    }

    //Customer Service
    waitLockedCartErrorModalDisplayed() : Promise<boolean>{
        return this.waitForElementDisplayed(ProductDetailPageObjs.lockedCartModal);
    }

    getLockedCartErrorMessage() : Promise<string>{
        return new Promise<string>((resolve, reject) => {
            ProductDetailPageObjs.lockedCartModal.getText().then(result => {
                console.log('Locked cart error message:', result);
                resolve(result);
            });
        });
    }

    clickChangeStore(): StoreLocatorPage {
        this.waitForElementPresent(ProductDetailPageObjs.changeStore);
        this.waitForElementDisplayed(ProductDetailPageObjs.changeStore);
        this.waitForStableHeight(ProductDetailPageObjs.changeStore);
        ProductDetailPageObjs.changeStore.click().then(function () {
            console.log("Click on change store button");
        });

        this.waitForElementDisplayed(ProductDetailPageObjs.storeLocatorModal);
        return new StoreLocatorPage();
    }

    closeStoreModel() : ProductPage {
        ProductDetailPageObjs.storeModalCloseButton.click().then(function(){
            console.log("Click on close button of store location modal.")
        });
        this.waitForElementNotDisplayed(ProductDetailPageObjs.storeLocatorModal);
        return this;
    }
}
