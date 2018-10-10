import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive } from '@angular/core';
@Directive({
	selector: '[commerce-identifier][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidIdentifierDirective, multi: true }]
})
export class ValidIdentifierDirective implements Validator {

	constructor() {}
	validate(c: FormControl) {
		const valid:boolean = !c.value||/^$/.test(c.value)||/^\s*\w[\w\s]*$/.test(c.value);
		const msg:any = {valid:false};
		return valid?null:msg;
	}
}