import { browser, protractor, ElementFinder } from 'protractor';
import { } from 'jasmine';
import { ElementArrayFinder } from 'protractor/built/element';
var log4js = require("log4js");
var log = log4js.getLogger("Utility");

/**
* Utility
*
* @class
*/

export class Util {

    constructor() {

    }

    makeUnique(p_string: string) : string{
        var uniqueId = Math.floor((Math.random() * Date.now())/1000000 + 1);
        return p_string + "_" + uniqueId;
    }


}