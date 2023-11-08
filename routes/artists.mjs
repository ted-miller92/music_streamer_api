import { pool } from "../database/db_connector.js";
import {body, validationResult, matchedData} from "express-validator";

const createArtistValidator = [
    body("artistName").notEmpty().escape(),
    body("artistDescription").escape()
]

const getArtists = (req, res) => {
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
}

const createArtist = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        const data = matchedData(req);
    
        console.log(data);

        // query building
        const artistName = data.artistName;
        const artistDescription = data.artistDescription;
        
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
    }
    
}

const updateArtist =  (req, res) => {
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
}

const deleteArtist = (req, res) => {
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
}

export default {getArtists, createArtistValidator, createArtist, updateArtist, deleteArtist};