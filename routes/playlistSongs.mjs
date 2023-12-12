/* playlistSongs.mjs

Citation Information
The basic layout of each function has been adapted from the starter application
code provided as part of OSU's CS 340 (Introduction to Databases), with the exception of the 
implementation of "express-validator". The code can be found at:
https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

import { pool } from "../database/db_connector.js";
import {
    query,
    param,
    body,
    validationResult,
    matchedData,
} from "express-validator";

// validation for getting Playlist_Song(s)
const getPlaylistSongsValidation = [
    query("playlistSongID").optional().isNumeric(),
    query("songID").optional().isNumeric(),
    query("playlistID").optional().isNumeric(),
];

// validation set for creating Playlist_Song record
const createPlaylistSongValidation = [
    body("songID").notEmpty().isNumeric(),
    body("playlistID").notEmpty().isNumeric(),
];

// validation for specificying single Playlist_Song by id
const playlistSongByIdValidation = [
    param("songPlaylistID").notEmpty().isNumeric().escape(),
];

// validation for updating Playlist_Song
const updatePlaylistSongValidation = [
    body("playlistSongID").notEmpty().isNumeric().escape(),
    body("songID").notEmpty().isNumeric().escape(),
    body("playlistID").notEmpty().isNumeric().escape(),
];

const getPlaylistSongs = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    var query = "";

    if (data.playlistSongID) {
        query = `SELECT * FROM Playlist_Songs
            WHERE playlist_song_id = ${data.playlistSongID};`;
    } else if (data.playlistID) {
        // this query gets all songs that are in a playlist
        query = `SELECT * FROM Playlist_Songs
            INNER JOIN Songs ON Playlist_Songs.song_id = Songs.song_id
            INNER JOIN Song_Artists ON Songs.song_id = Song_Artists.song_id
            INNER JOIN Artists ON Song_Artists.artist_id = Artists.artist_id 
            WHERE Playlist_Songs.playlist_id = ${data.playlistID}`;
    } else {
        query = `SELECT * FROM Playlist_Songs;`;
    }

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send(results);
        }
    });
};

const createPlaylistSong = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    const query = `INSERT INTO Playlist_Songs(playlist_id, song_id)
        VALUES(${data.playlistID}, ${data.songID});`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send(results);
        }
    });
};

const updatePlaylistSong = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    const query = `UPDATE Playlist_Songs
        SET playlist_id = ${data.playlistID},
        song_id = ${data.songID}
        WHERE playlist_song_id = ${data.playlistSongID}`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send(results);
        }
    });
};

// delete a song_artist record
const deletePlaylistSong = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    const query = `DELETE FROM Playlist_Songs
        WHERE playlist_song_id = ${data.playlistSongID};`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send(results);
        }
    });
};

export default {
    getPlaylistSongs,
    getPlaylistSongsValidation,
    createPlaylistSong,
    createPlaylistSongValidation,
    updatePlaylistSong,
    updatePlaylistSongValidation,
    deletePlaylistSong,
    playlistSongByIdValidation,
};
