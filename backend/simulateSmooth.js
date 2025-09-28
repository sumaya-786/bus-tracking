const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bus = require("./models/bus");
const Route = require("./models/route");
const Location = require("./models/location");
const Stop = require("./models/stop");
const axios = require("axios"); // for sending updates to backend

dotenv.config();

const STEP_INTERVAL = 1000; // 1 second per simulation step
const STEPS_PER_SEGMENT = 15; // 15 steps between stops
const MIN_SPEED = 5; // m/s

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Realistic Simulation"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

/** Linear interpolation with jitter */
function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  let lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  let lon = lon1 + ((lon2 - lon1) / totalSteps) * step;

  // Add jitter for realism
  lat += 0.00005 * (Math.random() - 0.5);
  lon += 0.00005 * (Math.random() - 0.5);

  return { lat, lon };
}

/** Haversine distance in meters */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Simulation Loop */
async function simulateBus(bus, route) {
  for (let i = 0; i < route.stops.length - 1; i++) {
    const currentStop = await Stop.findById(route.stops[i]);
    const nextStop = await Stop.findById(route.stops[i + 1]);

    const totalSteps = STEPS_PER_SEGMENT;
    for (let step = 0; step <= totalSteps; step++) {
      const { lat, lon } = interpolate(
        currentStop.latitude,
        currentStop.longitude,
        nextStop.latitude,
        nextStop.longitude,
        step,
        totalSteps
      );

      const distanceRemaining = getDistance(
        lat,
        lon,
        nextStop.latitude,
        nextStop.longitude
      );

      const currentSpeed = MIN_SPEED + Math.random() * 10; // 5–15 m/s
      const etaSeconds = Math.floor(distanceRemaining / currentSpeed);

      // ✅ Count unique active buses on same route in last 2 min
      const TWO_MINUTES = 2 * 60 * 1000;
      const now = new Date();
      const activeBusesOnRoute = await Location.distinct("busId", {
        routeId: bus.routeId,
        timestamp: { $gte: new Date(now - TWO_MINUTES) },
      }).then((ids) => ids.length);

      // Save location to MongoDB
      await Location.create({
        busId: bus.busId,
        routeId: bus.routeId,
        routeNo: route.routeNo,
        variantId: route.variant,
        stopId: nextStop._id,
        latitude: lat,
        longitude: lon,
        speed: currentSpeed,
        distanceRemaining,
        etaSeconds,
        activeBusesOnRoute,
        weather,
        timestamp: new Date(),
      });

      // ✅ Send to backend (with busId + routeNo)
      try {
        const response = await axios.post(
          `http://localhost:5000/api/locations/${bus.busId}`,
          {
            busId: bus.busId, // ✅ now included
            routeNo: bus.routeNo, // ✅ required by schema
            latitude: lat,
            longitude: lon,
            speed: currentSpeed,
            stopName: nextStop.stopName,
            etaSeconds,
          }
        );
        console.log("✅ Sent update to server:", response.data);
      } catch (err) {
        console.error(
          "❌ Failed to send update:",
          err.response?.data || err.message
        );
      }

      // Add random delay
      const delay = Math.floor(Math.random() * 2000); // small stagger
      await new Promise((res) => setTimeout(res, STEP_INTERVAL + delay));
    }
  }
}

module.exports = simulateBus;
