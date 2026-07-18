/* ArtConnect — Gallery page interactivity (vanilla JS)
   Category filtering, date sorting, and the artwork detail modal. */
(function () {
  "use strict";

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
      grid.appendChild(c); /* re-append in sorted order */
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

  /* ---------- artwork detail modal ---------- */
  var overlay = document.getElementById("artwork-modal");
  var mImg = document.getElementById("artwork-modal-img");
  var mTitle = document.getElementById("artwork-modal-title");
  var mSub = document.getElementById("artwork-modal-sub");
  var mDesc = document.getElementById("artwork-modal-desc");
  var mPrice = document.getElementById("artwork-modal-price");

  function openArtwork(card) {
    mImg.style.background = "url('" + card.getAttribute("data-img") + "') center/cover no-repeat";
    mTitle.textContent = card.getAttribute("data-title");
    mSub.textContent = card.getAttribute("data-artist") + " · " + card.getAttribute("data-year") + " · " + card.getAttribute("data-tag");
    mDesc.textContent = card.getAttribute("data-desc");
    mPrice.textContent = card.getAttribute("data-price");
    overlay.hidden = false;
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () { openArtwork(card); });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest("[data-close]")) overlay.hidden = true;
  });
})();
