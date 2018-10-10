import { BaseTest } from '../base/BaseTest.po';
import { by, element, browser } from 'protractor';
import { OrderHistoryPage } from './OrderHistoryPage.po';
import { ShoppingCartPage } from './ShoppingCartPage.po';
import { RegistrationPage } from './RegistrationPage.po';


var log4js = require("log4js");
var log = log4js.getLogger("OrderDetailPage");

export const orderDetailPageObjs = {

    orderDetailHeading: element.all(by.css("[id^=orderdetails_heading_]")).first(),
    orderDate: element.all(by.css("[id^=orderdetails_orderdate_]")).first(),
    orderStatus: element.all(by.css("[id^=orderdetails_orderstatus_]")).first(),
    shippingAddress: element.all(by.css("[id^=orderdetails_shippingaddress_]")).first(),
    billingAddress: element.all(by.css("[id^=orderdetails_billingaddress_]")).first(),
    paymentInfo: element.all(by.css("[id^=orderdetails_paymentmethod_]")).first(),
    shippingInfo: element.all(by.css("[id^=orderdetails_shippingmethod_]")).first(),

    orderCount: element.all(by.css("[id^=orderdetails_ordercount_]")).first(),

    productName: element.all(by.css("[id^=orderdetails_itemname_]")).first(),
    productSKU: element.all(by.css("[id^=orderdetails_itemsku_]")).first(),
    productAttribute: element.all(by.css("[id^=orderdetails_itemattribute_]")).first(),
    productQuantity: element.all(by.css("[id^=orderdetails_itemquantity_]")).first(),

    productSubTotal: element.all(by.css("[id^=orderdetails_productprice_]")).first(),
    discount: element.all(by.css("[id^=orderdetails_discount_]")).first(),
    shipping: element.all(by.css("[id^=orderdetails_shippingcharge_]")).first(),
    tax: element.all(by.css("[id^=orderdetails_totalSalestax_]")).first(),

    grandTotal: element.all(by.css("[id^=orderdetails_grandtotal_]")).first(),

    orderAgain: element.all(by.css("[id^=orderdetails_btn_orderagain_]")).first(),
    backToOrderHistory: element.all(by.css("[id^=orderdetails_backtoorders_]")).first(),
    VATTax: element.all(by.css("[id^=orderdetails_totalVAT_]")).first()
};

export class OrderDetailPage extends BaseTest {

    constructor() {
        super();

        this.waitForElementDisplayed(orderDetailPageObjs.orderDetailHeading);
        this.waitForElementDisplayed(orderDetailPageObjs.orderAgain);
        this.waitForElementDisplayed(orderDetailPageObjs.billingAddress);
        this.waitForElementDisplayed(element.all(by.css("[id^=orderdetails_orderitem_]")).get(0).all(by.css("[id^=orderdetails_itemname_]")).first());
    }

    getOrderIdFromHeading(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.orderDetailHeading.getText().then(result => {
                let orderId = result.replace(/Order #/, "").replace(/ Details/,"");
                console.log('orderId:', orderId);
                resolve(orderId);
            })
        });
    }

    getOrderDate(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.orderDate.getText().then(orderDate => {
                console.log('orderDate:', orderDate);
                resolve(orderDate);
            })
        });
    }

    getOrderStatus(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.orderStatus.getText().then(orderStatus => {
                console.log('orderStatus:', orderStatus);
                resolve(orderStatus);
            })
        });
    }

    getOrderShippingAddress(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.shippingAddress.getText().then(shippingAddress => {
                console.log('shippingAddress:', shippingAddress);
                resolve(shippingAddress);
            })
        });
    }

    getOrderBillingAddress(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.billingAddress.getText().then(billingAddress => {
                console.log('billingAddress:', billingAddress);
                resolve(billingAddress);
            })
        });
    }

    getOrderPaymentInfo(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.paymentInfo.getText().then(payment => {
                console.log('paymentInfo:', payment);
                resolve(payment);
            })
        });
    }

    getOrderShippingMethod(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.shippingInfo.getText().then(shippingInfo => {
                console.log('shippingInfo:', shippingInfo);
                resolve(shippingInfo);
            })
        });
    }

    getOrderCount(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.orderCount.getText().then(countText => {
                console.log('item quantity total count:', countText.replace(/ item/, "").replace(/ items/, ""));
                resolve(countText.replace(/ items/, "").replace(/ item/, ""));
            })
        });
    }

    getOrderItemNameByIndex( index: number){
        return new Promise<string>((resolve, reject) => {
            let itemByIndex= element.all(by.css("[id^=orderdetails_orderitem_]")).get(index).all(by.css("[id^=orderdetails_itemname_]")).first();
            itemByIndex.getText().then(itemName => {
                console.log('itemName:', itemName);
                resolve(itemName);
            })
        });
    }

    getOrderItemSKUByIndex( index: number){
        return new Promise<string>((resolve, reject) => {
            let itemSKUByIndex= element.all(by.css("[id^=orderdetails_orderitem_]")).get(index).all(by.css("[id^=orderdetails_itemsku_]")).first();
            itemSKUByIndex.getText().then(sku => {
                console.log('sku:', sku.replace(/SKU: /, ""));
                resolve(sku.replace(/SKU: /, ""));
            })
        });
    }

    getOrderItemAttributeByIndex( index: number, attributeIndex: number){
        return new Promise<string>((resolve, reject) => {
            let itemAttrByIndex= element.all(by.css("[id^=orderdetails_orderitem_]")).get(index).all(by.css("[id^=orderdetails_itemattribute_]")).get(attributeIndex);
            itemAttrByIndex.getText().then(attr => {
                console.log('attr:', attr.replace(/Color: /, ""));
                resolve(attr.replace(/Color: /, ""));
            })
        });
    }

    getOrderItemQuantityByIndex( index: number){
        return new Promise<string>((resolve, reject) => {
            let itemQuantityByIndex= element.all(by.css("[id^=orderdetails_orderitem_]")).get(index).all(by.css("[id^=orderdetails_itemquantity_]")).first();
            itemQuantityByIndex.getText().then(quantity => {
                console.log('attr:', quantity.replace(/Quantity: /, ""));
                resolve(quantity.replace(/Quantity: /, ""));
            })
        });
    }

    getOrderProductSubTotal(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.productSubTotal.getText().then(subtotal => {
                console.log('subtotal:', subtotal);
                resolve(subtotal);
            })
        });
    }

    getOrderDiscountTotal(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.discount.getText().then(discount => {
                console.log('discount:', discount);
                resolve(discount);
            })
        });
    }

    getOrderShippingTotal(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.shipping.getText().then(shipping => {
                console.log('shipping:', shipping);
                resolve(shipping);
            })
        });
    }

    getOrderTaxTotal(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.tax.getText().then(tax => {
                console.log('tax:', tax);
                resolve(tax);
            })
        });
    }

    getGrandTotal(){
        return new Promise<string>((resolve, reject) => {
            orderDetailPageObjs.grandTotal.getText().then(total => {
                console.log('total:', total);
                resolve(total);
            })
        });
    }

    clickOrderAgain(numberOfProducts:number): ShoppingCartPage{
        orderDetailPageObjs.orderAgain.click().then(function(){
            console.log('Clicked on order again button');
        });
        return new ShoppingCartPage(numberOfProducts);
    }

    clickBackToOrderHistory(numberOfOrders:number): OrderHistoryPage{
        browser.executeScript("arguments[0].scrollIntoView();", orderDetailPageObjs.backToOrderHistory).then(function () {
            orderDetailPageObjs.backToOrderHistory.click().then(function (){
                console.log('Clicked on Back to Orders link');
            })
        });
        return new OrderHistoryPage(numberOfOrders);
    }

    attemptToNavigateToOrderDetailsByURLAsGuestUser(): RegistrationPage{
        this.navigateTo("/order-details");
        return new RegistrationPage();
    }

    VATTaxDisplayed(): Promise<boolean> {
        return this.waitForElementDisplayed(orderDetailPageObjs.VATTax);
    }
}
