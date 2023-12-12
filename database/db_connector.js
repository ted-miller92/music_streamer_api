/* db_connector.js
Database connection file.

Citation for the following code
Date: Nov 6, 2023
Copied from starter application code from
OSU's CS 340 exploration:
https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step 5 - Adding New Data/database/db-connector.js
*/

import "dotenv/config";

import { createPool } from "mysql";

var _pool = createPool({
    connectionLimit: 100,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    multipleStatements: true,
});

export { _pool as pool };
