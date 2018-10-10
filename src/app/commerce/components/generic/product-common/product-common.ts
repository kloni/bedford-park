import { InventoryavailabilityService } from "../../../services/rest/transaction/inventoryavailability.service";
import { StorefrontUtils } from "../../../common/storefrontUtils.service";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { DigitalAnalyticsService } from "../../../services/digitalAnalytics.service";
import { CartTransactionService } from "../../../services/componentTransaction/cart.transaction.service";
import { OrderTransactionService } from "../../../services/componentTransaction/order.transaction.service";
import { AuthenticationTransactionService } from "../../../services/componentTransaction/authentication.transaction.service";
import { Logger } from "angular2-logger/core";
import { Router } from "@angular/router";
import { Constants } from "app/Constants";
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

type Constructor<T> = new (...args: any[]) => T;

export function ProductCommonMixin<T extends Constructor<{}>>(Base: T) {
    return class extends Base{
        readonly PRODUCT_CARD:string = "product-card";
        readonly COLLECTION_CARD:string = "collection-card";
        readonly VALID_PROPERTIES: string[] = ['productInternal', 'productDesc', 'eSpotDescInternal', 'eSpotInternal'];
        readonly PREFERRED_STORE_KEY: string = 'preferredStore';
        readonly ONLINE_STORE_KEY: string ='Online';
        readonly AVAILABLE_KEY: string = 'Available';
        id:any;
        user: any = {};
        currentSelection: any = {
            sku: {
                fullImage: ""
            },
            quantity: 1,
            isAngleImage: false,
            selectedAttributes: {},
            priceDisp: "",
            priceCurr: "",
            availability: null
        };
        product: any = {
            price: [{}],
            availableAttributes: [{ values: [{}] }],
            fullImage: ""
        };
        descAttributes: any[] = [];
        definingAttributes: any[] = [];
        defnAttrSrc:any[]=[];
        productType: string = "";
        bundlePrice: any;
        bundleCurrency: any;
        availAttrs:Set<string> = new Set<string>();
        invalidSKU: boolean;
        currency: any;
        errMsg: string = "";
        parentCategoryIdentifier: string;
        private selectdWishListExternalId: string;
        readonly addToWishListModelId: string = "addToWishListModal_";
        readonly newWishListModalId: string = "newWishListModal_";
        readonly signInModelId: string = "signInModal_";
        readonly storeLocatorModelId: string = "storeLocator_modal_";
        private wishListConfirm: boolean = false;
        public wishLists: any[] = [];
        isGuest: boolean = true;
        loginErrorMsg: any;
        isSmall: boolean;
        signInLink: string;
        extraAssetWork(product:any) {}

        extraSlideWork() {}

        initializeProduct(p: any, inv:InventoryavailabilityService, su:StorefrontUtils, attr?: any) {
            if (p) {
                this.product = JSON.parse(JSON.stringify(p));
                this.descAttributes = [];
                this.definingAttributes = [];
                this.defnAttrSrc = [];
                this.availAttrs.clear();
                if (p.attributes) {
                    this.product.availableAttributes = JSON.parse(JSON.stringify(p.attributes));
                    this.getDescriptiveAndDefiningAttributes();
                }

                // Product
                if (this.product.sKUs && this.product.sKUs.length > 0) {
                    this.currentSelection.sku = this.product.sKUs[0];
                    if (this.currentSelection.sku.attributes)
                        this.initializeSelectedAttributes(inv, su, attr);
                    else if (this.currentSelection.sku.uniqueID)
                        this.getInventory(this.currentSelection.sku.uniqueID, inv, su);
                } else {
                    this.currentSelection.sku = this.product;
                    this.currentSelection.selectedAttributes = {};
                    if (this.currentSelection.sku.attributes) {
                        for (const att of this.currentSelection.sku.attributes) {
                            if (att.values.length) {
                                this.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
                            }
                        }
                    }
                }

                this.currentSelection.quantity = 1;
                if (this.productType == "package") {
                    this.getInventory(this.currentSelection.sku.uniqueID, inv, su);
                }
                this.extraAssetWork(p);

                if (this.productType =="bundle") {
                    this.bundlePrice = this.currentSelection.sku.price[1].value;
                    this.bundleCurrency =  this.currentSelection.sku.price[1].currency;
                }

                if (!this.product.seoUrl) {
                    this.getStoreUtils().getSeoUrlMapForProducts([p])
                        .then(urlIdMap => {
                            switch (p.catalogEntryTypeCode) {
                                case 'ProductBean': {
                                    this.product.seoUrl = urlIdMap['idc-product-' + p.partNumber];
                                    break;
                                }
                                case 'BundleBean': {
                                    this.product.seoUrl = urlIdMap['idc-bundle-' + p.partNumber];
                                    break;
                                }
                                case 'PackageBean': {
                                    this.product.seoUrl = urlIdMap['idc-kit-' + p.partNumber];
                                    break;
                                }
                            }
                        });
                }
            }
            return this.product;
        }
        getDescriptiveAndDefiningAttributes() {
            for (const att of this.product.availableAttributes) {
                if (att.usage === 'Descriptive' && att.displayable && att.identifier != 'PickUpInStore' && !(att.identifier).startsWith('ribbonad')) {
                    this.descAttributes.push(att);
                } else if (att.usage === 'Defining') {
                    this.definingAttributes.push(att);
                    this.defnAttrSrc.push(att);
                }
            }
            if (this.product.sKUs) {
                this.availableAttributes(this.product.sKUs);
            }
        }

        attrs2Object(attrs:any[]):any{
            if (attrs === undefined) {
                return {};
            }
            return attrs.reduce((obj:any, attr:any) => {
                obj[attr.identifier] = attr.values[0].identifier;
                return obj;
            }, {});
        }

        availableAttributes(skus: any[]): void {
            let c:any;
            let u:string[]
            for (const s of skus) {
                c=this.attrs2Object(s.attributes);
                u=[];
                for (let d of this.definingAttributes) {
                    u.push(c[d.identifier]);
                }
                this.availAttrs.add(u.join("|"));
            }
        }

        private initializeSelectedAttributes(inv:InventoryavailabilityService, su:StorefrontUtils, attr?: any): void {
            this.currentSelection.selectedAttributes = {};

            if (attr) {
                for (const att of attr) {
                    this.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
                }
            } else {
                for (const att of this.currentSelection.sku.attributes) {
                    this.currentSelection.selectedAttributes[att.identifier] = att.values[0].identifier;
                }
            }

            const sku = this.resolveSKU(this.product.sKUs, this.currentSelection.selectedAttributes);
            if (sku === "") {
                this.invalidSKU = true;
            } else {
                this.invalidSKU = false;
                this.currentSelection.sku = sku;
                this.getInventory(this.currentSelection.sku.uniqueID, inv, su);
            }
        }

        resolveSKU(skus: any, selectedAttributes: any): any {
            for (const s of skus) {
                const values = s.attributes.reduce((value: any, a: any) => {
                    value[a.identifier] = a.values[0].identifier;
                    return value;
                }, {});
                let match = true;
                for (const key in selectedAttributes) {
                    match = match && selectedAttributes[key] === values[key];
                }
                if (match) {
                    return s;
                }
            }
            /* istanbul ignore next */
            return "";
        }

        getInventory(productId, inv:InventoryavailabilityService, su:StorefrontUtils) {
            let preferredStore: any = JSON.parse(localStorage.getItem(this.PREFERRED_STORE_KEY));
            let physicalStoreId: string = '';
            if (preferredStore) {
                physicalStoreId = preferredStore.storeId;
            }
            if (inv) {
                inv.getInventoryAvailabilityByProductId({ "storeId": su.commerceStoreId, "productIds": productId, "physicalStoreId": physicalStoreId }).toPromise()
                .then(res => {
                    this.currentSelection.availability = [];
                    let onlineInventory = res.body.InventoryAvailability.find(inventory => inventory.onlineStoreId);
                    this.currentSelection.availability.push({
                        storeId: onlineInventory.onlineStoreId,
                        storeName: this.ONLINE_STORE_KEY,
                        inventoryStatus: onlineInventory.inventoryStatus === this.AVAILABLE_KEY ? true : false
                    });
                    for (let inventory of res.body.InventoryAvailability) {
                        if (inventory.physicalStoreId && inventory.physicalStoreName) {
                            this.currentSelection.availability.push({
                                storeId: inventory.physicalStoreId,
                                storeName: inventory.physicalStoreName,
                                inventoryStatus: inventory.inventoryStatus === this.AVAILABLE_KEY ? true : false
                            });
                        }
                        else if (inventory.physicalStoreId && !inventory.physicalStoreName) {
                            this.currentSelection.availability.push({
                                storeId: inventory.physicalStoreId,
                                storeName: inventory.physicalStoreId,
                                inventoryStatus: inventory.inventoryStatus === this.AVAILABLE_KEY ? true : false
                            });
                        }
                    }
                }).catch(
                    e => {
                        return Promise.resolve<HttpResponse<any>>(new HttpResponse<any>());
                    }
                );
            }
        }
        onAttributeChange(attr?: any, val?: any): void {
            if (attr && val) {
                this.currentSelection.selectedAttributes[attr.identifier] = val.identifier;
            }
            const sku = this.resolveSKU(this.product.sKUs, this.currentSelection.selectedAttributes);
            if (sku === "") {
                this.invalidSKU = true;
                this.currentSelection.availability = [];
            } else {
                this.invalidSKU = false;
                this.currentSelection.sku = sku;
                this.extraSlideWork();
                this.getInventory(this.currentSelection.sku.uniqueID, this.getInvSvc(), this.getStoreUtils());
            }
            // Since pipes are pure by default (impure pipes might as well be a function call), we
            //   force the pdpAttr pipe by resetting definingAttributes array with a shallow-copy
            this.definingAttributes=this.defnAttrSrc.slice();
        }
        getInvSvc():InventoryavailabilityService { return null; }
        getStoreUtils():StorefrontUtils { return null; }
        getDASvc():DigitalAnalyticsService { return null; }
        getCartSvc():CartTransactionService { return null; }
        getOrderSvc(): OrderTransactionService { return null;}
        getLogger():Logger { return null; }
        getAuthSvc(): AuthenticationTransactionService { return null; }
        getRouter():Router { return null; }
        getLayoutId() { return "product-details-image"; }

        getCartLink(): string { return null; }

        getWishListLink(): string { return null; }

        getStoreLocatorLink(): string {return this.getStoreUtils().getPageLink(Constants.storeLocatorPageIdentifier)}

        openConfirmationDialog() {
            if (this.wishListConfirm) {
                (<any>$(`#confirmModal_cart_${this.id}.notification-toast`)).css('display', 'none');
                (<any>$(`#confirmModal_wishlist_${this.id}.notification-toast`)).css('display', 'block');
                (<any>$('.notification-toast-error')).css('display', 'none');
            } else {
                (<any>$(`#confirmModal_cart_${this.id}.notification-toast`)).css('display', 'block');
                (<any>$(`#confirmModal_wishlist_${this.id}.notification-toast`)).css('display', 'none');
                (<any>$('.notification-toast-error')).css('display', 'none');
            }
            if (this.errMsg) {
                (<any>$('.notification-toast-error')).css('display', 'block');
                (<any>$('.notification-toast')).css('display', 'none');
            }
            this.openModal("confirmationModal_");
            setTimeout(() => {
                if ((<any>$(`#confirmationModal_${this.id}`)).length > 0) {
                    (<any>$(`#confirmationModal_${this.id}`)).foundation('close');
                }
            }, 4000);
        }
        viewCart() {
            this.getRouter().navigate([this.getCartLink()]);
        }

        getWishLists() : Promise<any> {
            return this.getOrderSvc().getAllWishList().then(res => {
                this.wishLists = res.GiftList.map(list => {
                    let tmp = {}
                    tmp['externalId'] = list.externalIdentifier;
                    tmp['name'] = list.descriptionName;
                    return tmp;
                });

                if (this.wishLists.length > 0) {
                    this.selectdWishListExternalId = this.wishLists[0].externalId;
                }
            });
        }

        openAddToWishListDropdown() {
            if(!this.isSmall){
                if ($('#wishList_dropDown_'+this.id).css('display') === 'none') {
                    StorefrontUtils.showWishlistDropDownMenu(this.id);

                    /** Change product recommendation css style */
                    const prodInfoObj = $('div.product-info-container');
                    prodInfoObj.css('position','relative');
                    prodInfoObj.css('z-index','2');
                    const prodRecommObj = $('div.product-recommendation-container');
                    prodRecommObj.css('position','relative');
                    prodRecommObj.css('z-index','1');
                }
                else {
                    this.hideWishlistDropDown();
                }
            } else {
                this.openAddToWishListModal();
            }
        }

        openSignInModal() { this.openModal(this.signInModelId) }

        openModal(mId:string) {
          const obj=(<any>$(`#${mId}${this.id}`));
          if (typeof obj.foundation === 'function') {
            obj.foundation('open');
          }
        }

        goToRegistrationPage(){
            this.getRouter().navigate( [this.signInLink] );
        }

        getOfferPriceForSelectedSku() {
            let price = '';
            this.currentSelection.sku.price.forEach( priceObj => {
                if (priceObj.usage === 'Offer' && priceObj.value !== null) {
                    price = priceObj.value;
                }
            });
            return price;
        }
        addToCart(): Promise<any> {
            this.errMsg = '';
            this.getDASvc().currentParentCategory = this.parentCategoryIdentifier;
            return this.getCartSvc().addToCart(this.currentSelection.quantity, this.currentSelection.sku.uniqueID).then(res => {
                this.getLogger().info(this.constructor.name + " addToCart: %o", res);
                const cartParam: any = {
                    pageName: this.product.name,
                    product: this.product,
                    quantity: this.currentSelection.quantity,
                    price: this.getOfferPriceForSelectedSku(),
                    category: this.parentCategoryIdentifier,
                    facet: this.getDASvc().analyticsFacet,
                    currency: sessionStorage.getItem('currentUserCurrency') === null ? this.getStoreUtils().commerceCurrency : sessionStorage.getItem('currentUserCurrency')
                };
                this.getDASvc().addToCart(cartParam);
                this.openConfirmationDialog();
                this.currentSelection.quantity = 1;
            }).catch(error => {
                this.errMsg = this._parseErrorMsg(error, "Could not add the product to cart");
                this.openConfirmationDialog();
            });
        }

        addToWishList(wishlistId : string): Promise<any> {
            this.errMsg = '';
            this.wishListConfirm = false;
            let selectedId = wishlistId;
            if(this.isSmall){
                if (StorefrontUtils.isGuestOrActingAs() || selectedId === undefined) {
                    return Promise.resolve({});
                }
                (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation('close');
            }
            return this.getOrderSvc().addItemToWishList(selectedId, this.currentSelection.sku.uniqueID).then(res => {
                this.getLogger().info(this.constructor.name + " addToWishList: %o", res);
                this.hideWishlistDropDown();
                this.wishListConfirm = true;
                this.openConfirmationDialog();
                this.wishListConfirm = false;
                $('#product_add_to_wishlist_text_'+this.id).css('display', 'none');
                $('#product_added_to_wishlist_text_'+this.id).css('display','inline');
                $('#added_to_cart_check_'+this.id).css('display', 'inline-block');
               setTimeout(() => {
                   $('#product_add_to_wishlist_text_'+this.id).css('display', 'inline');
                   $('#product_added_to_wishlist_text_'+this.id).css('display', 'none');
                   $('#added_to_cart_check_'+this.id).css('display', 'none');
               }, 4000);
            }).catch(error => {
                this.errMsg = this._parseErrorMsg(error, "Could not add the product to wish list");
                this.openConfirmationDialog();
            });
        }

        login(): Promise<void> {
            return this.getAuthSvc().login(this.user.username, this.user.password).then(res => {
                if ((<any>$(`#${this.signInModelId}${this.id}`)).length >0) {
                    (<any>$(`#${this.signInModelId}${this.id}`)).foundation('close');
                }
                this.isGuest = StorefrontUtils.isGuestOrActingAs();
                this.getWishLists();
            }).catch((error: HttpErrorResponse) => {
                this.loginErrorMsg = this. getStoreUtils().handleErrorCase(error, 'Could not log in');
            })
        }
        _parseErrorMsg(error: HttpErrorResponse, fallback: string): string {
            const eBody = error.error,
                rc = eBody && eBody.errors && eBody.errors.length && eBody.errors[0].errorMessage ? eBody.errors[0].errorMessage : fallback;
            return rc;
        }
        viewWishList() {
            this.getRouter().navigate([this.getWishListLink()]);
        }

        openStoreLocatorModal() {
            (<any>$(`#${this.storeLocatorModelId}${this.id}`)).foundation('open');
        }

        showCreateModal() {
            this.hideWishlistDropDown();
            (<any>$(`#${this.newWishListModalId}_${this.id}`)).foundation('open');
        }

        private hideWishlistDropDown() {
            /** hide the wishlist dropdown menu */
            StorefrontUtils.hideWishlistDropDownMenu(this.id);

            /** Change product recommendation css style back to normal */
            const prodInfoObj = $('div.product-info-container');
            prodInfoObj.css('position','static');
            prodInfoObj.css('z-index','auto');

            const prodRecommObj = $('div.product-recommendation-container');
            prodRecommObj.css('position','static');
            prodRecommObj.css('z-index','auto');
        }

        wishListCreation(f: NgForm) {
            this.getOrderSvc().createNewWishList([], f.value.descriptionName, f.value.description).then(res => {
                f.reset();
                (<any>$(`#${this.newWishListModalId}_${this.id}`)).foundation('close');
                this.getWishLists();
            })
        }
        openAddToWishListModal() {
            (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation('open');
        }
        addToWishListMobileView(): Promise<any> {
            if (StorefrontUtils.isGuestOrActingAs() || this.selectdWishListExternalId === undefined) {
                return Promise.resolve({});
            }
            (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation('close');
        }

        onResize(screenWidth: number) {
            if (screenWidth >= 640) {
                this.isSmall = false;
                if ((<any>$(`#${this.addToWishListModelId}${this.id}`)).length > 0) {
                    (<any>$(`#${this.addToWishListModelId}${this.id}`)).foundation('close');
                }
            } else {
                this.isSmall = true;
            }
        }

        constructor(...args: any[]) {
            super(...args);
        }
    }
};