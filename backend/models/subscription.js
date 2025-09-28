// models/subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  phone: { type: String, required: true },   // user phone number
  busId: { type: String, required: true },   // bus ID
  stopName: { type: String, required: true },// stop name instead of stopId
  notified10: { type: Boolean, default: false }, // 10 min alert flag
  notified5: { type: Boolean, default: false }   // 5 min alert flag
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
