/* genres.mjs

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

// validation for get genre(s)
const getGenresValidation = [query("genreID").optional().isNumeric()];

// validation set for creating genre
const createGenreValidation = [
    body("genreName")
        .notEmpty()
        .matches(/^[A-Za-z0-9'"]/),
];

// validation for specificying single genre by id
const genreByIdValidation = [param("genreID").notEmpty().escape()];

// validation for updating genre
const updateGenreValidation = [
    body("genreName")
        .notEmpty()
        .matches(/^[A-Za-z0-9'"]/),
    body("genreID").notEmpty().escape(),
];

const getGenres = (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    var query = "";
    if (data.genreID) {
        query = `SELECT * FROM Genres
            WHERE genre_id = ${data.genreID};`;
    } else {
        query = `SELECT * FROM Genres;`;
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

const createGenre = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    const genreName = data.genreName;
    const query = `INSERT INTO Genres(genre_name)
                    VALUES("${genreName}");`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            res.status(200).send(results);
        }
    });
};

const updateGenre = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
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
            console.log(err);
            res.status(400).send(err.code);
        } else if (results.affectedRows === 0) {
            console.log(err);
            res.status(400).send({
                message: "Genre with that id does not exist",
            });
        } else {
            res.status(200).send(results);
        }
    });
};

const deleteGenre = (req, res) => {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send(result.array());
        return;
    }

    // query building
    const data = matchedData(req);
    const genreID = data.genreID;
    const query = `DELETE FROM Genres
        WHERE genre_id = ${genreID};`;

    // query the db
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({ message: "Genre not deleted" });
        } else if (results.affectedRows === 0) {
            res.status(400).send({
                message: "Genre with that id does not exist",
            });
        } else {
            res.status(200).send(results);
        }
    });
};

export default {
    getGenres,
    getGenresValidation,
    createGenre,
    createGenreValidation,
    updateGenre,
    updateGenreValidation,
    deleteGenre,
    genreByIdValidation,
};
