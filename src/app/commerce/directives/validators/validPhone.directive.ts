import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive } from '@angular/core';
@Directive({
	selector: '[commerce-phonenumber][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidPhoneDirective, multi: true }]
})
export class ValidPhoneDirective implements Validator {

	constructor() {}
	validate(c: FormControl) {
		const valid:boolean = !c.value||/^$/.test(c.value)||/^\s*(\+?\d*)?[-. (]*\d{3}[-. )]*\d{3}[-. ]*\d{4}$/.test(c.value);
		const msg:any = {valid:false};
		return valid?null:msg;
	}
}