/* ArtConnect — Events page interactivity (vanilla JS)
   Category filtering, date sorting, and the event detail modal. */
(function () {
  "use strict";

  var list = document.querySelector(".events-list");
  var rows = Array.prototype.slice.call(list.querySelectorAll(".event-row"));
  var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-group .pill"));
  var sortToggle = document.querySelector(".sort-toggle");
  var sortMenu = document.querySelector(".sort-menu");
  var sortOptions = Array.prototype.slice.call(sortMenu.querySelectorAll(".sort-option"));

  var activeCat = "All";
  var sort = "soonest";

  function applyFilterAndSort() {
    var visible = rows.filter(function (r) {
      return activeCat === "All" || r.getAttribute("data-cat") === activeCat;
    });
    visible.sort(function (a, b) {
      var ka = Number(a.getAttribute("data-key"));
      var kb = Number(b.getAttribute("data-key"));
      return sort === "soonest" ? ka - kb : kb - ka;
    });
    rows.forEach(function (r) { r.hidden = true; });
    visible.forEach(function (r) {
      r.hidden = false;
      list.appendChild(r);
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

  /* ---------- event detail modal ---------- */
  var overlay = document.getElementById("event-modal");
  var mTag = document.getElementById("event-modal-tag");
  var mTitle = document.getElementById("event-modal-title");
  var mImg = document.getElementById("event-modal-img");
  var mMeta = document.getElementById("event-modal-meta");
  var mDesc = document.getElementById("event-modal-desc");
  var mPrice = document.getElementById("event-modal-price");

  function openEvent(row) {
    mTag.textContent = row.getAttribute("data-tag");
    mTitle.textContent = row.getAttribute("data-title");
    mImg.style.background = "url('" + row.getAttribute("data-img") + "') center/cover no-repeat";
    mMeta.textContent = row.getAttribute("data-datetime") + " · " + row.getAttribute("data-location");
    mDesc.textContent = row.getAttribute("data-desc");
    mPrice.textContent = row.getAttribute("data-price");
    overlay.hidden = false;
  }

  rows.forEach(function (row) {
    row.addEventListener("click", function () { openEvent(row); });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest("[data-close]")) overlay.hidden = true;
  });
})();
