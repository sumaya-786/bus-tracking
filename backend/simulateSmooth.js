const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bus = require("./models/bus");
const Route = require("./models/route");
const Location = require("./models/location");

dotenv.config();

const STEP_INTERVAL = 1000; // 1 second per simulation step
const STEPS_PER_SEGMENT = 15; // steps between stops
const MIN_SPEED = 5; // m/s

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Realistic Simulation"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

/** Linear interpolation with jitter */
function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  let lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  let lon = lon1 + ((lon2 - lon1) / totalSteps) * step;
  lat += 0.00005 * (Math.random() - 0.5);
  lon += 0.00005 * (Math.random() - 0.5);
  return { lat, lon };
}

/** Haversine distance in meters */
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

/** Traffic schedule */
const TRAFFIC_SCHEDULE = [
  { start: 7, end: 10, factor: 0.5 },
  { start: 17, end: 20, factor: 0.5 },
  { start: 0, end: 6, factor: 0.9 },
  { start: 10, end: 17, factor: 0.8 },
  { start: 20, end: 24, factor: 0.8 },
];

function getTimeTrafficFactor() {
  const hour = new Date().getHours();
  const schedule = TRAFFIC_SCHEDULE.find(
    (s) => hour >= s.start && hour < s.end
  );
  return schedule ? schedule.factor : 1;
}

/** Move a bus along its route realistically */
async function moveBusRealistic(bus) {
  const route = await Route.findById(bus.routeId);
  if (!route) return console.log(`❌ No route found for bus ${bus.busId}`);

  const stops = route.stops.sort((a, b) => a.order - b.order);
  if (!stops.length)
    return console.log(`❌ No stops in route for bus ${bus.busId}`);

  let segment = 0;
  let step = 0;
  let currentSpeed = 0;
  const MAX_SPEED = 10 + Math.random() * 2;
  const ACCELERATION = 0.5 + Math.random() * 0.3;

  setInterval(async () => {
    const currentStop = stops[segment];
    const nextStop = stops[(segment + 1) % stops.length];

    const { lat, lon } = interpolate(
      currentStop.latitude,
      currentStop.longitude,
      nextStop.latitude,
      nextStop.longitude,
      step,
      STEPS_PER_SEGMENT
    );

    const distanceRemaining = getDistance(
      lat,
      lon,
      nextStop.latitude,
      nextStop.longitude
    );

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

    const stepDistance = getDistance(prevPos.lat, prevPos.lon, lat, lon);

    // Dynamic speed
    let targetSpeed = Math.min(
      MAX_SPEED,
      stepDistance / (STEP_INTERVAL / 1000)
    );
    targetSpeed *= getTimeTrafficFactor();

    // Weather effect
    const weather = Math.random() < 0.1 ? "rain" : "clear";
    if (weather === "rain") targetSpeed *= 0.7;
    targetSpeed *= 0.85 + Math.random() * 0.3;

    // Smooth acceleration
    if (currentSpeed < targetSpeed)
      currentSpeed = Math.min(currentSpeed + ACCELERATION, targetSpeed);
    else if (currentSpeed > targetSpeed)
      currentSpeed = Math.max(currentSpeed - ACCELERATION, targetSpeed);

    if (currentSpeed < MIN_SPEED && step !== 0) currentSpeed = MIN_SPEED;

    // Dwell time at stop
    if (step === 0) {
      const dwell = 5 + Math.random() * 5;
      await new Promise((r) => setTimeout(r, dwell * 1000));
    }

    const etaSeconds = distanceRemaining / (currentSpeed || 1);

    // ✅ Count unique active buses on same route in last 2 min
    const TWO_MINUTES = 2 * 60 * 1000;
    const now = new Date();
    const activeBusesOnRoute = await Location.distinct("busId", {
      routeId: bus.routeId,
      timestamp: { $gte: new Date(now - TWO_MINUTES) },
    }).then((ids) => ids.length);

    // Save location
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

    console.log(
      `🚌 ${bus.busId} → ${lat.toFixed(5)}, ${lon.toFixed(
        5
      )} | ETA: ${etaSeconds.toFixed(1)}s | Speed: ${currentSpeed.toFixed(
        1
      )} m/s | Weather: ${weather} | ActiveBusesOnRoute: ${activeBusesOnRoute}`
    );

    step++;
    if (step > STEPS_PER_SEGMENT) {
      step = 0;
      segment = (segment + 1) % stops.length;
    }
  }, STEP_INTERVAL);
}

/** Seed initial locations for all buses so activeBusesOnRoute starts >0 */
async function seedInitialLocations() {
  const buses = await Bus.find();
  for (const bus of buses) {
    const route = await Route.findById(bus.routeId);
    const firstStop = route.stops[0];
    await Location.create({
      busId: bus.busId,
      routeId: bus.routeId,
      routeNo: route.routeNo,
      variantId: route.variant,
      stopId: firstStop._id,
      latitude: firstStop.latitude,
      longitude: firstStop.longitude,
      speed: 0,
      distanceRemaining: 0,
      etaSeconds: 0,
      activeBusesOnRoute: 1,
      weather: "clear",
      timestamp: new Date(),
    });
  }
}

/** Start simulation for all buses */
async function startSimulation() {
  await seedInitialLocations();

  const buses = await Bus.find();
  if (!buses.length) return console.log("❌ No buses found to simulate");

  buses.forEach((bus) => {
    const delay = Math.floor(Math.random() * 2000);
    setTimeout(() => moveBusRealistic(bus), delay);
  });
}

startSimulation();
