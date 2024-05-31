// models/match.js
const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  user1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  user2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});




module.exports = mongoose.model("Match", MatchSchema);
