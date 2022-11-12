import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import isCurrentApp from "../../../utils/isCurrentApp";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import groupSchema from "../group.schemas/group.schema";

@singleton()
export default class GroupModel implements ModelI<any, any, any> {
  schema: Schema<any> = groupSchema;

  model: Model<any, any> | null = isCurrentApp("messaging-app")
    ? model<IGroup>("groups", this.schema)
    : null;
}
