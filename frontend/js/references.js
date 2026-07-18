/* ArtConnect — References page interactivity (vanilla JS)
   Expandable reference cards; one open at a time, +/− symbol swap. */
(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".ref-card"));

  function setSymbols() {
    cards.forEach(function (c) {
      c.querySelector(".ref-symbol").textContent =
        c.classList.contains("ref-card--open") ? "−" : "+";
    });
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      var isOpen = card.classList.contains("ref-card--open");
      cards.forEach(function (c) { c.classList.remove("ref-card--open"); });
      if (!isOpen) card.classList.add("ref-card--open");
      setSymbols();
    });
  });
})();
