import { Injectable } from '@angular/core';
import { LoggerFactory } from "ibm-wch-sdk-ng";
import { Logger as aLogger, Options } from "angular2-logger/core";
import { ConfigService } from "./config.service";
import { Logger } from "ibm-wch-sdk-ng";

@Injectable()
export class Angular2LoggerFactory implements LoggerFactory {
    private options:Options;

	create ( name: string ): Logger {
        let lg =  new aLogger(this.getOptions());
        lg['name'] = name;
        return lg;
    }

    constructor(private cs:ConfigService) {
        cs.getLoggerOptions().subscribe((r)=>{
            this.options=r;
        })
    }

    private getOptions():Options {
        return this.options;
    }
}