const Location = require("../models/location");

// Update bus location (extended version)
exports.updateLocation = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      routeNo,
      stopId,
      speed,
      distanceRemaining,
      etaSeconds,
      activeBusesOnRoute,
      weather,
    } = req.body;

    const location = new Location({
      busId: req.params.busId,
      routeNo,
      stopId: stopId || null,
      latitude,
      longitude,
      speed: speed || 0,
      distanceRemaining: distanceRemaining || 0,
      etaSeconds: etaSeconds || 0,
      activeBusesOnRoute: activeBusesOnRoute || 0,
      weather: weather || "clear",
    });

    await location.save();
    res.json({ message: "✅ Location updated", location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get latest bus location
exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ busId: req.params.busId }).sort({
      timestamp: -1,
    });
    if (!location)
      return res.status(404).json({ message: "No location found" });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
