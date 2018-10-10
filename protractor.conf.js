var env = require('./protractor.env');
var PrettyReporter = require('protractor-pretty-html-reporter').Reporter;

var prettyReporter = new PrettyReporter({
    path: './report',
    screenshotOnPassed: false
});

setupGlobals();

var config = require('./e2e');
  TENANT_ID = config.TENANT_ID;
  URL = config.ENVIRONMENT_URL;
  SUBSCRIBER_EXTID = config.SUBSCRIBER_EXTID;
  SUBSCRIBER_PASSWORD = config.SUBSCRIBER_PASSWORD;
  SUBSCRIBER_DISPLAYNAME = config.SUBSCRIBER_DISPLAYNAME;
  AUTHENTICATION = config.AUTHENTICATION;
  API_GATEWAY_URL = "http://dch-dxcloud.rtp.raleigh.ibm.com";
  FEATURE_TOGGLES = config.FEATURE_TOGGLES;
  PROXY_URL = config.PROXY_URL;


exports.config = {

  directConnect: true,
  framework: 'jasmine',

  specs: [

    'dist/out-tsc/test/e2e/tests/app/AddressBookPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/LoginPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/RegistrationPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/MyAccountPage.e2e-spec.js',
    // 'dist/out-tsc/test/e2e/tests/app/ShoppingCartAsRegisteredUser.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/CheckoutPageAsRegisteredShopper.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/OrderHistoryPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/OrderDetailsPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/CheckoutPageAsGuestShopper.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/Breadcrumb.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/ProductRecommendationEspot.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/ProductDetailsPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/CategoryPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/CategoryRecommendation.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/MerchandisingAssociation.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/InvalidURL.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/SessionError.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/SearchPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/SiteSearch.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/ProductListing.e2e-spec.js',
    // 'dist/out-tsc/test/e2e/tests/app/BundleKit.e2e-spec.js', // - calibrated but bundle/kit not working atm
    'dist/out-tsc/test/e2e/tests/app/SEORichText.e2e-spec.js', // -  bundle/kit not working atm
    'dist/out-tsc/test/e2e/tests/app/PageOverrides.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/StoreLocatorPage.e2e-spec.js',
    'dist/out-tsc/test/e2e/tests/app/SearchKeywordRedirect.e2e-spec.js',

    // UI Extension - needs espot picker to be pushed to the tenant
    // Uses e2e.json setting
    'dist/out-tsc/test/e2e/tests/sitesui/EspotPicker.e2e-spec.js',

    //CSR needs to be created with the following credentials
    //logonid:
    //password:
    // 'dist/out-tsc/test/e2e/tests/app/CSRCartLock.e2e-spec.js'
    // 'dist/out-tsc/test/e2e/tests/app/CSROrderManagement.e2e-spec.js'
    // 'dist/out-tsc/test/e2e/tests/app/CSRUserManagement.e2e-spec.js'

    //CSR needs to be created with the following credentials
    //logonid:
    //password:
    'dist/out-tsc/test/e2e/tests/app/WishList.e2e-spec.js',
    // 'dist/out-tsc/test/e2e/tests/app/CSRCartLock.e2e-spec.js'
    // 'dist/out-tsc/test/e2e/tests/app/CSROrderManagement.e2e-spec.js'
    'dist/out-tsc/test/e2e/tests/app/CSRUserManagement.e2e-spec.js',

    //extended E2E - needs CMC configuration
    //GDPR requires CMC configuration to have 1.DA Anyltics enabled 2. Permantent session storage 3. marketing and Analytics selected
    //'dist/out-tsc/test/e2e/tests/app/PrivacyPolicy.e2e-spec.js' ,

    //requires CMC configuration to have  VAT support enabled in the Checkout section of the store
    //'dist/out-tsc/test/e2e/tests/app/VATTax.e2e-spec.js'

    // Permanently leave this out, validation is included as part of other testcases
    // 'dist/out-tsc/test/e2e/tests/app/OrderConfirmationPage.e2e-spec.js'

    // Buy online and pick up on store E2E test.
    'dist/out-tsc/test/e2e/tests/app/BuyOnlinePickUpInStore.e2e-spec.js'
    ],

    multiCapabilities: [
        {
        'browserName' : 'chrome',
        chromeOptions: {
            args: [
              'disable-extensions', 'enable-logging'
            ],
            extensions: [],
            prefs: {
              intl: { accept_languages: "e2e-ui" },
              download: { default_directory: e2eRoot },
              protocol_handler: {
                excluded_schemes: {
                  unsafe: false
                }
              }
            },
          }
        }

    ],

  jasmineNodeOpts: {
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 100000000,
  },

  baseUrl: env.base,

  params: {
    storeBaseUrl: env.stockholmBase
    },

  directConnect: true,
  allScriptsTimeout: env.allScriptsTimeout,

  onPrepare: function() {
    jasmine.getEnv().addReporter(prettyReporter);
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(2000, 1600);
   },

   beforeLaunch() {
    prettyReporter.startReporter();

    log4js.configure({
        appenders: [
          {
              type: "console"
          }
        ],
        replaceConsole: true
        });
  }

}

function setupGlobals() {

    var path = require('path');
    global.e2eRoot = path.resolve(__dirname) + '/test/e2e';
    global.waitForElement = require(e2eRoot + '/common/PageObject').waitForElement;
    global.waitForElementToDisappear = require(e2eRoot + '/common/PageObject').waitForElementToDisappear;
    global.waitForPromiseTest = require(e2eRoot + '/common/PageObject').waitForPromiseTest;
     global.log4js =  require("log4js");

    global.TENANT_ID = "";
    global.SUBSCRIBER_EXTID = "";
    global.SUBSCRIBER_PASSWORD = "";
    global.SUBSCRIBER_DISPLAYNAME = "";
    global.AUTHENTICATION = "cookie";
    global.URL = "";
    global.API_GATEWAY_URL = "";
    global.FEATURE_TOGGLES = {};
    global.GLOBAL_TOGGLES = "";
    global.TENANT_TOGGLES = "";
   }
