const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/bus');
const Stop = require('./models/stop');
const Location = require('./models/location');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // --- Clear existing data ---
    await Bus.deleteMany({});
    await Stop.deleteMany({});
    await Location.deleteMany({});

    // --- Add buses ---
    const buses = await Bus.insertMany([
      { busId: 'BUS101', routeNo: 14, driverName: 'John Doe' },
      { busId: 'BUS102', routeNo: 14, driverName: 'Jane Doe' }
    ]);

    // --- Add stops ---
    const stops = await Stop.insertMany([
      { routeNo: 14, stopNo: 1, stopName: 'Penamaluru Center', latitude: 16.511, longitude: 80.7464 },
      { routeNo: 14, stopNo: 2, stopName: 'Sitapuram Colony', latitude: 16.4759, longitude: 80.6966 },
      { routeNo: 14, stopNo: 3, stopName: 'Poranki Center', latitude: 16.4762, longitude: 80.7067 },
      { routeNo: 14, stopNo: 4, stopName: 'Capital Hospital', latitude: 16.489, longitude: 80.705 }
    ]);

    // --- Add initial locations (optional) ---
    const initialLocations = buses.map(bus => ({
      busId: bus.busId,
      latitude: stops[0].latitude,
      longitude: stops[0].longitude
    }));
    await Location.insertMany(initialLocations);

    console.log('✅ Seed Data Inserted Successfully');
    mongoose.connection.close();
  })
  .catch(err => console.log('❌ Error:', err));
