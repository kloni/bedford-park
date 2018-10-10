import { LayoutComponent } from "ibm-wch-sdk-ng";
import { Component, ViewEncapsulation, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { TypeStoreLocatorComponent } from "../../components/store-locator/typeStoreLocatorComponent";
import { DynamicComponentLoader } from "../../../dynamic-component-loader/dynamic-component-loader.service";
import { DynamicStoreLocatorLayoutComponent } from "app/commerce/dynamic/store-locator/store-locator.dynamic.component";

/*
 * @name storeLocatorLayout
 * @id store-locator-layout
 */
@LayoutComponent({
    selector: 'store-locator-layout'
})
@Component({
  selector: 'app-store-locator-layout-component',
  templateUrl: './storeLocatorLayout.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class StoreLocatorLayoutComponent extends TypeStoreLocatorComponent implements OnInit {
    @ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

    constructor(private loader: DynamicComponentLoader) {
        super();
    }

    ngOnInit() {
        this.loader.getComponentFactory<DynamicStoreLocatorLayoutComponent>('store-locator').subscribe((cf)=>{
			const ref = this.outlet.createComponent(cf);
            ref.changeDetectorRef.detectChanges();
            ref.instance.title = this.title;
            this.onAvailableServices.subscribe(r=>ref.instance.catSubj.next(r));
		},
		(error) => {
			console.warn(error);
		});
    }
}