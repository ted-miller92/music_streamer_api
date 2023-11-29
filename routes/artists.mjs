import { pool } from "../database/db_connector.js";
import {query, body, validationResult, matchedData} from "express-validator";

/* Validation Schema */

// validation for getting Artists
const getArtistsValidation = [
    query("artistID").optional().isNumeric(),
    query("artistName").optional()
]

// validation for creating Artists
const createArtistValidation = [
    body("artistName").notEmpty().escape(),
    body("artistDescription").escape()
]

// validation for updating Artist
const updateArtistValidation = [
    body("artistID").notEmpty().escape(),
    body("artistName").notEmpty().escape(),
    body("artistDescription").notEmpty().escape()
]

// validation for deleting Artist
const artistByIdValidation = [
    param("artistID").notEmpty().escape()
]

const getArtists = (req, res) => {
    // validation
    const result = validationResult(req)

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    console.log(data);
    // check for query parameters, build query
    let query = '';

    if (data.artistID){
        query = `SELECT * FROM Artists WHERE artist_id = ${data.artistID};`;
    } else if (data.artistName) {
        query = `SELECT * FROM Artists WHERE artist_name = "${data.artistName}";`;
    } else {
        query = `SELECT * FROM Artists;`;
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

const createArtist = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        const data = matchedData(req);

        // query building
        const artistName = data.artistName;
        const artistDescription = data.artistDescription;
        
        const query = 
            `INSERT INTO Artists(artist_name, artist_description)
            VALUES("${artistName}", "${artistDescription}");`;
        
        pool.query(query, (err, results, fields) => {
            if (err) {
                console.log(err.code);
                res.status(400).send({message : "Record not created"});
            } else {
                res.status(200).send(results);
            }
        });
    }
    
}

const updateArtist =  (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        // query building
        const data = matchedData(req);

        const artistID = data.artistID;
        const artistName = data.artistName;
        const artistDescription = data.artistDescription;

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
    }
}

const deleteArtist = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        // query building
        const data = matchedData(req);
        const artistID = data.artistID;

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
    }
}

export default {getArtistsValidation, getArtists, 
    createArtistValidation, createArtist, 
    updateArtistValidation, updateArtist, 
    artistByIdValidation, deleteArtist
};