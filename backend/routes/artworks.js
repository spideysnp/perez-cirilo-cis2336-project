/* ArtConnect — /api/artworks routes.
   The POST chain is order-dependent: multer parses the multipart body and
   writes the file first, then validateSubmission checks the parsed fields, and
   only then does the controller store anything. */

const express = require("express");
const upload = require("../middleware/upload");
const validateSubmission = require("../middleware/validateSubmission");
const controller = require("../controllers/artworksController");

const router = express.Router();

router.get("/", controller.listArtworks);
router.get("/:id", controller.getArtwork);

/* the field name here must match the FormData key the Submit page appends the
   file under, or multer sees no file at all */
router.post("/", upload.single("image"), validateSubmission, controller.createArtwork);

module.exports = router;
