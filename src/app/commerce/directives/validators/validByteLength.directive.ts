import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
var utf8Length = require("utf8-byte-length")
@Directive({
	selector: '[commerce-maxlength][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidByteLengthDirective, multi: true }]
})
export class ValidByteLengthDirective implements Validator {

	@Input('commerce-maxlength') maxLength: number;

	constructor() {}
	validate(c: FormControl) {
		const valid: boolean = !c.value||this.getByteLength(c.value) <= this.maxLength;
		const msg: any = { valid: false };
		return valid?null:msg;
	}

	getByteLength(UTF16String) {
		return utf8Length(UTF16String);
	}
}