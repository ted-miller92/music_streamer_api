import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating genre
const createGenreValidation = [
    body("genreName").notEmpty().escape()
]

// validation for deleting Artist
const deleteGenreValidation = [
    param("genreID").notEmpty().escape()
]

const getGenres = (req, res) => {
    const query = `SELECT * FROM Genres;`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const createGenre = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        const data = matchedData(req);

        // query building
        const genreName = data.genreName;
    
        const query = `INSERT INTO Genres(genre_name)
                        VALUES("${genreName}");`;

        // query the DB
        pool.query(query, function (err, results, fields) {
            if (err){
                res.status(400).send({message: err.message});
            } else {
                res.status(200).send(results);
            }
        });
    }
}

const deleteGenre = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    } else {
        // query building
        const data = matchedData(req);
        const genreID = data.genreID;

        const query = 
            `DELETE FROM Genres
            WHERE genre_id = ${genreID};`
        
        pool.query(query, (err, results) => {
            if (err) {
                console.log(err.code);
                res.status(400).send({message: "Genre not deleted"});
            } else if (results.affectedRows === 0){
                res.status(400).send({message: "Genre with that id does not exist"});
            } else {
                res.status(200).send(results);
            }
        });
    }
}

export default {getGenres, 
        createGenre, createGenreValidation, 
        deleteGenre, deleteGenreValidation}