var env = require('./protractor.env');

exports.config = {
  directConnect: true,

  framework: 'jasmine',

  specs: [
    'dist/out-tsc/test/e2e/tests/app/StorePreCheck.e2e-spec.js',
],

  multiCapabilities: [
      {
       'browserName' : 'chrome'  
      }
   ],

  jasmineNodeOpts: {   
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 1000000,
  },

  baseUrl: env.base,
  directConnect: true,
  allScriptsTimeout: env.allScriptsTimeout,  
  
  onPrepare: function() {
      browser.ignoreSynchronization = true;
      browser.driver.manage().window().setSize(2000, 1600);
   }
}
