const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Bus = require("./models/bus");
const Stop = require("./models/stop");
const Location = require("./models/location");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // --- Clear existing data ---
    await Bus.deleteMany({});
    await Stop.deleteMany({});
    await Location.deleteMany({});

    // --- Add Route 14 ---
    const buses14 = await Bus.insertMany([
      { busId: "BUS101", routeNo: 14, driverName: "John Doe" },
      { busId: "BUS102", routeNo: 14, driverName: "Jane Doe" },
    ]);

    const stops14 = await Stop.insertMany([
      {
        routeNo: 14,
        stopNo: 1,
        stopName: "Penamaluru Center",
        latitude: 16.511,
        longitude: 80.7464,
      },
      {
        routeNo: 14,
        stopNo: 2,
        stopName: "Sitapuram Colony",
        latitude: 16.4759,
        longitude: 80.6966,
      },
      {
        routeNo: 14,
        stopNo: 3,
        stopName: "Poranki Center",
        latitude: 16.4762,
        longitude: 80.7067,
      },
      {
        routeNo: 14,
        stopNo: 4,
        stopName: "Capital Hospital",
        latitude: 16.489,
        longitude: 80.705,
      },
    ]);

    // --- Add Route 15 ---
    const buses15 = await Bus.insertMany([
      { busId: "BUS201", routeNo: 15, driverName: "Ravi" },
      { busId: "BUS202", routeNo: 15, driverName: "Anil" },
    ]);

    const stops15 = await Stop.insertMany([
      {
        routeNo: 15,
        stopNo: 1,
        stopName: "Autonagar Gate",
        latitude: 16.499819,
        longitude: 80.6729,
      },
      {
        routeNo: 15,
        stopNo: 2,
        stopName: "NTR Circle",
        latitude: 16.4965,
        longitude: 80.6581,
      },
      {
        routeNo: 15,
        stopNo: 3,
        stopName: "Benz Circle",
        latitude: 16.4997,
        longitude: 80.6581,
      },
      {
        routeNo: 15,
        stopNo: 4,
        stopName: "VIT-AP",
        latitude: 16.5273,
        longitude: 80.6254,
      },
    ]);

    // --- Add Route 16 ---
    const buses16 = await Bus.insertMany([
      { busId: "BUS301", routeNo: 16, driverName: "Prasad" },
      { busId: "BUS302", routeNo: 16, driverName: "Latha" },
    ]);

    const stops16 = await Stop.insertMany([
      {
        routeNo: 16,
        stopNo: 1,
        stopName: "Ganavaram",
        latitude: 16.5385,
        longitude: 80.7771,
      },
      {
        routeNo: 16,
        stopNo: 2,
        stopName: "Ayush Hospital",
        latitude: 16.5177,
        longitude: 80.6762,
      },
      {
        routeNo: 16,
        stopNo: 3,
        stopName: "Benz Circle",
        latitude: 16.4997,
        longitude: 80.6581,
      },
      {
        routeNo: 16,
        stopNo: 4,
        stopName: "VIT-AP",
        latitude: 16.5273,
        longitude: 80.6254,
      },
    ]);

    // --- Add initial locations ---
    const allBuses = [...buses14, ...buses15, ...buses16];
    const allStops = [...stops14, ...stops15, ...stops16];

    const initialLocations = allBuses.map((bus) => {
      const firstStop = allStops.find(
        (s) => s.routeNo === bus.routeNo && s.stopNo === 1
      );
      return {
        busId: bus.busId,
        routeNo: bus.routeNo,
        stopId: firstStop._id,
        latitude: firstStop.latitude,
        longitude: firstStop.longitude,
      };
    });

    await Location.insertMany(initialLocations);

    console.log("✅ Seed Data Inserted Successfully");
    mongoose.connection.close();
  })
  .catch((err) => console.log("❌ Error:", err));
