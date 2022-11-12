import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import isCurrentApp from "../../../utils/isCurrentApp";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";

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
      required: [true, "group Name is required"],
    },

    description: {
      type: String,
      default: "",
      required: [true, "description is required"],
    },

    location: {
      type: String,
      default: "",
      required: [true, "location is required"],
    },

    interests: {
      type: [String],
      default: "",
      required: [true, "interests are required"],
    },
  });

  model: Model<any, any> | null = isCurrentApp("messaging-app")
    ? model<IGroup>("groups", this.schema)
    : null;
}
