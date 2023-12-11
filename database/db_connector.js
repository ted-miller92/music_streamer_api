/* db_connector.js
Database connection file.
*/

import "dotenv/config";

import { createPool } from "mysql";

/* Citation for the following code
Date: Nov 6, 2023
Copied from starter application code from
OSU's CS 340 exploration
*/

var _pool = createPool({
    connectionLimit: 100,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    multipleStatements: true,
});

export { _pool as pool };
