/* ArtConnect — server-side validation for artwork submissions.
   Runs after multer has parsed the multipart body, so req.body holds the text
   fields and req.file holds the uploaded image.

   The rules and messages below intentionally match frontend/js/submit.js field
   for field: the browser check is for fast feedback, this one is what actually
   guards the data, since anything can POST to the API directly. */

const fs = require("fs");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRICE_RE = /^\$?\d+(\.\d{1,2})?$/;

/* The four categories the gallery filter pills and the Submit page's <select>
   are built from. This check goes further than submit.js, which only requires
   the field to be non-empty: the browser can rely on the <select> to keep the
   value in range, but a request sent straight to the API has no such limit, and
   a category outside this list would store a work that renders in the gallery
   yet no filter pill can ever match. */
const CATEGORIES = ["Painting", "Sculpture", "Photography", "Print"];

/* multipart text fields always arrive as strings, but a field left out of the
   request entirely comes through as undefined */
function value(raw) {
  return typeof raw === "string" ? raw.trim() : "";
}

const rules = {
  artistName: function (v) {
    return v ? "" : "Artist name is required.";
  },
  email: function (v) {
    if (!v) return "Email is required.";
    return EMAIL_RE.test(v) ? "" : "Enter a valid email address.";
  },
  title: function (v) {
    return v ? "" : "Artwork title is required.";
  },
  category: function (v) {
    if (!v) return "Please select a category.";
    if (CATEGORIES.indexOf(v) === -1) {
      return "Category must be one of: " + CATEGORIES.join(", ") + ".";
    }
    return "";
  },
  price: function (v) {
    if (!v) return "";
    if (/^not for sale$/i.test(v)) return "";
    return PRICE_RE.test(v) ? "" : 'Enter a numeric amount (e.g. 450) or "Not for sale".';
  },
  description: function (v) {
    return v ? "" : "Please add a description.";
  }
};

function validateSubmission(req, res, next) {
  const errors = {};

  Object.keys(rules).forEach(function (field) {
    const cleaned = value(req.body[field]);
    const message = rules[field](cleaned);
    if (message) {
      errors[field] = message;
    } else {
      /* hand the controller trimmed values so records never store padding */
      req.body[field] = cleaned;
    }
  });

  /* medium is optional and unvalidated, but still worth trimming */
  req.body.medium = value(req.body.medium);

  /* no req.file means either nothing was attached or the fileFilter turned it
     away; fileRejected tells the two apart */
  if (!req.file) {
    errors.image = req.fileRejected || "Please attach an image of your work.";
  }

  if (Object.keys(errors).length) {
    /* multer has already written the image by the time the text fields are
       checked, so a rejected submission would otherwise leave its picture
       behind on disk with no record pointing at it */
    if (req.file) {
      fs.unlink(req.file.path, function () {});
    }
    res.status(400).json({ success: false, errors: errors });
    return;
  }

  next();
}

module.exports = validateSubmission;
