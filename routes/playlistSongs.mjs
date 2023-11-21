import { pool } from "../database/db_connector.js";
import {query, param, body, validationResult, matchedData} from "express-validator";

// validation for getting Playlist_Song(s)
const getPlaylistSongsValidation = [
    query("playlistSongID").optional().isNumeric(),
    query("songID").optional().isNumeric(),
    query("playlistID").optional().isNumeric()
];

// validation set for creating Playlist_Song record
const createPlaylistSongValidation = [
    body("songID").notEmpty().isNumeric(),
    body("artistID").notEmpty().isNumeric()
]

// validation for specificying single Playlist_Song by id
const playlistSongByIdValidation = [
    param("songArtistID").notEmpty().isNumeric().escape()
]

// validation for updating Playlist_Song
const updatePlaylistSongValidation = [
    body("playlistSongID").notEmpty().isNumeric().escape(),
    body("songID").notEmpty().isNumeric().escape(),
    body("playlistID").notEmpty().isNumeric().escape()
]


const getPlaylistSongs = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }

    const data = matchedData(req);
    var query = '';

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
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

// create a new song_artist entry
// const createSongArtist = (req, res) => {
//     const result = validationResult(req);

//     if (!result.isEmpty()){
//         res.status(400).send(result.array());
//         return;
//     }

//     const data = matchedData(req);

//     const query = `INSERT INTO Song_Artists(song_id, artist_id)
//         VALUES(${data.song_id}, ${data.artistID});`;

//     // query the DB
//     pool.query(query, function (err, results, fields) {
//         if (err){
//             res.status(400).send({message: err.message});
//         } else {
//             res.status(200).send(results);
//         }
//     });
// }

// // update song_artist entry
// const updateSongArtist = (req, res) => {
//     const result = validationResult(req);

//     if (!result.isEmpty()){
//         res.status(400).send(result.array());
//         return;
//     }

//     const data = matchedData(req);

//     const query = `UPDATE Song_Artists
//         SET song_id = ${data.songID},
//         artist_id = ${data.artistID}
//         WHERE song_artist_id = ${data.songArtistID}`;
    
//     // query the DB
//     pool.query(query, function (err, results, fields) {
//         if (err){
//             res.status(400).send({message: err.message});
//         } else {
//             res.status(200).send(results);
//         }
//     });
// }

// // delete a song_artist record
// const deleteSongArtist = (req, res) => {
//     const result = validationResult(req);

//     if (!result.isEmpty()){
//         res.status(400).send(result.array());
//         return;
//     }

//     const data = matchedData(req);

//     const query = `DELETE FROM Song_Artists
//         WHERE song_id = ${data.songArtistID};`;

//     // query the DB
//     pool.query(query, function (err, results, fields) {
//         if (err){
//             res.status(400).send({message: err.message});
//         } else {
//             res.status(200).send(results);
//         }
//     });
// }

export default {getPlaylistSongs, getPlaylistSongsValidation}