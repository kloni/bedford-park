#!/bin/bash

VERSION=${VERSION_STRING}

echo "- debug: VERSION_STRING is $VERSION_STRING"
npm version ${VERSION} && npm install && npm run build && npm run copy-e2e && npm run test-jenkins
# npm version ${VERSION} && npm install && npm run build && chmod 777 ./chrome-ut.sh && ./chrome-ut.sh
