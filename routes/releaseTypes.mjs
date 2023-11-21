import { pool } from "../database/db_connector.js";
import {query, param, body, validationResult, matchedData} from "express-validator";

// validation for getting ReleaseType(s)
const getReleaseTypesValidation = [
    query("releaseTypeID").optional().isNumeric()
]

// validation set for creating releaseType
const createReleaseTypeValidation = [
    body("releaseTypeName").notEmpty().matches(/^[A-Za-z0-9'"]/)
]

// validation for specificying single releaseType by id
const releaseTypeByIdValidation = [
    param("releaseTypeID").notEmpty().escape()
]

// validation for updating releaseType
const updateReleaseTypeValidation = [
    body("releaseTypeID").notEmpty().isNumeric().escape(),
    body("releaseTypeName").notEmpty().matches(/^[A-Za-z0-9'"]/)
]

const getReleaseTypes = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    var query = '';

    if (data.releaseTypeID) {
        query = `SELECT * FROM Release_Types
            WHERE release_type_id = ${data.releaseTypeID};`;
    } else {
        query = `SELECT * FROM Release_Types;`
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

const createReleaseType = (req, res) => {
    // validation 
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const releaseTypeName = data.releaseTypeName;
    

    const query = `INSERT INTO Release_Types(release_type_name)
                    VALUES("${releaseTypeName}");`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const updateReleaseType = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const releaseTypeID = data.releaseTypeID
    const releaseTypeName = data.releaseTypeName;

    const query = `UPDATE Release_Types 
                    SET release_type_name = "${releaseTypeName}" 
                    WHERE release_type_id = ${releaseTypeID};`;

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

const deleteReleaseType = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const releaseTypeID = data.releaseTypeID;

    const query = 
        `DELETE FROM Release_Types
        WHERE release_type_id = ${releaseTypeID};`
    
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

export default {getReleaseTypes, getReleaseTypesValidation,
        createReleaseType, createReleaseTypeValidation, 
        updateReleaseType, updateReleaseTypeValidation,
        deleteReleaseType, releaseTypeByIdValidation}