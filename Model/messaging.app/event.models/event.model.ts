import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import isCurrentApp from "../../../utils/isCurrentApp";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";

@singleton()
export default class EventModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
    // Sample

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

    eventName: {
      type: String,
      default: "",
      required: [true, "is required"],
      index: true,
      unique: true,
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: "groups",
    },

    aboutUs: {
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

    image: {
      type: String,
      default: "/public/images/no-image.jpeg",
    },

    startTime: {
      type: Schema.Types.Date,
      required: [true, "is required"],
    },

    isOnline: {
      type: Boolean,
      required: [true, "is required"],
    },
  });

  model: Model<any, any> | null = isCurrentApp("messaging-app")
    ? model<IEvent>("events", this.schema)
    : null;
}
