/**
 * export_training_data.js
 *
 * Generates two CSVs:
 *   - eta_dataset.csv
 *   - density_dataset.csv
 *
 * Usage:
 *   npm install csv-writer
 *   node export_training_data.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Location = require("./models/location");

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const docs = await Location.find({}).sort({ timestamp: 1 }).lean();
  if (!docs.length) {
    console.log("❌ No location data found. Run simulator first.");
    process.exit(0);
  }

  const minTime = new Date(docs[0].timestamp).getTime();

  // --- ETA DATASET ---
  const etaRows = docs.map((d) => {
    const ts = new Date(d.timestamp);
    const timeIdx = Math.floor((ts.getTime() - minTime) / (60 * 1000)); // per minute index
    const hour = ts.getHours() + ts.getMinutes() / 60;
    const timeSin = Math.sin((2 * Math.PI * hour) / 24);
    const timeCos = Math.cos((2 * Math.PI * hour) / 24);

    return {
      time_idx: timeIdx,
      timestamp: ts.toISOString(),
      bus_id: d.busId,
      route_no: d.routeNo,
      stop_id: d.stopId || "",
      latitude: d.latitude,
      longitude: d.longitude,
      speed: d.speed || 0,
      distance_remaining: d.distanceRemaining || 0,
      eta_minutes: d.etaSeconds ? d.etaSeconds / 60 : null, // target
      active_buses_on_route: d.activeBusesOnRoute || 0,
      weather: d.weather || "clear",
      day_of_week: ts.getDay(),
      time_sin: timeSin,
      time_cos: timeCos,
    };
  });

  const etaWriter = createCsvWriter({
    path: "eta_dataset.csv",
    header: Object.keys(etaRows[0]).map((k) => ({ id: k, title: k })),
  });
  await etaWriter.writeRecords(etaRows);
  console.log("📁 Saved ETA dataset → eta_dataset.csv");

  // --- DENSITY DATASET ---
  // Aggregate by (routeNo, time bucket)
  const routeMap = new Map();

  for (const d of docs) {
    const ts = new Date(d.timestamp);
    const timeIdx = Math.floor((ts.getTime() - minTime) / (60 * 1000));
    const key = `${d.routeNo}_${timeIdx}`;
    const hour = ts.getHours() + ts.getMinutes() / 60;
    const timeSin = Math.sin((2 * Math.PI * hour) / 24);
    const timeCos = Math.cos((2 * Math.PI * hour) / 24);

    if (!routeMap.has(key)) {
      routeMap.set(key, {
        time_idx: timeIdx,
        timestamp: ts.toISOString(),
        route_no: d.routeNo,
        active_buses_on_route: d.activeBusesOnRoute || 0,
        weather: d.weather || "clear",
        day_of_week: ts.getDay(),
        time_sin: timeSin,
        time_cos: timeCos,
      });
    }
  }

  const densityRows = Array.from(routeMap.values());

  const densityWriter = createCsvWriter({
    path: "density_dataset.csv",
    header: Object.keys(densityRows[0]).map((k) => ({ id: k, title: k })),
  });
  await densityWriter.writeRecords(densityRows);
  console.log("📁 Saved Density dataset → density_dataset.csv");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Export failed:", err);
  process.exit(1);
});
