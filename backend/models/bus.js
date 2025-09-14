const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: String,
  routeNo: Number,
  driverName: String
});

module.exports = mongoose.models.Bus || mongoose.model('Bus', busSchema);
