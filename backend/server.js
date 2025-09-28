const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config(); // load .env
connectDB(); // connect to MongoDB

const app = express();
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚍 Bus Tracking Backend Running...");
});

const stopRoutes = require("./routes/stopRoutes");
app.use("/api/stops", stopRoutes);

const busRoutes = require("./routes/busRoutes");
app.use("/api/buses", busRoutes);

const locationRoutes = require("./routes/locationRoutes");
app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const subscriptionRoutes = require("./routes/subscriptionRoutes");
app.use("/api/subscribe", subscriptionRoutes);
