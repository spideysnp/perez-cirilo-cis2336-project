/* ArtConnect — Gallery page interactivity (vanilla JS)
   Fetches the collection from /api/artworks, builds a card per work with the
   shared builder in artwork-card.js, then wires up category filtering, date
   sorting, and the artwork detail modal.

   The filter and sort controls are wired only after the cards exist, since
   they work by reordering elements the fetch has to deliver first. */
(function () {
  "use strict";

  var grid = document.querySelector(".works-grid");
  var pageMeta = document.querySelector(".page-meta");

  var cards = [];
  var activeCat = "All";
  var sort = "recent";

  /* ---------- artwork detail modal ---------- */
  var overlay = document.getElementById("artwork-modal");
  var mImg = document.getElementById("artwork-modal-img");
  var mTitle = document.getElementById("artwork-modal-title");
  var mSub = document.getElementById("artwork-modal-sub");
  var mDesc = document.getElementById("artwork-modal-desc");
  var mPrice = document.getElementById("artwork-modal-price");

  function openArtwork(card) {
    var medium = card.getAttribute("data-medium");
    mImg.style.background = "url('" + card.getAttribute("data-img") + "') center/cover no-repeat";
    mTitle.textContent = card.getAttribute("data-title");
    mSub.textContent = card.getAttribute("data-artist") + " · " + card.getAttribute("data-year") + " · " +
      card.getAttribute("data-tag") + (medium ? " · " + medium : "");
    mDesc.textContent = card.getAttribute("data-desc");
    mPrice.textContent = card.getAttribute("data-price");
    overlay.hidden = false;
  }

  /* the overlay exists in the page from the start, so this can be wired now */
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest("[data-close]")) overlay.hidden = true;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) overlay.hidden = true;
  });

  /* ---------- filtering and sorting ---------- */
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
      grid.appendChild(c); /* re-append in sorted order */
    });
  }

  function wireControls() {
    var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-group .pill"));
    var sortToggle = document.querySelector(".sort-toggle");
    var sortMenu = document.querySelector(".sort-menu");
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

  /* ---------- rendering ---------- */

  /* A status line sits inside the grid, spanning all three columns so it reads
     as a full-width message rather than an empty first cell. */
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

  function updatePageMeta(artworks) {
    var artists = {};
    artworks.forEach(function (a) {
      if (a.artist) artists[a.artist] = true;
    });
    var works = artworks.length;
    var names = Object.keys(artists).length;
    pageMeta.textContent =
      works + (works === 1 ? " WORK · " : " WORKS · ") +
      names + (names === 1 ? " ARTIST" : " ARTISTS");
  }

  function render(artworks) {
    grid.textContent = ""; /* clears the loading message */
    cards = artworks.map(function (artwork) {
      var card = window.buildWorkCardEl(artwork);
      card.addEventListener("click", function () { openArtwork(card); });
      grid.appendChild(card);
      return card;
    });
    updatePageMeta(artworks);
    applyFilterAndSort();
    wireControls();
  }

  /* ---------- load ---------- */
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
