require("dotenv").config();

var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "music_streamer"
});

 module.exports.pool = pool;