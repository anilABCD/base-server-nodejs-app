import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import messagingSchema from "../messaging.schemas/messaging.schema";
import MessagingSI from "../../../interfaces/messaging.app/messaging.interfaces/messaging.interface";
import isCurrentApp from "../../../utils/isCurrentApp";

@singleton()
export default class MessagingModel implements ModelI<any, any, any> {
  schema: Schema<any> = messagingSchema;

  model: Model<any, any> | null = isCurrentApp("MessagingApp")
    ? model<MessagingSI>("messages", this.schema)
    : null;
}
