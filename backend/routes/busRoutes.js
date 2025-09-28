const express = require('express');
const Bus = require('../models/bus');
const router = express.Router();

// Add a bus
router.post('/', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.json({ message: 'Bus added', bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
