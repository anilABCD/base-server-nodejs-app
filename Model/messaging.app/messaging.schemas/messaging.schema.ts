import mongoose from "mongoose";
import { Schema } from "mongoose";

let messagingSchema = new mongoose.Schema({
  //
  // example : index , unique index for single column
  // unique index for one column
  // senderId: {
  //   type: Schema.Types.ObjectId,
  //   required: [true, "is required"],
  //   index: true,
  //   unique: true,
  // },

  // example : unique index for two columns .
  // unique index for two columns .
  //   var testSchema = db.Schema({
  //     "one": { "type": String, "required": true },
  //     "two": { "type": String, "required": true }
  // }, { "strict": false });

  // testSchema.index({ "one": 1, "two": 1}, { "unique": true });
  // var Test = db.model("Test", testSchema );

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
