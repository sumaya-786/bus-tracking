// routes/subscriptionRoutes.js
const express = require("express");
const Subscription = require("../models/subscription");
const router = express.Router();

// POST /api/subscribe
router.post("/", async (req, res) => {
  try {
    const { phone, busId, stopName } = req.body;

    if (!phone || !busId || !stopName) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const sub = await Subscription.create({ phone, busId, stopName });
    res.json({ success: true, sub });
  } catch (err) {
    console.error("❌ Error in subscribe:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
