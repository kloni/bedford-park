import { Injectable } from '@angular/core';
import { Constants } from 'app/Constants';
import { environment } from 'app/environment/environment';
import { Logger } from 'angular2-logger/core';
import { StorefrontUtils } from 'app/commerce/common/storefrontUtils.service';
import { CommerceEnvironment } from 'app/commerce/commerce.environment';
import { StoreConfigurationsCache } from 'app/commerce/common/util/storeConfigurations.cache';
import { BreadcrumbService } from 'app/commerce/common/util/breadcrumb.service';

function formatAmount(amount: any): any {
  return parseFloat(amount).toFixed(2);
}

@Injectable()
export class DigitalAnalyticsService {

  private _isInitialized: boolean;
  analyticsFacet: string = '';
  analyticsFacetList: any[] = [];
  currentParentCategory: string = '';
  productInBreadcrumb: any;
  categoryInBreadcrumb: any;
  readonly READ_DDX_OBJECT_KEY: string = 'readDDXObject';
  readonly CM_SETUP_OTHER_KEY: string = 'cmSetupOther';
  readonly CM_CREATE_MANUAL_IMPRES_TAG_KEY: string = 'cmCreateManualImpressionTag';

  constructor(
    private logger: Logger,
    private storeUtils: StorefrontUtils,
    private storeConfCache: StoreConfigurationsCache,
    private breadcrumbService: BreadcrumbService) {
    this._isInitialized = false;

    let productInBreadcrumbSub = this.breadcrumbService.selectedProduct$.subscribe( prod => {
      this.productInBreadcrumb = prod;
    });

    let categoryInBreadcrumbSubscription = this.breadcrumbService.selectedDepartment$.subscribe( category => {
      this.categoryInBreadcrumb = category;
    });

  }

  set isInitialized(isInitialized: boolean) { this._isInitialized = isInitialized; }
  get isInitialized(): boolean { return this._isInitialized; }

  initializeDA(): void {
    if (!!this.storeUtils.digitalAnalyticsConfig) {
      let clientIds: string[] = [];
      if (environment.production)
        clientIds = this.storeUtils.digitalAnalyticsConfig.ProductionClientIds;
      else
        clientIds = this.storeUtils.digitalAnalyticsConfig.DevelopmentClientIds;

      Promise.resolve(this.storeConfCache.isEnabled(CommerceEnvironment.digitalAnalyticsFeatureName).then(isDAEnabled => {
        if (isDAEnabled) {
          this.loadScript().then(() => {
            IORequest.disable_console_logging = true;
            cmSetupNormalization('krypto-_-krypto');
            this.setClientID(clientIds, this.storeUtils.digitalAnalyticsConfig.DataCollectionMethod, this.storeUtils.digitalAnalyticsConfig.DataCollectionDomain, this.storeUtils.digitalAnalyticsConfig.CookieDomain);
          });
        }
        else {
            // Empty function needed in place instead of Eluminate js library
            this.createScriptTags([this.READ_DDX_OBJECT_KEY, this.CM_SETUP_OTHER_KEY, this.CM_CREATE_MANUAL_IMPRES_TAG_KEY]);
        }
      }));
    }
    else {
        // Empty function needed in place instead of Eluminate js library
        this.createScriptTags([this.READ_DDX_OBJECT_KEY, this.CM_SETUP_OTHER_KEY, this.CM_CREATE_MANUAL_IMPRES_TAG_KEY]);
    }
    this.isInitialized = true;
  }

  private loadScript(): Promise<any> {
    return new Promise((resolve) => {
        let id = 'eluminate-js-library';
        if (!document.getElementById(id)) {
            let script: HTMLScriptElement = document.createElement('script');
            script.type = 'text/javascript';
            script.id = id;
            script.src = '//libs.coremetrics.com/eluminate.js';
            document.head.appendChild(script);

            // DDX Object function
            this.createScriptTags([this.READ_DDX_OBJECT_KEY]);

            script.onload = () => {
                resolve(true);
            };
        }
        else {
            resolve(true);
        }
    });
  }

  private setClientID(clientIds: string[], dataCollectionMethod: boolean, dataCollectionDomain: string, cookieDomain: string): void {
    cmSetClientID(clientIds.join(";"), dataCollectionMethod, dataCollectionDomain, cookieDomain);
    this.logger.debug(this.constructor.name + " cmSetClientID(" + clientIds.join(";") + "," + dataCollectionMethod + "," + dataCollectionDomain + "," + cookieDomain + ");");
  }

  private createPageviewTag(pageId: string, categoryId: string = '', searchTerm: string = '', searchResults: string = '', attrString: string = '',
    extraFields: string = ''): void {
    digitalData.page = {
      pageInfo: {
        pageID: pageId,
        onsiteSearchTerm: searchTerm,
        onsiteSearchResults: searchResults
      },
      category: {
        primaryCategory: categoryId
      },
      attributes: {
        exploreAttributes: attrString,
        extraFields: extraFields
      }
    };
    this.logger.debug(this.constructor.name + " cmCreatePageviewTag: digitalData = %o", digitalData);
  }

  private createProductviewTag(productId: string, productName: string, categoryId: string = '', attrString: string = '',
    virtualCategory: string = ''): void {
    digitalData.product = [{
      productInfo: {
        productID: productId,
        productName: productName
      },
      category: {
        primaryCategory: categoryId,
        virtualCategory: virtualCategory
      },
      attributes: {
        exploreAttributes: attrString
      }
    }];
    this.logger.debug(this.constructor.name + " cmCreateProductviewTag: digitalData = %o", digitalData);
  }

  private createRegistrationTag(registrationId: string, registrantEmail: string = '', registrantCity: string = '', registrantState: string = '',
    registrantPostalCode: string = '', registrantCountry: string = '', attrString: string = ''): void {
    digitalData.user = [{
      profile: [{
        profileInfo: {
          profileID: registrationId,
          profileEmail: registrantEmail,
          exploreAttributes: attrString
        },
        address: {
          city: registrantCity,
          state_province: registrantState,
          postalcode: registrantPostalCode,
          country: registrantCountry
        }
      }]
    }];
    this.logger.debug(this.constructor.name + " cmCreateRegistrationTag: digitalData = %o", digitalData);
  }

  private createShopAction5Tag(productId: string, productName: string, quantity: string, unitPrice: string, currency: string = '', categoryId: string = '',
    attrString: string = '', extraFields: string = ''): void {
    digitalData.cart.item = [{
      productInfo: {
        productID: productId,
        productName: productName
      },
      quantity: quantity,
      price: unitPrice,
      currency: currency,
      category: {
        primaryCategory: categoryId,
        virtualCategory: ''
      },
      attributes: {
        exploreAttributes: attrString,
        extraFields: extraFields
      }
    }];
    cmSetupOther({"cm_currencyCode":currency});
    this.logger.debug(this.constructor.name + " cmCreateShopAction5Tag: digitalData = %o", digitalData);
  }

  private createShopAction9Tag(productId: string, productName: string, quantity: string, unitPrice: string, currency: string = '', registrationId: string,
    orderId: string, orderSubtotal: string, categoryId: string = '', attrString: string = '', extraFields: string = ''): void {
    digitalData.transaction = {
      transactionID: orderId,
      total: {
        basePrice: orderSubtotal,
        currency: currency
      },
      profile: {
        profileInfo: {
          profileID: registrationId
        }
      }
    };
    digitalData.transaction.item = [{
      productInfo: {
        productID: productId,
        productName: productName
      },
      quantity: quantity,
      price: unitPrice,
      currency: currency,
      category: {
        primaryCategory: categoryId
      },
      attributes: {
        exploreAttributes: attrString,
        extraFields: extraFields
      }
    }];
    cmSetupOther({"cm_currencyCode":currency});
    this.logger.debug(this.constructor.name + " cmCreateShopAction9Tag: digitalData = %o", digitalData);
  }

  private createOrderTag(orderId: string, orderSubtotal: string, orderShipping: string, registrationId: string, registrantCity: string = '',
    registrantState: string = '', registrantPostalCode: string = '', currency: string = '', attrString: string = '', extraFields: string = ''): void {
    digitalData.transaction = {
      transactionID: orderId,
      total: {
        basePrice: orderSubtotal,
        shipping: orderShipping,
        currency: currency
      },
      profile: {
        profileInfo: {
          profileID: registrationId
        },
        address: {
          city: registrantCity,
          state_province: registrantState,
          postalcode: registrantPostalCode
        }
      },
      attributes: {
        exploreAttributes: attrString,
        extraFields: extraFields
      }
    };
    this.logger.debug(this.constructor.name + " cmCreateOrderTag: digitalData = %o", digitalData);
  }

  sendESpotTag(ctx, pageId): void {
    this.clearAnalyticsFacet();
    let campaignReportParam = this.getCampaignReportParam(ctx);
    pageId = this.getPageIdForImpressionTag(pageId);
    cmCreateManualImpressionTag(pageId, "", "", campaignReportParam, "");
    cmSetupOther({"cm_TrackImpressions":"CM"});
  }

  private getPageIdForImpressionTag(pageId): string {
    if (pageId.toLowerCase() === Constants.productDetailPageIdentifier.toLowerCase())
    {
      pageId = this.productInBreadcrumb.name;
    }
    else if (pageId.toLowerCase() === Constants.commerceCategoryPageIdentifier.toLowerCase())
    {
      pageId = this.categoryInBreadcrumb.name;
    }
    return pageId;
  }

  private getCampaignReportParam(ctx: any): string {
    let params: any = [];
    let paramsString: any = "";
    if (ctx.eSpotDescInternal && Object.keys(ctx.eSpotDescInternal).length > 0) {
        let campaignName = this.getCampaignName(ctx);
        let marketingActivityType = ctx.eSpotDescInternal.activityFormat;
        let marketingActivityName = ctx.eSpotDescInternal.activityIdentifierName;
        let eSpotName = ctx.eSpotInternal.eSpotName;
        let marketingContentName = ctx.eSpotDescInternal.baseMarketingSpotActivityName;
        params = [ campaignName, marketingActivityType, marketingActivityName, eSpotName, marketingContentName];
        params = params.map(param => param.replace(/ /g, '+'));
        paramsString = params.join('-_-');
    }
    return paramsString;
  }

  private getCampaignName(ctx: any): string {
    let eSpotDescInternal = ctx.eSpotDescInternal;
    if (eSpotDescInternal && eSpotDescInternal.baseMarketingSpotActivityData) {
        return eSpotDescInternal.baseMarketingSpotActivityData.baseMarketingSpotCampaignName;
    }
    return 'No Campaign';
  }

  orderComplete(orderParam: any): void {
    digitalData = {};
    digitalData.pageInstanceID = Constants.DA_PAGE_TYPE.StandardPage+'_'+Constants.DA_PAGE_TYPE.Order+'_'+Constants.DA_PAGE_TYPE.Registration;

    for (let item of orderParam.cart.orderItem) {
      // get facet info and parent category of item
      let orderItemExtAttr = this.getOrderItemExtAttr(item.orderItemExtendAttribute);

      // adjusted product price
      let adjustedProductPrice: string = this.adjustProductPrice(item.unitPrice, item.adjustment);

      let productId: string = item.item.parentCatalogEntyPartnumber ? item.item.parentCatalogEntyPartnumber : item.partNumber;

      this.createShopAction9Tag(productId, item.item.name, item.quantity, formatAmount(adjustedProductPrice), orderParam.currency, orderParam.cart.buyerId,
        orderParam.cart.orderId, formatAmount(orderParam.cart.grandTotal), orderItemExtAttr.currentParentCategory, orderItemExtAttr.facetAttr);

      readDDXObject();
    }

    // promotion data
    let promotionData: any = this.getOrderPromotion(orderParam.cart.orderPromotions);
    let extFieldsList = new Array(15);
    extFieldsList[12] = promotionData.promotionName.join('|');
    extFieldsList[13] = promotionData.promotionDiscount.join('|');
    extFieldsList[14] = promotionData.promotionCode.join('|');
    let orderExtFields: string = extFieldsList.join('-_-');

    this.createOrderTag(orderParam.cart.orderId, formatAmount(orderParam.cart.grandTotal), formatAmount(orderParam.cart.totalShippingCharge), orderParam.cart.buyerId, orderParam.address.Shipping.city, orderParam.address.Shipping.state, orderParam.address.Shipping.zipCode, orderParam.currency, '', orderExtFields);

    this.createPageviewTag(orderParam.pageName);

    this.createRegistrationTag(orderParam.cart.buyerId, orderParam.address.Shipping.email1, orderParam.address.Shipping.city,
      orderParam.address.Shipping.state, orderParam.address.Shipping.zipCode, orderParam.address.Shipping.country);

    readDDXObject();
  }

  viewCart(cartParam: any): void {
    digitalData = {};
    digitalData.cart = {};
    digitalData.pageInstanceID = Constants.DA_PAGE_TYPE.StandardPage+'_'+Constants.DA_PAGE_TYPE.Cart;

    for (let item of cartParam.cart.orderItem) {
      // get facet info and parent category of item
      let orderItemExtAttr = this.getOrderItemExtAttr(item.orderItemExtendAttribute);

      // adjusted product price
      let adjustedProductPrice: string = this.adjustProductPrice(item.unitPrice, item.adjustment);

      let productId: string = item.item.parentCatalogEntyPartnumber ? item.item.parentCatalogEntyPartnumber : item.partNumber;

      this.createShopAction5Tag(productId, item.item.name, item.quantity, formatAmount(adjustedProductPrice), cartParam.currency, orderItemExtAttr.currentParentCategory, orderItemExtAttr.facetAttr);
      readDDXObject();
    }
  }

  addToCart(cartParam: any): void {
    digitalData = {};
    digitalData.cart = {};
    digitalData.pageInstanceID = Constants.DA_PAGE_TYPE.StandardPage+'_'+Constants.DA_PAGE_TYPE.Cart;

    this.createPageviewTag(cartParam.pageName);
    this.createShopAction5Tag(cartParam.product.partNumber, cartParam.product.name, cartParam.quantity, cartParam.price, cartParam.currency, cartParam.category, cartParam.facet);
    readDDXObject();
  }

  updateUser(userParam: any): void {
    digitalData = {};
    digitalData.pageInstanceID = Constants.DA_PAGE_TYPE.StandardPage+'_'+Constants.DA_PAGE_TYPE.Registration;

    this.createPageviewTag(userParam.pageName);
    this.createRegistrationTag(userParam.user.userId, userParam.user.email1, userParam.user.city, userParam.user.state, userParam.user.zipCode, userParam.user.country);
    readDDXObject();
  }

  viewProduct(productParam: any): void {
    digitalData = {};
    digitalData.pageInstanceID = Constants.DA_PAGE_TYPE.StandardPage+'_'+Constants.DA_PAGE_TYPE.Productdetail;

    this.createPageviewTag(productParam.product.name);
    this.createProductviewTag(productParam.product.partNumber, productParam.product.name, productParam.category, productParam.facet);
    readDDXObject();
  }

  viewPage(pageParam: any): void {
    digitalData = {};
    digitalData.pageInstanceID = pageParam.pageType ? pageParam.pageType : Constants.DA_PAGE_TYPE.StandardPage;

    this.createPageviewTag(pageParam.pageName, pageParam.category, pageParam.searchTerm, pageParam.searchResults, pageParam.facet);
    readDDXObject();
  }

  removeFacetAnalyticsEntry(facetAnalyticEntry: string): void {
    this.analyticsFacetList = this.analyticsFacetList.filter( entry => entry !== facetAnalyticEntry);
    this.updateFacetAnalyticsAttribute();
  }

  addFacetAnalyticsEntry(facetAnalyticEntry): void {
    this.analyticsFacetList.push(facetAnalyticEntry);
    this.updateFacetAnalyticsAttribute();
  }

  clearAnalyticsFacet(): void {
    this.analyticsFacetList = [];
    this.analyticsFacet = "";
  }

  private updateFacetAnalyticsAttribute(): void {
     this.analyticsFacet = this.analyticsFacetList.join('-_-');
  }

  private getOrderPromotion(orderPromotions: any): any {
    let promotionData = {
      promotionName: [],
      promotionDiscount: [],
      promotionCode: []
    };

    promotionData = this.getItemLevelDiscount(promotionData, orderPromotions.orderItemsData);
    promotionData = this.getOrderLevelDiscount(promotionData, orderPromotions.orderLevelAdjustmentData);
    promotionData = this.getOrderShippingLevelDiscount(promotionData, orderPromotions.shippingAdjustmentData);

    return promotionData;
  }

  private getItemLevelDiscount(promotionData: any, orderItemsData: any): any {
    for (let data of orderItemsData) {
      if (data.appliedPromotions[0]) {
        data = data.appliedPromotions[0];
        promotionData.promotionName.push(data.promoName ? data.promoName : '');
        promotionData.promotionDiscount.push(data.formattedAdjustment.amount ? data.formattedAdjustment.amount : '');
        promotionData.promotionCode.push(data.promoCode ? data.promoCode : '');
      }
    }

    return promotionData = {
      promotionName: promotionData.promotionName,
      promotionDiscount: promotionData.promotionDiscount,
      promotionCode: promotionData.promotionCode
    }
  }

  private getOrderLevelDiscount(promotionData: any, adjustmentData: any): any {
    for (let data of adjustmentData) {
      promotionData.promotionName.push(data.calculationCodeData.promoName ? data.calculationCodeData.promoName : '');
      promotionData.promotionDiscount.push(data.formattedAdjustment.amount ? data.formattedAdjustment.amount : '');
      promotionData.promotionCode.push(data.calculationCodeData.promotionCodeData.promoCode ? data.calculationCodeData.promotionCodeData.promoCode : '');
    }

    return promotionData = {
      promotionName: promotionData.promotionName,
      promotionDiscount: promotionData.promotionDiscount,
      promotionCode: promotionData.promotionCode
    }
  }

  private getOrderShippingLevelDiscount(promotionData: any, shippingAdjustmentData: any): any {
    for (let data of shippingAdjustmentData) {
      promotionData.promotionName.push(data.calculationCodeData.promoName ? data.calculationCodeData.promoName : '');
      promotionData.promotionDiscount.push(data.formattedAdjustment.amount ? data.formattedAdjustment.amount : '');
      promotionData.promotionCode.push(data.calculationCodeData.promotionCodeData.promoCode ? data.calculationCodeData.promotionCodeData.promoCode : '');
    }

    return promotionData = {
      promotionName: promotionData.promotionName,
      promotionDiscount: promotionData.promotionDiscount,
      promotionCode: promotionData.promotionCode
    }
  }

  private adjustProductPrice(productAmount: string, discountAdjustment: any[]): string {
    let totalDiscountAmount: number = 0;
    let priceAdjList = discountAdjustment ? discountAdjustment: [];
    for (let adj of priceAdjList) {
      totalDiscountAmount += adj.amount ? Number(adj.amount) : 0;
    }
    return String(Number(productAmount) + totalDiscountAmount);
  }

  private getOrderItemExtAttr(orderItemExtendAttrParam: any): any {
    let orderItemExtendAttribute: any = {
      facetAttr: '',
      currentParentCategory: ''
    }

    let orderItemExtendAttrList = orderItemExtendAttrParam ? orderItemExtendAttrParam : [];
    for (let attr of orderItemExtendAttrList) {
      // get facet analytics info
      if (attr.attributeName === CommerceEnvironment.analytics.orderItemAttrFacetAnalytics) {
        orderItemExtendAttribute.facetAttr = orderItemExtendAttribute.facetAttr ? orderItemExtendAttribute.facetAttr + '-_-' + attr.attributeValue : attr.attributeValue;
      }
      // get parent category
      if (attr.attributeName === CommerceEnvironment.analytics.orderItemAttrParentCategory) {
        orderItemExtendAttribute.currentParentCategory = attr.attributeValue;
      }
    }

    return orderItemExtendAttribute;
  }

  private createScriptTags(functionNameList: string[]): void {
    let script: HTMLScriptElement = document.createElement('script');
    script.type = 'text/javascript';
    script.text = '';
    for (let functionName of functionNameList) {
        script.text = script.text + 'function ' + functionName + '() {}\n';
    }
    document.head.appendChild(script);
  }

}
