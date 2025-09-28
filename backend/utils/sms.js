const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // Twilio trial number
      to: to.startsWith("+") ? to : `+${to}`, // enforce +91 format
    });

    console.log("✅ SMS Sent:", result.sid, "to", to);
    return result;
  } catch (err) {
    console.error("❌ Twilio SMS Error:", err.message);
    throw err;
  }
}

module.exports = { sendSMS };
