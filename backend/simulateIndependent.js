const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/bus');
const Stop = require('./models/stop');
const Location = require('./models/location');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected for Independent Simulation'))
  .catch(err => console.error('❌ MongoDB Connection Failed:', err.message));

function interpolate(lat1, lon1, lat2, lon2, step, totalSteps) {
  const lat = lat1 + ((lat2 - lat1) / totalSteps) * step;
  const lon = lon1 + ((lon2 - lon1) / totalSteps) * step;
  return { lat, lon };
}

async function moveBusIndependent(bus, startDelay = 0, stepInterval = 1000) {
  const stops = await Stop.find({ routeNo: bus.routeNo }).sort({ stopNo: 1 });
  if (!stops.length) return console.log(`No stops for bus ${bus.busId}`);

  let segment = Math.floor(Math.random() * stops.length); // random starting stop
  let step = 0;
  const stepsPerSegment = 20 + Math.floor(Math.random() * 10); // slightly different steps per bus

  setTimeout(() => {
    setInterval(async () => {
      const currentStop = stops[segment];
      const nextStop = stops[(segment + 1) % stops.length];

      const { lat, lon } = interpolate(
        currentStop.latitude,
        currentStop.longitude,
        nextStop.latitude,
        nextStop.longitude,
        step,
        stepsPerSegment
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
      if (step > stepsPerSegment) {
        step = 0;
        segment = (segment + 1) % stops.length;
      }
    }, stepInterval);
  }, startDelay);
}

async function startSimulation() {
  const buses = await Bus.find();
  if (!buses.length) return console.log('No buses found to simulate');

  buses.forEach((bus, i) => {
    const startDelay = i * 2000; // stagger start times by 2 seconds
    const stepInterval = 800 + Math.floor(Math.random() * 400); // random speed per bus
    moveBusIndependent(bus, startDelay, stepInterval);
  });
}

startSimulation();
