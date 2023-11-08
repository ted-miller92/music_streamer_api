import express, { json, urlencoded } from "express";
import { pool } from "./database/db_connector.js";

import songs from "./routes/songs.mjs";
import artists from "./routes/artists.mjs";
import releases from "./routes/releases.mjs";
// import releaseTypes from "./routes/releaseTypes.mjs";
// import users from "./routes/users.mjs";
// import playlists from "./routes/playlists.mjs";
// import genres from "./routes/playlists.mjs";
// import songArtists from "./routes/songArtists.mjs";
// import playlistSongs from "./routes/playlistSongs.mjs";

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

/* Artists */
app.get("/api/artists", artists.getArtistsValidation, artists.getArtists);
app.post("/api/artists", artists.createArtistValidation, artists.createArtist);
app.put("/api/artists", artists.updateArtistValidation, artists.updateArtist);
app.delete("/api/artists", artists.deleteArtistValidation, artists.deleteArtist);

/* Songs */
app.get("/api/songs", songs.getSongs);
app.post("/api/songs", songs.createSong);
app.put("/api/songs", songs.updateSong);
app.delete("/api/songs", songs.deleteSong)

/* Releases */
// app.get("/api/relesases", releases.getReleases);
app.post("/api/relesases", releases.createRelease);
// app.put("/api/relesases", releases.updateRelease);
// app.delete("/api/relesases", releases.deleteRelease);

/* Playlists */

// Get all playlists by userID

// Create new playlist
app.post("", (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Update a playlist

// Delete a playlist

/*
Users
*/

// Get all users

// Get user by userName

// Get user by userID

// Create a new user
app.post("", (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Update a user

// Delete a user

/*
Release Types
*/

// Get all release types

// Get release type by name

// Create a release type
app.post("", (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Update release type

// Delete a release type

/* 
Genres
*/

// Get all genres

// Get genre by genreID

// Get genre by genreName

// Create a genre
app.post("", (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
});

// Update a genre

// Delete a genre

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`);
});

