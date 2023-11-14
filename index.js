import express, { json, urlencoded } from "express";
import { pool } from "./database/db_connector.js";

import songs from "./routes/songs.mjs";
import artists from "./routes/artists.mjs";
import releases from "./routes/releases.mjs";
// import releaseTypes from "./routes/releaseTypes.mjs";
// import users from "./routes/users.mjs";
// import playlists from "./routes/playlists.mjs";
import genres from "./routes/genres.mjs";
// import songArtists from "./routes/songArtists.mjs";
// import playlistSongs from "./routes/playlistSongs.mjs";

const app = express();
const port = 2626;

app.use(json());

import cors from "cors";
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
app.post("/api/songs", songs.createSong);
app.put("/api/songs", songs.updateSong);
app.delete("/api/songs", songs.deleteSong)

/* Releases */
// app.get("/api/relesases", releases.getReleases);
app.post("/api/relesases", releases.createRelease);
// app.put("/api/relesases", releases.updateRelease);
// app.delete("/api/relesases", releases.deleteRelease);

/* Genres */
app.get("/api/genres", genres.getGenres);
app.get("/api/genres/:genreID", genres.genreByIdValidation, genres.getGenre);
app.post("/api/genres", genres.createGenreValidation, genres.createGenre);
app.put("/api/genres", genres.updateGenreValidation, genres.updateGenre);
app.delete("/api/genres/:genreID", genres.genreByIdValidation, genres.deleteGenre);

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`);
});

