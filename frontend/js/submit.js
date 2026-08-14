/* ArtConnect — Submit page interactivity (vanilla JS)
   Client-side form validation: required fields, email format, a numeric price
   check, and an attached image. Errors appear after the first submit attempt
   and then update live as the user types.

   Validation here is only for fast feedback. The same rules run again on the
   server, and any error it sends back is mapped onto these same fields, so a
   rejection looks identical whether it was caught in the browser or not. */
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PRICE_RE = /^\$?\d+(\.\d{1,2})?$/;

  var fields = {
    artistName: {
      el: document.getElementById("f-artist"),
      err: document.getElementById("e-artist"),
      validate: function (v) { return v.trim() ? "" : "Artist name is required."; }
    },
    email: {
      el: document.getElementById("f-email"),
      err: document.getElementById("e-email"),
      validate: function (v) {
        v = v.trim();
        if (!v) return "Email is required.";
        return EMAIL_RE.test(v) ? "" : "Enter a valid email address.";
      }
    },
    title: {
      el: document.getElementById("f-title"),
      err: document.getElementById("e-title"),
      validate: function (v) { return v.trim() ? "" : "Artwork title is required."; }
    },
    category: {
      el: document.getElementById("f-category"),
      err: document.getElementById("e-category"),
      validate: function (v) { return v ? "" : "Please select a category."; }
    },
    price: {
      el: document.getElementById("f-price"),
      err: document.getElementById("e-price"),
      validate: function (v) {
        v = v.trim();
        if (!v) return "";
        if (/^not for sale$/i.test(v)) return "";
        return PRICE_RE.test(v) ? "" : 'Enter a numeric amount (e.g. 450) or "Not for sale".';
      }
    },
    description: {
      el: document.getElementById("f-desc"),
      err: document.getElementById("e-desc"),
      validate: function (v) { return v.trim() ? "" : "Please add a description."; }
    },
    /* a file input has no useful .value, so this one reads .files instead;
       the message matches what the server sends for a missing image */
    image: {
      el: document.getElementById("f-image"),
      err: document.getElementById("e-image"),
      validate: function () {
        return this.el.files && this.el.files.length ? "" : "Please attach an image of your work.";
      }
    }
  };

  var mediumField = document.getElementById("f-medium"); /* optional, no validation */
  var formError = document.getElementById("form-error");
  var confirmModal = document.getElementById("confirm-modal");
  var submitBtn = document.getElementById("submit-btn");
  var submitLabel = submitBtn.textContent;
  var defaultFormError = formError.textContent;
  var attempted = false;
  var sending = false;

  function showErrors() {
    var ok = true;
    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      /* .call so the image field can reach its own element through this */
      var msg = f.validate.call(f, f.el.value);
      if (msg) ok = false;
      f.err.textContent = msg;
      f.err.hidden = !msg;
      f.el.classList.toggle("field--error", !!msg);
    });
    formError.textContent = defaultFormError;
    formError.hidden = ok;
    return ok;
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      f.err.hidden = true;
      f.el.classList.remove("field--error");
    });
    formError.textContent = defaultFormError;
    formError.hidden = true;
  }

  /* Put the server's per-field messages under the matching inputs. The keys it
     sends are the same as the keys above, so anything it rejects lands in the
     same place a browser-side rejection would. */
  function showServerErrors(errors) {
    clearErrors();
    var unmapped = [];
    Object.keys(errors).forEach(function (k) {
      var f = fields[k];
      if (!f) {
        unmapped.push(errors[k]);
        return;
      }
      f.err.textContent = errors[k];
      f.err.hidden = false;
      f.el.classList.add("field--error");
    });
    /* a message with no field of its own still gets seen rather than dropped */
    formError.textContent = unmapped.length ? unmapped.join(" ") : defaultFormError;
    formError.hidden = false;
    attempted = true;
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function setSending(isSending) {
    sending = isSending;
    submitBtn.textContent = isSending ? "Submitting…" : submitLabel;
    submitBtn.classList.toggle("btn-primary--busy", isSending);
  }

  function resetForm() {
    Object.keys(fields).forEach(function (k) { fields[k].el.value = ""; });
    mediumField.value = "";
    attempted = false;
    clearErrors();
  }

  function sendSubmission() {
    var data = new FormData();
    data.append("artistName", fields.artistName.el.value.trim());
    data.append("email", fields.email.el.value.trim());
    data.append("title", fields.title.el.value.trim());
    data.append("category", fields.category.el.value);
    data.append("medium", mediumField.value.trim());
    data.append("price", fields.price.el.value.trim());
    data.append("description", fields.description.el.value.trim());
    /* this key must stay "image" — it is what upload.single("image") looks for */
    data.append("image", fields.image.el.files[0]);

    setSending(true);

    /* no Content-Type header: the browser has to set it itself so the
       multipart boundary is included */
    fetch("/api/artworks", { method: "POST", body: data })
      .then(function (res) {
        return res.json().then(
          function (body) { return { status: res.status, body: body }; },
          function () { return { status: res.status, body: null }; }
        );
      })
      .then(function (result) {
        setSending(false);
        if (result.status === 201) {
          resetForm();
          confirmModal.hidden = false;
          return;
        }
        if (result.status === 400 && result.body && result.body.errors) {
          showServerErrors(result.body.errors);
          return;
        }
        showFormError("Your work could not be submitted just now. Please try again.");
      })
      .catch(function () {
        setSending(false);
        showFormError("Could not reach the server. Check your connection and try again.");
      });
  }

  Object.keys(fields).forEach(function (k) {
    ["input", "change"].forEach(function (evt) {
      fields[k].el.addEventListener(evt, function () {
        if (attempted) showErrors();
      });
    });
  });

  submitBtn.addEventListener("click", function () {
    /* a second click while the first request is still going would submit the
       same work twice */
    if (sending) return;
    if (!showErrors()) {
      attempted = true;
      return;
    }
    sendSubmission();
  });

  confirmModal.addEventListener("click", function (e) {
    if (e.target === confirmModal || e.target.closest("[data-close]")) confirmModal.hidden = true;
  });
})();
