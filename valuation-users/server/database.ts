import { Request, Response} from 'express';

const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('node-xlsx');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');

//to upload files
import multer, { MulterError } from 'multer';

const app = express();

const port = 3000;

const saltRounds = 12;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Play16@@12@@',
    database: "valuationusers",
});

connection.connect((error: Error | null) => {
    if(error) {
        console.log("Error", error);
        return;
    }
    console.log("new connection!!");
});

const connection2 = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Play16@@12@@',
    database: "sgasgr_kasko",
});

const connection3 = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Play16@@12@@',
    database: "sgasgr_eurotax",
});

connection.connect((error: Error | null) => {
    if(error) {
        console.log("Error", error);
        return;
    }
    console.log("new connection to sgasgr_kasko!");
});

app.use(cors());

app.use(bodyParser.json());

//--------------------------FILE MANIPULATION------------------------------------------
const storage = multer.diskStorage({

    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
      cb(null, "./../../../../../../../ProgramData/MySQL/MySQL Server 8.0/Uploads");
    },

    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
      cb(null, `${file.originalname}`);
    }

}); 
  
const upload = multer({ storage });

app.post('/server/upload', upload.single('file') , (req: Request, res: Response) => {

    if (req.file) {

        
        let rows = [];
        let writeStr = "";
        let path = './../../../../../../../ProgramData/MySQL/MySQL Server 8.0/Uploads';
        const obj = xlsx.parse(path + `/${req.file.originalname}`); // parses a file

        //regex for the file name
        const s_marka_regex = /^SMarka\d{6}R\d\.(?:xls|xlsx)$/i;
       
        // check the filename
        console.log(s_marka_regex.test(req.file.originalname), req.file.originalname);
        if( s_marka_regex.test(req.file.originalname) ){
            console.log("The file name passed the `S_marka` regexp test");
        }

        //looping through all sheets
        for (let i = 0; i < obj.length; i++) {
            const sheet = obj[i];
            // Loop through all rows in the sheet
            for (let j = 0; j < sheet['data'].length; j++) {
              const row = sheet['data'][j];
              // for the first sheet and for the second row
              if (i == 0 && j == 1 ){
                // check for the correct column names in the file 0 - 3
                if( sheet['data'][j][0] == 'MarkaKodu' && sheet['data'][j][1] == 'TipKodu' && sheet['data'][j][2] == 'MarkaAdı' && sheet['data'][j][3] == 'TipAdı'){

                    // check the columns 4 - 17
                    for(let k = 4; k<=17; k++){
                        if (typeof sheet['data'][j][k] == 'string' || typeof sheet['data'][j][k] == 'number') {
                            {} // pass
                        } else {
                            console.log("File structure is not accepted!");
                            res.status(400).send('No file uploaded.');
                            return console.log("File structure is not accepted!");
                        }
                    }

                    // check the columns 17 - 18
                   for(let k = 18; k<=19; k++){
                        if (typeof sheet['data'][j][18] == 'string' || typeof sheet['data'][j][18] == 'number' &&  typeof sheet['data'][j][19] == 'undefined') {
                            {} // pass
                        } else {
                            console.log("File structure is not accepted!");
                            res.status(400).send('No file uploaded.');
                            return console.log("File structure is not accepted!");
                        }
                    }
                    console.log('File structure accepted!');
                  // if the check at the columns 0-3 fails
                } else{

                    res.status(400).json({response: 'No file uploaded.'});
                    return console.log("File structure is not accepted!");
                };
              };
              // Add the row to the rows array, quoting text cells and preserving cell content
              const quotedRow = row.map(cell => {
                // Quote all text cells
                if (typeof cell === 'string') {
                  return `"${cell}"`;
                }
                // For other cell types, preserve the content as shown
                return cell;
              });
              rows.push(quotedRow);
            };
          }
          
          // Create the CSV string with custom settings
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i].join(",") + "\n";
            writeStr += row;
          }

        //writes to a file, but you will presumably send the csv as a      
        //response instead
        fs.writeFile(`${path}/${convertToCSVFilename(req.file.originalname)}`, writeStr, { encoding: 'utf8' }, function(err: Error) {
            if(err) {
                return console.log(err);
            }
            console.log("The new CSV file was saved in /files directory!");
        });

        // console.log("Uploaded File Details:", req.file);
        res.send('File uploaded successfully.');

    } else {

        res.status(400).send('No file uploaded.');
    };

    function convertToCSVFilename(filename: string) {
        // Use a regular expression to match .xls or .xlsx at the end of the filename
        const regex = /\.(xls|xlsx)$/i;
        
        // Replace the matched extension with .csv
        const newFilename = filename.replace(regex, '.csv');
        
        return newFilename;
    };
});
//--------------------------FILE MANIPULATION------------------------------------------

// get the valuations table
app.post('/server/valuations', (req: Request, res: Response) => {
    const valuationQuery = `SELECT purc.id AS id, NAME AS company, num AS total, remaining , DATE_FORMAT(DATETIME, "%W %M %e %Y") AS started, DATE_FORMAT(expiration, "%W %M %e %Y") AS expiration 
    FROM valuationgroups val INNER JOIN valuationpurchases purc ON val.id = purc.gid 
    ORDER BY expiration ASC;`
    connection.query(valuationQuery, (error: Error, result: JSON) => {
        if(error) {
            console.log('error at getting the valuations!', req);
            res.status(500);
            return;
        } else {
            console.log('valuations got successfully!', res);
            res.status(200).json(result);
            return;
        }
    });
});

// connect to anydesk
app.post('/server/anyDesk', (req: Request, res: Response) => {
    const { execSync } = require('child_process');

    const command = 'cd ../../../../../../../Program Files (x86)/AnyDesk && anydesk.exe 1909629143 --file-transfer';

    try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(`Command output: ${output}`);
    res.status(200);
    } catch (error) {
    console.error(`Error executing command: ${error}`);
    }
});

// get equipments for open cars
app.post('/server/equip', (req: Request, res: Response) => {

    const typnatcode = req.body.typnatcode;

    const equipQuery = 'SELECT addeqcode, eqttext, addflag FROM addition INNER JOIN eqtext ON eqteqcode = addeqcode INNER JOIN `type` ON typnatcode = addnatcode WHERE addflag >= 2 AND typimpend = "" AND eqtlangcode = "GRGR" AND `addnatcode` = ? GROUP BY addeqcode';

    connection3.query(equipQuery, [typnatcode], (error:Error, result) => {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                console.log("Results found!");
                res.status(200).json(result);
            } else {
                console.log("No results found!");
                res.status(404).json(false);({response:"Incorrect password"});
            }
        }
    });
});

// log the user in
app.post('/server/login', (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const loginQuery = 'SELECT username, password FROM members WHERE `username` = ?';
    connection.query(loginQuery, [username], (error:Error, result) => {
        if (error) {
            throw error;
        } else {
            if (result.length > 0 && bcrypt.compareSync(password, result[0].password)) {
                console.log("User successfully logged in!");
                res.status(200).json(true);
            } else {
                console.log("Incorrect password");
                res.status(404).json(false);({response:"Incorrect password"});
            }
        }
    });
});

// register the user
app.post('/server/insert', (req: Request, res: Response) => {

    // get the values from the body request
    const username = req.body.username;
    const password = req.body.password;
    console.log("before encryption");
    // performing encryption
    const encryptPass = async () => {
        const encryptedPass = await bcrypt.hash(password, saltRounds);
        console.log("inside encryption");
        return encryptedPass;
    }
    // generate salt
    const generateSalt = async () => {
        const salt = await bcrypt.genSalt(saltRounds);
        console.log("inside salt generation");
        return salt;
    }
  
    const email = req.body.email;
    const date = new Date();

    // variable to store the query result
    let checkingNameResult: string;

    const storeWithEncrypted = async () => {

        const encryptedPassword = await encryptPass();
        const salt = await generateSalt();
        console.log("encryptedPass", encryptedPassword, "this is salt ->", salt);
        // check if the username already exists
        connection.query('SELECT username, password FROM members WHERE username = ?', [username], (error: Error, result: any) => {

            if (error) {
                throw error;

            } else {
                // if username exists return status(409)
                if(result.length > 0) {
                    console.log("The name is already taken!")
                    checkingNameResult = result[0].username;
                    res.status(409).json({ error: `Username ${username} is already taken` });
                    return;
                // else return status(200) successful register!
                } else {
                    console.log(`the name ${username} is not taken!!`);

                    const insertQuery = 'INSERT INTO members (username, email, verified, password, salt, datetime) VALUES(?, ?, ?, ?, ?, ?)';
                    console.log(username, email, 1, encryptedPassword, salt, date);
                    
                    connection.query(insertQuery, [username, email, 1, encryptedPassword, salt, date], (error: Error, result: any) => {
                        if(error) {
                            console.log('error during the registration!', error);
                            res.status(500).json({ error: `error during the registration!` });
                            return;
                        } else {
                            console.log('user was registered successfully!');
                            res.status(200).json({ response: 'user was registered successfully!'});;
                            return;
                        }
                    })
                };
            };    
        });
    }

    storeWithEncrypted();
});

//------------------------------------Create table----------------------------
app.post('/kasko/table', (req: Request, res: Response) => {

    const fileName = req.body.finalName;

    console.log('this is the name ', fileName)

    const createQuery = `CREATE TABLE ${fileName} LIKE 202310r2_kasko;`;

    connection2.query(createQuery, (error:Error, result) => {
        if (error) {
            res.status(500).json({ error: `Table already exists!!` });
            console.log(error);
            return;
        } else {
            console.log("Table created successfully!");
            res.status(200).json(false);({response:"Table created successfully!"});
        }
    });
});
//------------------------------------Create table----------------------------

//------------------------------------Load table----------------------------
app.post('/kasko/load', (req: Request, res: Response) => {

    const tableName = req.body.tableParams[0];

    const finalNameRequest = req.body.tableParams[1];

    console.log('these are the names ', tableName, finalNameRequest);

    const createQuery = `LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/${finalNameRequest}'
    INTO TABLE ${tableName}
    COLUMNS TERMINATED BY ','
    OPTIONALLY ENCLOSED BY '"'
    ESCAPED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;`;

    connection2.query(createQuery, (error:Error, result) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error });
            return;
        } else {
            console.log("Table loaded successfully!");
            res.status(200).json(false);({response:"ITable loaded successfully!"});
        }
    });
});
//------------------------------------Load table----------------------------

//-----------------------------------Truncate monthly import----------------------------
app.post('/kasko/truncate', (req: Request, res: Response) => {

    const createQuery = `TRUNCATE TABLE monthly_import;`;

    connection2.query(createQuery, (error:Error, result) => {
        if (error) {
            res.status(500).json({ error: `Failed to truncate the table` });
            return;
        } else {
            console.log("Table truncated successfully!");
            res.status(200).json({response:"Table truncated successfully!"});
        };
    });
});
//-----------------------------------Truncate monthly import----------------------------

//-----------------------------------Fill the monthly import----------------------------
app.post('/kasko/fill', (req:Request, res:Response) => {

    console.log(req.body.tableName);
    const fillQuery = `INSERT INTO monthly_import SELECT * FROM ${req.body.tableName};`;

    connection2.query(fillQuery, (error:Error, result) => {
        if(error) {
            res.status(500).json({ error: `Failed to fill the table` });
            return;
        } else {
            console.log("Table filled successfully!");
            res.status(200).json({response:"Table filled successfully!"});
        };
    })
})
//-----------------------------------Fill the monthly import----------------------------

//-----------------------------------Copy monthly import to eurotax---------------------
app.post('/kasko/copy', (req:Request, res:Response) => {

    const copyQuery = `INSERT INTO sgasgr_eurotax.monthly_import SELECT * FROM sgasgr_kasko.monthly_import;`;

    connection2.query(copyQuery, (error:Error, result) => {
        if(error) {
            res.status(500).json({ error: `Failed to copy the table` });
            console.log(error);
            return;
        } else {
            console.log("Table copied successfully!");
            res.status(200).json({response:"Table copied successfully!"});
        };
    })
})
//-----------------------------------Copy monthly import to eurotax---------------------

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

