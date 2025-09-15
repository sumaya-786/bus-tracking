const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bus = require("./models/bus");
const Stop = require("./models/stop");
const Location = require("./models/location");

dotenv.config();

const STEP_INTERVAL = 1000; // 1 second per simulation step
const STEPS_PER_SEGMENT = 15; // number of steps between stops

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Realistic Simulation"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

/**
 * Linear interpolation with jitter
 */
function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  let lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  let lon = lon1 + ((lon2 - lon1) / totalSteps) * step;
  lat += 0.00005 * (Math.random() - 0.5);
  lon += 0.00005 * (Math.random() - 0.5);
  return { lat, lon };
}

/**
 * Haversine distance in meters
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Traffic schedule (time-based speed factor)
const TRAFFIC_SCHEDULE = [
  { start: 7, end: 10, factor: 0.5 }, // Morning peak
  { start: 17, end: 20, factor: 0.5 }, // Evening peak
  { start: 0, end: 6, factor: 0.9 }, // Late night
  { start: 10, end: 17, factor: 0.8 }, // Daytime
  { start: 20, end: 24, factor: 0.8 }, // Night
];

function getTimeTrafficFactor() {
  const hour = new Date().getHours();
  const schedule = TRAFFIC_SCHEDULE.find(
    (s) => hour >= s.start && hour < s.end
  );
  return schedule ? schedule.factor : 1;
}

/**
 * Move one bus independently with dynamic speed
 */
async function moveBusRealistic(bus) {
  const stops = await Stop.find({ routeNo: bus.routeNo }).sort({ stopNo: 1 });
  if (!stops.length)
    return console.log(`❌ No stops found for bus ${bus.busId}`);

  let segment = 0;
  let step = 0;
  let currentSpeed = 0;

  const MAX_SPEED = 10 + Math.random() * 2; // m/s
  const ACCELERATION = 0.5 + Math.random() * 0.3;

  setInterval(async () => {
    const currentStop = stops[segment];
    const nextStop = stops[(segment + 1) % stops.length];

    // Interpolate position
    const { lat, lon } = interpolate(
      currentStop.latitude,
      currentStop.longitude,
      nextStop.latitude,
      nextStop.longitude,
      step,
      STEPS_PER_SEGMENT
    );

    // Distance to next stop
    const distanceRemaining = getDistance(
      lat,
      lon,
      nextStop.latitude,
      nextStop.longitude
    );

    // Previous position to calculate real speed per step
    const prevPos =
      step === 0
        ? { lat: currentStop.latitude, lon: currentStop.longitude }
        : interpolate(
            currentStop.latitude,
            currentStop.longitude,
            nextStop.latitude,
            nextStop.longitude,
            step - 1,
            STEPS_PER_SEGMENT
          );

    let stepDistance = getDistance(prevPos.lat, prevPos.lon, lat, lon);

    // Dynamic speed with acceleration/deceleration
    let targetSpeed = Math.min(
      MAX_SPEED,
      stepDistance / (STEP_INTERVAL / 1000)
    );
    targetSpeed *= getTimeTrafficFactor();

    // Weather effect
    const weather = Math.random() < 0.1 ? "rain" : "clear";
    if (weather === "rain") targetSpeed *= 0.7;

    // Random fluctuation
    targetSpeed *= 0.85 + Math.random() * 0.3;

    // Smooth acceleration/deceleration
    if (currentSpeed < targetSpeed) {
      currentSpeed = Math.min(currentSpeed + ACCELERATION, targetSpeed);
    } else if (currentSpeed > targetSpeed) {
      currentSpeed = Math.max(currentSpeed - ACCELERATION, targetSpeed);
    }

    // Stop dwell time at first step of segment
    if (step === 0 && Math.random() < 0.3) {
      const dwell = 2 + Math.random() * 5; // 2–7s
      await new Promise((r) => setTimeout(r, dwell * 1000));
    }

    // ETA calculation
    const etaSeconds = distanceRemaining / (currentSpeed || 1);

    // Count buses on route
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
      speed: currentSpeed,
      distanceRemaining,
      etaSeconds,
      activeBusesOnRoute,
      weather,
      timestamp: new Date(),
    });

    await location.save();

    console.log(
      `🚌 Bus ${bus.busId} → ${lat.toFixed(5)}, ${lon.toFixed(
        5
      )} | ETA: ${etaSeconds.toFixed(1)}s | Speed: ${currentSpeed.toFixed(
        1
      )} m/s | Weather: ${weather}`
    );

    step++;
    if (step > STEPS_PER_SEGMENT) {
      step = 0;
      segment = (segment + 1) % stops.length;
    }
  }, STEP_INTERVAL);
}

/**
 * Start simulation for all buses
 */
async function startSimulation() {
  const buses = await Bus.find();
  if (!buses.length) return console.log("❌ No buses found to simulate");

  buses.forEach((bus) => {
    const delay = Math.floor(Math.random() * 20000); // 0–20s stagger
    setTimeout(() => moveBusRealistic(bus), delay);
  });
}

startSimulation();
