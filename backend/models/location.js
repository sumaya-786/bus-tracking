const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  busId: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);
