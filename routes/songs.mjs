import { pool } from "../database/db_connector.js";
import {query, param, body, validationResult, matchedData} from "express-validator";

// validation for getting Song(s)
const getSongsValidation = [
    query("songID").optional().isNumeric(),
    query("artistID").optional().isNumeric(),
    query("releaseID").optional().isNumeric(),
    query("genreID").optional().isNumeric(),
    query("searchSong").optional()
];

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
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    var query = "";
    // check for query string
    if (data.songID) {
        // get a single song by id
        query = `SELECT * FROM Songs
            WHERE song_id = ${data.songID};`;
    } else if (data.searchSong) {
        // search query
        query = `SELECT * FROM Songs
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id
            INNER JOIN Releases ON Songs.release_id = Releases.release_id
            INNER JOIN Genres ON Songs.genre_id = Genres.genre_id
            WHERE Songs.song_name LIKE '%${data.searchSong}%';
        `;
    } else if (data.artistID) {
        // get all songs by one artist
        query = `SELECT * FROM Songs 
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id
            INNER JOIN Releases ON Songs.release_id = Releases.release_id
            INNER JOIN Genres ON Songs.genre_id = Genres.genre_id
            WHERE Song_Artists.artist_id = ${data.artistID};`;
    } else if (data.releaseID) {
        // get all songs from a single release 
        query = `SELECT * FROM Songs
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id
            INNER JOIN Releases ON Songs.release_id = Releases.release_id
            INNER JOIN Genres ON Songs.genre_id = Genres.genre_id
            WHERE Songs.release_id = ${data.releaseID};
        `;
    } else if (data.genreID) {
        // get all songs of a certain genre
        query = `SELECT * FROM Songs
            WHERE genre_id = ${data.genreID};`;
    } else {
        query = `SELECT * FROM Songs
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id
            INNER JOIN Releases ON Songs.release_id = Releases.release_id
            INNER JOIN Genres ON Songs.genre_id = Genres.genre_id;
        `;
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

    const query = `
            INSERT INTO Songs(song_name, release_id, genre_id, stream_count)
            VALUES("${songName}", ${releaseID}, ${genreID}, 0);    
    `;

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
    const releaseID = data.releaseID;
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

export default {getSongs, getSongsValidation,
    createSong, createSongValidation, 
    updateSong, updateSongValidation,
    deleteSong, songByIdValidation}