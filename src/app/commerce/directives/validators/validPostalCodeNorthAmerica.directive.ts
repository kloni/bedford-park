import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
@Directive({
	selector: '[commerce-postalcode-northamerica][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidPostalCodeNorthAmericaDirective, multi: true }]
})
export class ValidPostalCodeNorthAmericaDirective implements Validator {

	private zipPattern:any = {
        "US": /^\d{5}(?:[-\s]\d{4})?$/,
        "CA": /^([a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d)$/
    };
	@Input() countryCode: string;
	constructor() {}
	validate(c: FormControl) {
		const fallbackPattern: RegExp = /^(\d{5}|[a-zA-Z]\d[a-zA-Z]\s*\d[a-zA-Z]\d)$/;
		const pattern: RegExp = this.countryCode ? this.zipPattern[this.countryCode] : fallbackPattern;
		const valid:boolean = !c.value||!pattern||pattern.test(c.value);
		const msg:any = {valid:false};
		return valid?null:msg;
	}
}