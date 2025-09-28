// models/bus.js
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busId: String,
  driverName: String,
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route", // 🔗 reference to the Route collection
    required: true,
  },
});

module.exports = mongoose.models.Bus || mongoose.model("Bus", busSchema);
