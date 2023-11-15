import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating Playlist
const createPlaylistValidation = [
    body("playlistName").notEmpty().trim().matches(/^[A-Za-z0-9'"]/),
    body("userID").notEmpty().escape(),
    body("isPrivate").notEmpty().isNumeric().escape()
]

// validation for specificying single Playlist by id
const playlistByIdValidation = [
    param("playlistID").notEmpty().isNumeric().escape()
]

// validation for updating Playlist
const updatePlaylistValidation = [
    body("playlistID").notEmpty().isNumeric().escape(),
    body("playlistName").notEmpty().trim().matches(/^[A-Za-z0-9'"]/),
    body("userID").notEmpty().escape(),
    body("isPrivate").notEmpty().isNumeric().escape()
]

const getPlaylist = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    const playlistID = data.playlistID;

    const query = `SELECT * FROM Playlists
            WHERE playlist_id = ${playlistID}`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const getPlaylists = (req, res) => {
    var query = "";
    // check for query string
    if (req.query.userID) {
        query = `SELECT * FROM Playlists 
            WHERE user_id = ${req.query.userID}`;
    } else if (req.query.playlistID) {
        query = `SELECT * FROM Playlists 
            WHERE playlist_id = ${req.query.playlistID}`;
    } else {
        query = `SELECT * FROM Playlists;`;
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

// const getPlaylistsByUserID = (req, res) => {
//     const result = validationResult(req);

//     if (!result.isEmpty()){
//         res.status(400).send(result.array());
//         return;
//     }
//     const data = matchedData(req);
//     const userID = data.userID;
    
//     const query = `SELECT * FROM Playlists
//                     WHERE user_id = ${userID};`;

//     // query the DB
//     pool.query(query, function (err, results, fields) {
//         if (err){
//             res.status(400).send({message: err.message});
//         } else {
//             res.status(200).send(results);
//         }
//     });
// }

const createPlaylist = (req, res) => {
    // validation 
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const playlistName = data.playlistName;
    const userID = data.userID;
    const isPrivate = data.isPrivate;

    const query = `INSERT INTO Playlists(playlist_name, user_id, private)
                    VALUES("${playlistName}", "${userID}", ${isPrivate});`;
    console.log(query);
    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const updatePlaylist = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const playlistID = data.playlistID;
    const playlistName = data.playlistName;
    const userID = data.userID;
    const isPrivate = data.isPrivate;

    const query = `UPDATE Playlists 
                    SET playlist_name = "${playlistName}",
                    user_id = "${userID}",
                    private = ${isPrivate}
                    WHERE playlist_id = ${playlistID};`;

    // execute query
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
            res.status(400).send(err.code);
        } else if (results.affectedRows === 0) {
            console.log(err)
            res.status(400).send({message: "User with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

const deletePlaylist = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const playlistID = data.playlistID;

    const query = 
        `DELETE FROM Playlists
        WHERE playlist_id = ${playlistID};`
    
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message: "User not deleted"});
        } else if (results.affectedRows === 0){
            res.status(400).send({message: "User with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

export default {getPlaylist, getPlaylists,
    createPlaylist, createPlaylistValidation, 
    updatePlaylist, updatePlaylistValidation,
    deletePlaylist, playlistByIdValidation}