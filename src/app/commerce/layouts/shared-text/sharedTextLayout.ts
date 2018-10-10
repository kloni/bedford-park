/*******************************************************************************
 * Copyright IBM Corp. 2018
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import {
    LayoutComponent
} from 'ibm-wch-sdk-ng';
import { Component } from '@angular/core';
import { TypeSharedTextComponent } from './../../components/shared-text/typeSharedTextComponent';

/*
 * @name sharedTextLayout
 * @id shared-text-layout
 */
@LayoutComponent({
    selector: 'shared-text-layout'
})
@Component({
  selector: 'app-shared-text-layout-component',
  templateUrl: './sharedTextLayout.html',
  styleUrls: ['./sharedTextLayout.scss'],
  preserveWhitespaces: false
})
export class SharedTextLayoutComponent extends TypeSharedTextComponent {

    /*
     * TODO add custom fields here. These fields should be those
     * specific to this layout.
     */

    constructor() {
        super();
        /*
         * TODO initialize your custom fields here, note that
         * you can refer to the values bound via @RenderingContextBinding from
         * your super class.
         *
         * Make sure to call 'this.safeSubscribe' if you plan to subscribe to observables
         */
    }

}
