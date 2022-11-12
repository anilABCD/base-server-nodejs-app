import mongoose from "mongoose";
import { Schema } from "mongoose";

let groupSchema = new mongoose.Schema({
  // Sample
  // senderId: {
  //   type: Schema.Types.ObjectId,
  //   required: [true, "is required"],
  // },

  groupName: {
    type: String,
    default: "",
    required: [true, "is required"],
  },

  description: {
    type: String,
    default: "",
    required: [true, "is required"],
  },

  location: {
    type: String,
    default: "",
    required: [true, "is required"],
  },

  interests: {
    type: String,
    default: "",
  },
});

export default groupSchema;
