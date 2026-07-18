/* ArtConnect — Submit page interactivity (vanilla JS)
   Client-side form validation: required fields, email format, and a
   numeric price check. Errors appear after the first submit attempt and
   then update live as the user types. */
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
    }
  };

  var mediumField = document.getElementById("f-medium"); /* optional, no validation */
  var formError = document.getElementById("form-error");
  var confirmModal = document.getElementById("confirm-modal");
  var submitBtn = document.getElementById("submit-btn");
  var attempted = false;

  function showErrors() {
    var ok = true;
    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      var msg = f.validate(f.el.value);
      if (msg) ok = false;
      f.err.textContent = msg;
      f.err.hidden = !msg;
      f.el.classList.toggle("field--error", !!msg);
    });
    formError.hidden = ok;
    return ok;
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      f.err.hidden = true;
      f.el.classList.remove("field--error");
    });
    formError.hidden = true;
  }

  Object.keys(fields).forEach(function (k) {
    ["input", "change"].forEach(function (evt) {
      fields[k].el.addEventListener(evt, function () {
        if (attempted) showErrors();
      });
    });
  });

  submitBtn.addEventListener("click", function () {
    if (!showErrors()) {
      attempted = true;
      return;
    }
    /* success: reset the form and show the confirmation modal */
    attempted = false;
    Object.keys(fields).forEach(function (k) { fields[k].el.value = ""; });
    mediumField.value = "";
    clearErrors();
    confirmModal.hidden = false;
  });

  confirmModal.addEventListener("click", function (e) {
    if (e.target === confirmModal || e.target.closest("[data-close]")) confirmModal.hidden = true;
  });
})();
