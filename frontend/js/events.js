/* ArtConnect — Events page interactivity (vanilla JS)
   Fetches the schedule from /api/events, builds a row per event, then wires up
   category filtering, date sorting, and the event detail modal.

   The row markup is built here rather than in a shared module because nothing
   else on the site renders an event row.

   Filter and sort are wired only after the rows exist, since they work by
   reordering elements the fetch has to deliver first. */
(function () {
  "use strict";

  var list = document.querySelector(".events-list");
  var pageMeta = document.querySelector(".page-meta");

  var rows = [];
  var activeCat = "All";
  var sort = "soonest";

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

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target.closest("[data-close]")) overlay.hidden = true;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) overlay.hidden = true;
  });

  /* ---------- row building ---------- */
  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  /* Values go in through textContent and setAttribute rather than innerHTML,
     matching how the artwork cards are built. */
  function buildEventRowEl(event) {
    var row = el("div", "event-row");
    row.setAttribute("data-cat", event.category || "");
    row.setAttribute("data-key", String(event.sortkey));
    row.setAttribute("data-tag", event.tag || "");
    row.setAttribute("data-title", event.title || "");
    row.setAttribute("data-datetime", event.datetime || "");
    row.setAttribute("data-location", event.location || "");
    row.setAttribute("data-desc", event.description || "");
    row.setAttribute("data-price", event.price || "");
    row.setAttribute("data-img", event.img || "");

    var date = el("div", "event-date");
    var day = el("div", "event-day");
    day.textContent = event.day || "";
    var mon = el("div", "event-mon");
    mon.textContent = event.month || "";
    date.appendChild(day);
    date.appendChild(mon);
    row.appendChild(date);

    row.appendChild(el("div", "event-divider"));

    var thumb = el("div", "event-thumb");
    thumb.setAttribute("style", "background:url('" + event.img + "') center/cover no-repeat");
    thumb.appendChild(el("div", "art-glow"));
    row.appendChild(thumb);

    var info = el("div", "event-info");
    var title = el("div", "event-title");
    title.textContent = event.title || "";
    var meta = el("div", "event-meta");
    meta.textContent = (event.time || "") + " · " + (event.location || "");
    info.appendChild(title);
    info.appendChild(meta);
    row.appendChild(info);

    var tag = el("span", "event-tag");
    tag.textContent = event.tag || "";
    row.appendChild(tag);

    var view = el("span", "event-view");
    view.textContent = "View  →";
    row.appendChild(view);

    return row;
  }

  /* ---------- filtering and sorting ---------- */
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
      list.appendChild(r); /* re-append in sorted order */
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
  function showMessage(text) {
    list.textContent = "";
    var msg = document.createElement("div");
    msg.className = "list-status";
    msg.style.font = "12px 'Space Mono', monospace";
    msg.style.letterSpacing = ".1em";
    msg.style.color = "#82807a";
    msg.textContent = text;
    list.appendChild(msg);
  }

  function render(events) {
    list.textContent = ""; /* clears the loading message */
    rows = events.map(function (event) {
      var row = buildEventRowEl(event);
      row.addEventListener("click", function () { openEvent(row); });
      list.appendChild(row);
      return row;
    });
    pageMeta.textContent = events.length + " UPCOMING";
    applyFilterAndSort();
    wireControls();
  }

  /* ---------- load ---------- */
  pageMeta.textContent = "LOADING…";
  showMessage("Loading what's on…");

  fetch("/api/events")
    .then(function (res) {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
    .then(function (data) {
      var events = (data && data.events) || [];
      if (!events.length) {
        pageMeta.textContent = "0 UPCOMING";
        showMessage("There are no events scheduled right now.");
        return;
      }
      render(events);
    })
    .catch(function () {
      pageMeta.textContent = "UNAVAILABLE";
      showMessage("The events list could not be loaded. Refresh the page to try again.");
    });
})();
