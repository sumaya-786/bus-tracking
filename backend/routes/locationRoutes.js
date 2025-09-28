const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// Update bus location (accepts lat/lon or full extended data)
router.post("/:busId", locationController.updateLocation);

// Get latest location for a bus
router.get("/:busId", locationController.getLocation);

module.exports = router;
