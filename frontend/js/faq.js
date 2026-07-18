/* ArtConnect — FAQ page interactivity (vanilla JS)
   One accordion item open at a time; clicking an open item closes it. */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));

  items.forEach(function (item) {
    var row = item.querySelector(".faq-row");
    row.addEventListener("click", function () {
      var isOpen = item.classList.contains("faq-item--open");
      items.forEach(function (i) { i.classList.remove("faq-item--open"); });
      if (!isOpen) item.classList.add("faq-item--open");
    });
  });
})();
