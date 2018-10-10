# wch-stockholm-application
Source code for the IBM Digital Commerce and Watson Content Hub starter site application - Stockholm. 

## Prerequisites

* A WCH tenant with Stockholm assets (i.e. WCH Storefront Manager Edition)
* Node.js v8.10.0 or above
**Note:** We recommend to run npm install after getting the latest from this repository to get the latest prerequisites. 

## Overview
This github repository contains all the source code files like javascript, css and html but not the Stockholm artifacts like pages, content types, categories, and content.
WCH Storefront Manager tenants will have the Stockholm artifacts automatically deployed.
Not sure if you have the Stockholm artifacts? 

* Log in to your tenant and go to the Website menu and check if Stockholm is rendering in the preview window.
* Check SDK and SPA build levels from the browser
  * Open the dev console
  * Search for 'Build date' to get the current SPA level
  * Search for 'SDK version' to get the SDK version included in the SPA

You can compare the Build date with the date shown in the "Update the sample site" widget on the Home page to see if your deployed sample is older than the latest sample code.
Instructions on how to update Stockholm to the latest can be found here: [Updating your Stockholm sample](https://developer.ibm.com/customer-engagement/tutorials/updating-oslo-sample/).
  
## Documentation
1. [Roadmap for developing your own site](https://developer.ibm.com/customer-engagement/tutorials/roadmap-developing-your-own-website/#tocoverview)
2. [Site structure (Content model-How the sample site is built)](https://developer.ibm.com/customer-engagement/docs/wch/developing-your-own-website/content-model-oslo-website/)
3. [Programming Model](/doc/README-programming-model.md)
4. [Watson Content Hub - Sites Development Overview](https://ibm.box.com/s/0od1ta7hsmkxzl2i8y08o06zqwa0pzbq)
5. [Customizing the sample website](https://developer.ibm.com/customer-engagement/docs/wch/developing-your-own-website/customizing-sample-site/)
6. [Resources](#resources)
7. [Updating your Oslo sample](https://developer.ibm.com/customer-engagement/tutorials/updating-oslo-sample/)

## Getting started for local development (installing pre-requisites)
1. Make sure wchtools (`npm install -g wchtools-cli`) and ibm-wch-sdk-cli (`npm install -g ibm-wch-sdk-cli`) are installed
Note: `node` should be at the latest release of version 8

2. From your cli make sure to install project dependencies by running `npm install`

### Configuring IDC and WCH tenant information for local development

This file determines from which WCH tenant site and layout information gets served from. And it also has the IDC tenant information.

1. Update `src/proxy.config.js` to reflect your WCH tenant
const DOMAIN_NAME = 'myX.digitalexperience.ibm.com';
const CONTENT_HUB_ID = 'c52c930e-5e66-4a3d-943c-a5f3127c6741';

2. Update `src/proxy.config.js` to reflect your IDC information (it can point to your local IDC SDK or a non-production IDC tenant)
const IDC_SEARCH_HOST = 'https://idcsdk.ibm.com:3738';
const IDC_TRANSACTION_HOST = 'https://idcsdk.ibm.com:5443';

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app
will automatically reload if you change any of the source files.


## Build

Run `npm run build` to build the project. The build artifacts will be stored in
the `assets/` directory. Use the `-prod` flag for a production build.

## Deployment to Watson Content Hub

Run `npm run deploy` to deploy the built code to Watson Content Hub. There is also a shortcut for building and deploying in one step via `npm run build-deploy`. Note that publishing can take up to 20 minutes for all updates to be available.
In case you do not want to wait for the server side akamai cache to time out you can flush the cache via:
wchtools clear --cache
More information can be found here: [Clearing the content delivery network cache](https://github.com/ibm-wch/wchtools-cli#clearing-the-watson-content-hub-content-delivery-network-cache)

## Running unit tests and end-to-end tests

See the included detailed documentation on running tests [Running unit tests and end-to-end tests](RunningTest-README.md) .


## Resources
Find more details on the WCH development environment, technical documentation, sample applications, APIs and other information to jumpstart your development project.
### Tools
* [WCH tools](https://github.com/ibm-wch/wchtools-cli)
* [NodeJS](https://developer.ibm.com/node/sdk/v6/)
### API
* [API Explorer](https://developer.ibm.com/api/view/id-618:title-IBM_Watson_Content_Hub_API)
### Documentation
* [Developer documentation](https://developer.ibm.com/customer-engagement/docs/wch/)
* [Help](https://www.ibm.com/support/knowledgecenter/SS3UMF/dch/welcome/dch_welcome.html) 
* [Videos](https://developer.ibm.com/customer-engagement/videos/category/watson-content-hub/)
### Samples
* [WCH samples](https://developer.ibm.com/customer-engagement/watson-content-hub/samples/)
### Support forum
* [dW Answers](https://developer.ibm.com/answers/smart-spaces/301/watson-content-hub.html)

## License

See the included license file [License](LICENSE) .
