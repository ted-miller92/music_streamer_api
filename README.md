# Music Streamer API

This is the server code for a music streamer application. It emulates a back end for administration purposes, where a user can perform CRUD operations on an associated database. 

## General Citations

The structure of the route handlers was adapted from a project and starter code for Oregon State University's CS 290 Web Development class. That code originally used MongoDB as a database, but this has been changed to use MariaDB and MySQL as a database. The basic structure of using a `db_connector.js` file has been adopted from code from an activity in OSU's CS 340, Introduction to Databases. 

## Setting up the server

Run the server by entering the command `npm start`. When this is deployed on the flip server, I have changed the start command to the following:

```
...
"scripts": {
    "start": "forever start index.js",
    "stop": "forever stop index.js",
    "test": "npm test"
  },
  ...
```

This utilizes the npm `forever` package to leave the server running in the background. 

A local instance of a MySQL database should also be running. See the section [Database Set up](#database-set-up) for notes on this. 

This API uses the `dotenv` package to manage potentially sensitive credential information. Create a file called `.env` in the root directory of this project with the following:

```
PORT=[Port number]
HOST="[host_name]"
DB_USER="[insert username here]"
DB_PASS="[insert password here]"
DATABASE="[database_name]"
```

In the `/database/db-connecter.js` file, the database user name and password are retrieved from the `.env` file. 

## How to send requests

For any request body, use x-www-form-urlencoded. Request parameters and body attributes should follow camelCase syntax for variable names. For example, a Post request with a body to create a new artist should look like this:

```
body : {
    artistName: `${artistName}`,
    artistDescription: `${artistDescription}`
}
```

### GET requests

To retrieve data, most of the entities follow the pattern

```
GET http://{API_ENDPOINT}/api/artists
```

### POST requests

Include a body with all parameters filled out. 

```
POST
http://{API_ENDPOINT}/api/artists
body: {
    "artistName": artistName,
    "artistDescription" : artistDescription
}

```

### DELETE requests

No body is needed when making a DELETE request, simply include it as a parameter, trailing the end of the API endpoint. For example the full URL to delete a Genre with the genre_id of 8 would be:

```
DELETE http://{API_ENDPOINT}/api/genres/8
```

## Validation

This API uses the package `express-validator` to validate and sanitize incoming requests. The set of validation rules associated with each route are located in the individual route files. The `index.js` file imports both the route handlers and the `express-validator` objects and passes them as arguments to `app.get`, `app.post`, `app.put`, and `app.delete` routes. 

## Database Set up

Make sure there is a user with priveleges for SELECT, INSERT, UPDATE, DELETE operations on the correct database schema, and that the login information for this user is reflected in the `.env` file. 

Specifically for setting up on OSU Flip servers, make sure the `database/db_connector.js` file reflects the following, or that the .env file contains the correct environment variables. The `.env` approach is recommended so that the API can be easily run in different environments:

```
var _pool = createPool({
    connectionLimit: 100,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_[username]",
    password: "[password for mysql user]",
    database: "cs340_[username]"
});
```