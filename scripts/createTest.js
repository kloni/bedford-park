const
fs = require('fs');
fsExtra = require('fs-extra');
minimist = require('minimist');

const componentsDir = 'src/app';
const end2endDir = 'e2e';
const testDir = 'tests/app';
const poDir= 'pageobjects'
const dataDir= 'data'


let opts = {
    string: ['name', 'type', 'srcDir', 'componentName'],
    default: { name: 'undefined', type: 'undefined', srcDir: 'undefined', componentName: 'undefined'}
}

let cmdArgs = minimist(process.argv.slice(2), opts);

if (cmdArgs.name === 'undefined' || cmdArgs.type === 'undefined' || 
    (cmdArgs.type === 'UT' && cmdArgs.srcDir === 'undefined') || (cmdArgs.type === 'UT' && cmdArgs.componentName === 'undefined')) {
    console.error(`Error: You must specify the following cmd line arguments: name, type, srcDir

    usage: 
        npm run create-test -- --name <test file name> --type <UT or E2E> --srcDir <location of source code> --componentName <name of component to test>
    example:
        npm run create-test -- --name authentication --type UT --srcDir commerce/services/componentTransaction --componentName AuthenticationTransactionService
    
        npm run create-test -- --name ShoppingCartPage --type E2E

    name            name of the test file, .spec.ts will be appended
    type            type of test, possible values are UT and E2E
    srcDir          directory where the source code resides, relatives to src/app
    componentName   name of component to test, starts with Capital Letter and camelCase
    
    `);
    return;
}

createTestFiles(cmdArgs);


/**
 * This function only generates for UT for now.
 * Once E2E template is generated, we can extend this script
 */
function createTestFiles(opts){
    let templateFileName;
    let newTestFilePath;

    if(opts.type =='UT'){
        templateFileName = 'unitTest.spec.ts';
        newTestFilePath = `${componentsDir}/${opts.srcDir}/${opts.name.charAt(0).toLowerCase()}${opts.name.slice(1)}.spec.ts`;
        fsExtra.copy('scripts/testTemplate/' + templateFileName, newTestFilePath, err => {
            if (err) {
                console.error(err);
                console.error('Error: Test file generation failed.');
            } 
            else {
                let testFile = fs.readFileSync(newTestFilePath, 'utf8');
    
                testFile = testFile.replace(/UnitTestTemplate/, `${opts.componentName}`);
    
                fs.writeFile(newTestFilePath, testFile, 'utf8', err => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(newTestFilePath + ' is generated successfully');
                    }
                });
            }
        });
    }
    else{
        templateFileName = 'e2eTest.e2e-spec.ts';
        newTestFilePath = `${end2endDir}/${testDir}/${opts.name}.e2e-spec.ts`;

        fsExtra.copy('scripts/testTemplate/' + templateFileName, newTestFilePath)
        .then(function(result) {
                let testFile = fs.readFileSync(newTestFilePath, 'utf8');
                testFile = testFile.replace(/ComponentName/g, `${opts.name}`);

                return new Promise(function(resolve, reject) {
                    fs.writeFile(newTestFilePath, testFile, 'utf8', function(err) {
                        if (err){
                            console.error(err);
                            console.error('Error: Test file generation failed.');
                            reject(error)
                        }else{
                            console.log(newTestFilePath + ' is generated successfully');
                            resolve(testFile);
                        }
                    })
                }).then(()=>{
                    templateFileName= 'e2eData.json';
                    newTestFilePath =  `${end2endDir}/${testDir}/${dataDir}/${opts.name}.json`;

                    fsExtra.copy('scripts/testTemplate/' + templateFileName, newTestFilePath, err => {
                        if (err) {
                            console.error(err);
                            console.error('Error: Test file generation failed.');
                        }else{
                            console.log(newTestFilePath + ' is generated successfully');
                        }
                    });
                });

        }).catch(err => {
            if (err) {
                console.error(err);
                console.error('Error: Test file generation failed.');
            } 
        });
        
    }  
            

    
}

