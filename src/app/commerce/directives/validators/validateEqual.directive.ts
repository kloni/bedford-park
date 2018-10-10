import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
@Directive({
	selector: '[commerce-validateEqual][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidateEqualDirective, multi: true }]
})
export class ValidateEqualDirective implements Validator {

	@Input('commerce-validateEqual') validateEqual: string;

	constructor() {}
	validate(c: FormControl) {
		let self = c.value;
		let target = c.root.get(this.validateEqual);
		
		if (self && target && self !== target.value) { 
			target.setErrors({ valid: false }); 
			return { valid: false } 
		}
		else if (self && target && self === target.value) {
			delete target.errors['valid'];
			if (!Object.keys(target.errors).length) {
				target.setErrors(null); 
			}
		}

		return null;
	}
}