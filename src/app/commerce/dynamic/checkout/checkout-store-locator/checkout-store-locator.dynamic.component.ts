import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from "@angular/core";
import { StorefrontUtils } from "app/commerce/common/storefrontUtils.service";
import { HttpClient } from "@angular/common/http";
import { WchInfoService, RenderingContext } from "ibm-wch-sdk-ng";
import { CartTransactionService } from "app/commerce/services/componentTransaction/cart.transaction.service";
import { PersonContactService } from "app/commerce/services/rest/transaction/personContact.service";
import { MenuService } from "app/responsiveHeader/services/MenuService";
import { Subscription } from "rxjs/Subscription";

const uniqueId = require('lodash/uniqueId');

@Component({
    selector: 'commerce-dynamic-checkout-store-locator',
    templateUrl: './checkout-store-locator.dynamic.component.html',
    styleUrls: ['./checkout-store-locator.dynamic.component.scss']
})
export class CheckoutStoreLocatorDynamicComponent implements OnInit, AfterViewInit, OnDestroy {

    id: any;
    readonly storeLocatorModelId: string;
    readonly WCH_SEARCH_SERVICE_API_URL: string = '/delivery/v1/search?';
    readonly PREFERRED_STORE_KEY: string = 'preferredStore';
    readonly ADDRESS_KEY: string = 'address';
    readonly PHONE_NUMBER_KEY: string = 'phoneNumber';
    readonly ONLINE_OPTION_KEY: string = 'onlineOption';
    readonly PICKUP_OPTION_KEY: string = 'pickUpOption';
    readonly PICKUP_IN_STORE_KEY: string = 'PickupInStore';
    readonly physicalStoreNotSelected: string = "Checkout-store-locator.StoreNotSelected";
    componentName: string = "checkout-store-locator";
    showPickUpStore: boolean = false;
    selectedPhysicalStore: any;
    bopisSelection: string = this.ONLINE_OPTION_KEY; // default BOPIS selection to online option (ship to me)
    bopisSelectionSaved: boolean = false;
    _pickUpInStoreShipModeId: string = '';
    subscription: Subscription;
    @Output() onErrorMessage = new EventEmitter<string>();
    @Output() onSaveBOPIS = new EventEmitter<any>();
    @Input() set pickUpInStoreShipModeId(bopisOption){
        this._pickUpInStoreShipModeId = bopisOption;
    }
    get pickUpInStoreShipModeId(): any {
        return this._pickUpInStoreShipModeId;
    }
    serviceTypes: any[] = [];
    @Input() set availableServices(services) {
        this.serviceTypes = services;
    }
    get availableServices(): any[] {
        return this.serviceTypes;
    }

    constructor(private http: HttpClient,
        private storeUtils: StorefrontUtils,
        private wchInfo: WchInfoService,
        private cartTransactionService: CartTransactionService,
        private menuService: MenuService) {
        this.id = uniqueId();
        this.storeLocatorModelId = 'storeLocator_modal_' + this.id;
    }

    ngOnInit() {
        // check the shipModeCode from the cart order item
        let orderItem = this.cartTransactionService.cartSubject.getValue().orderItem;
        if (orderItem[0].shipModeCode === this.PICKUP_IN_STORE_KEY) {
            let pickUpSelection = { target: { id: this.PICKUP_OPTION_KEY } };
            this.onSelectionChange(pickUpSelection);
        }
        this.initPhysicalStore();

        this.subscription = this.menuService.preferredStore$.subscribe(() => {
            this.initPhysicalStore();
        })
    }

    ngAfterViewInit() {
        (<any>$(`#${this.storeLocatorModelId}`)).foundation();
    }

    ngOnDestroy() {
        if ((<any>$(`#${this.storeLocatorModelId}`)).length > 0) {
            (<any>$(`#${this.storeLocatorModelId}`)).foundation('close');
            (<any>$(`#${this.storeLocatorModelId}`)).foundation('_destroy');
            (<any>$(`#${this.storeLocatorModelId}`)).remove();
        }
        this.subscription.unsubscribe();
    }

    onSelectionChange(event: any) {
        this.bopisSelection = event.target.id;
        this.showPickUpStore = this.bopisSelection === this.ONLINE_OPTION_KEY ? false : true;
    }

    saveAndContinue() {
        if (!this.showPickUpStore) {
            this.selectedPhysicalStore = {};
        }
        else if (this.showPickUpStore && (!this.selectedPhysicalStore || !this.selectedPhysicalStore.storeId)) {
            // store is not selected
            this.bopisSelectionSaved = false;
            this.onErrorMessage.emit( this.physicalStoreNotSelected );
            return;
        }
        else {
            Promise.resolve(this.updatePhysicalStoreShippingInfo(this.selectedPhysicalStore.storeId, this.pickUpInStoreShipModeId));
        }
        this.onSaveBOPIS.emit(this.selectedPhysicalStore);
        this.bopisSelectionSaved = true;
        this.onErrorMessage.emit(null);
    }

    edit() {
        this.bopisSelectionSaved = false;
        this.initPhysicalStore();
    }

    initPhysicalStore() {
        let currentPhysicalStore: any = this.getPreferredStore();
        if (currentPhysicalStore) {
            this.getPhysicalStoreContent(currentPhysicalStore.storeName).then((res) => {
                if (res.documents && res.documents.length > 0) {
                    let physicalStore = res.documents[0].document;
                    this.selectedPhysicalStore = {
                        storeId: currentPhysicalStore.storeId,
                        storeName: currentPhysicalStore.storeName,
                        storeAddress: this.getElementValue(physicalStore, this.ADDRESS_KEY),
                        storePhoneNumber: this.getElementValue(physicalStore, this.PHONE_NUMBER_KEY)
                    };
                }
            });
        }
    }

    getPhysicalStoreContent(physicalStoreName: string): Promise<any> {
        let url: string;
        if (this.storeUtils.useMocks) {
            url = 'mocks/commerce/contextualsearch/contextualSearchResult.mocks.json';
        } else {
            /* istanbul ignore next */
            url = this.wchInfo.apiUrl + this.WCH_SEARCH_SERVICE_API_URL + this.getSearchQuery(physicalStoreName);
        }
        return this.http.get(url).toPromise();
    }

    getSearchQuery(physicalStoreName: string): string {
        return `q=${encodeURIComponent(`name:"${physicalStoreName}"`)} AND (type:"Physical store")&fq=classification:(content)&fq=isManaged:("true")&rows=1&fl=document:[json]`;
    }

    getElementValue(rc: RenderingContext, elem: string): string {
		if (rc && rc.elements[elem] && rc.elements[elem].value) {
            return rc.elements[elem].value;
        }
        else {
            return '';
        }
    }

    getPreferredStore(): string {
        return localStorage.getItem(this.PREFERRED_STORE_KEY) ? JSON.parse(localStorage.getItem(this.PREFERRED_STORE_KEY)) : null;
    }

    openStoreLocatorModal() {
        (<any>$(`#${this.storeLocatorModelId}`)).foundation('open');
    }

    updatePhysicalStoreShippingInfo(physicalStoreId: string, shipModeId: string): Promise<any> {
        return this.cartTransactionService.updateOrderShippingInfo(null, physicalStoreId, shipModeId);
    }

}