const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/bus');
const Stop = require('./models/stop');
const Location = require('./models/location');

dotenv.config();

const STEP_INTERVAL = 1000; // 1 second per step
const STEPS_PER_SEGMENT = 20; // number of steps between stops

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Smooth Simulation'))
  .catch(err => console.error('❌ MongoDB Connection Failed:', err.message));

function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  const lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  const lon = lon1 + ((lon2 - lon1) / totalSteps) * step;
  return { lat, lon };
}

async function moveBusSmooth(bus) {
  const stops = await Stop.find({ routeNo: bus.routeNo }).sort({ stopNo: 1 });
  if (!stops.length) return console.log(`No stops for bus ${bus.busId}`);

  let segment = 0;
  let step = 0;

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

    // Update MongoDB location
    const location = new Location({
      busId: bus.busId,
      latitude: lat,
      longitude: lon,
      timestamp: new Date()
    });
    await location.save();

    console.log(`Bus ${bus.busId} moving: ${lat.toFixed(5)}, ${lon.toFixed(5)}`);

    step++;
    if (step > STEPS_PER_SEGMENT) {
      step = 0;
      segment = (segment + 1) % stops.length;
    }
  }, STEP_INTERVAL);
}

async function startSimulation() {
  const buses = await Bus.find();
  if (!buses.length) return console.log('No buses found to simulate');

  buses.forEach(bus => moveBusSmooth(bus));
}

startSimulation();
