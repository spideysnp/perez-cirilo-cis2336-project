/* ArtConnect — Express server.
   Serves the static frontend and (from Phase 4 on) the JSON API that the
   Gallery, Events, and Submit pages read from. */
const path = require("path");
const express = require("express");

const artworkRoutes = require("./routes/artworks");
const eventRoutes = require("./routes/events");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

/* parse JSON request bodies (multipart bodies are handled by multer) */
app.use(express.json());

/* the site itself: frontend/index.html is served at / */
app.use(express.static(path.join(__dirname, "..", "frontend")));

/* images saved from artwork submissions, referenced as /uploads/<filename> */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* the JSON API the Gallery, Events, and Submit pages read from */
app.use("/api/artworks", artworkRoutes);
app.use("/api/events", eventRoutes);

/* unmatched /api paths answer in JSON; everything else has already been
   handled by express.static above */
app.use("/api", notFoundHandler);

/* must come last, after every route, or Express will not treat it as the
   error handler */
app.use(errorHandler);

app.listen(PORT, function () {
  console.log("ArtConnect running at http://localhost:" + PORT);
});
