import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { TypeCustomerServiceRepresentativeComponent } from 'app/commerce/components/customer-service-representative/typeCustomerServiceRepresentativeComponent';
import { DynamicComponentLoader } from 'app/dynamic-component-loader/dynamic-component-loader.service';
import { DynamicCSRComponent } from 'app/commerce/dynamic/csr/csr.dynamic.component';

/*
 * @name CSR Default Layout
 * @id csr-default-layout
 */
@LayoutComponent({
    selector: 'csr-default-layout'
})
@Component({
  selector: 'app-csr-default-layout-component',
  templateUrl: './csr-default-layout.html',
  preserveWhitespaces: false
})
export class CsrDefaultLayoutComponent extends TypeCustomerServiceRepresentativeComponent {

    @ViewChild('outlet', {read: ViewContainerRef}) outlet: ViewContainerRef;

    constructor(private loader: DynamicComponentLoader) {
        super();
    }

    ngOnInit() {
        this.loader.getComponentFactory<DynamicCSRComponent>('csr').subscribe((cf)=>{
            const ref = this.outlet.createComponent(cf);
            ref.changeDetectorRef.detectChanges();
            ref.instance.title = this.title;
        },
        (error) => {
            console.warn(error);
        });
    }
}