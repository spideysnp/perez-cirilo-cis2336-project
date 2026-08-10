/* ArtConnect — Express server.
   Serves the static frontend and (from Phase 4 on) the JSON API that the
   Gallery, Events, and Submit pages read from. */
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

/* parse JSON request bodies (multipart bodies are handled by multer) */
app.use(express.json());

/* the site itself: frontend/index.html is served at / */
app.use(express.static(path.join(__dirname, "..", "frontend")));

/* images saved from artwork submissions, referenced as /uploads/<filename> */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, function () {
  console.log("ArtConnect running at http://localhost:" + PORT);
});
