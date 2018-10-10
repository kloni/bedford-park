/*******************************************************************************
 * proxy.config.js
 *
 * Copyright IBM Corp. 2018
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
 ******************************************************************************/

/**
 * Developer dev server proxy config, does not apply to production.
 * Modify this to match your dev env configuration.
 */
const DOMAIN_NAME = 'my12.digitalexperience.ibm.com';
const CONTENT_HUB_ID = 'f65c109a-b965-43a3-b102-ea161ba72a26';
const IDC_SEARCH_HOST = 'https://localhost:3738';
const IDC_TRANSACTION_HOST = 'https://localhost:5443';
const DEV_HOST = 'http://localhost:4200';

const PROXY_CONFIG = {
    /**
     * WCH requests
     */
    "/api": { // for API request
        "target": "https://" + DOMAIN_NAME + "/api/" + CONTENT_HUB_ID,
        "secure": false,
        "pathRewrite": {
            "^/api": ""
        },
        "changeOrigin": true
    },
    /**
     * IDC search server proxy
     * update this to the IDC search server to the one that you prefer
     */
    "/search/resources": { // search server
        "target": IDC_SEARCH_HOST,
        "secure": false,
        "changeOrigin": true
    },
    /**
     * IDC transaction server proxy
     * update to the IDC transaction server that your are using.
     */
    "/wcs/resources": { // transaction server
        "target": IDC_TRANSACTION_HOST,
        "secure": false,
        "changeOrigin": true
    }
    // ,
    /**
     * Local Secure checkout SPA
     */
    // "/checkout": {
    //     "target": DEV_HOST,
    //     "pathRewrite": {
    //         "^/checkout": ""
    //     }
    // }
};

/**
 * WCH requests
 */
PROXY_CONFIG["/api/" + CONTENT_HUB_ID] = { // /api/{tenantId}
    "target": "https://" + DOMAIN_NAME,
    "secure": false,
    "changeOrigin": true
};
PROXY_CONFIG["/" + CONTENT_HUB_ID] = { // for delivery url
    "target": "https://" + DOMAIN_NAME,
    "secure": false,
    "changeOrigin": true
};
module.exports = PROXY_CONFIG;
