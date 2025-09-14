const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  routeNo: Number,
  stopNo: Number,
  stopName: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.models.Stop || mongoose.model('Stop', stopSchema);
