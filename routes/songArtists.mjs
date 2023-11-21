import { pool } from "../database/db_connector.js";
import {query, param, body, validationResult, matchedData} from "express-validator";

// validation for getting Song(s)
const getSongArtistsValidation = [
    query("songArtistsID").optional().isNumeric(),
    query("songID").optional().isNumeric(),
    query("artistID").optional().isNumeric(),
];

// validation set for creating SongArtist record
const createSongArtistValidation = [
    body("songID").notEmpty().isNumeric(),
    body("artistID").notEmpty().isNumeric()
]

// validation for specificying single Song_Artist by id
const songArtistByIdValidation = [
    param("songArtistID").notEmpty().isNumeric().escape()
]

// validation for updating Song
const updateSongArtistValidation = [
    body("songArtistID").notEmpty().isNumeric().escape(),
    body("songID").notEmpty().isNumeric().escape(),
    body("artistID").notEmpty().isNumeric().escape()
]

// Get all songs by an artist
const getSongsArtists = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }

    const data = matchedData(req);
    var query = '';
    console.log(data);

    if (data.songID) {
        query = `SELECT * FROM Song_Artists
            WHERE song_id = ${data.songID};`;
    } else if (data.artistID) {
        query = `SELECT Songs.song_id, Songs.song_name, Songs.stream_count,
            Artists.artist_id, Artists.artist_name FROM Songs
            INNER JOIN Song_Artists ON Song_Artists.song_id = Songs.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id
            WHERE Song_Artists.artist_id = ${data.artistID};`;
    } else {
        query = `SELECT * FROM Song_Artists;`;
    }

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// create a new song_artist entry
const createSongArtist = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }

    const data = matchedData(req);

    const query = `INSERT INTO Song_Artists(song_id, artist_id)
        VALUES(${data.song_id}, ${data.artistID});`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// update song_artist entry
const updateSongArtist = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }

    const data = matchedData(req);

    const query = `UPDATE Song_Artists
        SET song_id = ${data.songID},
        artist_id = ${data.artistID}
        WHERE song_artist_id = ${data.songArtistID}`;
    
    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// delete a song_artist record
const deleteSongArtist = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }

    const data = matchedData(req);

    const query = `DELETE FROM Song_Artists
        WHERE song_id = ${data.songArtistID};`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

export default {getSongsArtists, getSongArtistsValidation,
    createSongArtist, createSongArtistValidation,
    updateSongArtist, updateSongArtistValidation,
    deleteSongArtist, songArtistByIdValidation}