/* ArtConnect — artwork request handlers.
   Reads and writes go through the helpers in data/artworks.js; nothing here
   touches the underlying array. */

const store = require("../data/artworks");

/* GET /api/artworks — the whole collection, or one category of it */
function listArtworks(req, res) {
  const artworks = store.getAllArtworks(req.query.category);
  res.json({ success: true, count: artworks.length, artworks: artworks });
}

/* GET /api/artworks/:id */
function getArtwork(req, res) {
  const artwork = store.getArtworkById(req.params.id);
  if (!artwork) {
    res.status(404).json({ success: false, message: "No artwork with that id." });
    return;
  }
  res.json({ success: true, artwork: artwork });
}

/* POST /api/artworks — a submission from the Submit page.
   Runs after upload.single("image") and validateSubmission, so the text fields
   are present and trimmed and req.file is guaranteed. */
function createArtwork(req, res) {
  const body = req.body;
  const submittedAt = new Date().toISOString();

  const artwork = store.addArtwork({
    title: body.title,
    artist: body.artistName,
    category: body.category,
    medium: body.medium,
    price: body.price || "Not for sale",
    description: body.description,
    /* already root-relative, and server.js serves this folder at /uploads */
    img: "/uploads/" + req.file.filename,
    /* seeded works sort by year, so a millisecond timestamp puts every
       submission ahead of them under "Recent" */
    sortkey: Date.now(),
    submittedAt: submittedAt,
    /* the seeded works carry a museum credit; saying that about someone's own
       photograph would be a false attribution */
    credit: "ARTIST SUBMISSION",
    source: "submission"
  });

  res.status(201).json({
    success: true,
    message: "Your work has been submitted.",
    artwork: artwork
  });
}

module.exports = { listArtworks, getArtwork, createArtwork };
