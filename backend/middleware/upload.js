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

/* The picture formats a submission may use. SVG is deliberately absent: it is
   XML that can carry a <script> tag, and anything in this folder is served
   from the site's own origin, so opening an uploaded SVG directly would run
   its script as though the page had written it. The other formats here cannot
   execute regardless of what the file actually contains. */
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

/* Turn away anything that is not an image. Rejecting with cb(null, false)
   rather than an error leaves req.file undefined, which validateSubmission
   reports as a normal per-field error under the image input instead of a
   whole-form failure. The reason is stashed on req so the message can say
   what actually went wrong.

   The extension is the real test, because express.static picks the response's
   Content-Type from it, and that is what decides how a browser treats the
   file. The declared mimetype is only a hint: it comes from the client, and
   some clients send application/octet-stream for formats their own lookup
   table does not recognise (curl does exactly this for .webp and .avif). So a
   generic type is tolerated, while a type that positively claims to be
   something else is not. */
function fileFilter(req, file, cb) {
  const ext = path.extname(String(file.originalname || "")).toLowerCase();
  const typeIsPlausible =
    /^image\//.test(file.mimetype) || file.mimetype === "application/octet-stream";

  if (ALLOWED_EXTENSIONS.indexOf(ext) !== -1 && typeIsPlausible) {
    cb(null, true);
    return;
  }

  req.fileRejected = "That file is not an image. Upload a JPG, PNG, WebP, GIF, or AVIF.";
  cb(null, false);
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_BYTES, files: 1 }
});

module.exports = upload;
module.exports.MAX_BYTES = MAX_BYTES;
module.exports.ALLOWED_EXTENSIONS = ALLOWED_EXTENSIONS;
module.exports.sanitizeFilename = sanitizeFilename;
