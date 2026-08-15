/* ArtConnect — Homepage interactivity (vanilla JS)
   Hero + featured cards open the artwork modal, event rows open the event
   modal, and the gallery screen further down the page fetches the collection
   from /api/artworks and filters/sorts it.

   The hero and the featured previews are hand-picked and stay in the HTML; only
   the gallery screen's grid is built from the API. */
(function () {
  "use strict";

  /* ---------- artwork detail modal ---------- */
  var artOverlay = document.getElementById("artwork-modal");
  var aImg = document.getElementById("artwork-modal-img");
  var aTitle = document.getElementById("artwork-modal-title");
  var aSub = document.getElementById("artwork-modal-sub");
  var aDesc = document.getElementById("artwork-modal-desc");
  var aPrice = document.getElementById("artwork-modal-price");

  function openArtwork(el) {
    /* the static hero and featured cards have no data-medium; grid cards
       built from the API carry one when the artist supplied it */
    var medium = el.getAttribute("data-medium");
    aImg.style.background = "url('" + el.getAttribute("data-img") + "') center/cover no-repeat";
    aTitle.textContent = el.getAttribute("data-title");
    aSub.textContent = el.getAttribute("data-artist") + " · " + el.getAttribute("data-year") + " · " +
      el.getAttribute("data-tag") + (medium ? " · " + medium : "");
    aDesc.textContent = el.getAttribute("data-desc");
    aPrice.textContent = el.getAttribute("data-price");
    artOverlay.hidden = false;
  }

  /* This sweep runs now, while the only [data-artwork] elements in the page are
     the static hero and the three featured cards. The gallery grid's cards are
     added later by the fetch below and get their own listener as they are
     built, so nothing here can bind to them twice. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-artwork]"), function (el) {
    el.addEventListener("click", function () { openArtwork(el); });
  });

  artOverlay.addEventListener("click", function (e) {
    if (e.target === artOverlay || e.target.closest("[data-close]")) artOverlay.hidden = true;
  });

  /* ---------- event detail modal ---------- */
  var evOverlay = document.getElementById("event-modal");
  var eTag = document.getElementById("event-modal-tag");
  var eTitle = document.getElementById("event-modal-title");
  var eImg = document.getElementById("event-modal-img");
  var eMeta = document.getElementById("event-modal-meta");
  var eDesc = document.getElementById("event-modal-desc");
  var ePrice = document.getElementById("event-modal-price");

  Array.prototype.forEach.call(document.querySelectorAll(".home-event-row"), function (row) {
    row.addEventListener("click", function () {
      eTag.textContent = row.getAttribute("data-tag");
      eTitle.textContent = row.getAttribute("data-title");
      eImg.style.background = "url('" + row.getAttribute("data-img") + "') center/cover no-repeat";
      eMeta.textContent = row.getAttribute("data-datetime") + " · " + row.getAttribute("data-location");
      eDesc.textContent = row.getAttribute("data-desc");
      ePrice.textContent = row.getAttribute("data-price");
      evOverlay.hidden = false;
    });
  });

  evOverlay.addEventListener("click", function (e) {
    if (e.target === evOverlay || e.target.closest("[data-close]")) evOverlay.hidden = true;
  });

  /* one handler for both overlays on this page */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!artOverlay.hidden) artOverlay.hidden = true;
    if (!evOverlay.hidden) evOverlay.hidden = true;
  });

  /* ---------- gallery screen ----------
     Every query below is scoped to the gallery section rather than the whole
     document, because this page also holds the featured strip and the homepage
     screen above it. This section keeps its own state and does its own fetch;
     it shares nothing with the standalone Gallery page. */
  var gallerySection = document.querySelector('[data-screen-label="Gallery"]');
  var grid = gallerySection.querySelector(".works-grid");
  var pageMeta = gallerySection.querySelector(".page-meta");

  var cards = [];
  var activeCat = "All";
  var sort = "recent";

  function applyFilterAndSort() {
    var visible = cards.filter(function (c) {
      return activeCat === "All" || c.getAttribute("data-cat") === activeCat;
    });
    visible.sort(function (a, b) {
      var ka = Number(a.getAttribute("data-sortkey"));
      var kb = Number(b.getAttribute("data-sortkey"));
      return sort === "recent" ? kb - ka : ka - kb;
    });
    cards.forEach(function (c) { c.hidden = true; });
    visible.forEach(function (c) {
      c.hidden = false;
      grid.appendChild(c);
    });
  }

  function wireControls() {
    var pills = Array.prototype.slice.call(gallerySection.querySelectorAll(".filter-group .pill"));
    var sortToggle = gallerySection.querySelector(".sort-toggle");
    var sortMenu = gallerySection.querySelector(".sort-menu");
    var sortOptions = Array.prototype.slice.call(sortMenu.querySelectorAll(".sort-option"));

    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        activeCat = pill.getAttribute("data-cat");
        pills.forEach(function (p) { p.classList.toggle("pill--active", p === pill); });
        applyFilterAndSort();
      });
    });

    sortToggle.addEventListener("click", function () {
      sortMenu.hidden = !sortMenu.hidden;
    });

    sortOptions.forEach(function (opt) {
      opt.addEventListener("click", function () {
        sort = opt.getAttribute("data-sort");
        sortToggle.textContent = "SORT: " + sort.toUpperCase() + " ▾";
        sortOptions.forEach(function (o) { o.classList.toggle("sort-option--active", o === opt); });
        sortMenu.hidden = true;
        applyFilterAndSort();
      });
    });
  }

  function showMessage(text) {
    grid.textContent = "";
    var msg = document.createElement("div");
    msg.className = "grid-status";
    msg.style.gridColumn = "1 / -1";
    msg.style.font = "12px 'Space Mono', monospace";
    msg.style.letterSpacing = ".1em";
    msg.style.color = "#82807a";
    msg.textContent = text;
    grid.appendChild(msg);
  }

  /* the featured strip's link advertises a total, which would otherwise still
     read "9 works" the moment someone submits a tenth */
  var viewAll = document.querySelector(".view-all");

  function updateCounts(artworks) {
    var artists = {};
    artworks.forEach(function (a) {
      if (a.artist) artists[a.artist] = true;
    });
    var works = artworks.length;
    var names = Object.keys(artists).length;
    pageMeta.textContent =
      works + (works === 1 ? " WORK · " : " WORKS · ") +
      names + (names === 1 ? " ARTIST" : " ARTISTS");
    if (viewAll) {
      viewAll.textContent = "View all " + works + (works === 1 ? " work" : " works") + "  →";
    }
  }

  function render(artworks) {
    grid.textContent = "";
    cards = artworks.map(function (artwork) {
      var card = window.buildWorkCardEl(artwork);
      /* bound here, at build time, rather than by another [data-artwork] sweep,
         which would re-bind the hero and featured cards as well */
      card.addEventListener("click", function () { openArtwork(card); });
      grid.appendChild(card);
      return card;
    });
    updateCounts(artworks);
    applyFilterAndSort();
    wireControls();
  }

  pageMeta.textContent = "LOADING…";
  showMessage("Loading the collection…");

  fetch("/api/artworks")
    .then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
    .then(function (data) {
      var artworks = (data && data.artworks) || [];
      if (!artworks.length) {
        pageMeta.textContent = "0 WORKS · 0 ARTISTS";
        showMessage("There are no works in the collection yet.");
        return;
      }
      render(artworks);
    })
    .catch(function () {
      pageMeta.textContent = "UNAVAILABLE";
      showMessage("The collection could not be loaded. Refresh the page to try again.");
    });
})();
