import { element , by } from 'protractor';
import {BaseTest} from  './../base/BaseTest.po';


export const dialogObj = {
    closeButton:  element(by.className('close-button')) 

};

export class Dialog  extends BaseTest{
    constructor(){
        super();
    }

}