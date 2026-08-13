/* ArtConnect—artwork store.
   Holds the collection in memory: the nine seeded works plus anything
   submitted through the Submit page while the server is running. Restarting
   the server resets the list back to the seeds.

   Image paths are stored root-relative ("/images/...", "/uploads/...") rather
   than page-relative, because the same record is rendered by pages at two
   different directory depths (/index.html and /pages/Gallery.html).

   imgAvif is the smaller AVIF version of the same image and is optional: the
   seeded works each have one, submitted images do not. */

const artworks = [
  {
    id: 1,
    title: "Self-Portrait",
    artist: "Vincent van Gogh",
    year: "1887",
    sortkey: 1887,
    category: "Painting",
    medium: "",
    price: "Not for sale",
    description: "A painting by Vincent van Gogh, 1887. Part of the current collection.",
    img: "/images/Van-Gogh-1887.webp",
    imgAvif: "/images/Van-Gogh-1887.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 2,
    title: "Woman Reading a Letter",
    artist: "Johannes Vermeer",
    year: "c. 1663",
    sortkey: 1663,
    category: "Painting",
    medium: "",
    price: "$5,600",
    description: "A painting by Johannes Vermeer, c. 1663. Part of the current collection.",
    img: "/images/Vermeer-1663.webp",
    imgAvif: "/images/Vermeer-1663.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 3,
    title: "The Milkmaid",
    artist: "Johannes Vermeer",
    year: "c. 1660",
    sortkey: 1660,
    category: "Painting",
    medium: "",
    price: "On view",
    description: "A painting by Johannes Vermeer, c. 1660. Part of the current collection.",
    img: "/images/Vermeer-1660.webp",
    imgAvif: "/images/Vermeer-1660.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 4,
    title: "The Threatened Swan",
    artist: "Jan Asselijn",
    year: "c. 1650",
    sortkey: 1650,
    category: "Painting",
    medium: "",
    price: "$6,800",
    description: "A painting by Jan Asselijn, c. 1650. Part of the current collection.",
    img: "/images/Asselijn-1650.webp",
    imgAvif: "/images/Asselijn-1650.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 5,
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    year: "1642",
    sortkey: 1642,
    category: "Painting",
    medium: "",
    price: "Not for sale",
    description: "A painting by Rembrandt van Rijn, 1642. Part of the current collection.",
    img: "/images/Van-Rijn-1642.webp",
    imgAvif: "/images/Van-Rijn-1642.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 6,
    title: "Still Life with Flowers",
    artist: "Hans Bollongier",
    year: "1639",
    sortkey: 1639,
    category: "Painting",
    medium: "",
    price: "$4,200",
    description: "A painting by Hans Bollongier, 1639. Part of the current collection.",
    img: "/images/Bollongier-1639.webp",
    imgAvif: "/images/Bollongier-1639.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 7,
    title: "River Landscape",
    artist: "Salomon van Ruysdael",
    year: "1631",
    sortkey: 1631,
    category: "Painting",
    medium: "",
    price: "$2,400",
    description: "A painting by Salomon van Ruysdael, 1631. Part of the current collection.",
    img: "/images/Van-Ruysdael-1631.webp",
    imgAvif: "/images/Van-Ruysdael-1631.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 8,
    title: "Portrait of a Couple",
    artist: "Frans Hals",
    year: "c. 1622",
    sortkey: 1622,
    category: "Painting",
    medium: "",
    price: "$3,900",
    description: "A painting by Frans Hals, c. 1622. Part of the current collection.",
    img: "/images/Hals-1622.webp",
    imgAvif: "/images/Hals-1622.avif",
    credit: "RIJKS · PD",
    source: "seed"
  },
  {
    id: 9,
    title: "Winter Landscape",
    artist: "Hendrick Avercamp",
    year: "c. 1608",
    sortkey: 1608,
    category: "Painting",
    medium: "",
    price: "$3,100",
    description: "A painting by Hendrick Avercamp, c. 1608. Part of the current collection.",
    img: "/images/Avercamp-1608.webp",
    imgAvif: "/images/Avercamp-1608.avif",
    credit: "RIJKS · PD",
    source: "seed"
  }
];

/* ids are handed out here so nothing outside this file has to track them */
let nextId = artworks.length + 1;

/* every work, newest-submitted last; pass a category to narrow the list */
function getAllArtworks(category) {
  if (!category || category === "All") return artworks.slice();
  return artworks.filter(function (artwork) {
    return artwork.category === category;
  });
}

/* one work by id, or null when there is no match */
function getArtworkById(id) {
  const wanted = Number(id);
  if (!Number.isFinite(wanted)) return null;
  return artworks.find(function (artwork) {
    return artwork.id === wanted;
  }) || null;
}

/* add a submitted work; the id is assigned here and the stored record returned */
function addArtwork(data) {
  const artwork = Object.assign({}, data, { id: nextId });
  nextId += 1;
  artworks.push(artwork);
  return artwork;
}

module.exports = { getAllArtworks, getArtworkById, addArtwork };
