import {
	NG_VALIDATORS,
	FormControl,
	Validator
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
@Directive({
	selector: '[commerce-not-allowed-str][ngModel]',
	providers: [{ provide: NG_VALIDATORS, useExisting: ValidNotAllowedStrDirective, multi: true }]
})
export class ValidNotAllowedStrDirective implements Validator {

    @Input('commerce-not-allowed-str') notAllowedStr: string;
	constructor() {}
	validate(c: FormControl) {
		const valid: boolean = this.checkString(c.value);
        const msg: any = { valid: false };
		return valid ? null: msg;
	}

    checkString(str: string) : boolean {
        return ! (str === this.notAllowedStr);
    }
}