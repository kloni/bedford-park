/*
 * Copyright IBM Corp. 2017
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/
import { NgModule } from "@angular/core";
import { NonWhitespaceDirective } from "./validators/nonWhitespace.directive";
import { ValidIdentifierDirective } from "./validators/validIdentifier.directive";
import { ValidPhoneDirective } from "./validators/validPhone.directive";
import { ValidPostalCodeNorthAmericaDirective } from "./validators/validPostalCodeNorthAmerica.directive";
import { ValidByteLengthDirective } from "app/commerce/directives/validators/validByteLength.directive";
import { ValidateEqualDirective } from "app/commerce/directives/validators/validateEqual.directive";
import { ValidNotAllowedStrDirective } from "./validators/validNotAllowedStr.directive"
@NgModule({
	imports: [],
	declarations: [
		NonWhitespaceDirective,
		ValidIdentifierDirective,
		ValidPhoneDirective,
		ValidPostalCodeNorthAmericaDirective,
		ValidByteLengthDirective,
        ValidateEqualDirective,
        ValidNotAllowedStrDirective
	],
	providers: [],
	exports: [
		NonWhitespaceDirective,
		ValidIdentifierDirective,
		ValidPhoneDirective,
		ValidPostalCodeNorthAmericaDirective,
		ValidByteLengthDirective,
        ValidateEqualDirective,
        ValidNotAllowedStrDirective
	]
})
export class CommerceDirectivesModule {}

