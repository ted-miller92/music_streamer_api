# Music Streamer API

## Setting up the server

Run the server by entering the command `npm start`.

A local instance of a MySQL database should also be running. See the section [Database Set up](#database-set-up) for notes on this. 

This API uses the `dotenv` package to manage potentially sensitive credential information. Create a file called `.env` in the root directory of this project with the following:

```
DB_USER = "[insert username here]"
DB_PASS = "[insert password here]"
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

### DELETE requests

No body is needed when making a DELETE request, simply include it as a parameter, trailing the end of the API endpoint. For example the full URL to delete a Genre with the genre_id of 8 would be:

`${API_ENDPOINT}/api/genres/8`


## Database Set up

Make sure there is a user with priveleges for SELECT, INSERT, UPDATE, DELETE operations on the correct database schema, and that the login information for this user is reflected in the `.env` file. 