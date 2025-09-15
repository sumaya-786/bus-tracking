const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  busId: { type: String, required: true }, // bus ID
  routeNo: { type: Number, required: true }, // which route
  stopId: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" }, // optional (next stop)
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speed: { type: Number, default: 0 }, // m/s or km/h
  distanceRemaining: { type: Number, default: 0 }, // meters to next stop
  etaSeconds: { type: Number, default: 0 }, // ETA in seconds
  activeBusesOnRoute: { type: Number, default: 0 }, // current density
  weather: { type: String, default: "clear" }, // clear, rain, fog etc
  timestamp: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
