import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating Song
const createSongValidation = [
    body("songName").notEmpty().matches(/^[A-Za-z0-9'"]/),
    body("releaseID").notEmpty().isNumeric(),
    body("genreID").notEmpty().isNumeric()
]

// validation for specificying single Song by id
const songByIdValidation = [
    param("songID").notEmpty().isNumeric().escape()
]

// validation for updating Song
const updateSongValidation = [
    body("songID").notEmpty().isNumeric().escape(),
    body("songName").notEmpty().matches(/^[A-Za-z0-9'"]/),
    body("releaseID").notEmpty().isNumeric(),
    body("genreID").notEmpty().isNumeric(),
    body("streamCount").notEmpty().isNumeric()
]

const getSongs = (req, res) => {
    var query = "";
    // check for query string
    if (req.query.songID) {
        // get a single song by id
        query = `SELECT * FROM Songs
            WHERE song_id = ${req.query.songID};`;
    } else if (req.query.artistID) {
        // get all songs by one artist
        query = `SELECT * FROM Songs 
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            WHERE Song_Artists.artist_id = ${req.query.artistID};`;
    } else if (req.query.releaseID) {
        // get all songs from a single release 
        query = `SELECT * FROM Songs
            WHERE release_id = ${req.query.releaseID};`;
    } else if (req.query.genreID) {
        // get all songs of a certain genre
        query = `SELECT * FROM Songs
            WHERE genre_id = ${req.query.genreID};`;
    } else {
        query = `SELECT * FROM Songs;`;
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

const createSong = (req, res) => {
    // validation 
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const songName = data.songName;
    const releaseID = data.releaseID;
    const genreID = data.genreID;

    const query = `INSERT INTO Songs(song_name, release_id, genre_id, stream_count)
                    VALUES("${songName}", "${releaseID}", ${genreID}, 0);`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const updateSong = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const songID = data.songID;
    const songName = data.songName;
    const releaseID = data.releaseTypeID;
    const genreID = data.genreID;
    const streamCount = data.streamCount;

    const query = `UPDATE Songs 
                    SET song_name = "${songName}",
                    release_id = "${releaseID}",
                    genre_id = ${genreID},
                    stream_count = ${streamCount}
                    WHERE song_id = ${songID};`;

    // execute query
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
            res.status(400).send(err.code);
        } else if (results.affectedRows === 0) {
            console.log(err)
            res.status(400).send({message: "Song with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

const deleteSong = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const songID = data.songID;

    const query = 
        `DELETE FROM Songs
        WHERE song_id = ${songID};`
    
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message: "Song not deleted"});
        } else if (results.affectedRows === 0){
            res.status(400).send({message: "Song with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

export default {getSongs, songByIdValidation,
    createSong, createSongValidation, 
    updateSong, updateSongValidation,
    deleteSong}