import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating genre
const createGenreValidation = [
    body("genreName").notEmpty().matches(/^[A-Za-z0-9'"]/)
]

// validation for specificying single genre by id
const genreByIdValidation = [
    param("genreID").notEmpty().escape()
]

// validation for updating genre
const updateGenreValidation = [
    body("genreName").notEmpty().matches(/^[A-Za-z0-9'"]/),
    body("genreID").notEmpty().escape()
]

const getGenre = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    const genreID = data.genreID;

    const query = `SELECT * FROM Genres
            WHERE genre_id = ${genreID};`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

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

const updateGenre = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const genreID = data.genreID;
    const genreName = data.genreName;

    const query = `UPDATE Genres 
                    SET genre_name = "${genreName}"
                    WHERE genre_id = ${genreID};`;

    // execute query
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
            res.status(400).send(err.code);
        } else if (results.affectedRows === 0) {
            console.log(err)
            res.status(400).send({message: "Genre with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
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

export default {getGenre, getGenres, 
        createGenre, createGenreValidation, 
        updateGenre, updateGenreValidation,
        deleteGenre, 
        genreByIdValidation}