# ArtConnect

A dark, gallery-at-night styled web platform that helps beginner and professional artists showcase their work, promote upcoming events, and connect with the local art community.

Built for **CIS 2336 – Web Application Development** at the University of Houston.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend / API](#backend--api)
- [Known Limitations](#known-limitations)
- [Usage](#usage)
- [Live Site](#live-site)
- [Roadmap](#roadmap)
- [Credits & References](#credits--references)
- [Developer Contact](#developer-contact)
- [License](#license)

---

## Description

ArtConnect is a concept online platform for a local art gallery. Visitors can browse a curated collection of artwork, discover upcoming events and workshops, and artists can submit their own pieces for review. The goal was to design something that felt like an actual gallery — moody lighting, gallery-at-night visuals, and typography drawn from fine-art print — rather than a generic template site.

The site runs on a **Node.js/Express** server that serves the pages and a small JSON API. The Gallery, Events, and Submit pages are fully dynamic: the Gallery grid (both on its own page and in the gallery screen embedded in the homepage) and the Events list are fetched from the API at page load rather than written into the HTML, and the Submit form uploads a real image file to the server. The About, FAQ, and References pages remain static, as do the homepage hero and its hand-picked featured previews.

Some of the front-end scaffolding for this project was originally generated with an AI design tool and then hand-corrected (broken navigation links, missing script paths, image wiring, and a full CSS refactor). Every AI prompt used during development is logged transparently on the [References page](./frontend/pages/References.html), per course policy.

## Features

- **Homepage** — hero artwork spotlight, featured works, upcoming events preview, and developer contact info.
- **Gallery** — artworks loaded from `GET /api/artworks`, each with image, title, artist, category, and price (or "Not for sale"); filter by category, sort by date, and click any piece to open a detail modal. The work/artist count in the header is computed from the response rather than written into the page.
- **Events** — events loaded from `GET /api/events`, each with image, date, location, and description; filter by type, sort by date, and click to view full details in a modal.
- **Submit Artwork** — a form for artists to submit new work (name, email, title, category, medium, price, description) plus a real image upload. Validation runs twice: in the browser for immediate feedback, and again on the server, which is what actually guards the data. Server-side rejections are shown under the same fields as browser-side ones. A successful submission appears in the gallery straight away.
- **FAQ** — 6 expandable/collapsible questions for quick support answers.
- **References** — image/content sources, design inspiration, and a full log of AI prompts used during development.
- Consistent navigation and footer across every page, responsive layout, and a shared dark theme with CSS variables for accent color and lighting.

## Tech Stack

- **HTML5** — semantic page structure
- **CSS3** — external stylesheets (`frontend/css/`), CSS variables, Flexbox/Grid, transitions & animations, media-query-ready layout
- **JavaScript (vanilla, no frameworks)** — one small script per page (`frontend/js/`) driving data fetching, filtering, sorting, modals, form validation, and the FAQ accordion. No build step, no bundler, no ES modules — scripts are plain `<script defer>` includes.
- **Node.js / Express** — serves the frontend as static files and provides the JSON API
- **multer** — handles the multipart image upload on artwork submissions
- **nodemon** *(dev only)* — restarts the server on backend changes

## Project Structure

```
perez-cirilo-cis2336-project/
│
├── frontend/
│   ├── index.html            # Homepage (hero, featured previews, gallery screen)
│   ├── css/
│   │   ├── common.css        # Shared styles (nav, footer, cards, modals, buttons)
│   │   ├── index.css         # Homepage-specific styles
│   │   ├── Gallery.css
│   │   ├── Events.css
│   │   ├── About.css
│   │   ├── Submit.css
│   │   ├── FAQ.css
│   │   └── References.css
│   ├── js/
│   │   ├── artwork-card.js   # Shared: builds one .work-card element
│   │   ├── index.js          # Homepage: modals + fetches the gallery screen
│   │   ├── gallery.js        # Gallery: fetch, filter, sort, artwork modal
│   │   ├── events.js         # Events: fetch, filter, sort, event modal
│   │   ├── submit.js         # Submit: validation + multipart POST
│   │   ├── faq.js            # FAQ: accordion
│   │   └── references.js     # References: expandable cards
│   ├── images/                # Artwork and event photography
│   └── pages/
│       ├── Gallery.html
│       ├── Events.html
│       ├── About.html
│       ├── Submit.html
│       ├── FAQ.html
│       └── References.html
│
├── backend/
│   ├── server.js              # Express app: static files, API routes, error handling
│   ├── routes/
│   │   ├── artworks.js        # /api/artworks
│   │   └── events.js          # /api/events
│   ├── controllers/
│   │   ├── artworksController.js
│   │   └── eventsController.js
│   ├── middleware/
│   │   ├── upload.js          # multer: disk storage, file-type gate, 5MB limit
│   │   ├── validateSubmission.js  # server-side field validation
│   │   └── errorHandler.js    # API 404s + central error handler
│   ├── data/
│   │   ├── artworks.js        # in-memory artwork store + helpers
│   │   └── events.js          # in-memory event store (read-only)
│   └── uploads/               # submitted images (git-ignored except .gitkeep)
│
├── package.json
└── README.md
```

**A note on `artwork-card.js`.** Two places render artwork cards: `pages/Gallery.html` and the gallery screen embedded in `index.html` (a leftover from when the site was one long scrolling page). Both consume the same `/api/artworks` records, so the card markup is built once in `frontend/js/artwork-card.js`, which exposes a single `window.buildWorkCardEl(artwork)` and returns a detached element. It attaches no click handlers — each page wires its own modal — and it must be loaded before the page script that calls it. Event rows are *not* shared this way: only the Events page renders them, so that builder lives inside `events.js`.

## Getting Started

Requires **Node.js 18 or newer** (the frontend uses `fetch` and `FormData`, and the server is plain CommonJS).

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/spideysnp/perez-cirilo-cis2336-project.git
   cd perez-cirilo-cis2336-project
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Visit **http://localhost:3000**.

The server serves `frontend/` at the site root, so `/`, `/pages/Gallery.html`, and `/images/...` all resolve without any extra configuration. Set `PORT` to use a different port:

```bash
PORT=4000 npm start
```

While working on the backend, `npm run dev` runs the same server under nodemon, restarting it when a file in `backend/` changes. The watcher is scoped to `backend/` on purpose: because submitted artwork is held in memory, an unnecessary restart would wipe anything submitted during testing.

> **Opening the HTML files directly from disk will not work.** `file://` has no server to answer `/api/artworks`, so the Gallery and Events pages come up empty and Submit cannot upload. Use `npm start`.

## Backend / API

All API responses are JSON. Successful responses carry `success: true`; failures carry `success: false` plus either a `message` or a per-field `errors` object.

| Method | Path | Request | Success | Failure |
|---|---|---|---|---|
| `GET` | `/api/artworks` | optional `?category=Painting\|Sculpture\|Photography\|Print` | `200` `{ success, count, artworks: [...] }` | — |
| `GET` | `/api/artworks/:id` | — | `200` `{ success, artwork }` | `404` `{ success, message }` |
| `POST` | `/api/artworks` | `multipart/form-data` (see below) | `201` `{ success, message, artwork }` | `400` `{ success, errors }` |
| `GET` | `/api/events` | optional `?category=Talks\|Openings\|Evenings` | `200` `{ success, count, events: [...] }` | — |
| `GET` | `/api/events/:id` | — | `200` `{ success, event }` | `404` `{ success, message }` |

Any unmatched path under `/api` returns `404` with a JSON message. Requests outside `/api` fall through to the static file server, so a missing page still returns an ordinary HTML 404 rather than JSON.

### `POST /api/artworks`

Content type must be `multipart/form-data`. When posting from the browser, do **not** set the `Content-Type` header by hand — the browser has to set it itself so the multipart boundary is included.

| Field | Required | Notes |
|---|---|---|
| `artistName` | yes | stored on the record as `artist` |
| `email` | yes | must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `title` | yes | |
| `category` | yes | must be exactly one of `Painting`, `Sculpture`, `Photography`, `Print` |
| `description` | yes | |
| `medium` | no | free text; shown in the artwork detail modal when supplied |
| `price` | no | a number, optionally `$`-prefixed (`450`, `$450`, `450.50`), or `Not for sale`. Blank defaults to `Not for sale`. Stored in the same form as the seeded works, so `250` is saved as `$250` and `4200` as `$4,200` rather than sitting in the grid as a bare number |
| `image` | yes | the image file. The field name must be exactly `image` |

Uploads must be `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.avif` and under 5MB. The check is on the file extension rather than the browser-reported MIME type, because the extension is what decides the `Content-Type` the file is later served with. SVG is deliberately excluded: it is XML that can carry a `<script>` tag, and uploads are served from the site's own origin.

Example:

```bash
curl -X POST http://localhost:3000/api/artworks \
  -F "artistName=Cirilo Perez" \
  -F "email=cperez60@uh.edu" \
  -F "title=Harbour Lane at Dusk" \
  -F "category=Photography" \
  -F "medium=Digital photograph" \
  -F "price=250" \
  -F "description=A long exposure of the harbour at last light." \
  -F "image=@/path/to/photo.jpg"
```

A rejected submission returns every failed field at once, keyed by field name, which is what lets the Submit page put each message under its own input:

```json
{
  "success": false,
  "errors": {
    "email": "Enter a valid email address.",
    "image": "Please attach an image of your work."
  }
}
```

Saved images are written to `backend/uploads/` as `<timestamp>-<sanitized-filename>` and served at `/uploads/<filename>`. The timestamp prefix keeps two uploads of the same name from overwriting each other. Every path the API returns is root-relative (`/images/...`, `/uploads/...`) rather than page-relative, so the same record renders correctly from `/index.html` and from `/pages/Gallery.html`, which sit at different directory depths.

## Known Limitations

These are deliberate scope decisions for a course project, not oversights:

- **Storage is in memory.** Restarting the server resets the collection to the 9 seeded works and 6 seeded events. Anything submitted in the meantime is gone, though its uploaded image file stays on disk in `backend/uploads/`. (Images from submissions that *fail* validation are cleaned up immediately.)
- **No approval queue.** A submitted work appears in the gallery straight away. There is no admin interface, so adding a review step would mean submissions disappearing with no way to approve them.
- **No database and no authentication.** Nothing distinguishes one visitor from another.
- **HEIC images are not accepted.** iPhones shoot HEIC by default, and the site has no HEIC handling anywhere — no conversion step and no `<picture>` fallback — so it is treated like any other unsupported format and rejected with a clear message. The file picker on the Submit page is limited to the accepted formats to catch this before a round trip.
- **Events are read-only.** They are fixed in `backend/data/events.js`; there is no form or endpoint for creating one.

## Usage

- Use the top navigation (or footer links) to move between Home, Gallery, Events, Submit, About, FAQ, and References.
- On the **Gallery** and **Events** pages, use the pill filters and the "Sort" dropdown to narrow and reorder results; click any card to open its detail modal. Close a modal by clicking its Close button, clicking outside it, or pressing **Esc**.
- On the **Submit** page, try leaving a required field blank, entering an invalid email, or a non-numeric price — inline validation messages appear and the form won't send until everything is valid. Submitting a complete form with an image uploads it and shows a confirmation; the new piece then appears on the Gallery page and in the homepage's gallery screen. To see the server-side validation on its own, `curl` the endpoint directly with a bad field (see [Backend / API](#backend--api)).
- On the **FAQ** page, click any question to expand or collapse its answer.

## Live Site

- **Repository:** https://github.com/spideysnp/perez-cirilo-cis2336-project
- **GitHub Pages:** https://spideysnp.github.io/perez-cirilo-cis2336-project/

GitHub Pages serves static files only, so it hosts the site's design and its static pages — it cannot run the Express server. On Pages, the Gallery and Events pages have no API to fetch from and the Submit form has nowhere to upload to. The full experience runs locally via `npm start`.

## Roadmap

- [x] Node.js/Express backend to handle `GET`/`POST` requests for artwork submissions
- [x] Temporary in-memory storage (array/object) for submitted artwork on the server
- [x] Confirmation response returned to the Submit form after a successful POST
- [x] Real image upload with server-side file-type and size validation
- [ ] Persistent storage so submissions survive a restart
- [ ] An approval step before submitted work appears publicly
- [ ] Optional: a simple discussion/forum page for visitor comments

## Credits & References

- Artwork imagery and cataloguing referenced from the [Rijksmuseum](https://www.rijksmuseum.nl/) public-domain collection.
- Design direction informed by Rijksmuseum, the Baltic Centre for Contemporary Art, and Dverso (layout density and lighting treatment).
- Full AI prompt log and additional sourcing available on the [References page](./frontend/pages/References.html).

## Developer Contact

**Cirilo Perez**
📧 [cperez60@uh.edu](mailto:cperez60@uh.edu)

## License

This project was built for coursework in CIS 2336 at the University of Houston and is not currently licensed for reuse or redistribution.
