const { readFileSync, writeFile, readdirSync } = require('fs');
const processGen = require('process');
const iconv = require('iconv-lite');
const path = require('path');
const files = readdirSync("./");
const txtFileName = files.filter(file => path.extname(file) === '.txt');

// checking the arguments given by the command line
if(processGen.argv[4].length != 6 ) console.log("Check your input arguments again!", processGen.argv[4].length, processGen.argv[3] != "end"), processGen.exit();

const typnatcode = processGen.argv[2];
const action = processGen.argv[3];
const sixDigitDate = processGen.argv[4];

try {
    const buffer = readFileSync(`./${txtFileName}`);
    const data = iconv.decode(buffer, 'iso-8859-7');
    const lines = data.split('\n');

   for(let i=0; i<lines.length; i++) {

        // returns typnatcd 
        let typnatcd = lines[i].match(/\b(\d+)/);
        // returns date
        let date = lines[i].match(/\b\d{12}\b/);
        
        if(typnatcd[1] == typnatcode){

            let startingDate = date[0].substring(0,6);
            let endingDate = date[0].substring(6,13); 

            let fileName = `${txtFileName}_1`;

            let finalString = "";

            if(action == "beg") finalString = lines[i].replace(startingDate, sixDigitDate);
            console.log(endingDate, sixDigitDate);
            if(action == "end") finalString = lines[i].replace(endingDate, sixDigitDate);

            writeFile(fileName, finalString, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
                processGen.exit(); 
            });
            // typnatcode was found, no need to continue the loop     
        };
    };
    
  } catch (error) {
    console.error('Error reading the file:', error);
  } finally {}