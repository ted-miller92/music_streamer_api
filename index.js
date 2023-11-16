import express, { json, urlencoded } from "express";
import { pool } from "./database/db_connector.js";
import cors from "cors";

import songs from "./routes/songs.mjs";
import artists from "./routes/artists.mjs";
import releases from "./routes/releases.mjs";
import releaseTypes from "./routes/releaseTypes.mjs";
import users from "./routes/users.mjs";
import playlists from "./routes/playlists.mjs";
import genres from "./routes/genres.mjs";
// import songArtists from "./routes/songArtists.mjs";
// import playlistSongs from "./routes/playlistSongs.mjs";

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(cors());

app.use(
    urlencoded({
        extended: true
    })
);

app.get("/", (req, res) => {
    res.json({message: "ok"});
});

/* Artists */
app.get("/api/artists", artists.getArtistsValidation, artists.getArtists);
app.post("/api/artists", artists.createArtistValidation, artists.createArtist);
app.put("/api/artists", artists.updateArtistValidation, artists.updateArtist);
app.delete("/api/artists", artists.deleteArtistValidation, artists.deleteArtist);

/* Songs */
app.get("/api/songs", songs.getSongs);
app.post("/api/songs", songs.createSongValidation, songs.createSong);
app.put("/api/songs", songs.updateSongValidation, songs.updateSong);
app.delete("/api/songs", songs.songByIdValidation, songs.deleteSong);

/* Releases */
app.get("/api/relesases", releases.getReleases);
app.post("/api/relesases/", releases.createReleaseValidation, releases.createRelease);
app.put("/api/relesases", releases.updateReleaseValidation, releases.updateRelease);
app.delete("/api/relesases", releases.releaseByIdValidation, releases.deleteRelease);

/* Release Types */
app.get("/api/releaseTypes", releaseTypes.getReleaseTypes);
app.get("/api/releaseTypes/:releaseTypeID", releaseTypes.releaseTypeByIdValidation, releaseTypes.getReleaseType);
app.post("/api/releaseTypes", releaseTypes.createReleaseTypeValidation, releaseTypes.createReleaseType);
app.put("/api/releaseTypes", releaseTypes.updateReleaseTypeValidation, releaseTypes.updateReleaseType);
app.delete("/api/releaseTypes/:releaseTypeID", releaseTypes.releaseTypeByIdValidation, releaseTypes.deleteReleaseType);

/* Playlists */
app.get("/api/playlists", playlists.getPlaylists);
app.post("/api/playlists", playlists.createPlaylistValidation, playlists.createPlaylist);
app.put("/api/playlists", playlists.updatePlaylistValidation, playlists.updatePlaylist);
app.delete("/api/playlists/:playlistID", playlists.playlistByIdValidation, playlists.deletePlaylist);

/* Genres */
app.get("/api/genres", genres.getGenres);
app.get("/api/genres/:genreID", genres.genreByIdValidation, genres.getGenre);
app.post("/api/genres", genres.createGenreValidation, genres.createGenre);
app.put("/api/genres", genres.updateGenreValidation, genres.updateGenre);
app.delete("/api/genres/:genreID", genres.genreByIdValidation, genres.deleteGenre);

/* Users */
app.get("/api/users", users.getUsers);
app.get("/api/users/:userID", users.userByIdValidation, users.getUser);
app.post("/api/users", users.createUserValidation, users.createUser);
app.put("/api/users", users.updateUserValidation, users.updateUser);
app.delete("/api/users/:userID", users.userByIdValidation, users.deleteUser);

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`);
});

