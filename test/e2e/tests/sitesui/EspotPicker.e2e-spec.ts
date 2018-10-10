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

describe('User', function() {

    let util : Util  = new Util();
    const dataFile = require('./data/EspotPicker.json');

    beforeAll(function(done) {
        //Login as admin
        var login = new Login();
        login.asAdmin();

        this.typeTitle = util.makeUnique("type");
        this.contentTitle = util.makeUnique("content");

        log.info('Type title - ', this.typeTitle);
        log.info('Content title - ', this.contentTitle);

        done();
    })

    afterEach(function(done) {
        done();
    })

    it('create a content type and a content using Espot picker', function() {

        //Go to Content type creation page
        this.cui = new CUI();
        this.allTypes = this.cui.ribbon().contentModel().contentTypes();
        var typeCreationPage = this.allTypes.newType().setTitle(this.typeTitle);

        // In the element palette
        var palette = typeCreationPage.palette();

        //Add the Espot picker
        var setting = palette.addEspotPicker();

        //Set the label and key
        typeCreationPage =  setting.setLabel(dataFile.espotPickerKey);
        setting.getKey().then( key => {
            expect(key).toEqual(dataFile.espotPickerKey);
        });
        //Click apply
        setting.apply();

        //why do I need this?
        browser.sleep(10000);

        //Go to Contents page
        var allContentAssets = this.cui.ribbon().content().allContentAndAssets();

        //Create a new content from the newly created type
        var content = allContentAssets.createContent(this.typeTitle)
        .setName(this.contentTitle).waitForAutosave();

        //In the epsot picker element, get the espot type dropdown
        var espotPicker = content.getEspotPickerElement(dataFile.espotPickerKey,false);

        browser.sleep(5000);
        var espotPickerDropdown  = espotPicker.espotSelectionType();

        //select the espot dropdown select 'suffix'
        espotPickerDropdown.setEspotType(dataFile.suffix);

        //Get the espot type tag
        var tags = espotPicker.getespotSelectTypeTag();

        //check the tag for the appropriate type text
        tags.getTags().then(tagTexts => {
            expect(tagTexts).toContain(dataFile.suffix);
        });

        //the pattern text input is displayed
        espotPicker.getEspotPatternInputDialog().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        //select the espot dropdown select 'prefix'
        espotPickerDropdown.setEspotType(dataFile.prefix);
        tags = espotPicker.getespotSelectTypeTag();
        tags.getTags().then(tagTexts => {
            expect(tagTexts).toContain(dataFile.prefix);
        });

        espotPicker.getEspotPatternInputDialog().then(displayed => {
            expect(displayed).toBeTruthy();
        });

        //remove the tag
        tags.removeTypeTag();

        //now select 'common espot' from the type dropdown
        espotPickerDropdown.setEspotType(dataFile.common);

        //get the espot name dropdown
        var espotNameDropdown = espotPicker.espotName();

        //check the available espot names
        espotNameDropdown.dropdown().getOptions().then(options => {
            expect(options).toContain(dataFile.espotList[0]);
            expect(options).toContain(dataFile.espotList[1]);
            expect(options).toContain(dataFile.espotList[2]);
        });

        //select an espot
        espotNameDropdown.selectEspotName(dataFile.espotList[2]);

        //close the dropdown
        espotNameDropdown.dropdown();

        //get the espot name tag
        var nameTags = espotPicker.espotNameTags();

        //the espot name tag displays the correct name
        nameTags.getTags().then(tagTexts => {
            expect(tagTexts).toContain(dataFile.espotList[2]);
        });
        espotPicker.end();

        //publish the content
        content.isPublishPresent().then(present => {
            expect(present).toBeTruthy();
        });
        content.setToPublished();

        browser.sleep(5000);

        //close all notification
        var notifications = new ShellNotifications();
        notifications.closeAll();

        //delete the content
        content.delete().ok();
        browser.sleep(5000);

        //delete the content type
        this.allTypes = this.cui.ribbon().contentModel().contentTypes();
        typeCreationPage = this.allTypes.edit(this.typeTitle);
        typeCreationPage.delete().ok();

    });

});
