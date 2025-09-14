const express = require('express');
const { Stop } = require('../models/stop');
const router = express.Router();

router.get('/:routeNo', async (req, res) => {
  try {
    const stops = await Stop.find({ routeNo: req.params.routeNo });
    res.json(stops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
