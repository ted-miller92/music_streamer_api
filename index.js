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
import songArtists from "./routes/songArtists.mjs";
import playlistSongs from "./routes/playlistSongs.mjs";

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
app.delete("/api/artists/:artistID", artists.deleteArtistValidation, artists.deleteArtist);

/* Songs */
app.get("/api/songs", songs.getSongsValidation, songs.getSongs);
app.post("/api/songs", songs.createSongValidation, songs.createSong);
app.put("/api/songs", songs.updateSongValidation, songs.updateSong);
app.delete("/api/songs/:songID", songs.songByIdValidation, songs.deleteSong);

/* Song Artists */
app.get("/api/songArtists", songArtists.getSongArtistsValidation, songArtists.getSongsArtists);
app.post("/api/songArtists", songArtists.createSongArtistValidation, songArtists.createSongArtistValidation);
app.put("/api/songArtists", songArtists.updateSongArtistValidation, songArtists.updateSongArtist);
app.delete("/api/songArtists", songArtists.songArtistByIdValidation, songArtists.deleteSongArtist);

/* Releases */
app.get("/api/releases", releases.getReleasesValidation, releases.getReleases);
app.post("/api/releases", releases.createReleaseValidation, releases.createRelease);
app.put("/api/releases", releases.updateReleaseValidation, releases.updateRelease);
app.delete("/api/releases/:releaseID", releases.releaseByIdValidation, releases.deleteRelease);

/* Release Types */
app.get("/api/releaseTypes", releaseTypes.getReleaseTypesValidation, releaseTypes.getReleaseTypes);
app.post("/api/releaseTypes", releaseTypes.createReleaseTypeValidation, releaseTypes.createReleaseType);
app.put("/api/releaseTypes", releaseTypes.updateReleaseTypeValidation, releaseTypes.updateReleaseType);
app.delete("/api/releaseTypes/:releaseTypeID", releaseTypes.releaseTypeByIdValidation, releaseTypes.deleteReleaseType);

/* Playlists */
app.get("/api/playlists", playlists.getPlaylistsValidation, playlists.getPlaylists);
app.post("/api/playlists", playlists.createPlaylistValidation, playlists.createPlaylist);
app.put("/api/playlists", playlists.updatePlaylistValidation, playlists.updatePlaylist);
app.delete("/api/playlists/:playlistID", playlists.playlistByIdValidation, playlists.deletePlaylist);

/* Playlist_Songs */
app.get("/api/playlistSongs", playlistSongs.getPlaylistSongsValidation, playlistSongs.getPlaylistSongs);
app.post("/api/playlistSongs", playlistSongs.createPlaylistSongValidation, playlistSongs.createPlaylistSong);
app.put("/api/playlistSongs", playlistSongs.updatePlaylistSongValidation, playlistSongs.updatePlaylistSong);
app.delete("/api/playlistSongs", playlistSongs.playlistSongByIdValidation, playlistSongs.deletePlaylistSong);

/* Genres */
app.get("/api/genres", genres.getGenresValidation, genres.getGenres);
app.post("/api/genres", genres.createGenreValidation, genres.createGenre);
app.put("/api/genres", genres.updateGenreValidation, genres.updateGenre);
app.delete("/api/genres/:genreID", genres.genreByIdValidation, genres.deleteGenre);

/* Users */
app.get("/api/users", users.getUsersValidation, users.getUsers);
app.post("/api/users", users.createUserValidation, users.createUser);
app.put("/api/users", users.updateUserValidation, users.updateUser);
app.delete("/api/users/:userID", users.userByIdValidation, users.deleteUser);

app.listen(port, () => {
    console.log(`API Listening at http://localhost:${port}`);
});

