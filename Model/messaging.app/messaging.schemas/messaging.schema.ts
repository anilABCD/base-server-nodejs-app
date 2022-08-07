import mongoose from "mongoose";
import { Schema } from "mongoose";

let messagingSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "is required"],
  },
  createdDate: Date,
  updatedDate: Date,
});

export default messagingSchema;
