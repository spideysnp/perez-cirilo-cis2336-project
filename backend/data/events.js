/* ArtConnect — event store.
   The six scheduled events, held in memory and read-only: there is no way to
   add an event through the site, so this list only ever changes when the
   seeds below are edited.

   Image paths are root-relative for the same reason as in artworks.js.

   day, month, and time are stored separately from the full datetime string
   because the event row renders them in their own elements (the date block on
   the left and the "time · location" line), and splitting them here avoids
   parsing the datetime string in the browser.

   sortkey is the month and day as a number (12 July -> 712), which is what the
   soonest/latest sort orders on. */

const events = [
  {
    id: 1,
    tag: "EVENING",
    category: "Evenings",
    sortkey: 712,
    title: "Late at the Gallery. Dutch Masters by candlelight.",
    datetime: "12 July · 19:00–22:00",
    day: "12",
    month: "JUL",
    time: "19:00",
    location: "Main Hall",
    description: "Join us after hours for a candlelit walkthrough of the Dutch Masters collection, with live commentary from our curator and a glass of wine on arrival.",
    price: "Free · RSVP required",
    img: "/images/Dutch-Masters-by-Candlelight.webp"
  },
  {
    id: 2,
    tag: "TALK",
    category: "Talks",
    sortkey: 719,
    title: "Artist talk on collecting contemporary work.",
    datetime: "19 July · 18:30–19:30",
    day: "19",
    month: "JUL",
    time: "18:30",
    location: "Studio 2",
    description: "A conversation on building a personal collection, with tips for new and seasoned collectors alike.",
    price: "Free · RSVP required",
    img: "/images/Artist-Talk-on-Collecting-Contemporary-Work.webp"
  },
  {
    id: 3,
    tag: "OPENING",
    category: "Openings",
    sortkey: 802,
    title: "Open submission preview night.",
    datetime: "02 August · 20:00–23:00",
    day: "02",
    month: "AUG",
    time: "20:00",
    location: "West Wing",
    description: "A first look at newly submitted works ahead of their public debut, with the artists in attendance.",
    price: "Free · RSVP required",
    img: "/images/Open-Submission-Preview-Night.webp"
  },
  {
    id: 4,
    tag: "TALK",
    category: "Talks",
    sortkey: 809,
    title: "Curator walkthrough. Dutch Golden Age.",
    datetime: "09 August · 17:00–18:00",
    day: "09",
    month: "AUG",
    time: "17:00",
    location: "Main Hall",
    description: "Our curator leads a guided walkthrough of the Dutch Golden Age gallery, covering technique, provenance, and stories behind the works.",
    price: "Free · RSVP required",
    img: "/images/Curator-Walkthrough.webp"
  },
  {
    id: 5,
    tag: "EVENING",
    category: "Evenings",
    sortkey: 823,
    title: "Late at the Gallery. Jazz & wine evening.",
    datetime: "23 August · 19:30–22:30",
    day: "23",
    month: "AUG",
    time: "19:30",
    location: "Courtyard",
    description: "An evening of live jazz and wine in the courtyard, surrounded by rotating outdoor sculpture pieces.",
    price: "$15 · RSVP required",
    img: "/images/Jazz-and-Wine-Evening.webp"
  },
  {
    id: 6,
    tag: "OPENING",
    category: "Openings",
    sortkey: 905,
    title: "New works opening. City painters collective.",
    datetime: "05 September · 18:00–21:00",
    day: "05",
    month: "SEP",
    time: "18:00",
    location: "West Wing",
    description: "The opening night for a new group show from the city's painters collective, with several artists in attendance.",
    price: "Free · RSVP required",
    img: "/images/New-Works-Opening.webp"
  }
];

/* every event; pass a category to narrow the list */
function getAllEvents(category) {
  if (!category || category === "All") return events.slice();
  return events.filter(function (event) {
    return event.category === category;
  });
}

/* one event by id, or null when there is no match */
function getEventById(id) {
  const wanted = Number(id);
  if (!Number.isFinite(wanted)) return null;
  return events.find(function (event) {
    return event.id === wanted;
  }) || null;
}

module.exports = { getAllEvents, getEventById };
