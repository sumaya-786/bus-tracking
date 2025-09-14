const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import each model directly
const Bus = require('./models/bus');
const Stop = require('./models/stop');
const Location = require('./models/location');

dotenv.config();

const INTERVAL = 5000; // 5 seconds per stop

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Simulation'))
  .catch(err => console.error('❌ MongoDB Connection Failed:', err.message));

async function simulateBus(bus) {
  const stops = await Stop.find({ routeNo: bus.routeNo }).sort({ stopNo: 1 });
  if (!stops.length) return console.log(`No stops found for bus ${bus.busId}`);

  let index = 0;

  setInterval(async () => {
    const stop = stops[index];

    const location = new Location({
      busId: bus.busId,
      latitude: stop.latitude,
      longitude: stop.longitude,
      timestamp: new Date()
    });
    await location.save();

    console.log(`Bus ${bus.busId} moved to ${stop.stopName}`);

    index = (index + 1) % stops.length; // loop back to first stop
  }, INTERVAL);
}

async function startSimulation() {
  const buses = await Bus.find();
  if (!buses.length) return console.log('No buses found to simulate');

  buses.forEach(bus => simulateBus(bus));
}

startSimulation();
