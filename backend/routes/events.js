/* ArtConnect — /api/events routes. Read-only. */

const express = require("express");
const controller = require("../controllers/eventsController");

const router = express.Router();

router.get("/", controller.listEvents);
router.get("/:id", controller.getEvent);

module.exports = router;
