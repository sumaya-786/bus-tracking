// models/route.js
const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  routeNo: Number, // e.g. 15
  variant: String, // e.g. "A", "B"
  startPoint: String,
  endPoint: String,
  stops: [
    {
      stopNo: Number,
      stopName: String,
      latitude: Number,
      longitude: Number,
      order: Number, // order of the stop
    },
  ],
  totalDistance: Number, // optional
  expectedDuration: Number, // optional
});

module.exports = mongoose.models.Route || mongoose.model("Route", routeSchema);
