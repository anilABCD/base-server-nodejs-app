import mongoose from "mongoose";
import { Schema } from "mongoose";

let messagingSchema = new mongoose.Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    required: [true, "is required"],
  },

  receiverId: {
    type: Schema.Types.ObjectId,
    required: [true, "is required"],
  },

  message: {
    type: String,
    default: "",
    required: [true, "is required"],
  },

  time: {
    type: Date,
    default: Date.now(),
    required: [true, "is required"],
  },
});

export default messagingSchema;
