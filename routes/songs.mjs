import { pool } from "../database/db_connector.js";

// Get songs
const getSongs = (req, res) => {
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
        // avoid sending every song in the db
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
}

// Create a new song
const createSong = (req, res) => {
    // query building
    const {songName, releaseID, genreID} = req.body;

    let query = `INSERT INTO 
        Songs(song_name, release_id, genre_id, stream_count)
        VALUES(${songName}, ${releaseID}, ${genreID}, 0);`;

    console.log(query);

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// Update song by id
const updateSong = (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// Delete song by id
const deleteSong = (req, res) => {
    // query building
    let query = ``;

    pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

export default {getSongs, createSong, updateSong, deleteSong};