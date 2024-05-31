// models/match.js
const mongoose = require("mongoose");

const User = require("../user.models/user.model").default;

const MatchSchema = new mongoose.Schema({
  user1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

MatchSchema.pre("save", async function (this: any, next: any) {
  try {
    const senderExists = await User.findById(this.user1_id);
    if (!senderExists) {
      return next(new Error("Invalid user1_id"));
    }

    const receiverExists = await User.findById(this.user2_id);
    if (!receiverExists) {
      return next(new Error("Invalid user2_id"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Match", MatchSchema);
