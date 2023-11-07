import "dotenv/config";

import { createPool } from "mysql";

var _pool = createPool({
    connectionLimit: 100,
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "music_streamer"
});

export { _pool as pool };