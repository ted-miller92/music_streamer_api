import { pool } from "../database/db_connector.js";
import {query, param, body, validationResult, matchedData} from "express-validator";

// validation for getting Release(s)
const getReleasesValidation = [
    query("releaseID").optional().isNumeric(),
    query("artistID").optional().isNumeric(),
    query("releaseTypeID").optional().isNumeric()
]

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

const getReleases = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);

    var query = '';

    if (data.releaseID) {
        query = `SELECT * FROM Releases
            WHERE release_id = ${data.releaseID};`;
    } else if (data.artistID) {
        query = `SELECT * FROM Releases
            INNER JOIN Release_Types 
            ON Releases.release_type_id = Release_Types.release_type_id
            WHERE artist_id = ${data.artistID};`;
    } else if (data.releaseTypeID) {
        query = `SELECT * FROM Releases
            WHERE release_type_id = ${data.releaseTypeID};`;
    } else {
        query = `
            SELECT Releases.release_id, Releases.release_name, 
            Artists.artist_id, Artists.artist_name,
            Release_Types.release_type_id, Release_Types.release_type_name 
            FROM Releases
            INNER JOIN Artists ON Releases.artist_id = Artists.artist_id
            INNER JOIN Release_Types ON Releases.release_type_id = Release_Types.release_type_id
            ORDER BY Artists.artist_name ASC;
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
    } else{

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
}

export default {getReleases, getReleasesValidation,
    createRelease, createReleaseValidation, 
    updateRelease, updateReleaseValidation,
    deleteRelease, releaseByIdValidation}