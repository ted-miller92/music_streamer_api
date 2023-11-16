import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating Release
const createReleaseValidation = [
    body("releaseName").notEmpty().matches(/^[A-Za-z0-9'"]/),
    body("artistID").notEmpty().isNumeric(),
    body("releaseTypeID").notEmpty().isNumeric()
]

// validation for specificying single Release by id
const releaseByIdValidation = [
    param("releaseID").notEmpty().isNumeric().escape()
]

// validation for updating Release
const updateReleaseValidation = [
    body("releaseID").notEmpty().isNumeric().escape(),
    body("releaseName").notEmpty().matches(/^[A-Za-z0-9'"]/),
    body("artistID").notEmpty().isNumeric(),
    body("releaseTypeID").notEmpty().isNumeric()
]

const getRelease = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    const releaseID = data.releaseID;

    const query = `SELECT * FROM Releases
        WHERE release_id = ${releaseID};`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const getReleases = (req, res) => {
    var query = "";
    // check for query string
    if (req.query.artistID) {
        query = `SELECT * FROM Releases 
            WHERE artist_id = ${req.query.artistID};`;
    } else if (req.query.releaseTypeID) {
        query = `SELECT * FROM Releases 
            WHERE release_type_id = ${req.query.releaseTypeID};`;
    } else {
        query = `SELECT * FROM Releases;`;
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

const createRelease = (req, res) => {
    // validation 
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const releaseName = data.releaseName;
    const artistID = data.artistID;
    const releaseTypeID = data.releaseTypeID;

    const query = `INSERT INTO Releases(release_name, artist_id, release_type_id)
                    VALUES("${releaseName}", "${artistID}", ${releaseTypeID});`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const updateRelease = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const releaseID = data.releaseID;
    const releaseName = data.releaseName;
    const artistID = data.artistID;
    const releaseTypeID = data.releaseTypeID;

    const query = `UPDATE Releases 
                    SET releaseName = "${releaseName}",
                    artist_id = "${artistID}",
                    release_type_id = ${releaseTypeID}
                    WHERE release_id = ${releaseID};`;

    // execute query
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err)
            res.status(400).send(err.code);
        } else if (results.affectedRows === 0) {
            console.log(err)
            res.status(400).send({message: "Release with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

const deleteRelease = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const releaseID = data.releaseID;

    const query = 
        `DELETE FROM Releases
        WHERE release_id = ${releaseID};`
    
    pool.query(query, (err, results) => {
        if (err) {
            console.log(err.code);
            res.status(400).send({message: "Release not deleted"});
        } else if (results.affectedRows === 0){
            res.status(400).send({message: "Release with that id does not exist"});
        } else {
            res.status(200).send(results);
        }
    });
}

export default {getRelease, getReleases,
    createRelease, createReleaseValidation, 
    updateRelease, updateReleaseValidation,
    deleteRelease, releaseByIdValidation}