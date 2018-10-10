/*******************************************************************************
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
 *******************************************************************************/

const shell = require('shelljs');
const sourceMapName = 'source-map-explorer.html';
const tempDirName = 'tempSrcMap';

console.log('Building source map.\n');
shell.exec('node --max_old_space_size=5048 ./node_modules/@angular/cli/bin/ng build --prod --vendor-chunk=false --sm --output-path ' + tempDirName);
console.log('\nGenerating html explorer file as ' + sourceMapName + '.\n');
const sourceMapFile = shell.find(tempDirName + '/main.*.bundle.js')[0];
if (sourceMapFile) {
  shell.exec('source-map-explorer --html ' + sourceMapFile + ' > ' + sourceMapName);
  console.log('\nremoving ' + tempDirName + '\n');
  shell.rm('-r', tempDirName);
  console.log('Successfully generated source map explorer at ' + sourceMapName + '. Open file in a browser to interact with the source map explorer.');
} else {
  console.error('\nCould not locate source map file');
}
