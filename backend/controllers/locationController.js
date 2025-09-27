const Location = require("../models/location");
const Subscription = require("../models/subscription");
const { sendSMS } = require("../utils/sms");

// Save or update bus location
exports.updateLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const { latitude, longitude, speed, stopName, etaSeconds, routeNo } = req.body;

    console.log("📡 Incoming update:", {
      busId,
      routeNo,   // ✅ log routeNo
      latitude,
      longitude,
      stopName,
      etaSeconds,
    });

    // Save new location in DB
    const location = new Location({
      busId,
      routeNo,   // ✅ must be saved
      latitude,
      longitude,
      speed,
      stopName,
      etaSeconds,
      timestamp: new Date(),
    });

    await location.save();

    // Calculate ETA in minutes
    const etaMinutes = (etaSeconds / 60).toFixed(1);
    console.log(
      `📡 ETA Debug: Bus ${busId} ETA = ${etaMinutes} minutes at stop ${stopName}`
    );

    // Find matching subscriptions
    const subs = await Subscription.find({ busId, stopName });
    console.log(`📡 Found ${subs.length} subscriptions for stop ${stopName}`);

    // Notify subscribers
    for (let sub of subs) {
      console.log(`➡️ Checking subscription for ${sub.phone}`);

      if (!sub.notified10 && etaSeconds <= 600) {
        try {
          await sendSMS(
            sub.phone,
            `🚍 Bus ${sub.busId} is ~10 minutes away from ${sub.stopName}.`
          );
          sub.notified10 = true;
          await sub.save();
        } catch (err) {
          console.error("❌ SMS Error:", err.message);
        }
      }

      if (!sub.notified5 && etaSeconds <= 300) {
        try {
          await sendSMS(
            sub.phone,
            `🚍 Bus ${sub.busId} is ~5 minutes away from ${sub.stopName}. Get ready!`
          );
          sub.notified5 = true;
          await sub.save();
        } catch (err) {
          console.error("❌ SMS Error:", err.message);
        }
      }
    }

    res.json({ success: true, location });
  } catch (err) {
    console.error("❌ Location update error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get last location of a bus
exports.getLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const location = await Location.findOne({ busId }).sort({ timestamp: -1 });

    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found" });
    }

    res.json({ success: true, location });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
