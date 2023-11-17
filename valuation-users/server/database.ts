import { Request, Response} from 'express';

const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');

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

app.use(cors());

app.use(bodyParser.json());

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

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});