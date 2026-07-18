/* ArtConnect — Homepage interactivity (vanilla JS)
   Hero + artwork cards open the artwork modal, event rows open the
   event modal, and the gallery section filters/sorts its grid. */
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
    aImg.style.background = "url('" + el.getAttribute("data-img") + "') center/cover no-repeat";
    aTitle.textContent = el.getAttribute("data-title");
    aSub.textContent = el.getAttribute("data-artist") + " · " + el.getAttribute("data-year") + " · " + el.getAttribute("data-tag");
    aDesc.textContent = el.getAttribute("data-desc");
    aPrice.textContent = el.getAttribute("data-price");
    artOverlay.hidden = false;
  }

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

  /* ---------- gallery section: filter + sort ---------- */
  var grid = document.querySelector(".works-grid");
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".work-card"));
  var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-group .pill"));
  var sortToggle = document.querySelector(".sort-toggle");
  var sortMenu = document.querySelector(".sort-menu");
  var sortOptions = Array.prototype.slice.call(sortMenu.querySelectorAll(".sort-option"));

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
})();
