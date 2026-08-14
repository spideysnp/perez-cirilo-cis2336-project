/* ArtConnect — image upload handling.
   Wraps multer so the Submit route can accept one image file per submission
   and write it into backend/uploads, where server.js serves it back at
   /uploads/<filename>. */

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; /* 5MB */
const MAX_NAME_LENGTH = 80;

/* the folder is tracked in git via .gitkeep, but recreate it if it went missing
   so a submission fails validation rather than crashing the server */
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* Reduce an uploaded filename to something safe to put on disk and into a URL.
   path.basename strips any directory part (a name like "../../server.js"
   becomes "server.js"), and everything outside [A-Za-z0-9._-] is replaced, so
   the stored name can never contain quotes or slashes that would break out of
   the background:url('...') the gallery card builds around it. */
function sanitizeFilename(originalName) {
  const base = path.basename(String(originalName || ""));
  const ext = path.extname(base).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const stem = path.basename(base, path.extname(base))
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, MAX_NAME_LENGTH);
  return (stem || "image") + (ext || "");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  /* Date.now() keeps two uploads of the same filename from overwriting each
     other, and guarantees the name starts with a digit rather than a dot
     (express.static will not serve dotfiles) */
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + sanitizeFilename(file.originalname));
  }
});

/* Turn away anything that is not an image. Rejecting with cb(null, false)
   rather than an error leaves req.file undefined, which validateSubmission
   reports as a normal per-field error under the image input instead of a
   whole-form failure. The reason is stashed on req so the message can say
   what actually went wrong. */
function fileFilter(req, file, cb) {
  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
    return;
  }
  req.fileRejected = "That file is not an image. Upload a JPG, PNG, WebP, or GIF.";
  cb(null, false);
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_BYTES, files: 1 }
});

module.exports = upload;
module.exports.MAX_BYTES = MAX_BYTES;
module.exports.sanitizeFilename = sanitizeFilename;
