import { pool } from "../database/db_connector.js";
import {body, validationResult} from "express-validator";

const getReleases = null;

const createRelease = (body("releaseName").notEmpty().escape(), (req, res) => {
    // validation
    const result = validationResult(req);

    if (result.isEmpty()){
        // query building
        const data = matchedData(req);

        console.log(data);

        let query = `INSERT INTO 
            Releases(release_name, release_type_id, artist_id)
            VALUES("${data.releaseName}", 
                    ${data.releaseTypeID}, 
                    ${data.artistID});`;

        pool.query(query, (err, results, fields) => {
        if (err) {
            res.status(400).send({message: err.message});
        } else {
            res.status(200).send(results);
        }
    });
    }
    
    
})

const updateRelease = null;

const deleteRelease = null;

export default {getReleases, createRelease, updateRelease, deleteRelease};