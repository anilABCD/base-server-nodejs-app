// models/interaction.js
const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  user_from_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user_to_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, enum: ["like", "dislike"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interaction", InteractionSchema);
