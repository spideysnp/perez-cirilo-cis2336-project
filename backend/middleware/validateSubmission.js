/* ArtConnect — server-side validation for artwork submissions.
   Runs after multer has parsed the multipart body, so req.body holds the text
   fields and req.file holds the uploaded image.

   The rules and messages below intentionally match frontend/js/submit.js field
   for field: the browser check is for fast feedback, this one is what actually
   guards the data, since anything can POST to the API directly. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRICE_RE = /^\$?\d+(\.\d{1,2})?$/;

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
    return v ? "" : "Please select a category.";
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
    res.status(400).json({ success: false, errors: errors });
    return;
  }

  next();
}

module.exports = validateSubmission;
