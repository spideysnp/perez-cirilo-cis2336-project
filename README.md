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
- [Usage](#usage)
- [Live Site](#live-site)
- [Roadmap](#roadmap)
- [Credits & References](#credits--references)
- [Developer Contact](#developer-contact)
- [License](#license)

---

## Description

ArtConnect is a concept online platform for a local art gallery. Visitors can browse a curated collection of artwork, discover upcoming events and workshops, and artists can submit their own pieces for review. The goal was to design something that felt like an actual gallery — moody lighting, gallery-at-night visuals, and typography drawn from fine-art print — rather than a generic template site.

This phase of the project covers the **front end**: static pages built with HTML, CSS, and JavaScript, with client-side interactivity (filtering, sorting, modals, form validation, an FAQ accordion) and no server dependency yet. A **Node.js/Express backend** to handle real artwork submissions is planned for a later phase (see [Roadmap](#roadmap)).

Some of the front-end scaffolding for this project was originally generated with an AI design tool and then hand-corrected (broken navigation links, missing script paths, image wiring, and a full CSS refactor). Every AI prompt used during development is logged transparently on the [References page](./frontend/pages/References.html), per course policy.

## Features

- **Homepage** — hero artwork spotlight, featured works, upcoming events preview, and developer contact info.
- **Gallery** — 9 artworks with image, title, artist, category, and price (or "Not for sale"); filter by category, sort by date, and click any piece to open a detail modal.
- **Events** — 6 upcoming events with image, date, location, and description; filter by type, sort by date, and click to view full details in a modal.
- **Submit Artwork** — a form for artists to submit new work (name, email, title, category, price, description) with client-side validation: required fields, email format, and numeric price checks with inline error messages.
- **FAQ** — 6 expandable/collapsible questions for quick support answers.
- **References** — image/content sources, design inspiration, and a full log of AI prompts used during development.
- Consistent navigation and footer across every page, responsive layout, and a shared dark theme with CSS variables for accent color and lighting.

## Tech Stack

- **HTML5** — semantic page structure
- **CSS3** — external stylesheets (`frontend/css/`), CSS variables, Flexbox/Grid, transitions & animations, media-query-ready layout
- **JavaScript (vanilla, no frameworks)** — one small script per page (`frontend/js/`) driving filtering, sorting, modals, form validation, and the FAQ accordion
- **Node.js / Express** — planned for the backend phase (artwork submission storage + API)

## Project Structure

```
perez-cirilo-cis2336-project/
│
├── frontend/
│   ├── index.html            # Homepage
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
│   │   ├── index.js          # Homepage: modals + gallery filter/sort
│   │   ├── gallery.js        # Gallery: filter, sort, artwork modal
│   │   ├── events.js         # Events: filter, sort, event modal
│   │   ├── submit.js         # Submit: client-side form validation
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
├── backend/                   # Reserved for the Node/Express phase
│
└── README.md
```

## Getting Started

This phase of the project is entirely static — no build step or server is required to view it.

**Option 1: Open directly**
1. Clone the repo:
   ```bash
   git clone https://github.com/spideysnp/perez-cirilo-cis2336-project.git
   cd perez-cirilo-cis2336-project
   ```
2. Open `frontend/index.html` in your browser.

**Option 2: Run a local server (recommended)**

Some browsers restrict certain features when opening HTML files directly via `file://`. A quick local server avoids that:

```bash
cd perez-cirilo-cis2336-project/frontend
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Usage

- Use the top navigation (or footer links) to move between Home, Gallery, Events, Submit, About, FAQ, and References.
- On the **Gallery** and **Events** pages, use the pill filters and the "Sort" dropdown to narrow and reorder results; click any card to open its detail modal.
- On the **Submit** page, try leaving a required field blank, entering an invalid email, or a non-numeric price — inline validation messages will appear, and the form won't submit until everything is valid.
- On the **FAQ** page, click any question to expand or collapse its answer.

## Live Site

- **Repository:** https://github.com/spideysnp/perez-cirilo-cis2336-project
- **GitHub Pages:** https://spideysnp.github.io/perez-cirilo-cis2336-project/ *(publish via Settings → Pages once ready)*

## Roadmap

- [ ] Node.js/Express backend to handle `GET`/`POST` requests for artwork submissions
- [ ] Temporary in-memory storage (array/object) for submitted artwork on the server
- [ ] Confirmation response returned to the Submit form after a successful POST
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
