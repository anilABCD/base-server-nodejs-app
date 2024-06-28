// models/message.js
const mongoose = require("mongoose");
const Match = require("../../Model/deverloperDating/match");

const User = require("../../Model/user.models/user.model").default;

const RoomMessageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    capped: { size: 5242880, max: 1000, autoIndexId: true },
  }
);

RoomMessageSchema.pre("save", async function (this: any, next: any) {
  try {
    const senderExists = await User.findById(this.sender_id);
    if (!senderExists) {
      return next(new Error("Invalid sender_id"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Check if the model already exists to prevent OverwriteModelError
module.exports =
  mongoose.models.RoomMessage ||
  mongoose.model("RoomMessage", RoomMessageSchema);
