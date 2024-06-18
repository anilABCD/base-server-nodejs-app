const mongoose = require("mongoose");

// Define DeviceToken schema with a reference to the User schema
const deviceTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceToken: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const DeviceToken = mongoose.model("DeviceToken", deviceTokenSchema);

module.exports = DeviceToken;
