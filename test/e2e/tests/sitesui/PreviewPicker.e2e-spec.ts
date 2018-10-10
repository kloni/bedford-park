var Login = require("login-e2e-ui").Login;
var CUI = require("cui-e2e-ui");
var ShellNotifications = require('shell-ui-pageobjects').ShellNotifications;

import { browser } from 'protractor';
import {Util} from '../../utility/Util';

var log4js = require("log4js");
var log = log4js.getLogger("logintest.e2e");


/**
 * Espot Picker
 * Manual testing:
 * List of espots displayed in the espot dropdown: 1. site level 2. Asset store level
 *
 * Creating a content with espot picker:
 * 1. In palette, check for the custom element > espot picker
 * 2. add a espot picker to the content type
 * 3. create a content
 * 4.  check 3 options in the dropdown
 * 5. select common espots
 * 6. open the espot dropdown
 * 7. check the espot names
 */

describe('User uses website preview', function() {

    let util : Util  = new Util();
    const dataFile = require('./data/PreviewOption.json');

    beforeAll(function(done) {
        //Login as admin
        var login = new Login();
        login.asAdmin();

        //go to websites
        //go click on Stockholm
        done();
    })

    afterEach(function(done) {
        done();
    })

    it('to view stockholm in different time ad', function() {

        /**
         * Date and time TP
        Open the Preview option dropdown
        close the option dropdown
        open the preview option dropdown again

        Go to the commerce tab
        Use the date picker- to select/ type date
        Use the time picker - to select /type date

        Hide out of stock products -
            do we have an out of stock products?
            - open mega menu and browse
        Clear all button
            verify the date/time/out of stock product option has been reset

        open the customer dropdown
        select a customer option
        select date
        select time

        click apply?

        In stockholm, what UI change do I see?

         */
    });

});
