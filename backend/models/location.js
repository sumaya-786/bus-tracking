const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  busId: { type: String, required: true },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  }, // reference route
  stopId: { type: mongoose.Schema.Types.ObjectId }, // optional, next stop
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  distanceRemaining: { type: Number, default: 0 },
  etaSeconds: { type: Number, default: 0 },
  activeBusesOnRoute: { type: Number, default: 0 },
  weather: { type: String, default: "clear" },
  timestamp: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
