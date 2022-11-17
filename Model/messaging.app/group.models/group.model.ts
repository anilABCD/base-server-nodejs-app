import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import isCurrentApp from "../../../utils/isCurrentApp";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import getEnv, { EnvEnumType } from "../../../env/getEnv";

@singleton()
export default class GroupModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
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

    interests: {
      type: [String],
      default: "",
      required: [true, "are required"],
    },
  });

  model: Model<any, any> | null = null;

  constructor() {
    this.schema.index({ groupName: 1 }, { unique: true });
    this.model = isCurrentApp("messaging-app")
      ? model<IGroup>("groups", this.schema)
      : null;
  }
}
