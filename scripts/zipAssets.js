/*******************************************************************************
 * zipAssets.js
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

// require modules

console.log(process.argv);
console.log("======")
const fs = require('fs');
const archiver = require('archiver');
const dateString = (new Date()).toJSON().replace(/-/g, '').replace('T', '-').replace(/:\d\d.\d\d\dZ/, '').replace(':', '');

if (!process.argv[2]) {
    throw new Error("Missing store identifier!");
}

const dest = `dist/store_${process.argv[2]}_${dateString}.zip`;

// create a file to stream archive data to.
let output = fs.createWriteStream(dest);
let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
output.on('close', function() {
    console.log(`${dest} ${archive.pointer()} total bytes`);
    console.log('Zipping up Stockholm finished, archiver has been finalized and the output file descriptor has closed.');
});

// This event is fired when the data source is drained no matter what was the data sourcse.
// It is not part of Archiver but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
output.on('end', function() {
    console.log('Zipping up Stockholm, data has been drained');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        // throw error
        throw err;
    }
});

// good practice to catch this error explicitly
archive.on('error', function(err) {
    throw err;
});

// pipe archive data to the file
archive.pipe(output);

archive.directory('dist/assets/', false);

// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();