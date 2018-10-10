import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive } from '@angular/core';
@Directive({
	selector: '[commerce-nonwhitespace][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: NonWhitespaceDirective, multi: true }]
})
export class NonWhitespaceDirective implements Validator {

	constructor() {}
	validate(c: FormControl) {
		const valid:boolean = !c.value||/^$/.test(c.value)||!(/^\s+$/.test(c.value));
		const msg:any = {valid:false};
		return valid?null:msg;
	}
}