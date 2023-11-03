import { Request, Response} from 'express';


const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();

const port = 3000;

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

app.post('/server/valuations', (req: Request, res: Response) => {
    const valuationQuery = "SELECT purc.id AS id, NAME AS company, num AS total, remaining , DATETIME AS started, expiration FROM valuationgroups val INNER JOIN valuationpurchases purc ON val.id = purc.gid ORDER BY expiration ASC;"
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


app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});