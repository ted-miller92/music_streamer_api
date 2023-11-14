import { pool } from "../database/db_connector.js";
import {param, body, validationResult, matchedData} from "express-validator";

// validation set for creating User
const createUserValidation = [
    body("userName").notEmpty().escape(),
    body("userEmail").notEmpty().escape()
]

// validation for specificying single User by id
const userByIdValidation = [
    param("userID").notEmpty().escape()
]

// validation for updating user
const updateUserValidation = [
    body("userID").notEmpty().isNumeric().escape(),
    body("userName").notEmpty().escape(),
    body("userEmail").notEmpty().escape()
]

const getUser = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    const data = matchedData(req);
    const userID = data.userID;

    const query = `SELECT * FROM Users
            WHERE user_id = ${userID}`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const getUsers = (req, res) => {
    const query = `SELECT * FROM Users;`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const createUser = (req, res) => {
    // validation 
    const result = validationResult(req);
    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const userName = data.userName;
    const userEmail = data.userEmail;

    const query = `INSERT INTO Users(user_name, user_email)
                    VALUES("${userName}", "${userEmail}");`;

    // query the DB
    pool.query(query, function (err, results, fields) {
        if (err){
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
}

const updateUser = (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return
    }
    
    // build query from validated data
    const data = matchedData(req);
    const userID = data.userID
    const userName = data.userName;
    const userEmail = data.userEmail;

    const query = `UPDATE Users 
                    SET user_name = "${userName}",
                    user_email = "${userEmail}"
                    WHERE user_id = ${userID};`;

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

const deleteUser = (req, res) => {
    // validation 
    const result = validationResult(req);

    if (!result.isEmpty()){
        res.status(400).send(result.array());
        return;
    }
    // query building
    const data = matchedData(req);
    const userID = data.userID;

    const query = 
        `DELETE FROM Users
        WHERE user_id = ${userID};`
    
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

export default {getUser, getUsers, userByIdValidation,
        createUser, createUserValidation, 
        updateUser, updateUserValidation,
        deleteUser}