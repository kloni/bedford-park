import { DigitalAnalyticsService } from "app/commerce/services/digitalAnalytics.service";
import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from "@ngx-translate/core";
import { CommonTestModule } from "app/commerce/common/common.test.module";
import { Router } from "@angular/router";
import { Logger } from "angular2-logger/core";
import { MockRouter } from "mocks/angular-class/router";
import { StorefrontUtilsTest } from "app/commerce/common/storefrontUtilsTest.service";

declare var __karma__:any;

describe('DigitalAnalyticsService', () => {

	let daService: DigitalAnalyticsService;

    beforeEach(() => {
        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpModule, TranslateModule.forRoot({
				loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
				CommonTestModule
            ],
            providers: [
				StorefrontUtilsTest,
				Logger,
				TranslateService,
				{ provide: Router, useClass: MockRouter }
            ]
        });
    });

    beforeEach(inject([DigitalAnalyticsService], (_digitalAnalyticsService : DigitalAnalyticsService) => {
		daService = _digitalAnalyticsService;
		__karma__.config.testGroup = "";
    }));

    it('should instantiate', () => {
        expect(daService).toEqual(jasmine.any(DigitalAnalyticsService));
	});

	it('should initialize Digital Analytics', (done) => {
		daService.initializeDA();
		setTimeout(function(){
            expect(daService.isInitialized).toBe(true);
            done();
        }, 1000);
	});

	it('should invoke order complete tag', () => {
		let orderParam: any = {"address":{"Shipping":{"city":"Toronto","state":"ON","zipCode":"12345","email1":"testuser2@ca.ibm.com","country":"CA"}},"cart":{"orderItem":{"orderItemExtendAttribute":{"attributeName":"parentCategory","attributeValue":"LivingRoomFurniture"},"unitPrice":"749.99000","quantity":1,"adjustment":{"amount":"-25.00000","code":"Save $25 on all orders over $200 USD","description":"Save $25 on all orders over $200 USD"},"item":{"name":"Plump Leather Sofa","parentCatalogEntyPartnumber":"LR-FNTR-CO-0004"}},"orderId":"4319454913","grandTotal":"724.99000","totalShippingCharge":"0.00000","buyerId":"6083","orderPromotions":{"orderItemsData":{"appliedPromotions":""},"orderLevelAdjustmentData":{"calculationCodeData":{"promoName":"Save $25 on all orders over $200 USD","promotionCodeData":{"promoCode":null},"formattedAdjustment":{"amount":-25}}},"shippingAdjustmentData":""}},"currency":"USD",pageName:"Order Confirmation"};
		daService.orderComplete(orderParam);
		expect(digitalData).toEqual({"pageInstanceID":"wcs-standardpage_wcs-order_wcs-registration","transaction":{"transactionID":"4319454913","total":{"basePrice":"724.99","shipping":"0.00","currency":"USD"},"profile":{"profileInfo":{"profileID":"6083"},"address":{"city":"Toronto","state_province":"ON","postalcode":"12345"}},"attributes":{"exploreAttributes":"","extraFields":"-_--_--_--_--_--_--_--_--_--_--_--_--_--_-"}},"page":{"pageInfo":{"pageID":"Order Confirmation","onsiteSearchTerm":"","onsiteSearchResults":""},"category":{"primaryCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}},"user":[{"profile":[{"profileInfo":{"profileID":"6083","profileEmail":"testuser2@ca.ibm.com","exploreAttributes":""},"address":{"city":"Toronto","state_province":"ON","postalcode":"12345","country":"CA"}}]}]});
	});

	it('should invoke view cart tag', () => {
		let viewCartParam: any = {"pageName":"Shopping cart","cart":{"totalShippingCharge":"0.00000","resourceId":"https://abj146.watsoncommerce.ibm.com:443/wcs/resources/store/13001/cart/@self?sortOrderItemBy=orderItemID","orderId":"4285073175","lastUpdateDate":"2018-04-28T01:40:30.270Z","channel":{"channelIdentifer":{"channelName":"Telesales","uniqueID":"-4"},"userData":null,"description":{"language":"-1","value":"Used when operations performed by a telesales representative."}},"orderStatus":"P","x_isPurchaseOrderNumberRequired":"false","totalShippingChargeCurrency":"USD","grandTotalCurrency":"USD","buyerId":"6052","recordSetCount":"1","x_isPersonalAddressesAllowedForShipping":"true","storeNameIdentifier":"Stockholm0410","totalProductPriceCurrency":"USD","totalProductPrice":"749.99000","locked":"false","recordSetComplete":"true","totalAdjustmentCurrency":"USD","totalSalesTaxCurrency":"USD","totalSalesTax":"0.00000","grandTotal":"724.99000","orderItem":[{"unitUom":"C62","shippingChargeCurrency":"USD","lastUpdateDate":"2018-04-28T01:40:30.308Z","expectedShipDate":"2018-04-28T01:40:35.017Z","description":"Mail","language":"-1","availableDate":"2018-04-28T01:40:30.379Z","salesTax":"0.00000","xitem_isPersonalAddressesAllowedForShipping":"true","correlationGroup":"30198","usableShippingChargePolicy":[{"name":"StandardShippingChargeBySeller","type":"ShippingCharge","uniqueID":"-7001"}],"shippingTax":"0.00000","orderItemStatus":"P","offerID":"4000000000000001349","orderItemExtendAttribute":[{"attributeValue":"LivingRoomFurniture","attributeName":"parentCategory"}],"currency":"USD","shippingCharge":"0.00000","orderItemPrice":"749.99000","shipModeLanguage":"-1","createDate":"2018-04-28T01:40:30.254Z","unitPrice":"749.99000","salesTaxCurrency":"USD","quantity":1,"shipModeCode":"Mail","productId":"14675","shipModeDescription":"Mail","orderItemId":"30198","fulfillmentCenterId":"715840134","fulfillmentCenterName":"Stockholm0410","shipModeId":"715840284","isExpedited":"false","orderItemFulfillmentStatus":"Unreleased","shippingTaxCurrency":"USD","carrier":"Mail","UOM":"C62","freeGift":"false","unitQuantity":"1.0","contractId":"4000000000000001004","adjustment":[{"amount":"-25.00000","code":"Save $25 on all orders over $200 USD","displayLevel":"Order","usage":"Discount","descriptionLanguage":"-1","description":"Save $25 on all orders over $200 USD","language":"-1","currency":"USD"}],"partNumber":"LR-FNTR-CO-0004-0001","totalAdjustment":null,"orderItemInventoryStatus":"Available","availability":"inStock","item":{"partNumber":"LR-FNTR-CO-0004-0001","parentCatalogEntryID":"14674","thumbnail":"https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/StockholmCAS/images/catalog/livingroom/furniture/couch4_a1_350.jpg","name":"Plump Leather Sofa","price":[{"usage":"Display","description":"L","currency":"USD","value":"800.0"},{"usage":"Offer","description":"I","currency":"USD","value":"749.99"}],"attributes":[{"identifier":"Color","sequence":"1.00000","storeDisplay":false,"values":[{"identifier":"coffee","sequence":"9.00000","unitOfMeasure":"one","unitID":"C62","image1":"https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/StockholmCAS/images/catalog/swatches/sw_coffee.png","value":"Coffee","image1path":"https://my4.digitalexperience.ibm.com/30817b50-78a2-4463-b5e2-2d7c39231327/dxdam/StockholmCAS/images/catalog/swatches/sw_coffee.png","uniqueID":"7000000000000003309"}],"usage":"Defining","displayable":true,"name":"Color","facetable":true,"comparable":true,"searchable":true,"uniqueID":"7000000000000000651"},{"identifier":"Size","sequence":"2.00000","storeDisplay":false,"values":[{"identifier":"48x6x48","sequence":"1.00000","unitOfMeasure":"one","unitID":"C62","value":"48\"x6\"x48\"","uniqueID":"7000000000000003324"}],"usage":"Defining","displayable":true,"name":"Size","facetable":true,"comparable":true,"searchable":true,"uniqueID":"7000000000000000652"}],"parentCatalogEntyPartnumber":"LR-FNTR-CO-0004"}}],"storeUniqueID":"13001","recordSetStartNumber":"0","resourceName":"cart","recordSetTotal":"1","shipAsComplete":"true","x_trackingIds":"","totalShippingTax":"0.00000","totalShippingTaxCurrency":"USD","prepareIndicator":"false","adjustment":[{"amount":"-25.00000","code":"Save $25 on all orders over $200 USD","displayLevel":"Order","usage":"Discount","xadju_calUsageId":"-1","descriptionLanguage":"-1","description":"Save $25 on all orders over $200 USD","language":"-1","currency":"USD"}],"totalAdjustment":"-25.00000"},"currency":"USD"};
		daService.viewCart(viewCartParam);
		expect(digitalData).toEqual({"cart":{"item":[{"productInfo":{"productID":"LR-FNTR-CO-0004","productName":"Plump Leather Sofa"},"quantity":1,"price":"724.99","currency":"USD","category":{"primaryCategory":"LivingRoomFurniture","virtualCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}}]},"pageInstanceID":"wcs-standardpage_wcs-cart"});
	});

	it('should invoke add to cart tag', () => {
		let addToCartParam: any = {"category":"LivingRoomFurniture","currency":"USD","facet":"","pageName":"Plump Leather Sofa","price":"749.99","product":{"partNumber":"LR-FNTR-CO-0004","name":"Plump Leather Sofa"},"quantity":1};
		daService.addToCart(addToCartParam);
		expect(digitalData).toEqual({"cart":{"item":[{"productInfo":{"productID":"LR-FNTR-CO-0004","productName":"Plump Leather Sofa"},"quantity":1,"price":"749.99","currency":"USD","category":{"primaryCategory":"LivingRoomFurniture","virtualCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}}]},"pageInstanceID":"wcs-standardpage_wcs-cart","page":{"pageInfo":{"pageID":"Plump Leather Sofa","onsiteSearchTerm":"","onsiteSearchResults":""},"category":{"primaryCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}}});
	});

	it('should invoke update user tag', () => {
		let updateUserParam: any = {"pageName":"Home","user":{"lastName":"user","registrationStatus":"RegisteredPerson","resourceId":"https://abj146.watsoncommerce.ibm.com:443/wcs/resources/store/13001/person/@self","preferredCurrency":"USD","distinguishedName":"uid=testuser2@ca.ibm.com,o=default organization,o=root organization","orgizationId":"-2000","addressId":"5908798976","accountStatus":"Enabled","email1":"testuser2@ca.ibm.com","profileType":"Consumer","challengeQuestion":"","nickName":"testuser2@ca.ibm.com","addressType":"ShippingAndBilling","resourceName":"person","checkoutProfileUrl":"https://abj146.watsoncommerce.ibm.com:443/wcs/resources/store/13001/person/@self/checkoutProfile","userId":"6083","registrationDateTime":"2018-04-28T21:19:34.985Z","organizationDistinguishedName":"o=default organization,o=root organization","firstName":"test","logonId":"testuser2@ca.ibm.com","lastUpdate":"2018-04-28T21:19:34.985Z","registrationApprovalStatus":"Approved","contactUrl":"https://abj146.watsoncommerce.ibm.com:443/wcs/resources/store/13001/person/@self/contact","passwordExpired":"false","primary":"true"}};
		daService.updateUser(updateUserParam);
		expect(digitalData).toEqual({"pageInstanceID":"wcs-standardpage_wcs-registration","page":{"pageInfo":{"pageID":"Home","onsiteSearchTerm":"","onsiteSearchResults":""},"category":{"primaryCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}},"user":[{"profile":[{"profileInfo":{"profileID":"6083","profileEmail":"testuser2@ca.ibm.com","exploreAttributes":""},"address":{"city":"","state_province":"","postalcode":"","country":""}}]}]});
	});

	it('should invoke view product tag', () => {
		let viewProductParam: any = {"product":{"name":"Plump Leather Sofa","partNumber":"LR-FNTR-CO-0004"},"category":"LivingRoomFurniture","facet":""};
		daService.viewProduct(viewProductParam);
		expect(digitalData).toEqual({"pageInstanceID":"wcs-standardpage_wcs-productdetail","page":{"pageInfo":{"pageID":"Plump Leather Sofa","onsiteSearchTerm":"","onsiteSearchResults":""},"category":{"primaryCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}},"product":[{"productInfo":{"productID":"LR-FNTR-CO-0004","productName":"Plump Leather Sofa"},"category":{"primaryCategory":"LivingRoomFurniture","virtualCategory":""},"attributes":{"exploreAttributes":""}}]});
	});

	it('should invoke view page tag', () => {
		let viewPageParam: any = {"pageName":"LivingRoomFurniture","searchTerm":"","searchResults":"","facet":""};
		daService.viewPage(viewPageParam);
		expect(digitalData).toEqual({"pageInstanceID":"wcs-standardpage","page":{"pageInfo":{"pageID":"LivingRoomFurniture","onsiteSearchTerm":"","onsiteSearchResults":""},"category":{"primaryCategory":""},"attributes":{"exploreAttributes":"","extraFields":""}}});
	});

	it('should add facet analytics entry', () => {
		// add single facet analytics entry
		let facetAnalyticEntry = 'Brand:Home Design';
		daService.addFacetAnalyticsEntry(facetAnalyticEntry);
		expect(daService.analyticsFacetList).toEqual(["Brand:Home Design"]);
		expect(daService.analyticsFacet).toEqual("Brand:Home Design");

		// add multiple facet analytics entries
		let facetAnalyticEntry2 = "Material:Polyester, Cotton, Steel";
		let facetAnalyticEntry3 = "Item Weight:150 lbs";
		let facetAnalyticEntry4 = "Pattern:Solid";
		let facetAnalyticEntry5 = "Color:Grey";
		daService.addFacetAnalyticsEntry(facetAnalyticEntry2);
		daService.addFacetAnalyticsEntry(facetAnalyticEntry3);
		daService.addFacetAnalyticsEntry(facetAnalyticEntry4);
		daService.addFacetAnalyticsEntry(facetAnalyticEntry5);
		expect(daService.analyticsFacetList).toEqual(["Brand:Home Design", "Material:Polyester, Cotton, Steel", "Item Weight:150 lbs", "Pattern:Solid", "Color:Grey"]);
		expect(daService.analyticsFacet).toEqual("Brand:Home Design-_-Material:Polyester, Cotton, Steel-_-Item Weight:150 lbs-_-Pattern:Solid-_-Color:Grey");
	});

	it('should remove facet analytics entry', () => {
		daService.analyticsFacetList = ["Brand:Home Design", "Material:Polyester, Cotton, Steel", "Item Weight:150 lbs", "Pattern:Solid", "Color:Grey"];
		daService.analyticsFacet = "Brand:Home Design-_-Material:Polyester, Cotton, Steel-_-Item Weight:150 lbs-_-Pattern:Solid-_-Color:Grey";

		// remove single facet analytics entry
		let facetAnalyticEntry = 'Brand:Home Design';
		daService.removeFacetAnalyticsEntry(facetAnalyticEntry);
		expect(daService.analyticsFacetList).toEqual(["Material:Polyester, Cotton, Steel", "Item Weight:150 lbs", "Pattern:Solid", "Color:Grey"]);
		expect(daService.analyticsFacet).toEqual("Material:Polyester, Cotton, Steel-_-Item Weight:150 lbs-_-Pattern:Solid-_-Color:Grey");

		// remove multiple facet analytics entries
		let facetAnalyticEntry2 = "Material:Polyester, Cotton, Steel";
		let facetAnalyticEntry3 = "Item Weight:150 lbs";
		let facetAnalyticEntry4 = "Pattern:Solid";
		let facetAnalyticEntry5 = "Color:Grey";
		daService.removeFacetAnalyticsEntry(facetAnalyticEntry2);
		daService.removeFacetAnalyticsEntry(facetAnalyticEntry3);
		daService.removeFacetAnalyticsEntry(facetAnalyticEntry4);
		daService.removeFacetAnalyticsEntry(facetAnalyticEntry5);
		expect(daService.analyticsFacetList).toEqual([]);
		expect(daService.analyticsFacet).toEqual("");
	});

	it('should clar facet analytics entry', () => {
		daService.analyticsFacetList = ["Brand:Home Design", "Material:Polyester, Cotton, Steel", "Item Weight:150 lbs", "Pattern:Solid", "Color:Grey"];
		daService.analyticsFacet = "Brand:Home Design-_-Material:Polyester, Cotton, Steel-_-Item Weight:150 lbs-_-Pattern:Solid-_-Color:Grey";

		daService.clearAnalyticsFacet();
		expect(daService.analyticsFacetList).toEqual([]);
		expect(daService.analyticsFacet).toEqual("");
	});

});
