const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bus = require("./models/bus");
const Stop = require("./models/stop");
const Location = require("./models/location");

dotenv.config();

const STEP_INTERVAL = 1000; // 1 second per step
const STEPS_PER_SEGMENT = 15; // number of steps between stops

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Independent Simulation"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

/**
 * Linear interpolation between two coordinates
 */
function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  const lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  const lon = lon1 + ((lon2 - lon1) / totalSteps) * step;
  return { lat, lon };
}

/**
 * Calculate haversine distance between two coordinates (in meters)
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Move one bus independently
 */
async function moveBusIndependent(bus) {
  const stops = await Stop.find({ routeNo: bus.routeNo }).sort({ stopNo: 1 });
  if (!stops.length)
    return console.log(`❌ No stops found for bus ${bus.busId}`);

  let segment = 0;
  let step = 0;

  setInterval(async () => {
    const currentStop = stops[segment];
    const nextStop = stops[(segment + 1) % stops.length];

    // Interpolated position
    const { lat, lon } = interpolate(
      currentStop.latitude,
      currentStop.longitude,
      nextStop.latitude,
      nextStop.longitude,
      step,
      STEPS_PER_SEGMENT
    );

    // Calculate distance, speed, ETA
    const distanceRemaining = getDistance(
      lat,
      lon,
      nextStop.latitude,
      nextStop.longitude
    );
    const stepsLeft = Math.max(STEPS_PER_SEGMENT - step, 1);
    const speed = distanceRemaining / (stepsLeft * (STEP_INTERVAL / 1000)); // m/s
    const etaSeconds = distanceRemaining / (speed || 1);

    // Count buses on same route
    const activeBusesOnRoute = await Bus.countDocuments({
      routeNo: bus.routeNo,
    });

    // Save to MongoDB
    const location = new Location({
      busId: bus.busId,
      routeNo: bus.routeNo,
      stopId: nextStop._id,
      latitude: lat,
      longitude: lon,
      speed,
      distanceRemaining,
      etaSeconds,
      activeBusesOnRoute,
      weather: "clear",
      timestamp: new Date(),
    });

    await location.save();
    console.log(
      `🚌 [Independent] Bus ${bus.busId} → ${lat.toFixed(5)}, ${lon.toFixed(
        5
      )} | ETA: ${etaSeconds.toFixed(1)}s`
    );

    // Step forward
    step++;
    if (step > STEPS_PER_SEGMENT) {
      step = 0;
      segment = (segment + 1) % stops.length;
    }
  }, STEP_INTERVAL);
}

/**
 * Start all buses independently
 */
async function startIndependentSimulation() {
  const buses = await Bus.find();
  if (!buses.length) return console.log("❌ No buses found to simulate");

  buses.forEach((bus) => {
    const randomDelay = Math.floor(Math.random() * 20000); // 0–20s stagger
    setTimeout(() => moveBusIndependent(bus), randomDelay);
  });
}

startIndependentSimulation();
