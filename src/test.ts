/*******************************************************************************
 * Copyright IBM Corp. 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;
global['performance']=undefined;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();

/**
 * === override JSON.stringify to handle cyclic object ====
 * When JSON object has circular references and we are trying to call JSON.stringify, this cyclic error will occur.
 * We are calling a lot of JSON.stringify for logger purposes.
 * When we run test using PhantomJS, all of the JSON.stringify under the transaction service causes an error,
 * and the suggested solution is by adding replace function mentioned in here:
 * 1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 * 2. https://github.com/douglascrockford/JSON-js/blob/master/cycle.js (this is where the replace function from, and it's open license)
 *
 */
const stringify = JSON.stringify;
JSON.stringify = function(obj) {
  return stringify(decycle(obj));
};

let decycle = function(object) {
  'use strict';
  let objects = new WeakMap();     // object to path mappings
  return (function derez(value, path) {
    let old_path;   // The path of an earlier occurance of value
    let nu;         // The new object or array
    if (
        typeof value === 'object' && value !== null &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String)
    ) {
      old_path = objects.get(value);
      if (old_path !== undefined) {
          return {$ref: old_path};
      }
      objects.set(value, path);
      if (Array.isArray(value)) {
          nu = [];
          value.forEach(function (element, i) {
              nu[i] = derez(element, path + '[' + i + ']');
          });
      } else {
          nu = {};
          Object.keys(value).forEach(function (name) {
              nu[name] = derez(
                  value[name],
                  path + '[' + JSON.stringify(name) + ']'
              );
          });
      }
      return nu;
    }
    return value;
  }(object, '$'));
};

window['digitalData'] = {};
window['IORequest'] = {};
window['readDDXObject'] = function(){};
window['cmSetupNormalization'] = function(){};
window['cmSetupOther'] = function(){};
window['cmSetClientID'] = function(){};
window['cmCreateManualImpressionTag'] = function(){};