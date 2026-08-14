/* ArtConnect — shared artwork card builder (vanilla JS)
   Both the Gallery page and the gallery section on the homepage render the
   same .work-card markup from the same /api/artworks records, so the markup
   is built here once instead of being written out twice.

   Exposes window.buildWorkCardEl(artwork), which returns a detached element.
   It deliberately attaches no click handlers: each page opens its own
   #artwork-modal and wires that up itself.

   Every value goes in through textContent or setAttribute, never innerHTML,
   so a title or description typed into the Submit form is displayed as text
   rather than parsed as markup. */
(function () {
  "use strict";

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  /* Seeded works carry a display year like "c. 1660". Submissions have no year
     at all, only the timestamp of when they came in, so fall back to that. */
  function displayYear(artwork) {
    if (artwork.year) return String(artwork.year);
    if (artwork.submittedAt) {
      var submitted = new Date(artwork.submittedAt);
      if (!isNaN(submitted)) return String(submitted.getFullYear());
    }
    return "";
  }

  function buildWorkCardEl(artwork) {
    var year = displayYear(artwork);
    var card = el("div", "work-card");

    /* the homepage's modal wiring finds cards by this attribute; the Gallery
       page ignores it, so carrying it everywhere is harmless and keeps one
       card shape */
    card.setAttribute("data-artwork", "");
    card.setAttribute("data-cat", artwork.category || "");
    card.setAttribute("data-sortkey", String(artwork.sortkey));
    card.setAttribute("data-title", artwork.title || "");
    card.setAttribute("data-artist", artwork.artist || "");
    card.setAttribute("data-year", year);
    card.setAttribute("data-tag", artwork.category || "");
    card.setAttribute("data-price", artwork.price || "");
    card.setAttribute("data-img", artwork.img || "");
    card.setAttribute("data-desc", artwork.description || "");

    /* ---- framed image ---- */
    var frame = el("div", "art-frame");

    var picture = el("picture", "art-img");
    /* only the seeded works have an AVIF version; submitted images are served
       in whatever format they were uploaded in */
    if (artwork.imgAvif) {
      var source = document.createElement("source");
      source.setAttribute("srcset", artwork.imgAvif);
      source.setAttribute("type", "image/avif");
      picture.appendChild(source);
    }
    var img = document.createElement("img");
    img.setAttribute("src", artwork.img || "");
    img.setAttribute("alt", (artwork.title || "") + " — " + (artwork.artist || "") + ", " + year);
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    picture.appendChild(img);
    frame.appendChild(picture);

    var cover = el("div", "art-cover");
    cover.appendChild(el("div", "art-mat"));
    cover.appendChild(el("div", "art-glow"));

    var titleWrap = el("div", "art-title-wrap");
    var title = el("div", "art-title");
    title.textContent = artwork.title || "";
    titleWrap.appendChild(title);
    cover.appendChild(titleWrap);

    var credit = el("span", "art-credit");
    credit.textContent = artwork.credit || "";
    cover.appendChild(credit);

    frame.appendChild(cover);
    card.appendChild(frame);

    /* ---- caption under the frame ---- */
    var meta = el("div", "work-meta");
    var metaText = document.createElement("div");

    var artist = el("div", "work-artist");
    artist.textContent = artwork.artist || "";
    metaText.appendChild(artist);

    var yearLine = el("div", "work-year");
    yearLine.textContent = year + " · " + (artwork.category || "");
    metaText.appendChild(yearLine);

    meta.appendChild(metaText);

    var price = el("div", "work-price");
    price.textContent = artwork.price || "";
    meta.appendChild(price);

    card.appendChild(meta);

    return card;
  }

  window.buildWorkCardEl = buildWorkCardEl;
})();
