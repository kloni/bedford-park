/*******************************************************************************
 * sftpAsset.js
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

const minimist = require('minimist');

// parsing arguments
const opts = { //defaults
    string: ['host', 'port', 'remotePath', 'username', 'password'],
    default: { host: '', port: '', remotePath: '', username: '', password: ''}
};
let cmdArgs = minimist(process.argv.slice(2), opts);

console.log(`dest: ${cmdArgs.remotePath}, host: ${cmdArgs.host}, port: ${cmdArgs.port}, username: ${cmdArgs.username}, password: ${cmdArgs.password ===''? '':'*****'}`);

if ( cmdArgs.remotePath === '' || cmdArgs.host === '' || cmdArgs.port === '' || cmdArgs.username === '' || cmdArgs.password === '' ){
    console.error(`You must specify the following cmd line arguments: 'host', 'port', 'remoteFile', 'username', 'password'
    npm run sftp-assets --sftpHost=www.ftphost.com --sftpPort=20220 --sftpDest=CodeDeployment/SecureSPA --sftpUsername=testusername --sftpPassword=testpassword;
    You can also specify npm config properties sftpHost, sftpPort, sftpDest, sftpUsername, and sftpPassword in .npmrc file`);
    throw new Error("Missing commandline sftp information");
}

// getting the file
const fs = require('fs');
const fileNamePattern = /^store_\w+_\d{8}\-\d{4}.zip$/;

let fileName = '';
fs.readdirSync("dist").forEach(f => {
    if (f.match(fileNamePattern)){
        console.log(`Found file ${f}`);
        fileName = f;
    }
});


let Client = require('ssh2-sftp-client');
let sftp = new Client();
if (fileName === '') {
    throw "Secure SPA source file not found.";
}
const localFile = `dist/${fileName}`;
const remoteFile = `${cmdArgs.remotePath}/${fileName}`;
const remotePath = cmdArgs.remotePath;
const { host, port, username, password } = cmdArgs;
sftp.on('close', (hadError) => {
    if (hadError) {
        throw "Socket closed due to an error."
    }
});
sftp.on('error', (error)=>{
    throw error;
});
console.log("Connecting to remote server....");
sftp.connect({
    host: host,
    port: port,
    username: username,
    password: password
}).then(() => {
    console.log("Pushing " + localFile + " to " + remoteFile);
    return sftp.fastPut(localFile, remoteFile, null);
}).then(() => {
    console.log("Done ");
    return sftp.end();
}).catch((error)=>{
    throw error;
});
