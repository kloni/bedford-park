var Login = require("login-e2e-ui").Login;
var CUI = require("cui-e2e-ui");
var ShellNotifications = require('shell-ui-pageobjects').ShellNotifications;

import { browser } from 'protractor';
import {Util} from '../../utility/Util';

var log4js = require("log4js");
var log = log4js.getLogger("logintest.e2e");


/**
 * Category Picker
 */

describe('User uses category picker ', function() {

    let util : Util  = new Util();
    const dataFile = require('./data/CategoryPicker.json');

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

    it('to choose products for product recommendation content', function() {
        /**
         * Open the new content type creation page
            Add commerce product
            Enter key
            Go to the custom display tab
            In the dropdown, select the category
            wait for auto save

            go to all contents page
            from the dropdown, choose the new content type
            select the product from dropdown
            check the tag with product partnumber existant

            delete the category
         */
    });

    it('to choose categories for category recommendation content', function() {
        /**
         * Open the new content type creation page
            Add commerce category
            Enter key
            Go to the custom display tab
            In the dropdown, select the parent category
            wait for auto save

            go to all contents page
            from the dropdown, choose the new content type
            select the products from dropdown
            check the tag with expected category name existant
         */
    });

});
