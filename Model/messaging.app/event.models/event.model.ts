import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import isCurrentApp from "../../../utils/isCurrentApp";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";

@singleton()
export default class EventModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
    // Sample
    // senderId: {
    //   type: Schema.Types.ObjectId,
    //   required: [true, "is required"],
    // },

    eventName: {
      type: String,
      default: "",
      required: [true, "is required"],
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
