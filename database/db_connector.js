import "dotenv/config";

import { createPool } from "mysql";

var _pool = createPool({
    connectionLimit: 100,
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
    multipleStatements: true
});

export { _pool as pool };