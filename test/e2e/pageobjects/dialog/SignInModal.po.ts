import { Dialog } from  './Dialog.po';
import { by, element } from 'protractor';
import { RegistrationPage } from '../page/RegistrationPage.po';

var log4js = require("log4js");
var log = log4js.getLogger("SignInModal");


export const signInModal = {
    dialog : element.all(by.css("[id^=signInModal_]")).first(),

    logonId: element.all(by.css("[id^=signin_input_9_]")).first(),
    pw: element.all(by.css("[id^=signin_input_10_]")).first(),

    signIn: element.all(by.css("[id^=signin_button_]")).first(),
    register: element.all(by.css("[id^=signin_register_]")).first(),

    close: element.all(by.css("[id^=signin_close_]")).first()

  };

export class SignInModal extends Dialog {

    constructor(){
        super();
        this.waitForElementDisplayed(signInModal.dialog);
        this.waitForElementDisplayed(signInModal.logonId);
        this.waitForElementDisplayed(signInModal.pw);
        this.waitForElementDisplayed(signInModal.signIn);
        this.waitForElementDisplayed(signInModal.register);
    }

    clickRegister(): RegistrationPage{
        signInModal.register.click().then(()=>{
            console.log('Clicked on registration page link');
        });
        return new RegistrationPage();
    }

    waitForDialogNotDisplayed(): Promise<boolean>{
        return this.waitForElementNotDisplayed(signInModal.dialog);
    }

    dialogNotDisplayed(): Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => {
            signInModal.dialog.isDisplayed().then(displayed => {
                console.log('sign In dialog not displayed anymore:', displayed);
                resolve(displayed);
            })
        });
    }

    typeUserName(userName: string): SignInModal{
        signInModal.logonId.clear();
        signInModal.logonId.sendKeys(userName);
        return this;
    }

    typePw(pw : string): SignInModal{
        signInModal.pw.clear();
        signInModal.pw.sendKeys(pw);
        return this;
    }

    clickSignIn(): SignInModal{
        signInModal.signIn.click().then(()=>{
            console.log('Clicked on sign In button');
        });
        return this;
    }

}