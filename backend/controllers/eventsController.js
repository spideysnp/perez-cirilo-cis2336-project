/* ArtConnect — event request handlers.
   Read-only: events are fixed in data/events.js and cannot be created through
   the site, so there is no create handler here. */

const store = require("../data/events");

/* GET /api/events — every event, or one category of them */
function listEvents(req, res) {
  const events = store.getAllEvents(req.query.category);
  res.json({ success: true, count: events.length, events: events });
}

/* GET /api/events/:id */
function getEvent(req, res) {
  const event = store.getEventById(req.params.id);
  if (!event) {
    res.status(404).json({ success: false, message: "No event with that id." });
    return;
  }
  res.json({ success: true, event: event });
}

module.exports = { listEvents, getEvent };
