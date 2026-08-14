/* ArtConnect — API 404s and the central error handler.
   Both are mounted after every route in server.js, so anything that falls
   through the routers or throws inside one ends up here rather than in
   Express's default HTML error page. */

const multer = require("multer");
const upload = require("./upload");

const MAX_MB = Math.round(upload.MAX_BYTES / (1024 * 1024));

/* Messages for the upload problems multer raises itself, rather than through
   the fileFilter. The size limit is the one a real submitter will hit. */
const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: "Image must be under " + MAX_MB + "MB.",
  LIMIT_FILE_COUNT: "Attach a single image.",
  LIMIT_UNEXPECTED_FILE: 'Attach the image under the field name "image".'
};

/* Anything under /api that no route claimed. Mounted on /api only, so ordinary
   page and image requests still fall through to express.static. */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "No API route for " + req.method + " " + req.originalUrl + "."
  });
}

function errorHandler(err, req, res, next) {
  /* multer rejects an oversized file by throwing, which happens before
     validateSubmission runs. Reporting it under errors.image gives the Submit
     page exactly the same shape as a field rejected by the fileFilter, so the
     form has one way to display image problems instead of two. */
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      errors: { image: MULTER_MESSAGES[err.code] || "That image could not be uploaded." }
    });
    return;
  }

  /* genuinely unexpected: log the detail for whoever is running the server,
     but do not send a stack trace to the browser */
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server."
  });
}

module.exports = { notFoundHandler, errorHandler };
