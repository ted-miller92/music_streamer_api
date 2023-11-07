import express, { json, urlencoded } from "express";
import { pool } from "./database/db_connector.js";

const app = express();
const port = 2626;

app.use(json());

app.use(
    urlencoded({
        extended: true
    })
);

app.get("/", (req, res) => {
    res.json({message: "ok"});
});

/*
Artists
*/

// Get artists
app.get("/api/artists", (req, res) => {
    // initialize query var
    let query = null;
    
    // check for query parameters
    if (req.query.artistID){
        const artistID = req.query.artistID;
        query = `SELECT * FROM Artists WHERE artist_id = ${artistID}`;
    } else if (req.query.artistName) {
        const artistName = req.query.artistName;
        query = `SELECT * FROM Artists WHERE artist_name = "${artistName}"`;
    } else {
        query = "SELECT * FROM Artists;"
    }

    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Create a new artist
app.post("/api/artists", (req, res) => {
    // query building
    const artistName = req.body.artistName;
    const artistDescription = req.body.artistDescription;
    const query = 
        `INSERT INTO Artists(artist_name, artist_description)
        VALUES("${artistName}", "${artistDescription}")`;
    
    pool.query(query, (err, results, fields) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message : "Record not created"});
        } else {
            res.status(201).send(results);
        }
    });
});

// Update an artist
app.put("/api/artists", (req, res) => {
    // query building
    const artistID = req.body.artistID;
    const artistName = req.body.artistName;
    const artistDescription = req.body.artistDescription;
    
    const query = 
        `UPDATE Artists
        SET artist_name = "${artistName}",
        artist_description = "${artistDescription}"
        WHERE artist_id = ${artistID};`

    pool.query(query, (err, results, fields) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message : "Record not updated"});
        } else {
            res.status(200).send(results);
        }
    });
    
});

// Delete an artist
app.delete("/api/artists", (req, res) => {
    // query building
    const artistID = req.body.artistID;

    const query = 
        `DELETE FROM Artists
        WHERE artist_id = ${artistID};`

    pool.query(query, (err, results, fields) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message: "Record not deleted"});
        } else {
            res.status(200).send(results);
        }
    });
});

/* 
Songs
*/

// Get songs
app.get("/api/songs", (req, res) => {
    if (Object.keys(req.query).length == 0) {
        res.status(400).send({
            message: "Bad request. Send params of artistID OR releaseID"
        });
        return;
    }

    // query building
    let query;

    if (req.query.artistID){
        // artistID is specified
        const artistID = req.query.artistID;
        query = `SELECT * FROM Songs
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            WHERE Song_Artists.artist_id = ${artistID};`;
    } else if (req.query.releaseID){
        // releaseID is specified
        const releaseID = req.query.releaseID;
        query = `SELECT * FROM Songs
            WHERE release_id = ${releaseID};`;
    } else if (req.query.playlistID) {
        // playlistID is specified
        const playlistID = req.query.playlistID;
        query = `SELECT song_id FROM Playlist_Songs
            WHERE Playlist_Songs.playlist_id = ${playlistID};`;
    } else {
        // no query string
        // lets avoid sending every song in the db
        res.status(400).send({
            message: "Bad request. Send params of artistID OR releaseID"
        });
        return;
    }

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Create a new song


// Update a song

// Delete a song

/*
Releases
*/

// Get all releases

// Get releases by artistID

// Create a new release

// Update a release

// Delete a release

/*
Playlists
*/

// Get all playlists by userID

// Create new playlist

// Update a playlist

// Delete a playlist

/*
Users
*/

// Get all users

// Get user by userName

// Get user by userID

// Create a new user

// Update a user

// Delete a user

/*
Release Types
*/

// Get all release types

// Get release type by name

// Create a release type

// Update release type

// Delete a release type

/* 
Genres
*/

// Get all genres

// Get genre by genreID

// Get genre by genreName

// Create a genre

// Update a genre

// Delete a genre

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`);
});

