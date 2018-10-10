import { LayoutComponent } from 'ibm-wch-sdk-ng';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicOrderHistoryLayoutComponent } from 'app/commerce/dynamic/order-history/order-history.dynamic.component';
import { TypeOrderHistoryComponent } from './../../components/order-history/typeOrderHistoryComponent';

/*
 * @name orderHistoryLayout
 * @id order-history-layout
 */
@LayoutComponent({
    selector: 'order-history-layout'
})
@Component({
    selector: 'app-order-history-layout-component',
    templateUrl: './orderHistoryLayout.html',
    preserveWhitespaces: false
})
export class OrderHistoryLayoutComponent extends TypeOrderHistoryComponent implements OnInit {
    @ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

    constructor(private loader: DynamicComponentLoader) {
        super();
    }

    ngOnInit() {
        this.loader.getComponentFactory<DynamicOrderHistoryLayoutComponent>('order-history').subscribe((cf)=>{
            const ref = this.outlet.createComponent(cf);
            ref.changeDetectorRef.detectChanges();
            ref.instance.title = this.title;
        },
        (error) => {
            console.warn(error);
        });
    }
}
