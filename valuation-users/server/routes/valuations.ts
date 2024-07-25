import express from 'express';
const mysql = require('mysql2');
import { Request, Response} from 'express';

const valuationRouter = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'pass',
    database: "valuationusers",
});

valuationRouter.post('/server/valuations', (req: Request, res: Response) => {
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

export default valuationRouter;
