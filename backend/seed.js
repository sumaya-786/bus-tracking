// seeds.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Route = require("./models/route");
const Bus = require("./models/bus");
const Location = require("./models/location");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Location.deleteMany({});

    // -------------------------
    // ROUTES
    // -------------------------
    const route15A = await Route.create({
      routeNo: 15,
      variant: "A",
      startPoint: "IBRAHIMPATNAM",
      endPoint: "PORANKI",
      stops: [
        {
          stopNo: 1,
          stopName: "IBRAHIMPATNAM",
          latitude: 16.521,
          longitude: 80.611,
          order: 1,
        },
        {
          stopNo: 2,
          stopName: "SWATHI",
          latitude: 16.524,
          longitude: 80.619,
          order: 2,
        },
        {
          stopNo: 3,
          stopName: "KUMMARI PALEM",
          latitude: 16.529,
          longitude: 80.627,
          order: 3,
        },
        {
          stopNo: 4,
          stopName: "KR MARKET",
          latitude: 16.531,
          longitude: 80.635,
          order: 4,
        },
        {
          stopNo: 5,
          stopName: "RAILWAY STN",
          latitude: 16.541,
          longitude: 80.637,
          order: 5,
        },
        {
          stopNo: 6,
          stopName: "BENZ CIRCLE",
          latitude: 16.544,
          longitude: 80.648,
          order: 6,
        },
        {
          stopNo: 7,
          stopName: "PATAMATA",
          latitude: 16.547,
          longitude: 80.655,
          order: 7,
        },
        {
          stopNo: 8,
          stopName: "AUTONAGAR GATE",
          latitude: 16.553,
          longitude: 80.662,
          order: 8,
        },
        {
          stopNo: 9,
          stopName: "KAMAYYATHOPU",
          latitude: 16.559,
          longitude: 80.669,
          order: 9,
        },
        {
          stopNo: 10,
          stopName: "PORANKI",
          latitude: 16.563,
          longitude: 80.675,
          order: 10,
        },
      ],
      totalDistance: 25,
      expectedDuration: 60,
    });

    const route15B = await Route.create({
      routeNo: 15,
      variant: "B",
      startPoint: "IBRAHIMPATNAM",
      endPoint: "PORANKI",
      stops: [
        {
          stopNo: 1,
          stopName: "IBRAHIMPATNAM",
          latitude: 16.521,
          longitude: 80.611,
          order: 1,
        },
        {
          stopNo: 2,
          stopName: "SWATHI",
          latitude: 16.524,
          longitude: 80.619,
          order: 2,
        },
        {
          stopNo: 3,
          stopName: "KUMMARI PALEM",
          latitude: 16.529,
          longitude: 80.627,
          order: 3,
        },
        {
          stopNo: 4,
          stopName: "BUNDAR ROAD",
          latitude: 16.532,
          longitude: 80.641,
          order: 4,
        },
        {
          stopNo: 5,
          stopName: "IGMC STADIUM",
          latitude: 16.537,
          longitude: 80.645,
          order: 5,
        },
        {
          stopNo: 6,
          stopName: "BENZ CIRCLE",
          latitude: 16.544,
          longitude: 80.648,
          order: 6,
        },
        {
          stopNo: 7,
          stopName: "PATAMATA",
          latitude: 16.547,
          longitude: 80.655,
          order: 7,
        },
        {
          stopNo: 8,
          stopName: "AUTONAGAR GATE",
          latitude: 16.553,
          longitude: 80.662,
          order: 8,
        },
        {
          stopNo: 9,
          stopName: "KAMAYYATHOPU",
          latitude: 16.559,
          longitude: 80.669,
          order: 9,
        },
        {
          stopNo: 10,
          stopName: "PORANKI",
          latitude: 16.563,
          longitude: 80.675,
          order: 10,
        },
      ],
      totalDistance: 27,
      expectedDuration: 65,
    });

    const route1G = await Route.create({
      routeNo: 1,
      variant: "G",
      startPoint: "GOLLAPUDI",
      endPoint: "KANKIPADU",
      stops: [
        {
          stopNo: 1,
          stopName: "GOLLAPUDI",
          latitude: 16.534,
          longitude: 80.573,
          order: 1,
        },
        {
          stopNo: 2,
          stopName: "KUMMARI PALEM",
          latitude: 16.529,
          longitude: 80.627,
          order: 2,
        },
        {
          stopNo: 3,
          stopName: "KR MARKET",
          latitude: 16.531,
          longitude: 80.635,
          order: 3,
        },
        {
          stopNo: 4,
          stopName: "BENZ CIRCLE",
          latitude: 16.544,
          longitude: 80.648,
          order: 4,
        },
        {
          stopNo: 5,
          stopName: "PATAMATA",
          latitude: 16.547,
          longitude: 80.655,
          order: 5,
        },
        {
          stopNo: 6,
          stopName: "KANKIPADU",
          latitude: 16.489,
          longitude: 80.719,
          order: 6,
        },
      ],
      totalDistance: 22,
      expectedDuration: 55,
    });

    const route5A = await Route.create({
      routeNo: 5,
      variant: "A",
      startPoint: "AUTONAGAR",
      endPoint: "PENAMALURU",
      stops: [
        {
          stopNo: 1,
          stopName: "AUTONAGAR",
          latitude: 16.553,
          longitude: 80.662,
          order: 1,
        },
        {
          stopNo: 2,
          stopName: "PORANKI",
          latitude: 16.563,
          longitude: 80.675,
          order: 2,
        },
        {
          stopNo: 3,
          stopName: "PATAMATA",
          latitude: 16.547,
          longitude: 80.655,
          order: 3,
        },
        {
          stopNo: 4,
          stopName: "PENAMALURU",
          latitude: 16.497,
          longitude: 80.697,
          order: 4,
        },
      ],
      totalDistance: 18,
      expectedDuration: 40,
    });

    // -------------------------
    // BUSES
    // -------------------------
    const buses = await Bus.insertMany([
      { busId: "BUS201", routeId: route15A._id, driverName: "Ravi" },
      { busId: "BUS202", routeId: route15A._id, driverName: "Suresh" },
      { busId: "BUS203", routeId: route15B._id, driverName: "Anil" },
      { busId: "BUS204", routeId: route15B._id, driverName: "Kiran" },
      { busId: "BUS301", routeId: route1G._id, driverName: "Ramesh" },
      { busId: "BUS302", routeId: route1G._id, driverName: "Ajay" },
      { busId: "BUS401", routeId: route5A._id, driverName: "Naresh" },
      { busId: "BUS402", routeId: route5A._id, driverName: "Mahesh" },
    ]);

    // -------------------------
    // SEED INITIAL LOCATIONS
    // -------------------------
    for (const bus of buses) {
      const route = await Route.findById(bus.routeId);
      const firstStop = route.stops[0];

      // Count buses on same route
      const busesOnSameRoute = buses.filter(
        (b) => b.routeId.toString() === bus.routeId.toString()
      ).length;

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
        activeBusesOnRoute: busesOnSameRoute,
        weather: "clear",
        timestamp: new Date(),
      });
    }

    console.log(
      "✅ Database seeded successfully with Routes, Buses, and Locations"
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
