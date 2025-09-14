const express = require('express');
const Location = require('../models/location');
const router = express.Router();

// Update bus location
router.post('/:busId', async (req, res) => {
  try {
    const location = new Location({
      busId: req.params.busId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      timestamp: new Date()
    });
    await location.save();
    res.json({ message: 'Location updated', location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get latest location
router.get('/:busId', async (req, res) => {
  try {
    const location = await Location.findOne({ busId: req.params.busId }).sort({ timestamp: -1 });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
