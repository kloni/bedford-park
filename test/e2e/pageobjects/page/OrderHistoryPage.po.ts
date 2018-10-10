import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';
import { OrderDetailPage } from '../page/OrderDetailPage.po';
import { ProductPage } from '../page/ProductPage.po';
import { BaseTest } from  '../base/BaseTest.po';

var log4js = require("log4js");
var log = log4js.getLogger("OrderHistoryPage");

export const orderHistoryPageObj = {
    orderHistoryPageTitle: element.all(by.css("[id^=orderHistory_title_")),
    orderPlacedDate: element.all(by.css("[id^=orderHistory_orderDate_")),
    orderStatus: element.all(by.css("[id^=orderHistory_orderStatus_")),
    orderId: element.all(by.css("[id^=orderHistory_orderId_")),
    orderTotal: element.all(by.css("[id^=orderHistory_orderTotal_")),
    orderQuantity: element.all(by.css("[id^=orderHistory_orderCount_")),
    orderItemName: element.all(by.css("[id^=orderHistory_orderItemName_")),
    orderItemSKU: element.all(by.css("[id^=orderHistory_orderItemSku_")),
    orderItemQuantity: element.all(by.css("[id^=orderHistory_orderItemQty_")),
    orderItemPrice: element.all(by.css("[id^=orderHistory_orderItemPrice_")),
    orderDetailLink: element.all(by.css("[id^=orderHistory_orderDetailLink_")),
    nextPageButton: element.all(by.css("[id^=pagination_btn_next_")),
    prevPageButton: element.all(by.css("[id^=pagination_btn_pre_")),
    pageNumberButton: element.all(by.css("[id^=pagination_btn_pageNum_")),
    order: element.all(by.css("[id^=orderHistory_div_3_]")),

    noOrderMsg: element.all(by.css("[id^=orderHistory_p_noOrder_]")),

    //mobile only
    mobileOrderId: element.all(by.css("[id^=orderHistory_mob_orderId_")),
    mobileOrderPlaceDate: element.all(by.css("[id^=orderHistory_mob_orderDate_")),
    mobileOrderStatus: element.all(by.css("[id^=orderHistory_mob_orderStatus_")),
    mobileOrderTotal: element.all(by.css("[id^=orderHistory_mob_orderTotal_")),

    mobileOrder: element.all(by.css("[id^=orderHistory_mob_div_2_]")),
    mobileOrderDetailLink: element.all(by.css("[id^=orderHistory_mob_orderDetailLink_]")),
    mobileOrderQuantity: element.all(by.css("[id^=orderHistory_mob_orderCount_")),
    VATTax: element.all(by.css("[id^=orderHistory_vat_]")).first()

}

export class OrderHistoryPage extends BaseTest {

    constructor(numberOfOrders: number) {
        super();

        this.waitForElement(orderHistoryPageObj.orderHistoryPageTitle.first());

        if(numberOfOrders==0){
            this.waitForNoOrderMsg();

        }else{
            browser.sleep(5000);
            // TODO: needs more work to check properly. Also check if the order history is empty
            this.waitForElementDisplayed(orderHistoryPageObj.orderId.get(numberOfOrders-1));
        }
    }

    getPageName() : Promise<string>{
        return new Promise<string>((resolve, reject) => {
            orderHistoryPageObj.orderHistoryPageTitle.first().getText().then(pageTitle => {
                resolve(pageTitle);
            });
        });

    }

    waitForNoOrderMsg() : OrderHistoryPage {
        this.waitForElementPresent(orderHistoryPageObj.noOrderMsg.first());
        return this;
    }

    verifyNoOrderMsg(): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            orderHistoryPageObj.noOrderMsg.first().getText().then(result => {
                    resolve(result);
                })
        });
    }

    getOrderStatus(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            browser.getCapabilities().then(result => {
                let element: ElementArrayFinder;
                if (result.get('mobileEmulationEnabled')) {
                    element = orderHistoryPageObj.mobileOrderStatus;
                } else {
                    element = orderHistoryPageObj.orderStatus;
                }
                element.first().getText().then(result => {
                    let orderPlacedDate = result.replace(/Ordered: /, "");
                    resolve(orderPlacedDate);
                })
            });
        });
    }


    getOrderPlacedDate(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            browser.getCapabilities().then(result => {
                let element: ElementArrayFinder;
                if (result.get('mobileEmulationEnabled')) {
                    element = orderHistoryPageObj.mobileOrderPlaceDate;
                } else {
                    element = orderHistoryPageObj.orderPlacedDate;
                }
                element.first().getText().then(result => {
                    let orderPlacedDate = result.replace(/Ordered: /, "");
                    console.log('Order  placed date: ' , result.replace(/Ordered: /, ""));
                    resolve(orderPlacedDate);
                })
            });
        });
    }

    getOrderId(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            browser.getCapabilities().then(result => {
                let element: ElementArrayFinder;
                if (result.get('mobileEmulationEnabled')) {
                    element = orderHistoryPageObj.mobileOrderId;
                } else {
                    element = orderHistoryPageObj.orderId;
                }
                element.first().getText().then(result => {
                    let orderId = result.replace(/[^0-9\.]+/g, "");
                    console.log('First order id in the list:' , result.replace(/[^0-9\.]+/g, ""));
                    resolve(orderId);
                }).catch(err => {
                    resolve(undefined);
                })
            });
        });
    }

    getOrderIdByIndex(index: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            browser.getCapabilities().then(result => {
                let element: ElementArrayFinder;
                if (result.get('mobileEmulationEnabled')) {
                    element = orderHistoryPageObj.mobileOrderId;
                } else {
                    element = orderHistoryPageObj.orderId;
                }
                element.get(index).getText().then(result => {
                    let orderId = result.replace(/[^0-9\.]+/g, "");
                    console.log('Order id :' , result.replace(/[^0-9\.]+/g, ""), ' at index: ', index);
                    resolve(orderId);
                }).catch(err => {
                    resolve(undefined);
                })
            });
        });
    }

    getOrderTotal(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            browser.getCapabilities().then(result => {
                let element: ElementArrayFinder;
                if (result.get('mobileEmulationEnabled')) {
                    element = orderHistoryPageObj.mobileOrderTotal;
                } else {
                    element = orderHistoryPageObj.orderTotal;
                }
                element.first().getText().then(result => {
                    let orderTotal = Number(result.replace(/[^0-9\.]+/g, ""));
                    console.log('Order total :' , Number(result.replace(/[^0-9\.]+/g, "")));
                    resolve(orderTotal);
                }).catch(err => {
                    resolve(undefined);
                })
            });
        });
    }

    getOrderQuantity(): Promise<number> {
        return new Promise<number>((resolve, reject) => {

            var orderQuantity : ElementArrayFinder
            browser.getCapabilities().then(result => {
                if (!result.get('mobileEmulationEnabled')){
                    orderQuantity= orderHistoryPageObj.orderQuantity;
                }else{
                    orderQuantity= orderHistoryPageObj.mobileOrderQuantity;
                }
                orderQuantity.first().getText().then(result => {
                    let orderQuantity = Number(result.replace(/[^0-9\.]+/g, ""));
                    console.log('Order total quantity :' , Number(result.replace(/[^0-9\.]+/g, "")));
                    resolve(orderQuantity);
                })
            });

        });
    }

    //To be used in desktop store only
    waitForOrderItemsToLoad(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            this.waitForElementDisplayed(orderHistoryPageObj.orderItemName.first()).then(result => {
                resolve(result);
            });
        });
    }

    //To be used in desktop store only
    getOrderItemName(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            orderHistoryPageObj.orderItemName.first().getText().then(result => {
                let orderItemName = result;
                console.log('Order item name :' , result);
                resolve(orderItemName);
            })
        });
    }

    //To be used in desktop store only
    getOrderItemSKU(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            orderHistoryPageObj.orderItemSKU.first().getText().then(result => {
                let orderItemSKU = result.replace(/SKU: /gi,"");
                console.log('Order item SKU :' , result.replace(/SKU: /gi,""));
                resolve(orderItemSKU);
            })
        });
    }

    //To be used in desktop store only
    getOrderItemQuantity(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            orderHistoryPageObj.orderItemQuantity.first().getText().then(result => {
                let orderItemQuantity = Number(result.replace(/[^0-9\.]+/g, ""));
                console.log('Order item quantity :' , Number(result.replace(/[^0-9\.]+/g, "")));

                resolve(orderItemQuantity);
            })
        });
    }

    //To be used in desktop store only
    getOrderItemPrice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            orderHistoryPageObj.orderItemPrice.first().getText().then(result => {
                let orderItemPrice = Number(result.replace(/[^0-9\.]+/g, ""));
                console.log('Order item price :' , Number(result.replace(/[^0-9\.]+/g, "")));
                resolve(orderItemPrice);
            })
        });
    }

    getOrderDetailLinkByOrderId(orderId: string): ElementFinder {

        // find order detail by index
        var detailLink : ElementArrayFinder;
        var orderDetailLink : ElementFinder;
        browser.getCapabilities().then(result => {
            if (!result.get('mobileEmulationEnabled')){
                detailLink= orderHistoryPageObj.mobileOrderDetailLink;
            }else{
                detailLink= orderHistoryPageObj.orderDetailLink;
            }
            orderDetailLink = detailLink.filter(function (elem) {
                return elem.getText().then(function (val) {
                    console.log('Order detail link ' , val , ' with the order Id ', orderId);
                    return val === orderId;
                });
            }).first();
        });

        return orderDetailLink;
    }

    viewOrderDetailByIndex(index: number): OrderDetailPage {
        // find order detail by index
        let detailLink: ElementArrayFinder;
        browser.getCapabilities().then(result => {
            if (result.get('mobileEmulationEnabled')) {
                detailLink = orderHistoryPageObj.mobileOrderDetailLink;
            }
            else {
                detailLink = orderHistoryPageObj.orderDetailLink;
            }
            detailLink.get(index).getWebElement().then(element => {
                element.click();
                console.log('Click on order detail link for index: ', index);
            });
        });
        return new OrderDetailPage();


    }

    orderExistsById(orderId: string): boolean {
        if (this.getOrderDetailLinkByOrderId(orderId))
            return true;
        else
            return false;
    }

    goToNextPage(): OrderHistoryPage{
        browser.executeScript("arguments[0].scrollIntoView();", orderHistoryPageObj.nextPageButton.first()).then(function () {
            orderHistoryPageObj.nextPageButton.first().click();
            console.log('Go to next page');
        });
        return this;
    }

    goToPrevPage(): OrderHistoryPage {
        browser.executeScript("arguments[0].scrollIntoView();", orderHistoryPageObj.prevPageButton.first()).then(function () {
            orderHistoryPageObj.prevPageButton.first().click().then(function () {
                console.log('Go to previous page ');
            })
        });
        return this;
    }

    goToPage(pageNumber: string): OrderHistoryPage{
           browser.executeScript("arguments[0].scrollIntoView();", element(by.buttonText(pageNumber))).then(function () {
            element(by.buttonText(pageNumber)).click().then(function () {
                console.log('Go to page ', pageNumber);
            })
        });

        return this;
    }


    viewProductByOrderIndexProductIndex(orderIndex: number, productIndex: number): ProductPage{

        var productLink = orderHistoryPageObj.order.get(orderIndex).all(by.css("[id^=orderHistory_orderItemName_")).get(productIndex);
        this.waitForElementPresent(productLink);
        productLink.click().then(function () {
            console.log('Clicked on product in ', productIndex, ' position for order ' , orderIndex);
        })

        return new ProductPage();
    }

    waitForOrderIdToBeUpdated(orderId: string, orderIndex: number): OrderHistoryPage{
        var orderIdElem: ElementFinder;
        browser.getCapabilities().then(result => {
            if (!result.get('mobileEmulationEnabled')){
                orderIdElem = orderHistoryPageObj.orderId.get(orderIndex);
            }
            else{
                orderIdElem = orderHistoryPageObj.mobileOrderId.get(orderIndex); ;
            }
            this.waitForTextToUpdate(orderIdElem, orderId).then(function () {
                console.log('Order Id updated to :', orderId);
            });

        });
        return this;
    }

    VATTaxDisplayed() {
        return this.waitForElementDisplayed(orderHistoryPageObj.VATTax);
    }
}