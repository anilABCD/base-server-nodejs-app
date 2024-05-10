// models/message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  match_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
